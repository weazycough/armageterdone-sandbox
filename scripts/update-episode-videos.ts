// update-episode-videos.ts — append new official YouTube matches from each
// channel's public RSS feed (no API key). Fails soft if a feed is unreachable
// so CI and local builds still succeed. Rumble is probed the same way and
// skipped when the host blocks automated access.
//
//   node scripts/update-episode-videos.ts
//
// Called from scripts/prepare-content.ts after the episode list is written.

import { readFile, writeFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import { episodeListSchema } from "../app/lib/feed.ts";
import {
  type EpisodeVideoItem,
  type EpisodeVideos,
  type VideoCandidate,
  type YoutubeSource,
  YOUTUBE_RSS_URL,
  episodeVideosSchema,
  matchEpisodeVideos,
  mergeVideoItems,
} from "../app/lib/episode-videos.ts";
import { EPISODE_VIDEOS, EPISODES_JSON } from "../app/lib/paths.ts";

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "#text" in value && typeof value["#text"] === "string") {
    return value["#text"];
  }
  return "";
}

async function loadRss(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "canarycry-site-build" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${String(res.status)}`);
  return res.text();
}

function parseYoutubeRss(xml: string, channel: YoutubeSource): VideoCandidate[] {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml) as { feed?: { entry?: unknown } };
  const raw = doc.feed?.entry;
  const entries = Array.isArray(raw) ? raw : raw !== undefined ? [raw] : [];
  const out: VideoCandidate[] = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const rec = entry as Record<string, unknown>;
    const id = asText(rec["yt:videoId"]) || asText(rec.id).replace(/^yt:video:/, "");
    const title = asText(rec.title);
    const published = asText(rec.published);
    if (id === "" || title === "") continue;
    out.push({ id, title, published, channel });
  }
  return out;
}

export async function updateEpisodeVideosFromRss(): Promise<{ added: number; skipped: boolean; reason?: string }> {
  let catalog: EpisodeVideos;
  try {
    catalog = episodeVideosSchema.parse(JSON.parse(await readFile(EPISODE_VIDEOS, "utf8")));
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`episode-videos: could not read ${EPISODE_VIDEOS} (${reason})`);
    return { added: 0, skipped: true, reason };
  }

  let episodes: ReturnType<typeof episodeListSchema.parse>;
  try {
    episodes = episodeListSchema.parse(JSON.parse(await readFile(EPISODES_JSON, "utf8")));
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`episode-videos: could not read ${EPISODES_JSON} (${reason})`);
    return { added: 0, skipped: true, reason };
  }

  const knownYoutube = new Set(catalog.items.map((item) => item.youtubeId).filter((id): id is string => id !== undefined));
  const videos: VideoCandidate[] = [];
  const failures: string[] = [];

  for (const channel of ["ccnt", "ccr", "flts"] as const) {
    try {
      const xml = await loadRss(YOUTUBE_RSS_URL[channel]);
      const entries = parseYoutubeRss(xml, channel);
      for (const entry of entries) {
        if (!knownYoutube.has(entry.id)) videos.push(entry);
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      failures.push(`${channel}: ${reason}`);
    }
  }

  if (videos.length === 0) {
    if (failures.length > 0) {
      console.warn(`episode-videos: RSS update skipped (${failures.join("; ")})`);
      return { added: 0, skipped: true, reason: failures.join("; ") };
    }
    console.log("episode-videos: RSS had no new uploads to match");
    return { added: 0, skipped: false };
  }

  const matches = matchEpisodeVideos(
    episodes.map((e) => ({ slug: e.slug, title: e.title, published: e.published, audioUrl: e.audioUrl })),
    videos,
  );
  const incoming: EpisodeVideoItem[] = matches.map((m) => ({
    slug: m.slug,
    youtubeId: m.youtubeId,
    youtubeSource: m.youtubeSource,
  }));
  const merged = mergeVideoItems(catalog.items, incoming);
  const added = merged.filter((item) => item.youtubeId !== undefined).length - catalog.meta.youtube;
  if (added <= 0 && incoming.length === 0) {
    console.log(`episode-videos: ${String(videos.length)} new RSS videos, no new episode matches`);
    return { added: 0, skipped: false };
  }
  const next: EpisodeVideos = episodeVideosSchema.parse({
    meta: {
      generatedAt: new Date().toISOString(),
      youtube: merged.filter((item) => item.youtubeId !== undefined).length,
      rumble: merged.filter((item) => item.rumbleUrl !== undefined).length,
    },
    items: merged,
  });
  // Only rewrite when something new was attached.
  const before = new Set(catalog.items.filter((i) => i.youtubeId !== undefined).map((i) => `${i.slug}:${i.youtubeId}`));
  const afterNew = next.items.filter((i) => i.youtubeId !== undefined && !before.has(`${i.slug}:${i.youtubeId}`));
  if (afterNew.length === 0) {
    console.log(`episode-videos: ${String(videos.length)} new RSS videos, no new episode matches`);
    return { added: 0, skipped: false };
  }
  await writeFile(EPISODE_VIDEOS, `${JSON.stringify(next)}\n`);
  console.log(`episode-videos: added ${String(afterNew.length)} YouTube match(es) from RSS -> ${EPISODE_VIDEOS}`);
  if (failures.length > 0) console.warn(`episode-videos: some feeds failed (${failures.join("; ")})`);
  return { added: afterNew.length, skipped: false };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await updateEpisodeVideosFromRss();
}

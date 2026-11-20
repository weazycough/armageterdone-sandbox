// update-flts.ts — append new FaceLikeTheSun uploads from the channel's
// public RSS feed. No API key. Fails soft if the feed is unreachable so CI
// and local builds still succeed.
//
//   node scripts/update-flts.ts

import { readFile, writeFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import {
  compactDescription,
  FLTS_EXCLUDED_IDS,
  FLTS_INDEX_FILE,
  FLTS_RSS_URL,
  type CatalogEpisode,
  type FltsItem,
  fltsIndexSchema,
  isCanaryCryDuplicateTitle,
  isFltsDuplicateOfEpisode,
  parseChapters,
} from "../app/lib/flts.ts";
import { episodeListSchema } from "../app/lib/feed.ts";
import { episodeVideosSchema } from "../app/lib/episode-videos.ts";
import { EPISODE_VIDEOS, EPISODES_JSON } from "../app/lib/paths.ts";

const FILE = `public/${FLTS_INDEX_FILE}`;

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "#text" in value && typeof value["#text"] === "string") {
    return value["#text"];
  }
  return "";
}

async function loadCatalogEpisodes(): Promise<CatalogEpisode[]> {
  try {
    const episodes = episodeListSchema.parse(JSON.parse(await readFile(EPISODES_JSON, "utf8")));
    let bySlug = new Map<string, string>();
    try {
      const videos = episodeVideosSchema.parse(JSON.parse(await readFile(EPISODE_VIDEOS, "utf8")));
      bySlug = new Map(
        videos.items.flatMap((item) => (item.youtubeId !== undefined ? [[item.slug, item.youtubeId] as const] : [])),
      );
    } catch {
      /* mapping file is optional; title+date matching still runs */
    }
    return episodes.map((episode) => ({
      title: episode.title,
      published: episode.published,
      duration: episode.duration,
      ...(bySlug.get(episode.slug) ? { youtubeId: bySlug.get(episode.slug) } : {}),
    }));
  } catch {
    return [];
  }
}

/** Drop FaceLikeTheSun rows that match a current site episode, and persist if needed. */
export async function pruneFltsAgainstEpisodes(): Promise<{ removed: number }> {
  const episodes = await loadCatalogEpisodes();
  if (episodes.length === 0) return { removed: 0 };
  let catalog: ReturnType<typeof fltsIndexSchema.parse>;
  try {
    catalog = fltsIndexSchema.parse(JSON.parse(await readFile(FILE, "utf8")));
  } catch {
    return { removed: 0 };
  }
  const kept = catalog.items.filter((item) => !isFltsDuplicateOfEpisode(item, episodes));
  const removed = catalog.items.length - kept.length;
  if (removed === 0) return { removed: 0 };
  const next = {
    meta: {
      ...catalog.meta,
      generatedAt: new Date().toISOString(),
      source: catalog.meta.source.includes("deduped") ? catalog.meta.source : `${catalog.meta.source}+deduped`,
      included: kept.length,
    },
    items: kept,
  };
  fltsIndexSchema.parse(next);
  await writeFile(FILE, JSON.stringify(next));
  console.log(`flts: removed ${String(removed)} Canary Cry duplicate(s) from ${FILE} (${String(kept.length)} remain)`);
  return { removed };
}

export async function updateFltsFromRss(): Promise<{ added: number; skipped: boolean; reason?: string }> {
  let xml: string;
  try {
    const res = await fetch(FLTS_RSS_URL, {
      headers: { "User-Agent": "canarycry-site-build" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`HTTP ${String(res.status)}`);
    xml = await res.text();
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`flts: RSS update skipped (${reason})`);
    return { added: 0, skipped: true, reason };
  }

  let catalog: ReturnType<typeof fltsIndexSchema.parse>;
  try {
    catalog = fltsIndexSchema.parse(JSON.parse(await readFile(FILE, "utf8")));
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`flts: could not read ${FILE} (${reason})`);
    return { added: 0, skipped: true, reason };
  }

  const episodes = await loadCatalogEpisodes();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml) as { feed?: { entry?: unknown } };
  const raw = doc.feed?.entry;
  const entries = Array.isArray(raw) ? raw : raw !== undefined ? [raw] : [];

  const known = new Set(catalog.items.map((item) => item.id));
  const fresh: FltsItem[] = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const rec = entry as Record<string, unknown>;
    const id = asText(rec["yt:videoId"]) || asText(rec.id).replace(/^yt:video:/, "");
    if (id === "" || known.has(id) || FLTS_EXCLUDED_IDS.has(id)) continue;
    const title = asText(rec.title);
    const group = (rec["media:group"] ?? {}) as Record<string, unknown>;
    const description = asText(group["media:description"]);
    const published = asText(rec.published);
    const thumb = group["media:thumbnail"];
    const thumbnail =
      thumb && typeof thumb === "object" && "@_url" in thumb && typeof thumb["@_url"] === "string"
        ? thumb["@_url"]
        : null;
    if (isCanaryCryDuplicateTitle(title, { date: published })) continue;
    if (isFltsDuplicateOfEpisode({ id, title, date: published, duration: 0 }, episodes)) continue;
    const item: FltsItem = {
      id,
      title,
      date: published || new Date().toISOString(),
      type: "video",
      duration: 0,
      description: compactDescription(description),
      thumbnail,
      chapters: parseChapters(description),
    };
    fresh.push(item);
    known.add(id);
  }

  if (fresh.length > 0) {
    const items = [...fresh, ...catalog.items].sort((a, b) => b.date.localeCompare(a.date));
    const next = {
      meta: {
        ...catalog.meta,
        generatedAt: new Date().toISOString(),
        source: `${catalog.meta.source}+rss`,
        included: items.length,
      },
      items,
    };
    fltsIndexSchema.parse(next);
    await writeFile(FILE, JSON.stringify(next));
    console.log(`flts: added ${String(fresh.length)} upload(s) from RSS -> ${FILE}`);
  } else {
    console.log("flts: RSS checked, no new uploads to add");
  }

  await pruneFltsAgainstEpisodes();
  return { added: fresh.length, skipped: false };
}

const invoked = process.argv[1]?.replace(/\\/g, "/").endsWith("update-flts.ts") === true;
if (invoked) {
  await updateFltsFromRss();
}

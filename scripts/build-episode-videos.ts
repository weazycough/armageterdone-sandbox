// build-episode-videos.ts — one-time (or manual) rebuild of
// content/episode-videos.json from the episode list plus official YouTube
// upload lists and the FaceLikeTheSun catalog matches.
//
//   node scripts/build-episode-videos.ts
//
// Looks for video lists in .cache/youtube-uploads.json (and optional
// /workspace/flts-catalog/flts-youtube.json, flts-excluded.json). Does not
// call the YouTube API and does not print secrets.

import { readFile, writeFile } from "node:fs/promises";
import { episodeListSchema } from "../app/lib/feed.ts";
import {
  type CatalogHint,
  type EpisodeVideos,
  type VideoCandidate,
  type YoutubeSource,
  episodeVideosSchema,
  matchEpisodeVideos,
  sourceOfChannelId,
} from "../app/lib/episode-videos.ts";
import { EPISODE_VIDEOS, EPISODES_JSON } from "../app/lib/paths.ts";
import { showOf } from "../app/lib/shows.ts";

const UPLOADS = [".cache/youtube-uploads.json", "/tmp/libsyn-probe/youtube-videos.json"];
const FLTS_EXCLUDED = ["/workspace/flts-catalog/flts-excluded.json", ".cache/flts-excluded.json"];
const FLTS_YOUTUBE = ["/workspace/flts-catalog/flts-youtube.json", ".cache/flts-youtube.json"];

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"));
}

async function firstExisting(paths: string[]): Promise<{ path: string; data: unknown } | null> {
  for (const path of paths) {
    try {
      return { path, data: await readJson(path) };
    } catch {
      /* try next */
    }
  }
  return null;
}

function asVideos(raw: unknown, defaultChannel: YoutubeSource | null = null): VideoCandidate[] {
  const out: VideoCandidate[] = [];
  const seen = new Set<string>();
  const push = (item: VideoCandidate) => {
    if (seen.has(item.id)) return;
    seen.add(item.id);
    out.push(item);
  };

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const rec = raw as Record<string, unknown>;
    const maybeItems = rec.items;
    if (Array.isArray(maybeItems)) {
      for (const item of maybeItems) {
        if (!item || typeof item !== "object") continue;
        const v = item as Record<string, unknown>;
        if (typeof v.id !== "string") continue;
        const channel =
          (v.channel === "ccnt" || v.channel === "ccr" || v.channel === "flts" ? (v.channel as YoutubeSource) : null) ||
          (typeof v.channelId === "string" ? sourceOfChannelId(v.channelId) : null) ||
          defaultChannel;
        const published =
          (typeof v.published === "string" && v.published) ||
          (typeof v.publishedAt === "string" && v.publishedAt) ||
          (typeof v.actualStartTime === "string" && v.actualStartTime) ||
          (typeof v.date === "string" && v.date) ||
          "";
        if (channel === null || typeof v.title !== "string") continue;
        push({ id: v.id, title: v.title, published, channel });
      }
    }
    for (const key of ["ccnt", "ccr", "flts"] as const) {
      const list = rec[key];
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (!item || typeof item !== "object") continue;
        const v = item as Record<string, unknown>;
        if (typeof v.id !== "string" || typeof v.title !== "string") continue;
        push({
          id: v.id,
          title: v.title,
          published: typeof v.published === "string" ? v.published : typeof v.publishedAt === "string" ? v.publishedAt : "",
          channel: key,
        });
      }
    }
  }
  return out;
}

function asCatalog(raw: unknown): CatalogHint[] {
  if (!raw || typeof raw !== "object") return [];
  const items = (raw as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  const out: CatalogHint[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const v = item as Record<string, unknown>;
    if (typeof v.id !== "string" || typeof v.title !== "string") continue;
    const matchedShow =
      v.matchedShow === "CCNT" || v.matchedShow === "CCR" || v.matchedShow === "Clubhouse"
        ? v.matchedShow
        : null;
    const site = v.siteFeedMatch;
    let siteFeedMatch: CatalogHint["siteFeedMatch"] = null;
    if (site && typeof site === "object") {
      const s = site as Record<string, unknown>;
      if (typeof s.title === "string") {
        siteFeedMatch = { title: s.title, date: typeof s.date === "string" ? s.date : undefined };
      }
    }
    out.push({
      id: v.id,
      title: v.title,
      date: typeof v.date === "string" ? v.date : undefined,
      matchedShow,
      matchedEpisodeNumber: typeof v.matchedEpisodeNumber === "number" ? v.matchedEpisodeNumber : null,
      siteFeedMatch,
    });
  }
  return out;
}

const episodes = episodeListSchema.parse(await readJson(EPISODES_JSON));
const uploads = await firstExisting(UPLOADS);
if (uploads === null) {
  throw new Error(`build-episode-videos: no YouTube upload list in ${UPLOADS.join(" or ")}`);
}
const videos = asVideos(uploads.data);
const fltsUploads = await firstExisting(FLTS_YOUTUBE);
if (fltsUploads !== null) {
  for (const v of asVideos(fltsUploads.data, "flts")) videos.push(v);
}
// Dedup after merge
const byId = new Map<string, VideoCandidate>();
for (const v of videos) if (!byId.has(v.id)) byId.set(v.id, v);
const unique = [...byId.values()];

const excluded = await firstExisting(FLTS_EXCLUDED);
const catalog = excluded !== null ? asCatalog(excluded.data) : [];

const matches = matchEpisodeVideos(
  episodes.map((e) => ({ slug: e.slug, title: e.title, published: e.published, audioUrl: e.audioUrl })),
  unique,
  catalog,
);

const byShow = new Map<string, { total: number; youtube: number; ccnt: number; ccr: number; flts: number }>();
for (const e of episodes) {
  const show = showOf(e) ?? "other";
  const row = byShow.get(show) ?? { total: 0, youtube: 0, ccnt: 0, ccr: 0, flts: 0 };
  row.total += 1;
  byShow.set(show, row);
}
const epBySlug = new Map(episodes.map((e) => [e.slug, e]));
for (const m of matches) {
  const ep = epBySlug.get(m.slug);
  if (!ep) continue;
  const show = showOf(ep) ?? "other";
  const row = byShow.get(show) ?? { total: 0, youtube: 0, ccnt: 0, ccr: 0, flts: 0 };
  row.youtube += 1;
  row[m.youtubeSource] += 1;
  byShow.set(show, row);
}

const data: EpisodeVideos = episodeVideosSchema.parse({
  meta: {
    generatedAt: new Date().toISOString(),
    youtube: matches.length,
    rumble: 0,
  },
  items: matches
    .map((m) => ({
      slug: m.slug,
      youtubeId: m.youtubeId,
      youtubeSource: m.youtubeSource,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug)),
});

await writeFile(EPISODE_VIDEOS, `${JSON.stringify(data)}\n`);
console.log(`episode-videos: ${String(matches.length)}/${String(episodes.length)} YouTube matches -> ${EPISODE_VIDEOS}`);
console.log(`  sources: uploads ${uploads.path}` + (excluded !== null ? `, catalog ${excluded.path}` : ""));
for (const [show, row] of byShow) {
  console.log(
    `  ${show}: ${String(row.youtube)}/${String(row.total)} (ccnt ${String(row.ccnt)}, ccr ${String(row.ccr)}, flts ${String(row.flts)})`,
  );
}

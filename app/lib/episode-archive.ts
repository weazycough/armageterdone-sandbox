// episode-archive.ts — merge the one-time Libsyn site backfill with the live
// RSS list. The public RSS destination is capped at 1,000 items, so older
// episodes live in content/episodes-archive.json and are added at build time.
// Live-feed rows always win: their slugs, GUIDs, timestamps, and notes stay
// as parseFeed produced them.

import { readFileSync } from "node:fs";
import { z } from "zod";
import { episodeSchema, type Episode } from "./feed.ts";
import { EPISODES_ARCHIVE } from "./paths.ts";

export const archiveItemSchema = episodeSchema.extend({
  /** Libsyn website item id, when the row came from the site JSON API. */
  itemId: z.number().int().positive().optional(),
  /** Public page the row was built from. */
  sourceUrl: z.string().url().optional(),
  show: z.enum(["news-talk", "radio", "clubhouse"]).nullable().optional(),
  episodeNumber: z.number().int().positive().optional(),
});
export type ArchiveItem = z.infer<typeof archiveItemSchema>;

export const archiveFileSchema = z.object({
  meta: z.object({
    generatedAt: z.string(),
    source: z.string(),
    included: z.number().int().nonnegative(),
  }),
  items: z.array(archiveItemSchema),
});
export type ArchiveFile = z.infer<typeof archiveFileSchema>;

const LIBSYN_AUDIO_HOST = /(^|\.)traffic\.libsyn\.com$/i;

/** Filename of a Libsyn enclosure, ignoring /clean and dest-id query strings. */
export function normalizeAudioKey(url: string): string {
  try {
    const path = new URL(url).pathname.toLowerCase().replace(/^\/clean(?=\/)/, "");
    const file = path.split("/").filter(Boolean).pop() ?? path;
    return decodeURIComponent(file);
  } catch {
    return url.trim().toLowerCase();
  }
}

export function titleDateKey(title: string, published: string): string {
  return `${title.trim().toLowerCase()}|${published.slice(0, 10)}`;
}

export function isLibsynAudio(url: string): boolean {
  try {
    return new URL(url).protocol === "https:" && LIBSYN_AUDIO_HOST.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

function asEpisode(item: ArchiveItem): Episode {
  return episodeSchema.parse({
    slug: item.slug,
    guid: item.guid,
    title: item.title,
    published: item.published,
    audioUrl: item.audioUrl,
    audioType: item.audioType,
    duration: item.duration,
    artUrl: item.artUrl,
    notesHtml: item.notesHtml,
    excerpt: item.excerpt,
  });
}

function uniqueSlug(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${String(n)}`)) n += 1;
  return `${base}-${String(n)}`;
}

/** Live feed first; archive fills in anything the 1,000-item RSS does not have. */
export function mergeEpisodes(live: Episode[], archive: readonly ArchiveItem[]): Episode[] {
  const byGuid = new Set(live.map((e) => e.guid));
  const byAudio = new Set(live.map((e) => normalizeAudioKey(e.audioUrl)));
  const byTitleDate = new Set(live.map((e) => titleDateKey(e.title, e.published)));
  const usedSlugs = new Set(live.map((e) => e.slug));
  const extra: Episode[] = [];

  for (const raw of archive) {
    if (!isLibsynAudio(raw.audioUrl)) continue;
    if (byGuid.has(raw.guid)) continue;
    const audioKey = normalizeAudioKey(raw.audioUrl);
    if (byAudio.has(audioKey)) continue;
    const td = titleDateKey(raw.title, raw.published);
    if (byTitleDate.has(td)) continue;

    const episode = asEpisode({ ...raw, slug: uniqueSlug(raw.slug, usedSlugs) });
    usedSlugs.add(episode.slug);
    byGuid.add(episode.guid);
    byAudio.add(audioKey);
    byTitleDate.add(td);
    extra.push(episode);
  }

  return [...live, ...extra].sort((a, b) => b.published.localeCompare(a.published));
}

export function loadEpisodeArchive(path = EPISODES_ARCHIVE): ArchiveItem[] {
  const parsed = archiveFileSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  if (parsed.meta.included !== parsed.items.length) {
    throw new Error(
      `episode archive: meta.included is ${String(parsed.meta.included)} but file has ${String(parsed.items.length)} items`,
    );
  }
  return parsed.items;
}

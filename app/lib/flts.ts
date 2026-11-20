// flts.ts — FaceLikeTheSun catalog helpers: chapter timestamps, YouTube URLs,
// and the title / date / YouTube-id rules that keep Canary Cry episode
// re-uploads out of search.

import * as z from "zod/mini";
import { fold } from "./search.ts";

export const FLTS_CHANNEL_ID = "UCJ5PQfYe6er4rrt4LLu7EKg";
export const FLTS_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${FLTS_CHANNEL_ID}`;
/** File name under the site root (public/ → dist/), loaded only on /search/. */
export const FLTS_INDEX_FILE = "flts-search.json";
export const FLTS_DESC_CHARS = 1000;

/**
 * 2021 FaceLikeTheSun streams that look like unlabeled Canary Cry News Talk
 * episodes (flagged "kept but arguably duplicates" in the catalog review).
 * They stay out of the committed search file, and the RSS updater must not
 * add them back.
 */
export const FLTS_EXCLUDED_IDS = new Set([
  "dUQJmNkU8qw",
  "ak_5ZeZ1aQw",
  "Z-Re4LWQuFw",
  "0zBB26_qxhQ",
]);

export const fltsChapterSchema = z.object({
  title: z.string(),
  seconds: z.number(),
});
export type FltsChapter = z.infer<typeof fltsChapterSchema>;

export const fltsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  type: z.enum(["video", "stream", "short"]),
  duration: z.number(),
  description: z.string(),
  thumbnail: z.nullable(z.string()),
  chapters: z.array(fltsChapterSchema),
});
export type FltsItem = z.infer<typeof fltsItemSchema>;

export const fltsIndexSchema = z.object({
  meta: z.object({
    generatedAt: z.string(),
    source: z.string(),
    included: z.number(),
    excludedBorderlineCcnt: z.number(),
  }),
  items: z.array(fltsItemSchema),
});
export type FltsIndex = z.infer<typeof fltsIndexSchema>;

/** "1:02:33" or "0:00" → seconds. */
export function timestampToSeconds(raw: string): number | null {
  const parts = raw.split(":").map((p) => Number(p));
  if (parts.length < 2 || parts.length > 3 || parts.some((n) => !Number.isFinite(n) || n < 0)) {
    return null;
  }
  if (parts.length === 2) return parts[0]! * 60 + parts[1]!;
  return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
}

/** 5018 → "1:23:38"; 62 → "1:02". */
export function formatTimestamp(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${String(h)}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m)}:${String(sec).padStart(2, "0")}`;
}

const CHAPTER_LINE =
  /^\s*[-–—*•]?\s*\(?(\d{1,2}:\d{2}(?::\d{2})?)\)?\s*(?:[-–—:|]+\s*)?(.*?)\s*$/;
const CHAPTER_LINE_TRAILING =
  /^\s*(?:\d{1,2}[.)]+\s*)?(.+?)\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*$/;
const BIBLE_BOOK_TITLE =
  /^(?:(?:[123]|1st|2nd|3rd|first|second|third)\s+)?(?:genesis|exodus|leviticus|numbers|deuteronomy|deut|joshua|judges|ruth|samuel|kings|chronicles|ezra|nehemiah|esther|job|psalms?|proverbs|ecclesiastes|song(?: of (?:solomon|songs))?|isaiah|jeremiah|lamentations|ezekiel|daniel|hosea|joel|amos|obadiah|jonah|micah|nahum|habakkuk|zephaniah|haggai|zechariah|malachi|matthew|matt|mark|luke|john|acts|romans|corinthians|galatians|ephesians|philippians|colossians|thessalonians|timothy|titus|philemon|hebrews|james|peter|jude|revelation|rev)\.?$/i;

function isBibleVerseTitle(title: string): boolean {
  return BIBLE_BOOK_TITLE.test(title.trim());
}

function pushChapter(
  chapters: FltsChapter[],
  seen: Set<number>,
  seconds: number,
  rawTitle: string,
): void {
  if (seen.has(seconds)) return;
  let title = rawTitle.trim().replace(/^[-–—*•|:\s]+/, "").trim();
  // "18:24–25" / "2:24-26" verse ranges, not a chapter title.
  if (/^[-–—]\s*\d{1,3}$/.test(title) || /^\d{1,3}$/.test(title)) return;
  if (isBibleVerseTitle(title)) return;
  if (title === "") title = formatTimestamp(seconds);
  seen.add(seconds);
  chapters.push({ title, seconds });
}

/**
 * Chapter timestamps from a YouTube description. Accepts leading times
 * ("0:00 Intro", "1:02:33 Topic", "(12:34)", "12:34 - Topic") and numbered
 * lists with the time at the end ("1.) Prologue 0:48"). Skips Bible verse
 * lines.
 */
export function parseChapters(description: string): FltsChapter[] {
  const lines = description.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const chapters: FltsChapter[] = [];
  const seen = new Set<number>();
  for (const line of lines) {
    const m = CHAPTER_LINE.exec(line);
    if (!m) continue;
    const seconds = timestampToSeconds(m[1] ?? "");
    if (seconds === null) continue;
    pushChapter(chapters, seen, seconds, m[2] ?? "");
  }
  if (chapters.length >= 2) return chapters;

  const trailing: FltsChapter[] = [];
  const trailingSeen = new Set<number>();
  for (const line of lines) {
    if (CHAPTER_LINE.exec(line)) continue;
    const m = CHAPTER_LINE_TRAILING.exec(line);
    if (!m) continue;
    const seconds = timestampToSeconds(m[2] ?? "");
    if (seconds === null) continue;
    pushChapter(trailing, trailingSeen, seconds, m[1] ?? "");
  }
  if (trailing.length < 3) return chapters;
  const increasing = trailing.every((ch, i) => i === 0 || ch.seconds > trailing[i - 1]!.seconds);
  const startsEarly = trailing[0]!.seconds <= 180;
  return increasing && startsEarly ? trailing : chapters;
}

const PROMO = /promo|soundtrack|music release|trailer|subs!/i;

/**
 * Title rules used to drop Canary Cry News Talk / Radio / Clubhouse
 * re-uploads from the FaceLikeTheSun catalog. Promos and soundtrack videos
 * that mention the show stay in.
 */
export function isCanaryCryDuplicateTitle(
  title: string,
  opts: { durationSeconds?: number; date?: string } = {},
): boolean {
  if (PROMO.test(title)) return false;
  if (/\bCCNT\s*#?\d+/i.test(title)) return true;
  if (/\bCCR\s*#?\d+/.test(title)) return true;
  if (/Canary ?Cry Radio\s*(?:Ep\.?\s*|Episode\s*)?#?\d+\s*[:-]?/i.test(title)) return true;
  if (/^News ?Talk\s*#?\d+/i.test(title)) return true;
  if (/Canary ?Cry Clubhouse/i.test(title)) return true;
  if (/\bCCNT\b/i.test(title)) return true;
  const date = opts.date?.slice(0, 10);
  const m = /^(\d{2,3})\s*[:-]\s*\S/.exec(title);
  if (m && date !== undefined && date >= "2019-06-01") {
    const n = Number(m[1]);
    const mins = (opts.durationSeconds ?? 3600) / 60;
    if (n >= 142 && n <= 1000 && mins >= 60) return true;
  }
  return false;
}

export function youtubeUrl(id: string, seconds?: number): string {
  const base = `https://www.youtube.com/watch?v=${id}`;
  return seconds !== undefined && seconds > 0 ? `${base}&t=${String(seconds)}s` : base;
}

/** Trim a description to about `limit` characters, on a word boundary when possible. */
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

/** Drop personal emails from descriptions so the catalog can be committed. */
export function scrubPublicText(text: string): string {
  return text.replace(EMAIL_RE, "[email removed]");
}

/** Full description for search: emails scrubbed, whitespace compacted, not capped. */
export function compactDescription(text: string): string {
  return scrubPublicText(text).replace(/\s+/g, " ").trim();
}

export function trimDescription(text: string, limit = FLTS_DESC_CHARS): string {
  const compact = compactDescription(text);
  if (compact.length <= limit) return compact;
  const sliced = compact.slice(0, limit);
  const space = sliced.lastIndexOf(" ");
  return `${(space > limit * 0.6 ? sliced.slice(0, space) : sliced).trimEnd()}…`;
}

/** Strip show tags, episode numbers, and dates so "Title | CCNT 990" matches "Title!". */
const TITLE_DECORATION =
  /canary\s*cry\s*(news\s*talk|radio|clubhouse)|news\s*talk|\bccnt\b|\bccr\b|\bclubhouse\b|#\s*\d{1,4}\b|\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b|\blivestream\b|\b\(live\)\b|\*?live\*?\b|\bcall[- ]?in(?:\s+discussion)?\b/gi;
const TITLE_STOP = new Set([
  "the", "a", "an", "of", "and", "to", "in", "on", "for", "with", "from", "is", "it",
  "its", "by", "at", "as", "or", "we", "you", "our", "w",
]);

export function normalizeCatalogTitle(title: string): string {
  const folded = fold(title.replace(/['’]/g, "")).replace(TITLE_DECORATION, " ");
  return fold(folded.replace(/[^a-z0-9\s]/g, " "));
}

export function catalogTitleTokens(title: string): string[] {
  return normalizeCatalogTitle(title)
    .split(" ")
    .filter((word) => word.length > 1 && !TITLE_STOP.has(word));
}

/** iTunes ("1:31:42") or a positive length in seconds. 0 / empty means unknown. */
export function parseClockDuration(value: string | number | undefined): number | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
  if (typeof value !== "string") return undefined;
  const match = /^(?:(\d+):)?(\d+):(\d+)$/.exec(value.trim());
  if (!match) return undefined;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : undefined;
}

/**
 * A 10-minute highlight is not the same media as a two-hour episode. Unknown
 * lengths (RSS items often have 0) do not block a title match.
 */
export function durationsCompatible(
  left: string | number | undefined,
  right: string | number | undefined,
  minRatio = 0.4,
): boolean {
  const a = parseClockDuration(left);
  const b = parseClockDuration(right);
  if (a === undefined || b === undefined) return true;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return lo >= hi * minRatio;
}

export function daysBetween(left: string, right: string): number | undefined {
  const a = Date.parse(left);
  const b = Date.parse(right);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return undefined;
  const startOfDay = (ms: number): number => {
    const d = new Date(ms);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  };
  return Math.round(Math.abs(startOfDay(a) - startOfDay(b)) / 86_400_000);
}

export const TITLE_DATE_WINDOW_DAYS = 4;
export const OVERLAP_DATE_WINDOW_DAYS = 1;

export interface CatalogEpisode {
  title: string;
  published: string;
  youtubeId?: string;
  duration?: string | number;
}

export type FltsDuplicateReason = "youtube-id" | "title-date" | "overlap-date";

export interface FltsDuplicate {
  reason: FltsDuplicateReason;
  episodeTitle: string;
  days: number;
}

function titlesAlign(
  videoTitle: string,
  episodeTitle: string,
): "exact" | "overlap" | null {
  const videoCore = normalizeCatalogTitle(videoTitle);
  const episodeCore = normalizeCatalogTitle(episodeTitle);
  if (videoCore !== "" && (videoCore === episodeCore || fold(videoTitle) === fold(episodeTitle))) {
    return "exact";
  }
  const shorter = videoCore.length <= episodeCore.length ? videoCore : episodeCore;
  const longer = videoCore.length <= episodeCore.length ? episodeCore : videoCore;
  if (shorter.length >= 20 && longer.includes(shorter)) return "overlap";
  const videoTokens = catalogTitleTokens(videoTitle);
  const episodeTokens = catalogTitleTokens(episodeTitle);
  if (videoTokens.length === 0 || episodeTokens.length === 0) return null;
  const right = new Set(episodeTokens);
  let intersection = 0;
  for (const token of videoTokens) if (right.has(token)) intersection += 1;
  const overlap = intersection / Math.min(videoTokens.length, episodeTokens.length);
  if (intersection >= 4 && overlap >= 0.7) return "overlap";
  return null;
}

/** True when a FaceLikeTheSun upload is the same programme as a site episode. */
export function findFltsEpisodeDuplicate(
  item: { id: string; title: string; date: string; duration?: number },
  episodes: readonly CatalogEpisode[],
): FltsDuplicate | null {
  for (const episode of episodes) {
    if (episode.youtubeId !== undefined && episode.youtubeId === item.id) {
      return { reason: "youtube-id", episodeTitle: episode.title, days: daysBetween(episode.published, item.date) ?? 0 };
    }
  }
  let best: FltsDuplicate | null = null;
  for (const episode of episodes) {
    const days = daysBetween(episode.published, item.date);
    if (days === undefined) continue;
    const align = titlesAlign(item.title, episode.title);
    if (align === null) continue;
    const reason: FltsDuplicateReason = align === "exact" ? "title-date" : "overlap-date";
    const window = reason === "title-date" ? TITLE_DATE_WINDOW_DAYS : OVERLAP_DATE_WINDOW_DAYS;
    if (days > window) continue;
    if (!durationsCompatible(episode.duration, item.duration)) continue;
    if (best === null || days < best.days) {
      best = { reason, episodeTitle: episode.title, days };
    }
  }
  return best;
}

export function isFltsDuplicateOfEpisode(
  item: { id: string; title: string; date: string; duration?: number },
  episodes: readonly CatalogEpisode[],
): boolean {
  return findFltsEpisodeDuplicate(item, episodes) !== null;
}

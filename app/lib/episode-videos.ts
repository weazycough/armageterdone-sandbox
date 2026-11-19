// episode-videos.ts — map Canary Cry episodes to official YouTube (and, when
// we have a real catalog, Rumble) watch URLs. Matching prefers a show+episode
// number, then a tight title+date window. The committed data file is the
// source of truth at build time; scripts/update-episode-videos.ts appends
// new RSS matches without a YouTube API key.

import * as z from "zod/mini";
import { fold } from "./search.ts";
import { showOf, type ShowSlug } from "./shows.ts";

export const CCNT_CHANNEL_ID = "UCLJluiuXTB7iRhdp95iUIbA";
export const CCR_CHANNEL_ID = "UCuxgIViDUSfJ9_C9ruJFhOA";
export const FLTS_CHANNEL_ID = "UCJ5PQfYe6er4rrt4LLu7EKg";

export const YOUTUBE_CHANNELS = [
  { key: "ccnt", id: CCNT_CHANNEL_ID, title: "Canary Cry NewsTalk" },
  { key: "ccr", id: CCR_CHANNEL_ID, title: "Canary Cry Radio" },
] as const;

export type YoutubeSource = "ccnt" | "ccr" | "flts";

export const YOUTUBE_RSS_URL: Record<YoutubeSource, string> = {
  ccnt: `https://www.youtube.com/feeds/videos.xml?channel_id=${CCNT_CHANNEL_ID}`,
  ccr: `https://www.youtube.com/feeds/videos.xml?channel_id=${CCR_CHANNEL_ID}`,
  flts: `https://www.youtube.com/feeds/videos.xml?channel_id=${FLTS_CHANNEL_ID}`,
};

/** Official Rumble channel linked from the site footer and Watch page. */
export const RUMBLE_CCNT_CHANNEL = "https://rumble.com/c/CanaryCryNewsTalk";

export const episodeVideoItemSchema = z.object({
  slug: z.string(),
  youtubeId: z.optional(z.string()),
  youtubeSource: z.optional(z.enum(["ccnt", "ccr", "flts"])),
  rumbleUrl: z.optional(z.string()),
});
export type EpisodeVideoItem = z.infer<typeof episodeVideoItemSchema>;

export const episodeVideosSchema = z.object({
  meta: z.object({
    generatedAt: z.string(),
    youtube: z.number(),
    rumble: z.number(),
  }),
  items: z.array(episodeVideoItemSchema),
});
export type EpisodeVideos = z.infer<typeof episodeVideosSchema>;

export function youtubeWatchUrl(id: string, seconds?: number): string {
  const base = `https://www.youtube.com/watch?v=${id}`;
  return seconds !== undefined && seconds > 0 ? `${base}&t=${String(seconds)}s` : base;
}

export function sourceOfChannelId(id: string): YoutubeSource | null {
  if (id === CCNT_CHANNEL_ID) return "ccnt";
  if (id === CCR_CHANNEL_ID) return "ccr";
  if (id === FLTS_CHANNEL_ID) return "flts";
  return null;
}

const YEAR_NUMBERS = new Set(Array.from({ length: 16 }, (_, i) => 2016 + i));
const STOP = new Set([
  "the",
  "a",
  "an",
  "of",
  "and",
  "to",
  "in",
  "on",
  "for",
  "with",
  "from",
  "is",
  "it",
  "its",
  "by",
  "at",
  "as",
  "or",
  "we",
  "you",
  "our",
  "w",
]);

const SHOW_NUMBERS: { show: ShowSlug; pattern: RegExp }[] = [
  { show: "news-talk", pattern: /(?:canary\s*cry\s*)?(?:news\s*talk|ccnt)\s*#?\s*(\d{1,4})(?!\.\d)\b/i },
  { show: "radio", pattern: /(?:canary\s*cry\s*(?:radio)?\s*)?\bCCR\s*#?\s*(\d{1,4})(?!\.\d)\b/ },
  { show: "radio", pattern: /canary\s*cry\s*radio\s*(?:ep(?:isode)?\.?\s*)?#?\s*(\d{1,4})(?!\.\d)\b/i },
  { show: "news-talk", pattern: /^(\d{1,4})\s*CCNT\b/i },
  { show: "radio", pattern: /^(\d{1,4})\s*CCR\b/i },
];

const LEAD_NUM = /^(\d{2,4})\s*[:.\-–—]\s+\S/;
const TRAIL_NUM = /\|\s*(\d{2,4})\s*$/;
const FILE_NUMBERS: { show: ShowSlug; pattern: RegExp }[] = [
  { show: "news-talk", pattern: /(?:^|[_-])CCNT_?(\d{1,4})(?:[_.-]|$)/i },
  { show: "news-talk", pattern: /(?:^|[_-])(\d{1,4})CCNT(?:[_.-]|$)/i },
  { show: "radio", pattern: /(?:^|[_-])CCR_?(\d{1,4})(?:[_.-]|$)/i },
  { show: "radio", pattern: /(?:^|[_-])(\d{1,4})CCR(?:[_.-]|$)/i },
];

function audioFileName(audioUrl: string): string {
  const last = audioUrl.split("?")[0]?.split("/").pop() ?? "";
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

function usableNumber(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 2000 || YEAR_NUMBERS.has(n)) return null;
  return n;
}

export interface ShowNumber {
  show: ShowSlug | null;
  number: number | null;
}

/** Episode or video title (and optional MP3 name / upload channel) → show + number. */
export function parseShowAndNumber(
  title: string,
  opts: { audioUrl?: string; channel?: YoutubeSource } = {},
): ShowNumber {
  const file = opts.audioUrl !== undefined ? audioFileName(opts.audioUrl) : "";
  for (const { show, pattern } of SHOW_NUMBERS) {
    for (const src of [title, file]) {
      const match = pattern.exec(src);
      if (!match) continue;
      const n = usableNumber(match[1] ?? "");
      if (n !== null) return { show, number: n };
    }
  }
  if (file !== "") {
    for (const { show, pattern } of FILE_NUMBERS) {
      const match = pattern.exec(file);
      if (!match) continue;
      const n = usableNumber(match[1] ?? "");
      if (n !== null) return { show, number: n };
    }
  }
  const titledShow = showOf({ title, audioUrl: opts.audioUrl ?? "" });
  if (opts.channel === "ccnt" && titledShow !== "radio") {
    const lead = LEAD_NUM.exec(title.trim());
    const n = lead ? usableNumber(lead[1] ?? "") : null;
    if (n !== null) return { show: titledShow === "clubhouse" ? "clubhouse" : "news-talk", number: n };
  }
  const trail = TRAIL_NUM.exec(title.trim());
  if (trail && titledShow !== "radio" && titledShow !== "clubhouse") {
    const n = usableNumber(trail[1] ?? "");
    if (n !== null) return { show: titledShow ?? "news-talk", number: n };
  }
  // Do not assume a channel is a single show: the Radio channel also hosts
  // older News Talk uploads, and NewsTalk hosts Clubhouse. Title evidence only.
  return { show: titledShow, number: null };
}

const STRIP_DECORATION =
  /canary\s*cry\s*(news\s*talk|radio|clubhouse)|news\s*talk|\bccnt\b|\bccr\b|\bclubhouse\b|#?\b\d{1,4}\b|\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/gi;

export function titleTokens(title: string): string[] {
  const stripped = fold(title.replace(/['’]/g, "")).replace(STRIP_DECORATION, " ");
  return stripped
    .replace(/[^a-z0-9\s]/g, " ")
    .split(" ")
    .filter((w) => w !== "" && !STOP.has(w) && w.length > 1);
}

export interface TitleSimilarity {
  jaccard: number;
  overlap: number;
  intersection: number;
  contained: boolean;
}

export function titleSimilarity(a: string[] | string, b: string[] | string): TitleSimilarity {
  const left = new Set(Array.isArray(a) ? a : titleTokens(a));
  const right = new Set(Array.isArray(b) ? b : titleTokens(b));
  if (left.size === 0 || right.size === 0) {
    return { jaccard: 0, overlap: 0, intersection: 0, contained: false };
  }
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  const union = left.size + right.size - intersection;
  const contained = intersection === left.size || intersection === right.size;
  return {
    jaccard: intersection / union,
    overlap: intersection / Math.min(left.size, right.size),
    intersection,
    contained,
  };
}

export function daysApart(a: string, b: string): number | null {
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (!Number.isFinite(da) || !Number.isFinite(db)) return null;
  return Math.round(Math.abs(da - db) / 86_400_000);
}

/** Title+date match: close calendar days and a strong token overlap. */
export const TITLE_DATE_WINDOW_DAYS = 4;

export function isTitleDateMatch(sim: TitleSimilarity, days: number | null, shortTokenLength = 0): boolean {
  if (days === null || days > TITLE_DATE_WINDOW_DAYS) return false;
  if (sim.intersection >= 2 && (sim.overlap >= 0.6 || sim.jaccard >= 0.5 || sim.contained)) {
    return true;
  }
  // One distinctive made-up word ("BELLYFEEL") on the same / next day.
  return sim.contained && sim.intersection === 1 && days <= 2 && shortTokenLength >= 6;
}

/** Number matches must share a date window unless the titles also agree (re-uploads). */
export const NUMBER_DATE_WINDOW_DAYS = 45;

export function isNumberMatch(sim: TitleSimilarity, days: number | null): boolean {
  if (days === null) {
    return sim.jaccard >= 0.4 || sim.overlap >= 0.6 || sim.intersection >= 3;
  }
  return days <= NUMBER_DATE_WINDOW_DAYS || sim.jaccard >= 0.45 || sim.overlap >= 0.65;
}

export interface EpisodeCandidate {
  slug: string;
  title: string;
  published: string;
  audioUrl?: string;
  show?: ShowSlug | null;
}

export interface VideoCandidate {
  id: string;
  title: string;
  published: string;
  channel: YoutubeSource;
}

export interface CatalogHint {
  id: string;
  title: string;
  date?: string;
  matchedShow?: "CCNT" | "CCR" | "Clubhouse" | null;
  matchedEpisodeNumber?: number | null;
  siteFeedMatch?: { title: string; date?: string } | null;
}

export type MatchMethod = "number" | "title-date" | "catalog";

export interface VideoMatch {
  slug: string;
  youtubeId: string;
  youtubeSource: YoutubeSource;
  method: MatchMethod;
}

const CATALOG_SHOW: Record<"CCNT" | "CCR" | "Clubhouse", ShowSlug> = {
  CCNT: "news-talk",
  CCR: "radio",
  Clubhouse: "clubhouse",
};

function sourceRank(channel: YoutubeSource, show: ShowSlug | null): number {
  if (show === "radio" && channel === "ccr") return 0;
  if (show === "news-talk" && channel === "ccnt") return 0;
  if (show === "clubhouse" && channel === "ccnt") return 0;
  if (channel === "ccnt" || channel === "ccr") return 1;
  return 2;
}

interface PreparedEpisode {
  ep: EpisodeCandidate;
  show: ShowSlug | null;
  number: number | null;
  tokens: string[];
  folded: string;
}

interface PreparedVideo {
  video: VideoCandidate;
  show: ShowSlug | null;
  number: number | null;
  tokens: string[];
}

type Score = readonly [number, number, number, number, number];

interface Cand {
  score: Score;
  slug: string;
  video: PreparedVideo;
  method: MatchMethod;
}

function prepareEpisode(ep: EpisodeCandidate): PreparedEpisode {
  const parsed = parseShowAndNumber(ep.title, { audioUrl: ep.audioUrl });
  return {
    ep,
    show: ep.show ?? parsed.show,
    number: parsed.number,
    tokens: titleTokens(ep.title),
    folded: fold(ep.title),
  };
}

function prepareVideo(video: VideoCandidate): PreparedVideo {
  const parsed = parseShowAndNumber(video.title, { channel: video.channel });
  return { video, show: parsed.show, number: parsed.number, tokens: titleTokens(video.title) };
}

function shortTokenLen(sim: TitleSimilarity, a: string[], b: string[]): number {
  if (sim.intersection !== 1) return 0;
  const right = new Set(b);
  const token = a.find((t) => right.has(t)) ?? b.find((t) => a.includes(t)) ?? "";
  return token.length;
}

function scoreOf(
  method: MatchMethod,
  channel: YoutubeSource,
  show: ShowSlug | null,
  days: number | null,
  sim: TitleSimilarity,
  videoHasNumber: boolean,
): Score {
  const official = sourceRank(channel, show);
  const kind = method === "title-date" ? 1 : 0;
  const numbered = videoHasNumber ? 0 : 1;
  return [official, kind, numbered, days ?? 99, Math.round((1 - sim.jaccard) * 1000)];
}

/**
 * Pair official (and FaceLikeTheSun-reupload) videos with episodes.
 * One video maps to at most one episode; official show channels win ties.
 */
export function matchEpisodeVideos(
  episodes: readonly EpisodeCandidate[],
  videos: readonly VideoCandidate[],
  catalog: readonly CatalogHint[] = [],
): VideoMatch[] {
  const preparedEps = episodes.map(prepareEpisode);
  const preparedVideos = videos.map(prepareVideo);
  const byNumber = new Map<string, PreparedEpisode[]>();
  const byFolded = new Map<string, PreparedEpisode[]>();
  const bySlug = new Map<string, PreparedEpisode>();

  for (const ep of preparedEps) {
    bySlug.set(ep.ep.slug, ep);
    if (ep.show !== null && ep.number !== null) {
      const key = `${ep.show}:${String(ep.number)}`;
      const list = byNumber.get(key) ?? [];
      list.push(ep);
      byNumber.set(key, list);
    }
    const list = byFolded.get(ep.folded) ?? [];
    list.push(ep);
    byFolded.set(ep.folded, list);
  }

  const cands: Cand[] = [];

  const add = (ep: PreparedEpisode, pv: PreparedVideo, method: MatchMethod, days: number | null, sim: TitleSimilarity) => {
    cands.push({
      score: scoreOf(method, pv.video.channel, ep.show, days, sim, pv.number !== null),
      slug: ep.ep.slug,
      video: pv,
      method,
    });
  };

  const pickByNumber = (show: ShowSlug, number: number, published: string): PreparedEpisode | null => {
    const list = byNumber.get(`${show}:${String(number)}`);
    if (list === undefined || list.length === 0) return null;
    if (list.length === 1) return list[0]!;
    return list.reduce((best, cur) => {
      const bd = daysApart(best.ep.published, published);
      const cd = daysApart(cur.ep.published, published);
      if (cd === null) return best;
      if (bd === null || cd < bd) return cur;
      return best;
    });
  };

  for (const pv of preparedVideos) {
    if (pv.show !== null && pv.number !== null) {
      const ep = pickByNumber(pv.show, pv.number, pv.video.published);
      if (ep !== null) {
        const days = daysApart(ep.ep.published, pv.video.published);
        const sim = titleSimilarity(ep.tokens, pv.tokens);
        if (isNumberMatch(sim, days)) add(ep, pv, "number", days, sim);
      }
    }
    if (pv.tokens.length === 0) continue;
    for (const ep of preparedEps) {
      if (pv.show !== null && ep.show !== null && pv.show !== ep.show) continue;
      if (pv.number !== null && ep.number !== null && pv.number !== ep.number) continue;
      const days = daysApart(ep.ep.published, pv.video.published);
      const sim = titleSimilarity(ep.tokens, pv.tokens);
      const shortLen = shortTokenLen(sim, ep.tokens, pv.tokens);
      if (isTitleDateMatch(sim, days, shortLen)) add(ep, pv, "title-date", days, sim);
    }
  }

  const catalogShow = (hint: CatalogHint): ShowSlug | null =>
    hint.matchedShow ? CATALOG_SHOW[hint.matchedShow] : null;

  for (const hint of catalog) {
    let ep: PreparedEpisode | undefined;
    const show = catalogShow(hint);
    if (show !== null && hint.matchedEpisodeNumber) {
      ep = pickByNumber(show, hint.matchedEpisodeNumber, hint.date ?? hint.siteFeedMatch?.date ?? "") ?? undefined;
    }
    if (ep === undefined && hint.siteFeedMatch?.title) {
      const folded = fold(hint.siteFeedMatch.title);
      const exact = byFolded.get(folded);
      if (exact?.length === 1) ep = exact[0];
      else {
        const loose = preparedEps.filter(
          (e) => e.folded === folded || e.folded.includes(folded) || folded.includes(e.folded),
        );
        if (loose.length === 1) ep = loose[0];
      }
    }
    if (ep === undefined) continue;
    const existing = preparedVideos.find((v) => v.video.id === hint.id);
    const pv: PreparedVideo =
      existing ??
      prepareVideo({
        id: hint.id,
        title: hint.title,
        published: hint.date ?? hint.siteFeedMatch?.date ?? ep.ep.published,
        channel: "flts",
      });
    const days = daysApart(ep.ep.published, pv.video.published);
    const sim = titleSimilarity(ep.tokens, pv.tokens);
    const shortLen = shortTokenLen(sim, ep.tokens, pv.tokens);
    const numberOk =
      ep.number !== null &&
      (pv.number === ep.number || hint.matchedEpisodeNumber === ep.number) &&
      (ep.show === null || pv.show === null || ep.show === pv.show || catalogShow(hint) === ep.show) &&
      isNumberMatch(sim, days);
    if (!numberOk && !isTitleDateMatch(sim, days, shortLen)) continue;
    add(ep, pv, "catalog", days, sim);
  }

  cands.sort((a, b) => {
    for (let i = 0; i < a.score.length; i += 1) {
      const d = a.score[i]! - b.score[i]!;
      if (d !== 0) return d;
    }
    return a.slug.localeCompare(b.slug);
  });

  const usedSlug = new Set<string>();
  const usedVideo = new Set<string>();
  const matches: VideoMatch[] = [];
  for (const cand of cands) {
    if (usedSlug.has(cand.slug) || usedVideo.has(cand.video.video.id)) continue;
    usedSlug.add(cand.slug);
    usedVideo.add(cand.video.video.id);
    matches.push({
      slug: cand.slug,
      youtubeId: cand.video.video.id,
      youtubeSource: cand.video.video.channel,
      method: cand.method,
    });
  }
  return matches;
}

export function indexEpisodeVideos(data: EpisodeVideos): Map<string, EpisodeVideoItem> {
  return new Map(data.items.map((item) => [item.slug, item]));
}

export function mergeVideoItems(existing: readonly EpisodeVideoItem[], incoming: readonly EpisodeVideoItem[]): EpisodeVideoItem[] {
  const bySlug = new Map(existing.map((item) => [item.slug, { ...item }]));
  for (const item of incoming) {
    const cur = bySlug.get(item.slug);
    if (cur === undefined) {
      bySlug.set(item.slug, { ...item });
      continue;
    }
    if (cur.youtubeId === undefined && item.youtubeId !== undefined) {
      cur.youtubeId = item.youtubeId;
      cur.youtubeSource = item.youtubeSource;
    }
    if (cur.rumbleUrl === undefined && item.rumbleUrl !== undefined) {
      cur.rumbleUrl = item.rumbleUrl;
    }
  }
  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

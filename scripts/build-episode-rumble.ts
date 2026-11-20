// build-episode-rumble.ts — match the official CanaryCryNewsTalk Rumble
// catalog to site episodes and write content/episode-rumble.json.
//
//   node scripts/build-episode-rumble.ts

import { readFile, writeFile } from "node:fs/promises";
import { episodeListSchema } from "../app/lib/feed.ts";
import {
  parseShowAndNumber,
  titleSimilarity,
  titleTokens,
  type EpisodeCandidate,
} from "../app/lib/episode-videos.ts";
import { EPISODE_RUMBLE, EPISODES_JSON } from "../app/lib/paths.ts";
import { fold } from "../app/lib/search.ts";
import { showOf, type ShowSlug } from "../app/lib/shows.ts";

const BATCHES = [
  "/workspace/rumble/batch-01-12.txt",
  "/workspace/rumble/batch-13-24.txt",
  "/workspace/rumble/batch-25-35.txt",
];

const NUMBER_DATE_WINDOW = 14;
const LIKELY_DATE_WINDOW = 2;
const TITLE_DATE_WINDOW = 4;
const EXACT_TITLE_WINDOW = 6;
const MODEST_TITLE_WINDOW = 1;

export interface RumbleRow {
  url: string;
  id: string;
  date: string;
  label: string;
  title: string;
  skip: boolean;
  skipReason?: string;
  prefer?: boolean;
  likely: boolean;
  numbers: { show: ShowSlug; number: number }[];
}

export interface PreparedEpisode extends EpisodeCandidate {
  show: ShowSlug | null;
  number: number | null;
  tokens: string[];
  folded: string;
  day: string;
}

function calendarDays(left: string, right: string): number | undefined {
  const a = Date.parse(left.includes("T") ? left : `${left}T12:00:00.000Z`);
  const b = Date.parse(right.includes("T") ? right : `${right}T12:00:00.000Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return undefined;
  const startOfDay = (ms: number): number => {
    const d = new Date(ms);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  };
  return Math.round(Math.abs(startOfDay(a) - startOfDay(b)) / 86_400_000);
}

function parseRumbleUrl(url: string): { id: string; slugTitle: string } {
  const match = /^https:\/\/(?:www\.)?rumble\.com\/(v[0-9a-z]+)(?:-(.*?))?\.html\/?$/i.exec(url);
  if (!match) return { id: "", slugTitle: "" };
  return { id: match[1] ?? "", slugTitle: (match[2] ?? "").replace(/-/g, " ") };
}

function isSkipLabel(label: string): string | undefined {
  const low = label.toLowerCase();
  if (/\bbad version\b/.test(low)) return "bad version";
  if (/\bnot an episode\b/.test(low) || /\bexplicitly not an episode\b/.test(low)) return "not an episode";
  if (/\bnot a full episode\b/.test(low) || /\bclip\/alt\b/.test(low) || /^clip\b/.test(low)) return "clip";
  return undefined;
}

function numbersFromText(text: string): { show: ShowSlug; number: number }[] {
  const out: { show: ShowSlug; number: number }[] = [];
  const seen = new Set<string>();
  const patterns: { show: ShowSlug; re: RegExp }[] = [
    { show: "news-talk", re: /\bCCNT\s*#?\s*(\d{1,4})\b/gi },
    { show: "radio", re: /\bCCR\s*#?\s*(\d{1,4})\b/gi },
    { show: "news-talk", re: /\bcanary\s*cry\s*news\s*talk\s*#?\s*(\d{1,4})\b/gi },
  ];
  for (const { show, re } of patterns) {
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      const n = Number(match[1]);
      if (!Number.isInteger(n) || n < 1 || n > 2000 || n >= 2016 && n <= 2026) continue;
      const key = `${show}:${String(n)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ show, number: n });
    }
  }
  const slugCcnt = /\bccnt[_-]?(\d{1,4})\b/i.exec(text);
  const slugCcr = /\bccr[_-]?(\d{1,4})\b/i.exec(text);
  if (slugCcnt) {
    const n = Number(slugCcnt[1]);
    const key = `news-talk:${String(n)}`;
    if (Number.isInteger(n) && n < 2016 && !seen.has(key)) {
      seen.add(key);
      out.push({ show: "news-talk", number: n });
    }
  }
  if (slugCcr) {
    const n = Number(slugCcr[1]);
    const key = `radio:${String(n)}`;
    if (Number.isInteger(n) && n < 2016 && !seen.has(key)) {
      seen.add(key);
      out.push({ show: "radio", number: n });
    }
  }
  return out;
}

function likelyNumbers(label: string): { show: ShowSlug; number: number }[] {
  const out: { show: ShowSlug; number: number }[] = [];
  const seen = new Set<string>();
  const re = /likely[^\n]*?(?:CCNT|CCR)\s*#?\s*(\d{1,4})(?:\s+or\s+(?:CCNT\s*|CCR\s*)?(\d{1,4}))?/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(label)) !== null) {
    const show: ShowSlug = /ccr/i.test(match[0]) && !/ccnt/i.test(match[0]) ? "radio" : "news-talk";
    // "likely CCNT 335 or 336" — both CCNT
    const show2: ShowSlug = /likely[^\n]*CCR/i.test(match[0]) && !/CCNT/i.test(match[0]) ? "radio" : "news-talk";
    for (const raw of [match[1], match[2]]) {
      if (raw === undefined) continue;
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > 2000) continue;
      const key = `${show2}:${String(n)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ show: show === "radio" && show2 === "radio" ? "radio" : "news-talk", number: n });
    }
  }
  // "title says 907; likely 908" without a show word after likely
  const bare = /likely\s+(\d{1,4})\b/i.exec(label);
  if (bare && out.length === 0) {
    const n = Number(bare[1]);
    if (Number.isInteger(n)) out.push({ show: "news-talk", number: n });
  }
  return out;
}

function displayTitle(label: string, slugTitle: string): string {
  const titled = /(?:^|\b)TITLE=([^\n]+)$/.exec(label);
  if (titled) return titled[1] ?? slugTitle;
  const cleaned = label
    .replace(/\((?:dup upload[^)]*|canonical|FIXED|earlier(?: id)?|title says[^)]*|no number[^)]*|untitled[^)]*|verify[^)]*)\)/gi, " ")
    .replace(/\b(?:FIXED|canonical|skip)\b/gi, " ")
    .trim();
  if (cleaned !== "" && !cleaned.startsWith("TITLE=")) return `${cleaned} ${slugTitle}`;
  return slugTitle;
}

export function parseRumbleLine(line: string): RumbleRow | null {
  const trimmed = line.trim();
  if (trimmed === "" || trimmed.startsWith("#")) return null;
  const parts = trimmed.split("|");
  const url = parts[0]?.trim() ?? "";
  if (!url.startsWith("https://rumble.com/")) return null;
  const date = parts[1]?.trim() ?? "";
  const label = parts.slice(2).join("|").trim();
  const { id, slugTitle } = parseRumbleUrl(url);
  const skipReason = isSkipLabel(label);
  const likely = /\blikely\b/i.test(label);
  const fromLikely = likely ? likelyNumbers(label) : [];
  const fromText = numbersFromText(`${label} ${slugTitle}`);
  // When the label names a "likely" number, prefer those over a conflicting slug number (907 vs 908).
  const numbers = fromLikely.length > 0 ? fromLikely : fromText;
  const prefer = /\b(?:canonical|fixed|earlier(?:\s+id)?)\b/i.test(label);
  return {
    url,
    id,
    date,
    label,
    title: displayTitle(label, slugTitle),
    skip: skipReason !== undefined,
    skipReason,
    prefer,
    likely,
    numbers,
  };
}

function slugSimilarity(episodeSlug: string, rumbleTitle: string): number {
  const left = fold(episodeSlug.replace(/-/g, " "));
  const right = fold(rumbleTitle);
  if (left === "" || right === "") return 0;
  if (left.includes(right) || right.includes(left)) return 1;
  return titleSimilarity(titleTokens(left), titleTokens(right)).overlap;
}

function coreTitle(value: string): string {
  return fold(value)
    .replace(/\b(canary cry|clubhouse|news talk|ccnt|ccr|call[- ]?in|discussion|live)\b/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function exactTitle(episodeTitle: string, videoTitle: string, sim?: ReturnType<typeof titleSimilarity>): boolean {
  const left = coreTitle(episodeTitle);
  const right = coreTitle(videoTitle);
  if (left === "" || right === "") return false;
  if (left === right) return true;
  const shorter = left.length <= right.length ? left : right;
  const longer = left.length <= right.length ? right : left;
  if (shorter.length >= 20 && longer.includes(shorter)) return true;
  return sim !== undefined && sim.contained === true && sim.overlap >= 0.9 && sim.intersection >= 4;
}

function strongTitle(sim: ReturnType<typeof titleSimilarity>, slugScore: number): boolean {
  if (slugScore >= 0.85) return true;
  if (sim.contained && sim.intersection >= 2) return true;
  if (sim.overlap >= 0.6 && sim.intersection >= 3) return true;
  if (sim.overlap >= 0.7 && sim.intersection >= 2) return true;
  if (sim.jaccard >= 0.5 && sim.intersection >= 2) return true;
  return false;
}

function firstTokens(value: string, n: number): string[] {
  return titleTokens(value).slice(0, n);
}

function modestTitle(
  sim: ReturnType<typeof titleSimilarity>,
  slugScore: number,
  episodeTitle?: string,
  videoTitle?: string,
): boolean {
  if (strongTitle(sim, slugScore) || slugScore >= 0.6 || sim.contained) return true;
  if (sim.overlap >= 0.5 && sim.intersection >= 3) return true;
  if (sim.overlap >= 0.5 && sim.intersection >= 2 && episodeTitle !== undefined && videoTitle !== undefined) {
    const a = firstTokens(episodeTitle, 2).join(" ");
    const b = firstTokens(videoTitle, 2).join(" ");
    return a !== "" && a === b;
  }
  return false;
}

interface Cand {
  episode: PreparedEpisode;
  row: RumbleRow;
  days: number;
  method: "number" | "likely-number" | "title-date";
  sim: ReturnType<typeof titleSimilarity>;
  slugScore: number;
}

function titleRank(c: Cand): number {
  if (exactTitle(c.episode.title, c.row.title, c.sim) || c.slugScore >= 0.9) return 0;
  if (strongTitle(c.sim, c.slugScore)) return 1;
  return 2;
}

function scoreCand(c: Cand): Array<number | string> {
  // lower is better
  const methodRank = c.method === "number" ? 0 : c.method === "likely-number" ? 1 : 2;
  const prefer = c.row.prefer ? 0 : 1;
  return [methodRank, titleRank(c), prefer, c.days, -c.slugScore, -c.sim.overlap, c.row.date, c.row.id];
}

export async function matchRumbleCatalog(
  episodeSource = EPISODES_JSON,
  batchPaths = BATCHES,
): Promise<{
  items: { slug: string; rumbleUrl: string; method: string; label: string }[];
  skipped: { row: RumbleRow; reason: string }[];
  unmatched: RumbleRow[];
  uncertain: { row: RumbleRow; reason: string; candidates?: string[] }[];
  episodes: PreparedEpisode[];
}> {
  const episodes = episodeListSchema.parse(JSON.parse(await readFile(episodeSource, "utf8")));
  const prepared: PreparedEpisode[] = episodes.map((e) => {
    const parsed = parseShowAndNumber(e.title, { audioUrl: e.audioUrl });
    const show = showOf(e);
    return {
      slug: e.slug,
      title: e.title,
      published: e.published,
      audioUrl: e.audioUrl,
      show,
      number: parsed.number,
      tokens: titleTokens(e.title),
      folded: fold(e.title),
      day: e.published.slice(0, 10),
    };
  });
  const byNumber = new Map<string, PreparedEpisode[]>();
  for (const e of prepared) {
    if (e.number === null || e.show === null) continue;
    const key = `${e.show}:${String(e.number)}`;
    const list = byNumber.get(key) ?? [];
    list.push(e);
    byNumber.set(key, list);
  }
  // Also index CCR-in-title on a news-talk episode (CCR 165 | CCNT 688).
  for (const e of prepared) {
    const ccr = /\bCCR\s*#?\s*(\d{1,4})\b/.exec(e.title);
    if (!ccr) continue;
    const n = Number(ccr[1]);
    const key = `radio:${String(n)}`;
    if (!byNumber.has(key)) byNumber.set(key, [e]);
  }

  const rows: RumbleRow[] = [];
  for (const path of batchPaths) {
    const text = await readFile(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const row = parseRumbleLine(line);
      if (row) rows.push(row);
    }
  }

  const skipped: { row: RumbleRow; reason: string }[] = [];
  const unmatched: RumbleRow[] = [];
  const uncertain: { row: RumbleRow; reason: string; candidates?: string[] }[] = [];
  const cands: Cand[] = [];

  for (const row of rows) {
    if (row.skip) {
      skipped.push({ row, reason: row.skipReason ?? "skipped" });
      continue;
    }
    const tokens = titleTokens(row.title);
    const found: Cand[] = [];

    const consider = (episode: PreparedEpisode, method: Cand["method"]) => {
      const days = calendarDays(episode.published, row.date);
      if (days === undefined) return;
      const sim = titleSimilarity(tokens, episode.tokens);
      const slugScore = slugSimilarity(episode.slug, row.title);
      if (method === "number") {
        if (days <= NUMBER_DATE_WINDOW) {
          found.push({ episode, row, days, method, sim, slugScore });
          return;
        }
        if (days <= 45 && modestTitle(sim, slugScore, episode.title, row.title)) {
          found.push({ episode, row, days, method, sim, slugScore });
        }
        return;
      }
      if (method === "likely-number") {
        if (days <= LIKELY_DATE_WINDOW && (modestTitle(sim, slugScore, episode.title, row.title) || sim.contained || slugScore >= 0.5 || tokens.length <= 2)) {
          found.push({ episode, row, days, method, sim, slugScore });
        }
        return;
      }
      const exact = exactTitle(episode.title, row.title, sim);
      if (exact && days <= EXACT_TITLE_WINDOW) {
        found.push({ episode, row, days, method, sim, slugScore });
        return;
      }
      if (strongTitle(sim, slugScore) && days <= TITLE_DATE_WINDOW) {
        found.push({ episode, row, days, method, sim, slugScore });
        return;
      }
      if (modestTitle(sim, slugScore, episode.title, row.title) && days <= MODEST_TITLE_WINDOW) {
        found.push({ episode, row, days, method, sim, slugScore });
      }
    };

    if (row.numbers.length > 0) {
      for (const num of row.numbers) {
        const list = byNumber.get(`${num.show}:${String(num.number)}`) ?? [];
        for (const episode of list) consider(episode, row.likely ? "likely-number" : "number");
      }
    }
    if (found.length === 0) {
      for (const episode of prepared) consider(episode, "title-date");
    }

    if (found.length === 0) {
      // Number was present but date/title didn't clear the bar.
      if (row.numbers.length > 0) {
        const nearby: string[] = [];
        for (const num of row.numbers) {
          for (const episode of byNumber.get(`${num.show}:${String(num.number)}`) ?? []) {
            const days = calendarDays(episode.published, row.date);
            nearby.push(`${episode.slug} (${episode.day}, ${String(days)}d)`);
          }
        }
        if (nearby.length > 0) {
          uncertain.push({ row, reason: "number found but date/title too far", candidates: nearby });
          continue;
        }
      }
      unmatched.push(row);
      continue;
    }

    found.sort((a, b) => {
      const sa = scoreCand(a);
      const sb = scoreCand(b);
      for (let i = 0; i < sa.length; i += 1) {
        if (sa[i]! < sb[i]!) return -1;
        if (sa[i]! > sb[i]!) return 1;
      }
      return 0;
    });
    const best = found[0]!;
    // If two different episodes score close, skip as uncertain.
    const rival = found.find((c) => c.episode.slug !== best.episode.slug);
    if (
      rival &&
      titleRank(rival) === titleRank(best) &&
      rival.days <= best.days + 1 &&
      Math.abs(rival.slugScore - best.slugScore) < 0.15 &&
      Math.abs(rival.sim.overlap - best.sim.overlap) < 0.15
    ) {
      uncertain.push({
        row,
        reason: "ambiguous between episodes",
        candidates: [best.episode.slug, rival.episode.slug],
      });
      continue;
    }
    cands.push(best);
  }

  // One canonical URL per episode; one episode per URL.
  cands.sort((a, b) => {
    const sa = scoreCand(a);
    const sb = scoreCand(b);
    for (let i = 0; i < sa.length; i += 1) {
      if (sa[i]! < sb[i]!) return -1;
      if (sa[i]! > sb[i]!) return 1;
    }
    return a.row.id.localeCompare(b.row.id);
  });
  const usedSlug = new Set<string>();
  const usedUrl = new Set<string>();
  const items: { slug: string; rumbleUrl: string; method: string; label: string }[] = [];
  const leftover: RumbleRow[] = [];
  for (const cand of cands) {
    if (usedSlug.has(cand.episode.slug) || usedUrl.has(cand.row.url)) {
      leftover.push(cand.row);
      continue;
    }
    usedSlug.add(cand.episode.slug);
    usedUrl.add(cand.row.url);
    items.push({
      slug: cand.episode.slug,
      rumbleUrl: cand.row.url,
      method: cand.method,
      label: cand.row.label,
    });
  }
  items.sort((a, b) => a.slug.localeCompare(b.slug));
  return { items, skipped, unmatched: [...unmatched, ...leftover], uncertain, episodes: prepared };
}

async function main(): Promise<void> {
  const result = await matchRumbleCatalog();
  const byShow = { "news-talk": 0, radio: 0, clubhouse: 0, none: 0 };
  const totals = { "news-talk": 0, radio: 0, clubhouse: 0, none: 0 };
  const itemBySlug = new Map(result.items.map((i) => [i.slug, i]));
  for (const e of result.episodes) {
    const key = e.show ?? "none";
    totals[key] += 1;
    if (itemBySlug.has(e.slug)) byShow[key] += 1;
  }
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      source: "rumble/batch-01-12+13-24+25-35",
      included: result.items.length,
    },
    items: result.items.map((i) => ({ slug: i.slug, rumbleUrl: i.rumbleUrl })),
  };
  await writeFile(EPISODE_RUMBLE, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(
    "/tmp/rumble-match-report.json",
    JSON.stringify(
      {
        byShow,
        totals,
        matched: result.items.length,
        skipped: result.skipped.length,
        unmatched: result.unmatched.length,
        uncertainCount: result.uncertain.length,
        methods: result.items.reduce<Record<string, number>>((acc, i) => {
          acc[i.method] = (acc[i.method] ?? 0) + 1;
          return acc;
        }, {}),
        skippedReasons: result.skipped.reduce<Record<string, number>>((acc, s) => {
          acc[s.reason] = (acc[s.reason] ?? 0) + 1;
          return acc;
        }, {}),
        unmatchedSample: result.unmatched.slice(0, 80).map((r) => ({ date: r.date, label: r.label, url: r.url, title: r.title })),
        uncertain: result.uncertain.map((u) => ({
          date: u.row.date,
          label: u.row.label,
          url: u.row.url,
          reason: u.reason,
          candidates: u.candidates,
        })),
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ byShow, totals, matched: result.items.length, skipped: result.skipped.length, unmatched: result.unmatched.length, uncertain: result.uncertain.length }, null, 2));
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("build-episode-rumble.ts") === true) {
  await main();
}

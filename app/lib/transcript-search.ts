// transcript-search.ts — client-side search over episode show notes (and,
// later, real transcripts). The build writes dist/transcript-search-index.json
// (scripts/assemble-dist.ts); the /transcripts/ page downloads it once and
// filters in the browser. Same fold/match idea as app/lib/search.ts, with
// highlighted snippets and optional nearby timestamps from the notes.

import * as z from "zod/mini";
import { fold, plainText } from "./search.ts";

export { plainText };

/** File name under the site root. */
export const TRANSCRIPT_INDEX_FILE = "transcript-search-index.json";

/** How much of each episode's show notes goes in the index (keeps the
 *  download sane; titles are always searched in full). */
export const NOTES_TEXT_CHARS = 4000;

export const transcriptEntrySchema = z.object({
  /** "show-notes" today; "transcript" when a real transcript is dropped in. */
  source: z.enum(["show-notes", "transcript"]),
  title: z.string(),
  /** Router path to the episode page when one exists ("/episodes/…/"). */
  path: z.optional(z.string()),
  /** Off-site page for a transcript that isn't in the feed yet. */
  externalUrl: z.optional(z.string()),
  /** ISO publication date when known. */
  date: z.optional(z.string()),
  audioUrl: z.optional(z.string()),
  videoUrl: z.optional(z.string()),
  /** Plain text searched besides the title. */
  text: z.string(),
});
export type TranscriptEntry = z.infer<typeof transcriptEntrySchema>;

export const transcriptIndexSchema = z.array(transcriptEntrySchema);

export interface PreparedTranscript {
  entry: TranscriptEntry;
  title: string;
  all: string;
  /** Original (unfolded) body, for snippets. */
  body: string;
}

export function prepareTranscripts(entries: TranscriptEntry[]): PreparedTranscript[] {
  return entries.map((entry) => ({
    entry,
    title: fold(entry.title),
    all: fold(`${entry.title} ${entry.text}`),
    body: entry.text,
  }));
}

export type SnippetPart = { text: string; hit?: boolean };

/** A short window around the first query match, with matching runs marked. */
export function snippetParts(text: string, query: string, radius = 100): SnippetPart[] {
  const words = fold(query).split(" ").filter(Boolean);
  if (words.length === 0 || text === "") return [];
  const folded = fold(text);
  let at = -1;
  for (const w of words) {
    const i = folded.indexOf(w);
    if (i >= 0) {
      at = i;
      break;
    }
  }
  if (at < 0) return [{ text: text.slice(0, radius * 2).trim() + (text.length > radius * 2 ? "…" : "") }];

  // Map folded index roughly onto the original by walking both; accents make
  // lengths differ, so we approximate with the same slice bounds on `text`.
  const start = Math.max(0, at - radius);
  const end = Math.min(text.length, at + words[0]!.length + radius);
  let window = text.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) window = `…${window}`;
  if (end < text.length) window = `${window}…`;

  // Match on a lowercased window so highlight offsets line up with `window`
  // (fold() can change length when accents are stripped).
  const lower = window.toLowerCase();
  const parts: SnippetPart[] = [];
  let cursor = 0;
  const ranges: { a: number; b: number }[] = [];
  for (const w of words) {
    let from = 0;
    while (from < lower.length) {
      const i = lower.indexOf(w, from);
      if (i < 0) break;
      ranges.push({ a: i, b: i + w.length });
      from = i + w.length;
    }
  }
  ranges.sort((x, y) => x.a - y.a || x.b - y.b);
  const merged: { a: number; b: number }[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r.a <= last.b) last.b = Math.max(last.b, r.b);
    else merged.push({ ...r });
  }
  for (const r of merged) {
    if (r.a > cursor) parts.push({ text: window.slice(cursor, r.a) });
    parts.push({ text: window.slice(r.a, r.b), hit: true });
    cursor = r.b;
  }
  if (cursor < window.length) parts.push({ text: window.slice(cursor) });
  return parts;
}

/** First timestamp (M:SS or H:MM:SS) near the first query hit in the body. */
export function nearbyTimestamp(text: string, query: string): string | undefined {
  const words = fold(query).split(" ").filter(Boolean);
  if (words.length === 0) return undefined;
  const folded = fold(text);
  let at = -1;
  for (const w of words) {
    const i = folded.indexOf(w);
    if (i >= 0) {
      at = i;
      break;
    }
  }
  if (at < 0) return undefined;
  const window = text.slice(Math.max(0, at - 100), Math.min(text.length, at + 100));
  return /\b(\d{1,2}:\d{2}(?::\d{2})?)\b/.exec(window)?.[1];
}

export interface TranscriptHit {
  entry: TranscriptEntry;
  snippet: SnippetPart[];
  timestamp?: string;
}

/** Entries containing every word of the query; title matches first. */
export function searchTranscripts(
  index: PreparedTranscript[],
  query: string,
  limit = 40,
): TranscriptHit[] {
  const words = fold(query).split(" ").filter(Boolean);
  if (words.length === 0) return [];
  const hits = index.filter((p) => words.every((w) => p.all.includes(w)));
  const inTitle = hits.filter((p) => words.every((w) => p.title.includes(w)));
  const rest = hits.filter((p) => !inTitle.includes(p));
  return [...inTitle, ...rest].slice(0, limit).map((p) => ({
    entry: p.entry,
    snippet: snippetParts(p.body || p.entry.title, query),
    timestamp: nearbyTimestamp(p.body, query),
  }));
}

const YOUTUBE_URL =
  /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?[^"'<\s]*v=[\w-]+|youtu\.be\/[\w-]+)[^"'<\s]*/i;

/** First YouTube watch URL in HTML or plain text, if any. */
export function firstYoutubeUrl(htmlOrText: string): string | undefined {
  const m = YOUTUBE_URL.exec(htmlOrText);
  if (m === null) return undefined;
  // Strip trailing punctuation that often sticks to URLs in notes.
  return m[0]!.replace(/[).,;]+$/g, "");
}

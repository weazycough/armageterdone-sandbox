// search.ts — site search without a search service: the build writes every
// page and episode to dist/search-index.json (scripts/assemble-dist.ts), the
// search dialog downloads it the first time it opens and filters it in the
// browser. Shared by both sides, so the index format is checked at the
// boundary: Zod on write and on read.

import * as z from "zod/mini";

export const searchEntrySchema = z.object({
  /** "page" or "episode": shown beside the result. */
  kind: z.enum(["page", "episode"]),
  title: z.string(),
  /** Router path ("/support/"), no base path. */
  path: z.string(),
  /** Episodes: the publication date, ISO. */
  date: z.optional(z.string()),
  /** Plain text that is searched besides the title (cut short at build). */
  text: z.string(),
});
export type SearchEntry = z.infer<typeof searchEntrySchema>;

export const searchIndexSchema = z.array(searchEntrySchema);

/** File name under the site root. */
export const SEARCH_INDEX_FILE = "search-index.json";

/** How much of a page's or episode's text goes in the index. */
export const SEARCH_TEXT_CHARS = 400;

/** Lower case, accents off ("Dölek" matches "dolek"), runs of space as one. */
export function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ");
}

/** Text from HTML: tags dropped, entities for the common characters decoded. */
export function plainText(html: string): string {
  return html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export interface Prepared {
  entry: SearchEntry;
  title: string;
  all: string;
}

/** Fold every entry once, when the index arrives. */
export function prepare(entries: SearchEntry[]): Prepared[] {
  return entries.map((entry) => ({
    entry,
    title: fold(entry.title),
    all: fold(`${entry.title} ${entry.text}`),
  }));
}

/** Entries containing every word of the query; title matches first, then the
 *  index order (pages, then episodes newest first). */
export function search(index: Prepared[], query: string, limit = 30): SearchEntry[] {
  const words = fold(query).split(" ").filter(Boolean);
  if (words.length === 0) return [];
  const hits = index.filter((p) => words.every((w) => p.all.includes(w)));
  const inTitle = new Set(hits.filter((p) => words.every((w) => p.title.includes(w))));
  const rest = hits.filter((p) => !inTitle.has(p));
  return [...inTitle, ...rest].slice(0, limit).map((p) => p.entry);
}

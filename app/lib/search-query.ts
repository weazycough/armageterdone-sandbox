// search-query.ts — query parsing, filtering, sorting and highlighting for
// the dedicated /search/ page (episodes + FaceLikeTheSun).

import { formatDuration, formatDurationSeconds } from "./duration";
import { type FltsChapter, type FltsItem, youtubeUrl } from "./flts";
import { type SearchEntry, fold } from "./search";

export const SEARCH_PAGE_SIZE = 12;

export type ShowFilter = "all" | "news-talk" | "radio" | "clubhouse" | "facelikethesun";
export type SearchSort = "relevance" | "newest";
export type SearchShow = "news-talk" | "radio" | "clubhouse" | "facelikethesun" | "other";

export const SHOW_FILTERS: { id: ShowFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "news-talk", label: "News Talk" },
  { id: "radio", label: "Radio" },
  { id: "clubhouse", label: "Clubhouse" },
  { id: "facelikethesun", label: "FaceLikeTheSun" },
];

export const SHOW_LABELS: Record<SearchShow, string> = {
  "news-talk": "News Talk",
  radio: "Radio",
  clubhouse: "Clubhouse",
  facelikethesun: "FaceLikeTheSun",
  other: "Episode",
};

export interface ParsedQuery {
  raw: string;
  phrases: string[];
  words: string[];
  /** Original terms, for highlighting (case-insensitive on the visible text). */
  terms: string[];
}

export function parseQuery(raw: string): ParsedQuery {
  const phrases: string[] = [];
  const terms: string[] = [];
  const rest = raw.replace(/"([^"]*)"/g, (_m, phrase: string) => {
    const trimmed = phrase.trim();
    const folded = fold(trimmed);
    if (folded) {
      phrases.push(folded);
      terms.push(trimmed);
    }
    return " ";
  });
  const words = fold(rest).split(" ").filter(Boolean);
  for (const word of rest.split(/\s+/)) {
    if (word) terms.push(word);
  }
  return { raw, phrases, words, terms };
}

export function queryIsEmpty(query: ParsedQuery): boolean {
  return query.phrases.length === 0 && query.words.length === 0;
}

export function matchesFolded(folded: string, query: ParsedQuery): boolean {
  return query.phrases.every((p) => folded.includes(p)) && query.words.every((w) => folded.includes(w));
}

export interface SearchHit {
  key: string;
  source: "episode" | "flts";
  show: SearchShow;
  title: string;
  href: string;
  external: boolean;
  date?: string;
  durationLabel: string;
  snippet: string;
  chapter?: FltsChapter;
  /** All chapters on a FaceLikeTheSun hit, for timestamp links. */
  chapters?: FltsChapter[];
  typeLabel?: string;
  /** Internal episode page, only for Canary Cry episodes. */
  episodeHref?: string;
  /** Official YouTube watch URL, when a real video match exists. */
  youtubeHref?: string;
  /** Official Rumble watch URL, when a real video match exists. */
  rumbleHref?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Split visible text into highlighted and plain runs. */
export function highlightParts(text: string, query: ParsedQuery): { text: string; mark: boolean }[] {
  const terms = query.terms.filter((t) => t.length > 0).sort((a, b) => b.length - a.length);
  if (terms.length === 0 || text === "") return [{ text, mark: false }];
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts: { text: string; mark: boolean }[] = [];
  let last = 0;
  for (const match of text.matchAll(re)) {
    const start = match.index;
    if (start > last) parts.push({ text: text.slice(last, start), mark: false });
    parts.push({ text: match[0], mark: true });
    last = start + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), mark: false });
  return parts.length > 0 ? parts : [{ text, mark: false }];
}

/** A short window of `text` around the first query match. */
export function snippetAround(text: string, query: ParsedQuery, width = 220): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact === "") return "";
  const terms = query.terms.filter((t) => t.length > 0).sort((a, b) => b.length - a.length);
  let index = -1;
  if (terms.length > 0) {
    const re = new RegExp(terms.map(escapeRegExp).join("|"), "i");
    const match = re.exec(compact);
    if (match) index = match.index;
  }
  if (index < 0) {
    return compact.length > width ? `${compact.slice(0, width).trimEnd()}…` : compact;
  }
  const pad = Math.floor((width - 16) / 2);
  let start = Math.max(0, index - pad);
  let end = Math.min(compact.length, index + pad);
  if (start > 0) {
    const space = compact.indexOf(" ", start);
    if (space !== -1 && space < index) start = space + 1;
  }
  if (end < compact.length) {
    const space = compact.lastIndexOf(" ", end);
    if (space > index) end = space;
  }
  const slice = compact.slice(start, end).trim();
  return `${start > 0 ? "…" : ""}${slice}${end < compact.length ? "…" : ""}`;
}

function dateValue(iso: string | undefined): number {
  if (iso === undefined) return 0;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : t;
}

const TYPE_LABEL: Record<FltsItem["type"], string> = {
  video: "Video",
  stream: "Stream",
  short: "Short",
};

function matchingChapter(chapters: FltsChapter[], query: ParsedQuery): FltsChapter | undefined {
  if (queryIsEmpty(query)) return undefined;
  return chapters.find((ch) => matchesFolded(fold(ch.title), query));
}

export function searchCatalog(
  episodes: SearchEntry[],
  videos: FltsItem[],
  query: ParsedQuery,
  filter: ShowFilter,
  sort: SearchSort,
): SearchHit[] {
  const emptyQuery = queryIsEmpty(query);
  const hits: (SearchHit & { score: number })[] = [];

  if (filter !== "facelikethesun") {
    for (const entry of episodes) {
      if (entry.kind !== "episode") continue;
      const show: SearchShow = entry.show ?? "other";
      if (filter !== "all" && show !== filter) continue;
      const titleFolded = fold(entry.title);
      const allFolded = fold(`${entry.title} ${entry.text}`);
      if (!emptyQuery && !matchesFolded(allFolded, query)) continue;
      const titleHit = !emptyQuery && matchesFolded(titleFolded, query);
      hits.push({
        key: entry.path,
        source: "episode",
        show,
        title: entry.title,
        href: entry.path,
        external: false,
        date: entry.date,
        durationLabel: entry.duration !== undefined ? formatDuration(entry.duration) : "",
        snippet: emptyQuery ? entry.text : snippetAround(entry.text, query),
        episodeHref: entry.path,
        youtubeHref: entry.youtubeId !== undefined ? youtubeUrl(entry.youtubeId) : undefined,
        rumbleHref: entry.rumbleUrl,
        score: emptyQuery ? dateValue(entry.date) : (titleHit ? 300 : 100) + dateValue(entry.date) / 1e13,
      });
    }
  }

  if (filter === "all" || filter === "facelikethesun") {
    for (const item of videos) {
      const chapterText = item.chapters.map((ch) => ch.title).join(" ");
      const titleFolded = fold(item.title);
      const allFolded = fold(`${item.title} ${item.description} ${chapterText}`);
      if (!emptyQuery && !matchesFolded(allFolded, query)) continue;
      const chapter = matchingChapter(item.chapters, query);
      const titleHit = !emptyQuery && matchesFolded(titleFolded, query);
      const snippetSource = chapter ? chapter.title : item.description;
      hits.push({
        key: item.id,
        source: "flts",
        show: "facelikethesun",
        title: item.title,
        href: youtubeUrl(item.id, chapter?.seconds),
        external: true,
        date: item.date,
        durationLabel: formatDurationSeconds(item.duration),
        snippet: emptyQuery ? snippetAround(item.description, query) : snippetAround(snippetSource, query),
        chapter,
        chapters: item.chapters.length > 0 ? item.chapters : undefined,
        typeLabel: TYPE_LABEL[item.type],
        youtubeHref: youtubeUrl(item.id, chapter?.seconds),
        score: emptyQuery
          ? dateValue(item.date)
          : (titleHit ? 300 : 0) + (chapter ? 200 : 0) + (titleHit || chapter ? 0 : 100) + dateValue(item.date) / 1e13,
      });
    }
  }

  if (sort === "newest" || emptyQuery) {
    hits.sort((a, b) => dateValue(b.date) - dateValue(a.date) || a.title.localeCompare(b.title));
  } else {
    hits.sort((a, b) => b.score - a.score || dateValue(b.date) - dateValue(a.date));
  }
  return hits.map(({ score: _score, ...hit }) => hit);
}

export function searchPagePath(opts: {
  q?: string;
  show?: ShowFilter;
  sort?: SearchSort;
  page?: number;
}): string {
  const params = new URLSearchParams();
  const q = opts.q?.trim() ?? "";
  if (q !== "") params.set("q", q);
  if (opts.show !== undefined && opts.show !== "all") params.set("show", opts.show);
  if (opts.sort !== undefined && opts.sort !== "relevance") params.set("sort", opts.sort);
  if (opts.page !== undefined && opts.page > 1) params.set("page", String(opts.page));
  const qs = params.toString();
  return qs === "" ? "/search/" : `/search/?${qs}`;
}

export function parseShowFilter(value: string | null): ShowFilter {
  return SHOW_FILTERS.some((f) => f.id === value) ? (value as ShowFilter) : "all";
}

export function parseSearchSort(value: string | null): SearchSort {
  return value === "newest" ? "newest" : "relevance";
}

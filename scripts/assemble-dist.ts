// assemble-dist.ts — lay React Router's build output out as the site root
// GitHub Pages serves at /Armageterdone/.
//
// React Router writes prerendered pages under build/client/Armageterdone/
// (the basename) but Vite's assets and public/ files at build/client/. Pages
// serves the uploaded folder AT /Armageterdone/, so dist/ is both merged at
// one level. Also: the not-found page becomes 404.html (Pages serves it for
// every missing URL), and React Router's SPA fallback is dropped (every route
// is prerendered; a missing URL gets 404.html instead).
//
// 404.html ships as plain HTML, without the app's scripts: Pages serves it at
// whatever URL was missing, so the router would hydrate it against a route it
// wasn't rendered for (a hydration mismatch, then an error page). The inline
// theme script stays, and the `static-page` class hides the two header
// buttons that need the app (theme toggle, mobile menu, search).
//
// Last, it writes the site search index (dist/search-index.json, see
// app/lib/search.ts): every page, read back from its built HTML so designed
// and generic pages are indexed alike, and every episode from the feed.
// It also writes the transcript search index (dist/transcript-search-index.json,
// see app/lib/transcript-search.ts): fuller show-notes text per episode, plus
// any real transcripts dropped into content/transcripts/.

import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { episodeListSchema } from "../app/lib/feed.ts";
import {
  BASE,
  EPISODES_JSON,
  NOT_FOUND_PRERENDER_PATH,
  PAGES_DIR,
  episodePath,
  tagPath,
} from "../app/lib/paths.ts";
import {
  SEARCH_INDEX_FILE,
  SEARCH_TEXT_CHARS,
  type SearchEntry,
  plainText,
  searchIndexSchema,
} from "../app/lib/search.ts";
import { SHOWS } from "../app/lib/shows.ts";
import { THEME_KEY } from "../app/lib/theme.ts";
import {
  NOTES_TEXT_CHARS,
  TRANSCRIPT_INDEX_FILE,
  firstYoutubeUrl,
  transcriptIndexSchema,
} from "../app/lib/transcript-search.ts";

const CLIENT = "build/client";
const PAGES = join(CLIENT, BASE);
const DIST = "dist";
const SKIP = new Set([BASE.replace(/\//g, ""), "index.html", "__spa-fallback.html", ".vite"]);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

for (const entry of await readdir(CLIENT)) {
  if (!SKIP.has(entry)) await cp(join(CLIENT, entry), join(DIST, entry), { recursive: true });
}
await cp(PAGES, DIST, { recursive: true });

const notFound = await readFile(join(DIST, NOT_FOUND_PRERENDER_PATH, "index.html"), "utf8");
const staticNotFound = notFound
  .replace(/<link rel="modulepreload"[^>]*>/g, "")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (tag) => (tag.includes(THEME_KEY) ? tag : ""))
  .replace('<html lang="en">', '<html lang="en" class="static-page">');
if (!staticNotFound.includes("static-page") || staticNotFound.includes('type="module"'))
  throw new Error("404.html: script stripping failed");
await writeFile(join(DIST, "404.html"), staticNotFound);
await rm(join(DIST, NOT_FOUND_PRERENDER_PATH.split("/").filter(Boolean)[0]!), {
  recursive: true,
  force: true,
});

const TITLE_SUFFIX = / — Canary Cry News Talk$/;

/** A built page as a search entry: its <title> and the text of its <main>. */
async function pageEntry(path: string): Promise<SearchEntry> {
  const html = await readFile(join(DIST, path, "index.html"), "utf8");
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  const main = /<main\b[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1];
  if (title === undefined || main === undefined)
    throw new Error(`search: ${path} has no title or main`);
  return {
    kind: "page",
    title: plainText(title).replace(TITLE_SUFFIX, ""),
    path,
    text: plainText(main).slice(0, SEARCH_TEXT_CHARS),
  };
}

const pagePaths = [
  ...(await readdir(PAGES_DIR))
    .filter((f) => f.endsWith(".json"))
    .map((f) => `/${f.slice(0, -5)}/`),
  ...SHOWS.map((s) => tagPath(s.slug)),
].sort();
const episodes = episodeListSchema.parse(JSON.parse(await readFile(EPISODES_JSON, "utf8")));
const index = searchIndexSchema.parse([
  ...(await Promise.all(pagePaths.map(pageEntry))),
  ...episodes.map((e) => ({
    kind: "episode" as const,
    title: e.title,
    path: episodePath(e.slug),
    date: e.published,
    text: plainText(e.notesHtml).slice(0, SEARCH_TEXT_CHARS),
  })),
]);
await writeFile(join(DIST, SEARCH_INDEX_FILE), JSON.stringify(index));

// Transcript / show-notes search index. Real transcripts live in
// content/transcripts/*.json ({ title, text, date?, audioUrl?, videoUrl?,
// path?, externalUrl? }); everything else is the feed's show notes.
const TRANSCRIPTS_DIR = "content/transcripts";
const realTranscripts: {
  title: string;
  text: string;
  date?: string;
  audioUrl?: string;
  videoUrl?: string;
  path?: string;
  externalUrl?: string;
}[] = [];
try {
  for (const f of await readdir(TRANSCRIPTS_DIR)) {
    if (!f.endsWith(".json")) continue;
    const raw = JSON.parse(await readFile(join(TRANSCRIPTS_DIR, f), "utf8")) as {
      title?: unknown;
      text?: unknown;
      date?: unknown;
      audioUrl?: unknown;
      videoUrl?: unknown;
      path?: unknown;
      externalUrl?: unknown;
    };
    if (typeof raw.title !== "string" || typeof raw.text !== "string") continue;
    realTranscripts.push({
      title: raw.title,
      text: plainText(raw.text).slice(0, NOTES_TEXT_CHARS * 4),
      ...(typeof raw.date === "string" ? { date: raw.date } : {}),
      ...(typeof raw.audioUrl === "string" ? { audioUrl: raw.audioUrl } : {}),
      ...(typeof raw.videoUrl === "string" ? { videoUrl: raw.videoUrl } : {}),
      ...(typeof raw.path === "string" ? { path: raw.path } : {}),
      ...(typeof raw.externalUrl === "string" ? { externalUrl: raw.externalUrl } : {}),
    });
  }
} catch {
  // Directory optional.
}

const transcriptIndex = transcriptIndexSchema.parse([
  ...realTranscripts.map((t) => ({
    source: "transcript" as const,
    title: t.title,
    text: t.text,
    ...(t.date !== undefined ? { date: t.date } : {}),
    ...(t.audioUrl !== undefined ? { audioUrl: t.audioUrl } : {}),
    ...(t.videoUrl !== undefined ? { videoUrl: t.videoUrl } : {}),
    ...(t.path !== undefined ? { path: t.path } : {}),
    ...(t.externalUrl !== undefined ? { externalUrl: t.externalUrl } : {}),
  })),
  ...episodes.map((e) => {
    const videoUrl = firstYoutubeUrl(e.notesHtml);
    return {
      source: "show-notes" as const,
      title: e.title,
      path: episodePath(e.slug),
      date: e.published,
      audioUrl: e.audioUrl,
      ...(videoUrl !== undefined ? { videoUrl } : {}),
      text: plainText(e.notesHtml).slice(0, NOTES_TEXT_CHARS),
    };
  }),
]);
await writeFile(join(DIST, TRANSCRIPT_INDEX_FILE), JSON.stringify(transcriptIndex));

console.log(
  `dist: assembled from ${CLIENT}; search index: ${String(index.length)} entries; transcript index: ${String(transcriptIndex.length)} entries (${String(realTranscripts.length)} real transcripts)`,
);

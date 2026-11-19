// build-episode-archive.ts — turn a Libsyn website JSON crawl into the
// committed archive at content/episodes-archive.json.
//
//   node scripts/build-episode-archive.ts [crawl.json]
//
// The crawl is a JSON array of Libsyn /render-type/json items. Rows already
// in the live RSS (by enclosure filename, GUID, or title+date) are omitted
// so existing slugs stay owned by the feed. Notes are sanitised here so the
// committed file can pass leak-scan.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { archiveFileSchema, type ArchiveItem, isLibsynAudio, mergeEpisodes, normalizeAudioKey } from "../app/lib/episode-archive.ts";
import { parseFeed, plainExcerpt, sanitizeNotes, slugify, type Episode } from "../app/lib/feed.ts";
import { EPISODES_ARCHIVE, FEED_CACHE } from "../app/lib/paths.ts";
import { showOf } from "../app/lib/shows.ts";

const crawlPath = process.argv[2] ?? "/tmp/libsyn-probe/all-items.json";

type Primary = {
  file_class?: string;
  url?: string;
  url_secure?: string;
  content_type?: string;
};

type CrawlItem = {
  item_id?: number;
  item_title?: string;
  item_slug?: string;
  item_body?: string;
  item_body_clean?: string;
  release_date?: string;
  full_item_url?: string;
  image_url?: string;
  premium_state?: string;
  display_download_link?: boolean;
  primary_content?: Primary;
};

const MONTHS: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

/** Libsyn site dates look like "Aug 31, 2016". Store noon UTC so the day is stable. */
function parseReleaseDate(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  const m = raw.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!m) return undefined;
  const month = MONTHS[m[1]!.slice(0, 3).toLowerCase()];
  if (month === undefined) return undefined;
  const day = m[2]!.padStart(2, "0");
  return `${m[3]}-${month}-${day}T12:00:00.000Z`;
}

function httpsUrl(u: string | undefined): string | undefined {
  if (u === undefined) return undefined;
  const t = u.trim();
  if (t.startsWith("https://")) return t;
  if (t.startsWith("http://")) return `https://${t.slice("http://".length)}`;
  return undefined;
}

function audioUrlOf(item: CrawlItem): string | undefined {
  const pc = item.primary_content;
  const raw = httpsUrl(pc?.url_secure) ?? httpsUrl(pc?.url);
  if (raw === undefined || !isLibsynAudio(raw)) return undefined;
  if (pc?.file_class !== undefined && pc.file_class !== "audio") return undefined;
  // Drop dest-id so the committed URL is stable; traffic.libsyn.com still serves it.
  try {
    const url = new URL(raw);
    url.search = "";
    return url.toString();
  } catch {
    return raw;
  }
}

function audioFileName(audioUrl: string): string {
  try {
    return decodeURIComponent(new URL(audioUrl).pathname.split("/").pop() ?? "");
  } catch {
    return "";
  }
}

const YEAR_NUMBERS = new Set(Array.from({ length: 20 }, (_, i) => 2016 + i));

/** Prefer show codes in the title, then a leading number ("114 …"), then the MP3 name. Skip calendar years. */
function episodeNumberOf(title: string, audioUrl: string): number | undefined {
  const file = audioFileName(audioUrl);
  const patterns = [
    /\bCCNT\s*#?\s*(\d{1,4})\b/i,
    /\bCCR\s*#?\s*(\d{1,4})\b/i,
    /^(\d{1,4})\s*CCNT\b/i,
    /^(\d{1,4})(?=\s)/,
    /(?:^|[_-])CCNT_?(\d{1,4})(?:[_.-]|$)/i,
    /(?:^|[_-])(\d{1,4})CCNT(?:[_.-]|$)/i,
    /(?:^|[_-])CCR_?(\d{1,4})(?:[_.-]|$)/i,
    /(?:^|[_-])(\d{1,4})CCR(?:[_.-]|$)/i,
  ];
  for (const src of [title.trim(), file]) {
    for (const pattern of patterns) {
      const match = src.match(pattern);
      if (!match) continue;
      const n = Number(match[1]);
      if (n >= 1 && n <= 2000 && !YEAR_NUMBERS.has(n)) return n;
    }
  }
  return undefined;
}

function showOfArchive(title: string, audioUrl: string): "news-talk" | "radio" | "clubhouse" | null {
  const fromTitle = showOf({ title, audioUrl });
  if (fromTitle !== null) return fromTitle;
  const file = audioFileName(audioUrl);
  if (/(?:^|[_-])\d+ccr(?:[_.-]|$)/i.test(file) || /(?:^|[_-])ccr[_-]?\d/i.test(file)) return "radio";
  return null;
}

function toArchiveItem(item: CrawlItem): ArchiveItem | undefined {
  const title = item.item_title?.trim();
  const published = parseReleaseDate(item.release_date);
  const audioUrl = audioUrlOf(item);
  const itemId = item.item_id;
  if (title === undefined || title === "" || published === undefined || audioUrl === undefined || itemId === undefined) {
    return undefined;
  }
  const slug = slugify(item.item_slug ?? title) || "episode";
  const notesHtml = sanitizeNotes(item.item_body ?? item.item_body_clean ?? "");
  const show = showOfArchive(title, audioUrl);
  const episodeNumber = episodeNumberOf(title, audioUrl);
  const artRaw = httpsUrl(item.image_url);
  const artUrl = artRaw !== undefined && new URL(artRaw).hostname === "static.libsyn.com" ? artRaw : undefined;
  const sourceUrl = httpsUrl(item.full_item_url);
  return {
    slug,
    guid: `libsyn-item-${String(itemId)}`,
    title,
    published,
    audioUrl,
    audioType: "audio/mpeg",
    notesHtml,
    excerpt: plainExcerpt(notesHtml),
    itemId,
    ...(sourceUrl !== undefined ? { sourceUrl } : {}),
    ...(show !== null ? { show } : { show: null }),
    ...(episodeNumber !== undefined ? { episodeNumber } : {}),
    ...(artUrl !== undefined ? { artUrl } : {}),
  };
}

const crawl = JSON.parse(await readFile(crawlPath, "utf8")) as CrawlItem[];
if (!Array.isArray(crawl)) throw new Error(`crawl: expected an array in ${crawlPath}`);

const built: ArchiveItem[] = [];
const seenAudio = new Set<string>();
const skipped = { noAudio: 0, dup: 0, invalid: 0 };
for (const raw of crawl) {
  const item = toArchiveItem(raw);
  if (item === undefined) {
    if (!audioUrlOf(raw)) skipped.noAudio += 1;
    else skipped.invalid += 1;
    continue;
  }
  const key = normalizeAudioKey(item.audioUrl);
  if (seenAudio.has(key)) {
    skipped.dup += 1;
    continue;
  }
  seenAudio.add(key);
  built.push(item);
}

const live: Episode[] = parseFeed(await readFile(FEED_CACHE, "utf8"));
const merged = mergeEpisodes(live, built);
const liveGuids = new Set(live.map((episode) => episode.guid));
const addedGuids = new Set(merged.filter((episode) => !liveGuids.has(episode.guid)).map((episode) => episode.guid));
const items = built
  .filter((item) => addedGuids.has(item.guid))
  .sort((a, b) => b.published.localeCompare(a.published));

const file = archiveFileSchema.parse({
  meta: {
    generatedAt: new Date().toISOString(),
    source: "canarycrynewstalk.libsyn.com/render-type/json",
    included: items.length,
  },
  items,
});

await mkdir(dirname(EPISODES_ARCHIVE), { recursive: true });
await writeFile(EPISODES_ARCHIVE, `${JSON.stringify(file)}\n`);
console.log(
  `archive: crawl ${String(crawl.length)} -> built ${String(built.length)} -> recovered ${String(items.length)} (skipped no-audio ${String(skipped.noAudio)}, dup ${String(skipped.dup)}, invalid ${String(skipped.invalid)})`,
);
console.log(`archive: live feed ${String(live.length)} + recovered ${String(items.length)} = ${String(live.length + items.length)} -> ${EPISODES_ARCHIVE}`);

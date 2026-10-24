// prepare-content.ts — fetch the Libsyn feed once and write the parsed,
// validated, sanitised episode list for the build to read.
//
//   node scripts/prepare-content.ts            use .cache/libsyn-feed.xml if present
//   node scripts/prepare-content.ts --refresh  always download a fresh copy
//
// CI starts without a cache, so every CI build downloads the feed fresh.
// Local dev keeps the ~36 MB copy until you pass --refresh.

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { parseFeed } from "../app/lib/feed.ts";
import { EPISODES_JSON, FEED_CACHE, FEED_URL, SITE_JSON } from "../app/lib/paths.ts";

const refresh = process.argv.includes("--refresh");

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function loadFeed(): Promise<string> {
  if (!refresh && (await exists(FEED_CACHE))) {
    console.log(`feed: using cached ${FEED_CACHE} (pass --refresh to download again)`);
    return readFile(FEED_CACHE, "utf8");
  }
  console.log(`feed: downloading ${FEED_URL}`);
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "canarycry-site-build" },
    signal: AbortSignal.timeout(180_000),
  });
  if (!res.ok) throw new Error(`feed download failed: HTTP ${String(res.status)}`);
  const xml = await res.text();
  await mkdir(".cache", { recursive: true });
  await writeFile(FEED_CACHE, xml);
  return xml;
}

const episodes = parseFeed(await loadFeed());
if (episodes.length === 0) throw new Error("feed: no episodes parsed");
await mkdir(".cache", { recursive: true });
await writeFile(EPISODES_JSON, JSON.stringify(episodes));
// The few facts every page's header and footer show (see vite.config.ts).
const latest = episodes[0]!;
await writeFile(
  SITE_JSON,
  JSON.stringify({
    latest: { slug: latest.slug, title: latest.title, published: latest.published },
    year: new Date().getUTCFullYear(),
  }),
);
console.log(`feed: ${String(episodes.length)} episodes -> ${EPISODES_JSON}`);

// prepare-content.ts — fetch the Libsyn feed once and write the parsed,
// validated, sanitised episode list for the build to read.
//
//   node scripts/prepare-content.ts            use .cache/libsyn-feed.xml if present
//   node scripts/prepare-content.ts --refresh  always download a fresh copy
//
// CI starts without a cache, so every CI build downloads the feed fresh.
// Local dev keeps the ~36 MB copy until you pass --refresh.
//
// Also caches The Joyspiracy Theory's latest episode art (separate Libsyn show)
// into .cache/network-latest.json for the Shows page tile grid.

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import { z } from "zod";
import { parseFeed } from "../app/lib/feed.ts";
import {
  EPISODES_JSON,
  FEED_CACHE,
  FEED_URL,
  JOYSPIRACY_FEED_CACHE,
  JOYSPIRACY_FEED_URL,
  NETWORK_LATEST_JSON,
  SITE_JSON,
} from "../app/lib/paths.ts";

const refresh = process.argv.includes("--refresh");

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function download(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "canarycry-site-build" },
    signal: AbortSignal.timeout(180_000),
  });
  if (!res.ok) throw new Error(`feed download failed (${url}): HTTP ${String(res.status)}`);
  return res.text();
}

async function loadFeed(): Promise<string> {
  if (!refresh && (await exists(FEED_CACHE))) {
    console.log(`feed: using cached ${FEED_CACHE} (pass --refresh to download again)`);
    return readFile(FEED_CACHE, "utf8");
  }
  console.log(`feed: downloading ${FEED_URL}`);
  const xml = await download(FEED_URL);
  await mkdir(".cache", { recursive: true });
  await writeFile(FEED_CACHE, xml);
  return xml;
}

const textNode = z.union([
  z.string(),
  z.object({ "#text": z.string() }).transform((n) => n["#text"]),
]);

/** Latest Joyspiracy episode art from its own Libsyn RSS (not in the main feed). */
async function loadJoyspiracyLatest(): Promise<{
  title: string;
  published: string;
  artUrl: string;
  externalUrl?: string;
} | null> {
  let xml: string;
  try {
    if (!refresh && (await exists(JOYSPIRACY_FEED_CACHE))) {
      console.log(`joyspiracy: using cached ${JOYSPIRACY_FEED_CACHE}`);
      xml = await readFile(JOYSPIRACY_FEED_CACHE, "utf8");
    } else {
      console.log(`joyspiracy: downloading ${JOYSPIRACY_FEED_URL}`);
      xml = await download(JOYSPIRACY_FEED_URL);
      await mkdir(".cache", { recursive: true });
      await writeFile(JOYSPIRACY_FEED_CACHE, xml);
    }
  } catch (err) {
    console.warn(`joyspiracy: feed unavailable (${String(err)}); Shows tile art will be missing`);
    return null;
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: false,
  });
  const raw = parser.parse(xml) as {
    rss?: { channel?: { item?: unknown | unknown[]; "itunes:image"?: { "@_href"?: string }; link?: string } };
  };
  const channel = raw.rss?.channel;
  const items = channel?.item;
  const first = Array.isArray(items) ? items[0] : items;
  if (!first || typeof first !== "object") {
    console.warn("joyspiracy: no items in feed");
    return null;
  }
  const item = first as {
    title?: unknown;
    pubDate?: string;
    link?: string;
    "itunes:image"?: { "@_href"?: string };
  };
  const title = textNode.safeParse(item.title);
  if (!title.success || !item.pubDate) {
    console.warn("joyspiracy: first item missing title/pubDate");
    return null;
  }
  const artUrl =
    item["itunes:image"]?.["@_href"] ?? channel?.["itunes:image"]?.["@_href"];
  if (!artUrl || !/^https:/i.test(artUrl)) {
    console.warn("joyspiracy: first item missing https itunes:image");
    return null;
  }
  const published = new Date(item.pubDate).toISOString();
  if (Number.isNaN(Date.parse(published))) {
    console.warn("joyspiracy: unparsable pubDate");
    return null;
  }
  const externalUrl = item.link && /^https:/i.test(item.link) ? item.link : undefined;
  return { title: title.data, published, artUrl, ...(externalUrl ? { externalUrl } : {}) };
}

const episodes = parseFeed(await loadFeed());
if (episodes.length === 0) throw new Error("feed: no episodes parsed");
await mkdir(".cache", { recursive: true });
await writeFile(EPISODES_JSON, JSON.stringify(episodes));
const latest = episodes[0]!;
await writeFile(
  SITE_JSON,
  JSON.stringify({
    latest: { slug: latest.slug, title: latest.title, published: latest.published },
    year: new Date().getUTCFullYear(),
  }),
);
console.log(`feed: ${String(episodes.length)} episodes -> ${EPISODES_JSON}`);

const joyspiracy = await loadJoyspiracyLatest();
await writeFile(NETWORK_LATEST_JSON, JSON.stringify({ joyspiracy }));
console.log(
  joyspiracy
    ? `joyspiracy: latest "${joyspiracy.title}" (${joyspiracy.published}) -> ${NETWORK_LATEST_JSON}`
    : `joyspiracy: no latest written -> ${NETWORK_LATEST_JSON}`,
);

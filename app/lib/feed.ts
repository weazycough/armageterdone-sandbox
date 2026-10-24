// feed.ts — turns the Libsyn RSS feed into the site's episode list.
//
// Build-time only (scripts/prepare-content.ts runs it once per build; the
// route loaders read its JSON output). The feed is ~36 MB and holds every
// episode, so it is parsed once, validated with Zod, and the show notes are
// sanitised here: no scripts, iframes, images, styles or tracking attributes
// reach the site, only text formatting and plain links.

import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

export const episodeSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  guid: z.string().min(1),
  title: z.string().min(1),
  /** ISO 8601 timestamp. */
  published: z.iso.datetime(),
  audioUrl: z.url({ protocol: /^https$/ }),
  audioType: z.string(),
  /** "HH:MM:SS" or "MM:SS" as the feed gives it, when present. */
  duration: z.string().optional(),
  artUrl: z.url({ protocol: /^https$/ }).optional(),
  /** Sanitised show notes HTML. */
  notesHtml: z.string(),
  /** Plain-text opening of the show notes, for cards. */
  excerpt: z.string(),
});
export type Episode = z.infer<typeof episodeSchema>;

export const episodeListSchema = z.array(episodeSchema);

// Raw feed shapes. fast-xml-parser gives text nodes as strings (parseTagValue
// off) and attributes with an "@_" prefix. `guid` carries an attribute, so it
// arrives as an object with "#text".
const textNode = z.union([
  z.string(),
  z.object({ "#text": z.string() }).transform((n) => n["#text"]),
]);

const rawItemSchema = z.object({
  title: textNode,
  pubDate: z.string(),
  guid: textNode,
  link: z.string().optional(),
  enclosure: z.object({ "@_url": z.string(), "@_type": z.string().default("audio/mpeg") }),
  "itunes:image": z.object({ "@_href": z.string() }).optional(),
  "itunes:duration": z.string().optional(),
  "content:encoded": z.string().optional(),
  description: z.string().optional(),
});

const rawFeedSchema = z.object({
  rss: z.object({
    channel: z.object({
      "itunes:image": z.object({ "@_href": z.string() }).optional(),
      item: z.array(z.unknown()),
    }),
  }),
});

const NOTES_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "div",
    "br",
    "hr",
    "a",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],
  // `rel` is set by the transform below.
  allowedAttributes: { a: ["href", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    // The page has its own <h1>; notes headings start one level down.
    h1: "h2",
    a: (_tagName, attribs) => ({
      tagName: "a",
      attribs: {
        ...(attribs.href === undefined ? {} : { href: attribs.href }),
        rel: "noopener noreferrer nofollow",
      },
    }),
  },
  // Text inside dropped tags (script, style, iframe…) is discarded, not kept.
  nonTextTags: ["script", "style", "textarea", "option", "noscript", "iframe", "object", "embed"],
};

export function sanitizeNotes(html: string): string {
  // Notes use hosted emoji images; keep the emoji (the alt text), drop the
  // image request. The alt value is already HTML-escaped, so it goes in as is.
  const emojiAsText = html.replace(/<img\b[^>]*?\balt=(["'])(.*?)\1[^>]*>/gi, "$2");
  return sanitizeHtml(emojiAsText, NOTES_OPTIONS)
    .replace(/<(p|div)>\s*<\/\1>/g, "")
    .trim();
}

export function plainExcerpt(html: string, words = 28): string {
  // Block boundaries become spaces, so "<p>a</p><p>b</p>" reads "a b", not "ab".
  const spaced = html.replace(
    /<\/?(?:p|div|br|li|ul|ol|h[1-6]|hr|blockquote|figure|figcaption)\b[^>]*>/gi,
    " ",
  );
  const text = sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  const list = text.split(" ");
  return list.length <= words ? text : `${list.slice(0, words).join(" ")}…`;
}

export function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The episode's slug: the last segment of its Libsyn page URL, which is
 *  stable and already human-readable; the title when there is no link. */
function slugFor(link: string | undefined, title: string): string {
  if (link !== undefined) {
    try {
      const last = new URL(link.trim()).pathname.split("/").filter(Boolean).pop();
      if (last !== undefined) {
        const s = slugify(decodeURIComponent(last));
        if (s !== "") return s;
      }
    } catch {
      // Not a URL: fall through to the title.
    }
  }
  return slugify(title) || "episode";
}

/** Libsyn fills both fields, but for recent episodes content:encoded is a
 *  flattened copy with the line structure gone. Take whichever keeps more
 *  block structure (paragraphs, lines, list items); content:encoded on a tie. */
function richerNotes(encoded: string | undefined, description: string | undefined): string {
  const blocks = (html: string | undefined): number =>
    (html ?? "").match(/<(?:p|div|br|li|h[1-6])\b/gi)?.length ?? 0;
  if (encoded === undefined) return description ?? "";
  return blocks(description) > blocks(encoded) ? (description ?? "") : encoded;
}

function httpsUrl(u: string | undefined): string | undefined {
  if (u === undefined) return undefined;
  const t = u.trim();
  if (t.startsWith("https://")) return t;
  if (t.startsWith("http://")) return `https://${t.slice("http://".length)}`;
  return undefined;
}

export function parseFeed(xml: string): Episode[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
    isArray: (name) => name === "item",
  });
  const feed = rawFeedSchema.parse(parser.parse(xml));
  const channelArt = httpsUrl(feed.rss.channel["itunes:image"]?.["@_href"]);
  const seen = new Map<string, number>();
  const episodes: Episode[] = [];

  for (const rawItem of feed.rss.channel.item) {
    const item = rawItemSchema.parse(rawItem);
    const audioUrl = httpsUrl(item.enclosure["@_url"]);
    if (audioUrl === undefined) continue; // no playable audio: not an episode page
    const notesSource = richerNotes(item["content:encoded"], item.description);
    const notesHtml = sanitizeNotes(notesSource);

    let slug = slugFor(item.link, item.title);
    const n = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, n);
    if (n > 1) slug = `${slug}-${String(n)}`;

    const date = new Date(item.pubDate);
    const artUrl = httpsUrl(item["itunes:image"]?.["@_href"]) ?? channelArt;
    episodes.push(
      episodeSchema.parse({
        slug,
        guid: item.guid,
        title: item.title,
        published: date.toISOString(),
        audioUrl,
        audioType: item.enclosure["@_type"],
        duration: item["itunes:duration"],
        artUrl,
        notesHtml,
        excerpt: plainExcerpt(notesHtml),
      }),
    );
  }

  // Newest first, whatever order the feed uses.
  return episodes.sort((a, b) => b.published.localeCompare(a.published));
}

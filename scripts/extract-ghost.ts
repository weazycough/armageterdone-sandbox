// extract-ghost.ts — one-off import of the Ghost demo's pages and posts into
// committed content files, plus the theme's images.
//
//   node scripts/extract-ghost.ts --export <ghost-export.json> --content <ghost content dir>
//
// <ghost content dir> is the Ghost install's content/ folder (it holds
// themes/canarycry/ and images/). Reads ONLY the posts table: the export also
// holds user accounts and settings, which never leave it. The export itself
// is never committed.
//
// Writes:
//   content/pages/<slug>.json, content/posts/<slug>.json  (sanitised HTML)
//   public/content/images/*   images the pages use, downloaded once
//   public/images/*           the theme's images (fan art, shows, shirts…)
//   public/images/cc-logo.webp
//
// Body HTML is sanitised here, so what is committed is what ships: no
// scripts, styles or iframes. Each embed becomes a plain link to its source
// and is listed in `removedEmbeds` so a later page port can rebuild it.

import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { parseArgs } from "node:util";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { redactContactsHtml } from "../app/lib/contacts.ts";
import { plainExcerpt, slugify } from "../app/lib/feed.ts";

const { values } = parseArgs({
  options: { export: { type: "string" }, content: { type: "string" } },
});
if (values.export === undefined || values.content === undefined) {
  console.error(
    "usage: node scripts/extract-ghost.ts --export <ghost-export.json> --content <ghost content dir>",
  );
  process.exit(2);
}
const exportPath = values.export;
const ghostContent = values.content;

/** The live site. Ghost links to pages this site doesn't have point there. */
const LIVE_SITE = "https://www.canarycrynewstalk.com";

/** Pages the static site replaces with its own routes. */
const SKIP: Record<string, string> = {
  episodes: "a stale list of Ghost posts; /episodes/ lists the RSS feed",
  home: "an empty slideshow placeholder; / is the homepage",
};

const postSchema = z.object({
  slug: z.string(),
  title: z.string(),
  type: z.enum(["post", "page"]),
  status: z.string(),
  html: z.string().nullable(),
  updated_at: z.string(),
  published_at: z.string().nullable(),
});
const exportSchema = z.object({
  db: z.array(z.object({ data: z.object({ posts: z.array(z.unknown()) }) })).min(1),
});

const raw = exportSchema.parse(JSON.parse(await readFile(exportPath, "utf8")));
const posts = raw.db[0]!.data.posts.map((p) => postSchema.parse(p)).filter(
  (p) => p.status === "published",
);
const pageSlugs = new Set(
  posts.filter((p) => p.type === "page" && !(p.slug in SKIP)).map((p) => p.slug),
);

/** A Ghost-internal link ("__GHOST_URL__/support#one") as a site path or a live-site URL. */
function rewriteGhostUrl(href: string): string {
  const rest = href.slice("__GHOST_URL__".length) || "/";
  const url = new URL(rest, "https://placeholder.invalid");
  const first = url.pathname.split("/").filter(Boolean)[0];
  if (first === undefined) return `/${url.hash}`;
  if (first === "episodes") return `/episodes/${url.hash}`;
  if (pageSlugs.has(first)) return `/${first}/${url.hash}`;
  return `${LIVE_SITE}${url.pathname}${url.search}${url.hash}`;
}

const imageDir = "public/content/images";
const downloaded = new Map<string, string>();

async function localImage(src: string): Promise<string> {
  const known = downloaded.get(src);
  if (known !== undefined) return known;
  const u = new URL(src);
  const parts = u.pathname.split("/").filter(Boolean);
  const file = decodeURIComponent(parts.at(-1) ?? "image");
  const ext = extname(file).toLowerCase() || ".jpg";
  // The folder above the file is a per-upload id; its head keeps names unique.
  const id = (parts.at(-2) ?? "").slice(0, 8).toLowerCase();
  const name = `${slugify(`${id}-${basename(file, extname(file))}`)}${ext}`;
  const res = await fetch(src, { headers: { "User-Agent": "canarycry-site-build" } });
  if (!res.ok) throw new Error(`image download failed (${String(res.status)}): ${src}`);
  await writeFile(join(imageDir, name), Buffer.from(await res.arrayBuffer()));
  const local = `/content/images/${name}`;
  downloaded.set(src, local);
  return local;
}

const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
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
    "figure",
    "figcaption",
    "img",
    "div",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    "*": ["class"],
  },
  allowedClasses: { "*": ["kg-*", "embed-placeholder"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    h1: "h2",
    a: (_t, attribs) => {
      const href = attribs.href;
      const out: Record<string, string> = {};
      if (href !== undefined) {
        out.href = href.startsWith("__GHOST_URL__") ? rewriteGhostUrl(href) : href;
        if (!out.href.startsWith("/")) out.rel = "noopener noreferrer";
      }
      return { tagName: "a", attribs: out };
    },
    img: (_t, attribs) => ({ tagName: "img", attribs: { ...attribs, loading: "lazy" } }),
  },
  nonTextTags: [
    "script",
    "style",
    "textarea",
    "option",
    "noscript",
    "iframe",
    "object",
    "embed",
    "form",
  ],
};

async function cleanHtml(
  html: string,
): Promise<{ html: string; removedEmbeds: { host: string; src: string }[] }> {
  const removedEmbeds: { host: string; src: string }[] = [];
  // Each iframe becomes a link to what it embedded.
  let out = html.replace(
    /<iframe\b[^>]*?\ssrc="([^"]+)"[^>]*>[\s\S]*?<\/iframe>/g,
    (_m, src: string) => {
      const full = src.startsWith("//") ? `https:${src}` : src;
      const host = new URL(full).hostname;
      removedEmbeds.push({ host, src: full });
      return `<p class="embed-placeholder">Embedded player from ${host}: <a href="${full}">open it there</a>.</p>`;
    },
  );
  // Images move to local copies.
  const srcs = [...out.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)].map((m) => m[1]!);
  for (const src of srcs) {
    if (src.startsWith("http")) out = out.split(`"${src}"`).join(`"${await localImage(src)}"`);
  }
  // Other people's emails and phone numbers stay out of the preview.
  return { html: redactContactsHtml(sanitizeHtml(out, SANITIZE)).trim(), removedEmbeds };
}

await rm("content/pages", { recursive: true, force: true });
await rm("content/posts", { recursive: true, force: true });
await rm(imageDir, { recursive: true, force: true });
await mkdir("content/pages", { recursive: true });
await mkdir("content/posts", { recursive: true });
await mkdir(imageDir, { recursive: true });

let pageCount = 0;
let postCount = 0;
for (const p of posts) {
  if (p.type === "page" && p.slug in SKIP) {
    console.log(`skip page ${p.slug}: ${SKIP[p.slug] ?? ""}`);
    continue;
  }
  const { html, removedEmbeds } = await cleanHtml(p.html ?? "");
  // From the body, not Ghost's custom_excerpt: the Squarespace import filled
  // those in with words run together ("from youname@…").
  const excerpt = plainExcerpt(html, 30) || undefined;
  const record = {
    slug: p.slug,
    title: p.title,
    html,
    ...(excerpt === undefined ? {} : { excerpt }),
    removedEmbeds,
    updatedAt: p.updated_at,
    ...(p.type === "post" && p.published_at !== null ? { publishedAt: p.published_at } : {}),
  };
  const dir = p.type === "page" ? "content/pages" : "content/posts";
  await writeFile(join(dir, `${p.slug}.json`), `${JSON.stringify(record, null, 2)}\n`);
  if (p.type === "page") pageCount++;
  else postCount++;
}

// Theme images (fan art, show art, shirts, roundtable, supply drop) and the logo.
await rm("public/images", { recursive: true, force: true });
await cp(join(ghostContent, "themes/canarycry/assets/images"), "public/images", {
  recursive: true,
});
await cp(join(ghostContent, "images/2026/06/cc-logo.webp"), "public/images/cc-logo.webp");

console.log(
  `extracted ${String(pageCount)} pages, ${String(postCount)} posts, ${String(downloaded.size)} images`,
);

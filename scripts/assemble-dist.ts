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
// buttons that need the app (theme toggle, mobile menu).

import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { BASE, NOT_FOUND_PRERENDER_PATH } from "../app/lib/paths.ts";
import { THEME_KEY } from "../app/lib/theme.ts";

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

console.log(`dist: assembled from ${CLIENT}`);

// dist-files.ts — reads the assembled site (dist/) for the dist tests.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const DIST = "dist";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

if (!existsSync(DIST))
  throw new Error("dist/ is missing: run `pnpm build` (the dist tests run at its end)");

/** Every file in dist/, as a path relative to it ("episodes/index.html"). */
export const files: string[] = walk(DIST).map((f) => relative(DIST, f).split("\\").join("/"));

export const htmlFiles: string[] = files.filter((f) => f.endsWith(".html"));

/** Images, fonts and audio: scanned as bytes, without the email check. */
export function isBinary(file: string): boolean {
  return /\.(?:png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|mp3|mp4|pdf)$/i.test(file);
}

const cache = new Map<string, string>();
export function read(file: string): string {
  let text = cache.get(file);
  if (text === undefined) {
    text = readFileSync(join(DIST, file), "utf8");
    cache.set(file, text);
  }
  return text;
}

/** Binary-safe read for scanning images and fonts for embedded text. */
export function readLatin1(file: string): string {
  return readFileSync(join(DIST, file), "latin1");
}

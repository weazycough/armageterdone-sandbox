// links.test.ts — every internal link and asset reference resolves to a file
// in dist/, and none escapes the /armageterdone-sandbox/ base path. Relative links
// (common in hand-written labs) are resolved against their page.

import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { BASE } from "../../app/lib/paths";
import { externalHost, pageUrls } from "../site-checks";
import { DIST, htmlFiles, read } from "./dist-files";

const ORIGIN = "https://site.invalid";

/** A page-relative or root-relative URL as a path on the site; null if it isn't one. */
function sitePath(url: string, file: string): string | null {
  const u = url.trim();
  if (
    u === "" ||
    u.startsWith("#") ||
    externalHost(u) !== null ||
    /^(?:data|blob|mailto|tel|javascript):/i.test(u)
  )
    return null;
  return decodeURIComponent(new URL(u, `${ORIGIN}${BASE}${file}`).pathname);
}

function target(path: string): string {
  const rel = path.slice(BASE.length);
  return path.endsWith("/") ? join(DIST, rel, "index.html") : join(DIST, rel);
}

describe("links", () => {
  const refs = htmlFiles.flatMap((f) =>
    pageUrls(read(f)).flatMap((url) => {
      const path = sitePath(url, f);
      return path === null ? [] : [{ f, url, path }];
    }),
  );

  it("every site URL stays under the base path", () => {
    expect(
      refs.filter(({ path }) => !path.startsWith(BASE)).map(({ f, url }) => `${f}: ${url}`),
    ).toEqual([]);
  });

  it("every internal link and asset exists", () => {
    const seen = new Set<string>();
    const broken: string[] = [];
    for (const { f, url, path } of refs) {
      if (!path.startsWith(BASE) || seen.has(path)) continue;
      seen.add(path);
      if (!existsSync(target(path))) broken.push(`${f}: ${url}`);
    }
    expect(seen.size).toBeGreaterThan(100);
    expect(broken).toEqual([]);
  });
});

// noindex.test.ts — the preview must never be indexed. Covers every HTML file
// in dist/, including design labs and anything copied from public/.

import { describe, expect, it } from "vite-plus/test";
import { robotsProblem } from "../site-checks";
import { files, htmlFiles, read } from "./dist-files";

describe("no-index", () => {
  it("every HTML file carries the robots meta in its server-rendered <head>", () => {
    expect(htmlFiles).toContain("index.html");
    expect(htmlFiles).toContain("labs/index.html");
    const bad = htmlFiles.flatMap((f) => {
      const problem = robotsProblem(read(f));
      return problem === null ? [] : [`${f}: ${problem}`];
    });
    expect(bad).toEqual([]);
  });

  it("ships no robots.txt and no sitemap", () => {
    // A robots.txt Disallow would stop crawlers reading the noindex tag; a
    // project site can't own the domain's robots.txt anyway.
    expect(files.filter((f) => /(^|\/)robots\.txt$|sitemap[^/]*\.xml$/i.test(f))).toEqual([]);
  });
});

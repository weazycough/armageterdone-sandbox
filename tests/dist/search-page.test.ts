import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { FLTS_EXCLUDED_IDS, FLTS_INDEX_FILE, fltsIndexSchema } from "../../app/lib/flts";
import { SEARCH_INDEX_FILE, searchIndexSchema } from "../../app/lib/search";
import { files, read } from "./dist-files";

describe("search page", () => {
  it("is prerendered with the interior header and a coming-soon Topic Index", () => {
    expect(files).toContain("search/index.html");
    const html = read("search/index.html");
    expect(html).toContain("page-intro");
    expect(html).toContain("Topic Index");
    expect(html).toContain("Coming soon");
    expect(html).not.toContain("bracket-frame");
    expect(html).not.toMatch(/Antarctica \(\d+\)/);
    expect(html).toContain('href="/armageterdone-sandbox/search/"');
    expect(html).toMatch(/aria-pressed="true"[^>]*>\s*All\s*</);
    expect(html).toMatch(/aria-pressed="false"[^>]*>\s*News Talk\s*</);
    expect(html).toMatch(/aria-pressed="false"[^>]*>\s*FaceLikeTheSun\s*</);
  });

  it("ships a trimmed FaceLikeTheSun catalog without the borderline CCNT streams", () => {
    expect(files).toContain(FLTS_INDEX_FILE);
    const catalog = fltsIndexSchema.parse(JSON.parse(readFileSync(`dist/${FLTS_INDEX_FILE}`, "utf8")));
    expect(catalog.items.length).toBeGreaterThanOrEqual(1029);
    expect(catalog.meta.included).toBe(catalog.items.length);
    expect(catalog.items.filter((item) => FLTS_EXCLUDED_IDS.has(item.id))).toEqual([]);
    expect(catalog.items.filter((item) => item.chapters.length > 0).length).toBeGreaterThanOrEqual(5);
  });

  it("adds the page to the site search index and does not embed YouTube media", () => {
    const index = searchIndexSchema.parse(JSON.parse(read(SEARCH_INDEX_FILE)));
    expect(index.some((entry) => entry.path === "/search/")).toBe(true);
    const html = read("search/index.html");
    expect(html).not.toContain("i.ytimg.com");
  });
});

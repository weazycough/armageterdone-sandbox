import { describe, expect, it } from "vite-plus/test";
import { episodeListPath, pageCount, withBase } from "../../app/lib/paths";

describe("paths", () => {
  it("episode list pages: page 1 is /episodes/", () => {
    expect(episodeListPath(1)).toBe("/episodes/");
    expect(episodeListPath(2)).toBe("/episodes/page/2/");
  });

  it("pageCount", () => {
    expect(pageCount(0)).toBe(1);
    expect(pageCount(16)).toBe(1);
    expect(pageCount(17)).toBe(2);
  });

  it("withBase prefixes root-relative href/src only", () => {
    expect(withBase('<a href="/support/#one">x</a><img src="/content/images/a.png">')).toBe(
      '<a href="/armageterdone-sandbox/support/#one">x</a><img src="/armageterdone-sandbox/content/images/a.png">',
    );
    expect(withBase('<a href="https://x.test/a">x</a><a href="//cdn.test/a">y</a>')).toBe(
      '<a href="https://x.test/a">x</a><a href="//cdn.test/a">y</a>',
    );
  });
});

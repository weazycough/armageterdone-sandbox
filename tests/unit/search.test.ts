// The site search: folding, matching and ordering, on a hand-made index.

import { describe, expect, it } from "vite-plus/test";
import { fold, plainText, prepare, search, searchIndexSchema } from "../../app/lib/search";

const index = prepare(
  searchIndexSchema.parse([
    { kind: "page", title: "Roundtable", path: "/roundtable/", text: "Knights and Dames" },
    { kind: "page", title: "Support", path: "/support/", text: "Become a producer, Roundtable" },
    {
      kind: "episode",
      title: "CERN PHYSICIST MISSING",
      path: "/episodes/cern/",
      date: "2026-01-02T00:00:00.000Z",
      text: "What we know about Dr. Furkan Dölek",
    },
  ]),
);

describe("search", () => {
  it("matches every word, in any case and without accents", () => {
    expect(search(index, "dr dolek").map((e) => e.path)).toEqual(["/episodes/cern/"]);
    expect(search(index, "  CERN   missing ").map((e) => e.path)).toEqual(["/episodes/cern/"]);
    expect(search(index, "cern nephilim")).toEqual([]);
  });

  it("puts title matches first", () => {
    expect(search(index, "roundtable").map((e) => e.path)).toEqual(["/roundtable/", "/support/"]);
  });

  it("returns nothing for an empty query, and respects the limit", () => {
    expect(search(index, "   ")).toEqual([]);
    expect(search(index, "e", 2)).toHaveLength(2);
  });

  it("rejects an index entry of the wrong shape", () => {
    expect(() =>
      searchIndexSchema.parse([{ kind: "post", title: "x", path: "/", text: "" }]),
    ).toThrow();
  });
});

describe("plainText and fold", () => {
  it("drops tags, scripts and entities", () => {
    expect(plainText("<p>Tom &amp; Jerry</p><script>x()</script><b>&quot;hi&quot;</b>")).toBe(
      'Tom & Jerry "hi"',
    );
    expect(fold("Türkiye  ÉTÉ")).toBe("turkiye ete");
  });
});

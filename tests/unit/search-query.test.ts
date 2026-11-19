import { describe, expect, it } from "vite-plus/test";
import type { FltsItem } from "../../app/lib/flts";
import type { SearchEntry } from "../../app/lib/search";
import {
  highlightParts,
  parseQuery,
  queryIsEmpty,
  searchCatalog,
  searchPagePath,
  snippetAround,
} from "../../app/lib/search-query";

const episodes: SearchEntry[] = [
  {
    kind: "episode",
    title: "Nephilim in the Headlines | CCNT 900",
    path: "/episodes/nephilim-headlines/",
    date: "2024-01-02T00:00:00.000Z",
    text: "A News Talk look at the Nephilim story in current events.",
    show: "news-talk",
    duration: "02:10:00",
    youtubeId: "abc123xyz00",
  },
  {
    kind: "page",
    title: "Support",
    path: "/support/",
    text: "Become a producer",
  },
];

const videos: FltsItem[] = [
  {
    id: "goxUOqxxhjE",
    title: "A Lifetime of NHI Encounters!",
    date: "2023-06-01T00:00:00.000Z",
    type: "video",
    duration: 6000,
    description: "Al Matthews describes a lifetime of strange encounters.",
    thumbnail: null,
    chapters: [
      { title: "Mapping the “Supernatural Ecosystem”: Spirits, UFOs, Portals & Technology", seconds: 4798 },
    ],
  },
];

describe("parseQuery", () => {
  it("treats quoted text as an exact phrase", () => {
    const q = parseQuery('Nephilim "news talk" hidden');
    expect(q.phrases).toEqual(["news talk"]);
    expect(q.words).toEqual(["nephilim", "hidden"]);
    expect(queryIsEmpty(parseQuery('  ""  '))).toBe(true);
  });
});

describe("searchCatalog", () => {
  it("returns mixed episode and FaceLikeTheSun hits, and skips pages", () => {
    const hits = searchCatalog(episodes, videos, parseQuery("nephilim"), "all", "relevance");
    expect(hits.map((h) => h.key)).toEqual(["/episodes/nephilim-headlines/"]);
    expect(hits[0]?.show).toBe("news-talk");
    expect(hits[0]?.external).toBe(false);
    expect(hits[0]?.episodeHref).toBe("/episodes/nephilim-headlines/");
    expect(hits[0]?.youtubeHref).toBe("https://www.youtube.com/watch?v=abc123xyz00");
    expect(hits[0]?.rumbleHref).toBeUndefined();
  });

  it("links a chapter timestamp when the query matches the chapter title", () => {
    const hits = searchCatalog(episodes, videos, parseQuery("supernatural ecosystem"), "facelikethesun", "relevance");
    expect(hits).toHaveLength(1);
    expect(hits[0]?.chapter?.seconds).toBe(4798);
    expect(hits[0]?.href).toBe("https://www.youtube.com/watch?v=goxUOqxxhjE&t=4798s");
    expect(hits[0]?.external).toBe(true);
  });

  it("filters by show and sorts newest first", () => {
    expect(searchCatalog(episodes, videos, parseQuery(""), "facelikethesun", "newest")).toHaveLength(1);
    expect(searchCatalog(episodes, videos, parseQuery("nephilim"), "radio", "relevance")).toEqual([]);
  });
});

describe("highlight and urls", () => {
  it("marks matched words and builds shareable paths", () => {
    const q = parseQuery("Nephilim");
    expect(highlightParts("The Nephilim story", q)).toEqual([
      { text: "The ", mark: false },
      { text: "Nephilim", mark: true },
      { text: " story", mark: false },
    ]);
    expect(snippetAround("A News Talk look at the Nephilim story in current events.", q)).toContain("Nephilim");
    expect(searchPagePath({ q: "nephilim", show: "facelikethesun", page: 2 })).toBe(
      "/search/?q=nephilim&show=facelikethesun&page=2",
    );
  });
});

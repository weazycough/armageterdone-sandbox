import { describe, expect, it } from "vite-plus/test";
import { isBurningManResearchEpisode, networkShowTiles } from "../../app/lib/network-latest.server";
import type { Episode } from "../../app/lib/feed";

const ep = (partial: Partial<Episode> & Pick<Episode, "title" | "slug">): Episode => ({
  guid: partial.guid ?? partial.slug,
  published: partial.published ?? "2026-01-01T00:00:00.000Z",
  audioUrl: partial.audioUrl ?? "https://example.com/a.mp3",
  audioType: "audio/mpeg",
  notesHtml: "",
  excerpt: "",
  artUrl: partial.artUrl ?? "https://example.com/art.png",
  ...partial,
});

describe("isBurningManResearchEpisode", () => {
  it("accepts CCR / FLYBY Burning Man research", () => {
    expect(
      isBurningManResearchEpisode(
        ep({ slug: "a", title: "BURNING MAN: The Supernatural Encounter | CCR 204" }),
      ),
    ).toBe(true);
    expect(
      isBurningManResearchEpisode(ep({ slug: "b", title: "FLYBY: Basil Trapped at Burning Man 2023!" })),
    ).toBe(true);
  });

  it("rejects Clubhouse and CCNT mentions", () => {
    expect(
      isBurningManResearchEpisode(
        ep({ slug: "c", title: "A Christian Q&A on The Supernatural Burning Man - Canary Cry Clubhouse" }),
      ),
    ).toBe(false);
    expect(
      isBurningManResearchEpisode(
        ep({ slug: "d", title: "Nuclear Burning Man | CCNT 955" }),
      ),
    ).toBe(false);
  });
});

describe("networkShowTiles", () => {
  it("picks latest thumbs per show from the main feed + joyspiracy extra", () => {
    const episodes = [
      ep({
        slug: "nt",
        title: "News | CCNT 1",
        published: "2026-10-01T00:00:00.000Z",
        artUrl: "https://example.com/nt.png",
        audioUrl: "https://example.com/CCNT1.mp3",
      }),
      ep({
        slug: "rad",
        title: "Interview | CCR 1",
        published: "2026-09-01T00:00:00.000Z",
        artUrl: "https://example.com/ccr.png",
        audioUrl: "https://example.com/CCR1.mp3",
      }),
      ep({
        slug: "ch",
        title: "Talk - Canary Cry Clubhouse",
        published: "2026-08-01T00:00:00.000Z",
        artUrl: "https://example.com/ch.png",
        audioUrl: "https://example.com/Clubhouse_1.mp3",
      }),
      ep({
        slug: "bm",
        title: "TRIPPIN' ON JESUS | Burning Man 2025 | CCR 188",
        published: "2025-10-15T00:00:00.000Z",
        artUrl: "https://example.com/bm.png",
        audioUrl: "https://example.com/CCR188.mp3",
      }),
      ep({
        slug: "bb",
        title: "Basil's Bunker 14 - Missouri Missile Silo",
        published: "2024-09-21T00:00:00.000Z",
        artUrl: "https://example.com/bb.png",
        audioUrl: "https://example.com/BB14.mp3",
      }),
    ];
    const tiles = networkShowTiles(episodes, {
      joyspiracy: {
        title: "TJT vs Michael Basham",
        published: "2020-01-09T21:15:02.000Z",
        artUrl: "https://example.com/tjt.jpg",
        externalUrl: "https://thejoyspiracytheory.libsyn.com/tjt",
      },
    });
    const by = Object.fromEntries(tiles.map((t) => [t.slug, t.latest?.artUrl]));
    expect(by["news-talk"]).toBe("https://example.com/nt.png");
    expect(by.radio).toBe("https://example.com/ccr.png");
    expect(by.clubhouse).toBe("https://example.com/ch.png");
    expect(by.joyspiracy).toBe("https://example.com/tjt.jpg");
    expect(by["burning-man-research"]).toBe("https://example.com/bm.png");
    expect(by["basils-bunker"]).toBe("https://example.com/bb.png");
  });
});

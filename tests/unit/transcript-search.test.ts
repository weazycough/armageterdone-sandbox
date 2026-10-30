// Transcript / show-notes search: matching, snippets, timestamps, YouTube URL.

import { describe, expect, it } from "vite-plus/test";
import {
  firstYoutubeUrl,
  nearbyTimestamp,
  prepareTranscripts,
  searchTranscripts,
  snippetParts,
  transcriptIndexSchema,
} from "../../app/lib/transcript-search";

const index = prepareTranscripts(
  transcriptIndexSchema.parse([
    {
      source: "show-notes",
      title: "NEPHILIM PENGUINS | CCNT 900",
      path: "/episodes/nephilim-penguins/",
      date: "2026-01-02T00:00:00.000Z",
      audioUrl: "https://example.com/a.mp3",
      text: "INTRO 0:00 ELON 12:30 NEPHILIM PENGUIN/SEWER SURVEILLANCE 1:18:18 PRODUCERS 1:34:57 END 2:00:00",
    },
    {
      source: "show-notes",
      title: "BITCOIN AND BABYLON | CCNT 901",
      path: "/episodes/bitcoin-babylon/",
      date: "2026-01-03T00:00:00.000Z",
      audioUrl: "https://example.com/b.mp3",
      videoUrl: "https://www.youtube.com/watch?v=abc123",
      text: "Talking bitcoin wallets and digital babylon with guests.",
    },
    {
      source: "transcript",
      title: "TRASCRIPT ep 257",
      externalUrl: "https://www.canarycrynewstalk.com/trascript-ep-257",
      date: "2020-10-19T00:00:00.000Z",
      text: "You're listening to Canary Cry News Talk, episode 257, build backed better.",
    },
  ]),
);

describe("searchTranscripts", () => {
  it("matches show notes and prefers title hits", () => {
    const hits = searchTranscripts(index, "bitcoin");
    expect(hits.map((h) => h.entry.path)).toEqual(["/episodes/bitcoin-babylon/"]);
    expect(hits[0]?.entry.videoUrl).toContain("youtube.com");
  });

  it("finds real transcripts by source", () => {
    const hits = searchTranscripts(index, "build backed");
    expect(hits).toHaveLength(1);
    expect(hits[0]?.entry.source).toBe("transcript");
  });

  it("returns nothing for an empty query", () => {
    expect(searchTranscripts(index, "   ")).toEqual([]);
  });
});

describe("snippetParts and nearbyTimestamp", () => {
  it("highlights the query in a snippet", () => {
    const parts = snippetParts("Talking bitcoin wallets and digital babylon.", "bitcoin");
    expect(parts.some((p) => p.hit === true && p.text.toLowerCase() === "bitcoin")).toBe(true);
  });

  it("pulls a nearby timestamp from the notes", () => {
    expect(nearbyTimestamp(index[0]!.body, "nephilim")).toMatch(/\d/);
  });
});

describe("firstYoutubeUrl", () => {
  it("extracts a watch URL and strips trailing punctuation", () => {
    expect(
      firstYoutubeUrl('see <a href="https://www.youtube.com/watch?v=T_FCOOJxh4E">clip</a>.'),
    ).toBe("https://www.youtube.com/watch?v=T_FCOOJxh4E");
    expect(firstYoutubeUrl("https://youtu.be/abc123).")).toBe("https://youtu.be/abc123");
    expect(firstYoutubeUrl("no video here")).toBeUndefined();
  });
});

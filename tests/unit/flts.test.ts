import { describe, expect, it } from "vite-plus/test";
import {
  FLTS_EXCLUDED_IDS,
  formatTimestamp,
  isCanaryCryDuplicateTitle,
  parseChapters,
  timestampToSeconds,
  trimDescription,
  youtubeUrl,
} from "../../app/lib/flts";

describe("parseChapters", () => {
  it("reads common timestamp lines and skips Bible verses", () => {
    const chapters = parseChapters(`Intro text
0:00 Intro
6:35 The story so far
1:02:33 Mapping the “Supernatural Ecosystem”
(12:34)
15:01 - Topic
2 Timothy 2:24-26
Leviticus 18:24–25`);
    expect(chapters).toEqual([
      { title: "Intro", seconds: 0 },
      { title: "The story so far", seconds: 395 },
      { title: "Mapping the “Supernatural Ecosystem”", seconds: 3753 },
      { title: "12:34", seconds: 754 },
      { title: "Topic", seconds: 901 },
    ]);
  });
});

describe("isCanaryCryDuplicateTitle", () => {
  it("excludes CCNT, CCR, News Talk, and Clubhouse re-uploads", () => {
    expect(isCanaryCryDuplicateTitle("Something CCNT #986")).toBe(true);
    expect(isCanaryCryDuplicateTitle("Guest | CCR 202")).toBe(true);
    expect(isCanaryCryDuplicateTitle("Canary Cry Radio Ep. 200: Interview")).toBe(true);
    expect(isCanaryCryDuplicateTitle("News Talk 900 something")).toBe(true);
    expect(isCanaryCryDuplicateTitle("Live Canary Cry Clubhouse")).toBe(true);
    expect(
      isCanaryCryDuplicateTitle("500: Super Long Title, Many Clauses, And More", {
        date: "2021-06-25",
        durationSeconds: 8000,
      }),
    ).toBe(true);
  });

  it("keeps promos, soundtracks, and original FaceLikeTheSun titles", () => {
    expect(isCanaryCryDuplicateTitle("Canary Cry Radio Ep. 116 Promo Video")).toBe(false);
    expect(isCanaryCryDuplicateTitle("PORTALS OF CERN - FaceLikeTheSun & Canary Cry Radio Music Soundtrack")).toBe(
      false,
    );
    expect(isCanaryCryDuplicateTitle("A Lifetime of NHI Encounters!")).toBe(false);
  });
});

describe("youtubeUrl and helpers", () => {
  it("builds watch links with optional timestamps", () => {
    expect(youtubeUrl("abc")).toBe("https://www.youtube.com/watch?v=abc");
    expect(youtubeUrl("abc", 4798)).toBe("https://www.youtube.com/watch?v=abc&t=4798s");
    expect(timestampToSeconds("1:02:33")).toBe(3753);
    expect(formatTimestamp(4798)).toBe("1:19:58");
    expect(trimDescription("a ".repeat(800)).endsWith("…")).toBe(true);
    expect(FLTS_EXCLUDED_IDS.size).toBe(4);
  });
});

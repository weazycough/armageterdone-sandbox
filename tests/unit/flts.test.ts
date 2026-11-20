import { describe, expect, it } from "vite-plus/test";
import {
  FLTS_EXCLUDED_IDS,
  findFltsEpisodeDuplicate,
  formatTimestamp,
  isCanaryCryDuplicateTitle,
  isFltsDuplicateOfEpisode,
  compactDescription,
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

  it("reads numbered lists with the timestamp at the end of the line", () => {
    const chapters = parseChapters(`Intro text
1.) Prologue 0:48
2.) As in the Days of Noah 4:20
3.) Death, Famine, War, and the Conquering King 7:01
4.) Control, Evolve, Transcend 18:16`);
    expect(chapters).toEqual([
      { title: "Prologue", seconds: 48 },
      { title: "As in the Days of Noah", seconds: 260 },
      { title: "Death, Famine, War, and the Conquering King", seconds: 421 },
      { title: "Control, Evolve, Transcend", seconds: 1096 },
    ]);
  });

  it("still finds chapters after a long preface, and ignores Bible verse lists", () => {
    const preface = `${"Word ".repeat(250)}\n`;
    expect(preface.length).toBeGreaterThan(1000);
    const chapters = parseChapters(`${preface}0:00 Intro\n6:35 The story so far\n13:33 The problem`);
    expect(chapters).toEqual([
      { title: "Intro", seconds: 0 },
      { title: "The story so far", seconds: 395 },
      { title: "The problem", seconds: 813 },
    ]);
    expect(
      parseChapters(`2 Kings 2:11
Mark 16:14
John 20:19
Luke 24:31`),
    ).toEqual([]);
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
    expect(compactDescription("a ".repeat(800)).endsWith("…")).toBe(false);
    expect(compactDescription("a ".repeat(800)).length).toBeGreaterThan(1000);
    expect(FLTS_EXCLUDED_IDS.size).toBe(4);
  });
});

describe("findFltsEpisodeDuplicate", () => {
  const episodes = [
    {
      title: "The THIELOCALYPSE is Here! Breeding gods for the Last Empire!",
      published: "2026-11-10T12:00:00.000Z",
      duration: "01:31:42",
    },
    {
      title: "CYBER CHAOS EVE! November 17 Predictions | CCNT 990",
      published: "2026-11-17T12:00:00.000Z",
      duration: "02:49:40",
    },
    {
      title: "Super Soldier Dogs, Palantir Monkeys & Dems Could Kill the UFO Hearings | CCNT 986",
      published: "2026-10-29T12:00:00.000Z",
      duration: "02:10:00",
    },
    {
      title: "How JESUS defeated the NEPHILIM! *LIVE* Call in Discussion",
      published: "2025-07-06T12:00:00.000Z",
      duration: "01:50:57",
      youtubeId: "yExp02xmmL4",
    },
    {
      title: "FLYBY | Interview with Sen. Mike Moon | 01.30.2026",
      published: "2026-01-31T12:00:00.000Z",
      duration: "42:24",
      youtubeId: "NH4HlE-RO7s",
    },
    {
      title: "Nephilim in the Headlines, Part 1 | CCNT 900",
      published: "2024-01-02T00:00:00.000Z",
      duration: "02:00:00",
    },
    {
      title: "Nephilim in the Headlines, Part 2 | CCNT 901",
      published: "2024-01-03T00:00:00.000Z",
      duration: "02:00:00",
    },
  ];

  it("matches a FaceLikeTheSun re-upload of a site episode by title and date", () => {
    const hit = findFltsEpisodeDuplicate(
      {
        id: "ApDz2gWcXaU",
        title: "The THIELOCALYPSE is Here! Breeding gods for the Last Empire!",
        date: "2026-11-11T00:00:00.000Z",
        duration: 0,
      },
      episodes,
    );
    expect(hit?.reason).toBe("title-date");
    expect(
      isFltsDuplicateOfEpisode(
        { id: "x", title: "CYBER CHAOS EVE! November 17 Predictions!", date: "2026-11-17", duration: 0 },
        episodes,
      ),
    ).toBe(true);
    expect(
      isFltsDuplicateOfEpisode(
        {
          id: "B3CwVbUIIUE",
          title: "They're UNLEASHING Super Soldier Dogs and Palantir Monkeys",
          date: "2026-10-28",
          duration: 7672,
        },
        episodes,
      ),
    ).toBe(true);
  });

  it("matches the same YouTube id even when the dates are a few days apart", () => {
    const hit = findFltsEpisodeDuplicate(
      { id: "NH4HlE-RO7s", title: "FLYBY | Sen. Mike Moon Interview", date: "2026-02-04", duration: 2544 },
      episodes,
    );
    expect(hit?.reason).toBe("youtube-id");
  });

  it("keeps a short highlight that shares a title with a long call-in, and part 1 vs part 2", () => {
    expect(
      findFltsEpisodeDuplicate(
        { id: "W0g1aj3R8JE", title: "HOW JESUS DEFEATED THE NEPHILIM!", date: "2025-07-06", duration: 600 },
        episodes,
      ),
    ).toBeNull();
    expect(
      isFltsDuplicateOfEpisode(
        { id: "p2", title: "Nephilim in the Headlines, Part 2", date: "2024-01-03", duration: 7200 },
        [episodes[5]!],
      ),
    ).toBe(false);
  });
});

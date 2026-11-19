import { describe, expect, it } from "vite-plus/test";
import {
  isNumberMatch,
  isTitleDateMatch,
  matchEpisodeVideos,
  mergeVideoItems,
  parseShowAndNumber,
  titleSimilarity,
  titleTokens,
  youtubeWatchUrl,
} from "../../app/lib/episode-videos";

describe("parseShowAndNumber", () => {
  it("reads CCNT and CCR numbers from titles", () => {
    expect(parseShowAndNumber("CYBER CHAOS EVE! | CCNT 990")).toEqual({ show: "news-talk", number: 990 });
    expect(parseShowAndNumber("TRUMP vs THE BEAST | CCR 208")).toEqual({ show: "radio", number: 208 });
    expect(parseShowAndNumber("Canary Cry Radio ep032")).toEqual({ show: "radio", number: 32 });
    expect(parseShowAndNumber("143 CCNT \"The Beast from Down Under!\"")).toEqual({
      show: "news-talk",
      number: 143,
    });
  });

  it("does not treat a date like CCNT 10.17.2017 as episode 10", () => {
    expect(parseShowAndNumber("EXPLOSIONS IN THE HEAVENS - CCNT 10.17.2017").number).toBeNull();
    expect(parseShowAndNumber("Trump Defeats Globalism CCNT 01.24.2017 (Audio Only)").number).toBeNull();
  });

  it("reads a leading number on the NewsTalk channel and the MP3 name", () => {
    expect(parseShowAndNumber("389: CLAWNIFORNIA (Live)", { channel: "ccnt" })).toEqual({
      show: "news-talk",
      number: 389,
    });
    expect(
      parseShowAndNumber("CLOWNIFORNIA", {
        audioUrl: "https://traffic.libsyn.com/canarycrynewstalk/CCNT389_09.15.2021_mixdown.mp3",
      }),
    ).toEqual({ show: "news-talk", number: 389 });
  });

  it("labels Clubhouse from the title without inventing a number", () => {
    expect(parseShowAndNumber("The most important livestream of our lives! Canary Cry Clubhouse")).toEqual({
      show: "clubhouse",
      number: null,
    });
  });
});

describe("title and date matching", () => {
  it("accepts a shared distinctive stem on the same day", () => {
    const sim = titleSimilarity("FAUCILEAKS", "FAUCILEAKS: CyberPandemic, Dystopian Jabs - CCNT 345");
    expect(sim.contained).toBe(true);
    expect(isTitleDateMatch(sim, 0, titleTokens("FAUCILEAKS")[0]!.length)).toBe(true);
  });

  it("accepts overlapping titles a day apart even when jaccard is modest", () => {
    const sim = titleSimilarity(
      "Super Soldier Dogs, Palantir Monkeys & Dems Could Kill the UFO Hearings | CCNT 986",
      "They're UNLEASHING Super Soldier Dogs and Palantir Monkeys",
    );
    expect(sim.intersection).toBeGreaterThanOrEqual(4);
    expect(isTitleDateMatch(sim, 1)).toBe(true);
  });

  it("rejects a reused episode number years later when the titles disagree", () => {
    const sim = titleSimilarity(
      "CCR 156: False Light with Donnie Darkened",
      "BIRTHRIGHT: The New Golden Age of Apollo w/ Tim Alberino - CCR 156",
    );
    expect(isNumberMatch(sim, 811)).toBe(false);
  });
});

describe("matchEpisodeVideos", () => {
  const episodes = [
    {
      slug: "cyber-chaos-eve-ccnt-990",
      title: "CYBER CHAOS EVE! November 17 Predictions | CCNT 990",
      published: "2026-11-17T12:00:00.000Z",
      show: "news-talk" as const,
    },
    {
      slug: "ccr-156-false-light",
      title: "CCR 156: False Light with Donnie Darkened",
      published: "2023-03-31T12:00:00.000Z",
      show: "radio" as const,
    },
  ];

  it("prefers the official NewsTalk upload over a FaceLikeTheSun copy", () => {
    const matches = matchEpisodeVideos(episodes, [
      {
        id: "fltsCopy",
        title: "CYBER CHAOS EVE! November 17 Predictions!",
        published: "2026-11-16T20:00:00.000Z",
        channel: "flts",
      },
      {
        id: "official",
        title: "CYBER CHAOS EVE! November 17 Predictions!",
        published: "2026-11-17T00:11:16Z",
        channel: "ccnt",
      },
    ]);
    expect(matches).toEqual([
      {
        slug: "cyber-chaos-eve-ccnt-990",
        youtubeId: "official",
        youtubeSource: "ccnt",
        method: "title-date",
      },
    ]);
  });

  it("does not attach an old reused CCR number to a later episode", () => {
    const matches = matchEpisodeVideos(episodes, [
      {
        id: "old156",
        title: "BIRTHRIGHT: The New Golden Age of Apollo w/ Tim Alberino - CCR 156",
        published: "2021-01-09T00:00:00.000Z",
        channel: "ccr",
      },
    ]);
    expect(matches.find((m) => m.slug === "ccr-156-false-light")).toBeUndefined();
  });

  it("uses a curated catalog hint when the titles and dates agree", () => {
    const matches = matchEpisodeVideos(
      episodes,
      [
        {
          id: "hintVid",
          title: "CYBER CHAOS EVE! November 17 Predictions!",
          published: "2026-11-16T20:00:00.000Z",
          channel: "flts",
        },
      ],
      [
        {
          id: "hintVid",
          title: "CYBER CHAOS EVE! November 17 Predictions!",
          date: "2026-11-16",
          matchedShow: "CCNT",
          matchedEpisodeNumber: 990,
          siteFeedMatch: { title: "CYBER CHAOS EVE! November 17 Predictions | CCNT 990", date: "2026-11-17" },
        },
      ],
    );
    expect(matches[0]?.youtubeId).toBe("hintVid");
  });
});

describe("helpers", () => {
  it("builds a watch URL and merges new matches without overwriting existing ones", () => {
    expect(youtubeWatchUrl("abc", 12)).toBe("https://www.youtube.com/watch?v=abc&t=12s");
    const merged = mergeVideoItems(
      [{ slug: "a", youtubeId: "old", youtubeSource: "ccnt" }],
      [
        { slug: "a", youtubeId: "new", youtubeSource: "flts", rumbleUrl: "https://rumble.com/v1" },
        { slug: "b", youtubeId: "b1", youtubeSource: "ccr" },
      ],
    );
    expect(merged).toEqual([
      { slug: "a", youtubeId: "old", youtubeSource: "ccnt", rumbleUrl: "https://rumble.com/v1" },
      { slug: "b", youtubeId: "b1", youtubeSource: "ccr" },
    ]);
  });
});

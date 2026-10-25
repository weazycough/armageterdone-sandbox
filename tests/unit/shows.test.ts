// Which show an episode belongs to, from its title and MP3 file name.

import { describe, expect, it } from "vite-plus/test";
import { showOf } from "../../app/lib/shows";

const mp3 = (file: string) =>
  `https://traffic.libsyn.com/clean/secure/canarycrynewstalk/${file}?dest-id=400745`;

describe("showOf", () => {
  it.each([
    ["Building the GOD OF FORTRESSES | CCNT 983", "CCNT983_mixdown.mp3", "news-talk"],
    ["When Satanists Walk & Burning Bezos", "205_ccnt_06.05.2020_mixdown.mp3", "news-talk"],
    ["Eyes on the Right w/ Amy | CCR 207", "CCR207_amy_AUDIO.mp3", "radio"],
    ["Logos, not logos - Canary Cry Clubhouse", "CCClubhouse_07.09.2026mp3.mp3", "clubhouse"],
    ["Pity the Christian Humanist!", "CCClubhouse_mixdown_06.18.2026.mp3", "clubhouse"],
    ["Jesus as the Veil - Call-in Discussion", "CALLIN_x.mp3", "clubhouse"],
    // A News Talk episode whose file name mentions a call-in: the title wins.
    ["Days of NOAH | CCNT 870", "CALLM_RISING_CCNT_870_1.mp3", "news-talk"],
  ])("%s → %s", (title, file, show) => {
    expect(showOf({ title, audioUrl: mp3(file) })).toBe(show);
  });

  it("leaves specials it can't place out of every show", () => {
    expect(showOf({ title: "Basil's Bunker 14", audioUrl: mp3("BB14_mixdown.mp3") })).toBeNull();
    expect(showOf({ title: "X SPACES | THE MARK", audioUrl: mp3("XSPACES_1.mp3") })).toBeNull();
  });
});

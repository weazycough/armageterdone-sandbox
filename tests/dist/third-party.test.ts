// third-party.test.ts — no analytics, trackers, hosted players or remote
// scripts, on any page (React-built or a hand-written lab). The only remote
// loads allowed are the podcast's own episode art and MP3s on Libsyn, played
// in a native <audio> (no Libsyn player or pixel). Rules: tests/site-checks.ts.

import { describe, expect, it } from "vite-plus/test";
import { cssProblems, thirdPartyProblems, trackerIn } from "../site-checks";
import { files, htmlFiles, read } from "./dist-files";

describe("third parties", () => {
  it("pages load nothing from other sites except episode media", () => {
    const bad = htmlFiles.flatMap((f) => thirdPartyProblems(read(f), f).map((p) => `${f}: ${p}`));
    expect(bad).toEqual([]);
  });

  it("stylesheets load nothing from other sites", () => {
    const bad = files
      .filter((f) => f.endsWith(".css"))
      .flatMap((f) => cssProblems(read(f)).map((p) => `${f}: ${p}`));
    expect(bad).toEqual([]);
  });

  it("no tracker or hosted-player references in scripts or stylesheets", () => {
    const bad = files
      .filter((f) => /\.(?:js|mjs|css)$/.test(f))
      .flatMap((f) => {
        const m = trackerIn(read(f));
        return m === null ? [] : [`${f}: ${m}`];
      });
    expect(bad).toEqual([]);
  });
});

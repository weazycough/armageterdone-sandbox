// Shows hero: centered Canary Cry above NETWORK + bannerless bird crest;
// left/right stacked show tiles; shared mission-hero shell; nav-width stage.

import { describe, expect, it } from "vite-plus/test";
import { read } from "./dist-files";

const HOME = "index.html";
const SHOWS = "shows/index.html";

describe("Shows hero (centered title + crest + side columns)", () => {
  it("keeps home mission-hero unchanged and paints the three-column Shows hero", () => {
    const home = read(HOME);
    const shows = read(SHOWS);

    expect(home).toContain("mission-hero__tag");
    expect(home).toContain("canary-cry-key-art");
    expect(home).not.toContain("shows-hero__network");
    expect(home).not.toContain("mission-hero--blank");

    expect(shows).toContain('class="mission-hero shows-hero"');
    expect(shows).toContain("mission-hero__floor-grid");
    expect(shows).toContain("shows-hero__stage");
    expect(shows).toContain("shows-hero__center");
    expect(shows).toContain("shows-hero__col--left");
    expect(shows).toContain("shows-hero__col--right");
    expect(shows).toContain("shows-hero__mark");
    expect(shows).toMatch(/<h1 class="shows-hero__network"/);
    expect(shows).toContain("NETWORK");
    // No side-by-side yellow rule in this layout.
    expect(shows).not.toContain("shows-hero__rule");
    expect(shows).not.toContain("shows-hero__brand-left");
    // Mark precedes NETWORK (stacked above).
    expect(shows.indexOf("shows-hero__mark")).toBeLessThan(
      shows.indexOf('class="shows-hero__network"'),
    );
    // Real CcWordmark path data (not a text substitute).
    expect(shows).toContain("M.02,26.46C.02,11.76");
    // Bannerless crest asset.
    expect(shows).toContain("images/cc-bird-crest.webp");
    expect(shows).toContain("shows-hero__crest");

    // Tile order: left stack then right stack labels present.
    for (const label of [
      "Canary Cry News Talk",
      "Canary Cry Radio",
      "Canary Cry Clubhouse",
      "The Joyspiracy Theory",
      "Burning Man Research",
      "Basil's Bunker",
    ]) {
      expect(shows).toContain(label);
    }

    expect(shows).toContain("On the network");
    expect(shows).not.toContain("mission-hero--blank");
    expect(shows).not.toContain("shows-network__tile--news");
    expect(shows).not.toContain("shows-hero__network-row");
    expect(shows).not.toContain("shows-hero__grid");
  });

  it("styles centered brand+crest, side columns, nav-width stage", () => {
    const cssName = read(SHOWS).match(/assets\/(root-[^"]+\.css)/)?.[1];
    expect(cssName).toBeTruthy();
    const css = read(`assets/${cssName}`);
    expect(css).toContain("shows-hero__network");
    expect(css).toContain("scaleY(var(--shows-network-scale-y))");
    expect(css).toContain("transform-origin:50% 0");
    expect(css).toContain("color:#fff");
    expect(css).toContain("shows-hero__stage");
    expect(css).toContain("shows-hero__center");
    expect(css).toContain("shows-hero__col--left");
    expect(css).toContain("shows-hero__crest");
    expect(css).toContain("--shows-network-scale-y:1.3");
    // No rule nudge / brand-left from prior layout.
    expect(css).not.toContain("shows-rule-nudge");
    expect(css).not.toContain("shows-hero__brand-left");
    // Shows-only bottom padding (extra blue under tiles).
    expect(css).toContain("padding:1.75rem 0 3.75rem");
    expect(css).toContain("padding:1.35rem 0 2.75rem");
    expect(css).toContain("padding:2.25rem 0 4.25rem");
  });
});

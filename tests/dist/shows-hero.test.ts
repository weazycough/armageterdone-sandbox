// Shows hero: two-row sketch — small top over inner bigs, centered title,
// bird crest between bottom pairs; nav-width stage; bannerless crest asset.

import { describe, expect, it } from "vite-plus/test";
import { read } from "./dist-files";

const HOME = "index.html";
const SHOWS = "shows/index.html";

describe("Shows hero (two-row symmetric sketch)", () => {
  it("keeps home unchanged and paints the sketch slots + crest", () => {
    const home = read(HOME);
    const shows = read(SHOWS);

    expect(home).toContain("mission-hero__tag");
    expect(home).toContain("canary-cry-key-art");
    expect(home).not.toContain("shows-hero__network");
    expect(home).not.toContain("mission-hero--blank");

    expect(shows).toContain('class="mission-hero shows-hero"');
    expect(shows).toContain("mission-hero__floor-grid");
    expect(shows).toContain("shows-hero__stage");
    expect(shows).toContain("shows-hero__brand");
    expect(shows).toContain("shows-hero__mark");
    expect(shows).toMatch(/<h1 class="shows-hero__network"/);
    expect(shows).toContain("NETWORK");
    expect(shows).toContain("images/cc-bird-crest.webp");
    expect(shows).toContain("shows-hero__crest");
    expect(shows).toContain("shows-hero__slot--tl");
    expect(shows).toContain("shows-hero__slot--tr");
    expect(shows).toContain("shows-hero__slot--blo");
    expect(shows).toContain("shows-hero__slot--bli");
    expect(shows).toContain("shows-hero__slot--bri");
    expect(shows).toContain("shows-hero__slot--bro");
    expect(shows).toContain("shows-hero__tile--sm");
    expect(shows).toContain("shows-hero__tile--lg");
    // Prior three-column / rule layouts gone.
    expect(shows).not.toContain("shows-hero__rule");
    expect(shows).not.toContain("shows-hero__brand-left");
    expect(shows).not.toContain("shows-hero__col--left");
    expect(shows).toContain("M.02,26.46C.02,11.76");

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
  });

  it("styles two-row grid, square cards, nav-edge padding-block, scaleY 1.3", () => {
    const cssName = read(SHOWS).match(/assets\/(root-[^"]+\.css)/)?.[1];
    expect(cssName).toBeTruthy();
    const css = read(`assets/${cssName}`);
    expect(css).toContain("shows-hero__network");
    expect(css).toContain("scaleY(var(--shows-network-scale-y))");
    expect(css).toContain("--shows-network-scale-y:1.3");
    expect(css).toContain("transform-origin:50% 0");
    expect(css).toContain("color:#fff");
    expect(css).toContain("shows-hero__stage");
    expect(css).toContain("shows-hero__crest");
    expect(css).toContain("shows-hero__slot--tl");
    expect(css).toContain("aspect-ratio:1");
    expect(
      css.includes("--shows-sm-scale:.62") || css.includes("--shows-sm-scale:0.62"),
    ).toBe(true);
    // Nav edges: block pad only (inline from .container).
    expect(css).toContain("padding-block:1.75rem 3.75rem");
    expect(css).toContain("padding-block:1.35rem 2.75rem");
    expect(css).toContain("padding-block:2.25rem 4.25rem");
    expect(css).not.toContain("shows-rule-nudge");
    expect(css).not.toContain("shows-hero__brand-left");
    expect(css).not.toContain("shows-hero__col--left");
  });
});

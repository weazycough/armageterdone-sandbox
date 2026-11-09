// Shows hero: equal-size pyramid — slot wrappers; top card = one bottom card,
// centered over pair gap; title + crest centered; nav-width stage.

import { describe, expect, it } from "vite-plus/test";
import { read } from "./dist-files";

const HOME = "index.html";
const SHOWS = "shows/index.html";

describe("Shows hero (equal-size pyramid sketch)", () => {
  it("keeps home unchanged and paints equal pyramid slots + crest", () => {
    const home = read(HOME);
    const shows = read(SHOWS);

    expect(home).toContain("mission-hero__tag");
    expect(home).toContain("canary-cry-key-art");
    expect(home).not.toContain("shows-hero__network");

    expect(shows).toContain('class="mission-hero shows-hero"');
    expect(shows).toContain("mission-hero__floor-grid");
    expect(shows).toContain("shows-hero__stage");
    expect(shows).toContain("shows-hero__brand");
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
    expect(shows).toContain("images/show-joyspiracy.webp");
    expect(shows).not.toContain("shows-hero__tile--contain");
    expect(shows).not.toContain("shows-hero__tile--sm");
    expect(shows).not.toContain("shows-hero__rule");
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
  });

  it("styles equal cards via slot wrappers, cover/contain, nav padding-block", () => {
    const cssName = read(SHOWS).match(/assets\/(root-[^"]+\.css)/)?.[1];
    expect(cssName).toBeTruthy();
    const css = read(`assets/${cssName}`);
    expect(css).toContain("shows-hero__network");
    expect(css).toContain("scaleY(var(--shows-network-scale-y))");
    expect(css).toContain("--shows-network-scale-y:1.3");
    expect(css).toContain("--shows-network-size:clamp(2.85rem, 6.75vw, 6.1rem)");
    expect(css).toContain("transform-origin:50% 0");
    expect(css).toContain("shows-hero__stage");
    expect(css).toContain("shows-hero__crest");
    expect(css).toContain("aspect-ratio:1");
    expect(css).toContain("object-fit:cover");
    expect(css).toContain("object-position:center");
    expect(css).toContain("object-fit:contain");
    expect(css).toContain("padding-block:1.75rem 3.75rem");
    expect(css).toContain("padding-block:1.35rem 2.75rem");
    expect(css).toContain("padding-block:2.25rem 4.25rem");
    // Top tile sized to one card against the 2-col wrapper.
    expect(
      css.includes("width:calc((100% - var(--shows-gap)) / 2)") ||
        css.includes("width:calc((100% - var(--shows-gap))/2)"),
    ).toBe(true);
    expect(css).not.toContain("shows-sm-scale");
    expect(css).not.toContain("--shows-card-w");
  });
});

// Shows hero: Canary Cry SVG wordmark + stretched Bebas NETWORK (left), then
// two centered rows of three network tiles on the shared mission-hero shell.

import { describe, expect, it } from "vite-plus/test";
import { read } from "./dist-files";

const HOME = "index.html";
const SHOWS = "shows/index.html";

describe("Shows hero (wordmark + NETWORK + 2×3 tiles)", () => {
  it("keeps home mission-hero unchanged and paints the new Shows hero", () => {
    const home = read(HOME);
    const shows = read(SHOWS);

    expect(home).toContain("mission-hero__tag");
    expect(home).toContain("canary-cry-key-art");
    expect(home).not.toContain("shows-hero__network");
    expect(home).not.toContain("mission-hero--blank");

    expect(shows).toContain('class="mission-hero shows-hero"');
    expect(shows).toContain("mission-hero__floor-grid");
    expect(shows).toContain("shows-hero__mark");
    expect(shows).toMatch(/<h1 class="shows-hero__network"/);
    expect(shows).toContain("NETWORK");
    // Real CcWordmark path data (not a text substitute).
    expect(shows).toContain("M.02,26.46C.02,11.76");

    expect(shows).toContain("shows-hero__grid");
    expect(shows).toContain("shows-hero__row");
    // Row order labels present.
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
  });

  it("styles NETWORK with Bebas stretch and white mark", () => {
    const cssName = read(SHOWS).match(/assets\/(root-[^"]+\.css)/)?.[1];
    expect(cssName).toBeTruthy();
    const css = read(`assets/${cssName}`);
    expect(css).toMatch(/\.shows-hero__network\{[^}]*scaleY\(1\.4\)/);
    expect(css).toMatch(/\.shows-hero__mark\{[^}]*color:#fff/);
    expect(css).toMatch(/\.shows-hero__row\{[^}]*grid-template-columns:repeat\(3/);
  });
});

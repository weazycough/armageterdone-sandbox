// Shows hero: Canary Cry SVG above yellow rule (left); NETWORK stage-right;
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
    expect(shows).toContain("shows-hero__stage");
    expect(shows).toContain("shows-hero__brand-left");
    expect(shows).toContain("shows-hero__mark");
    expect(shows).toMatch(/<h1 class="shows-hero__network"/);
    expect(shows).toContain("NETWORK");
    expect(shows).toMatch(/ep-wall__rule[^"]*shows-hero__rule|shows-hero__rule[^"]*ep-wall__rule/);
    // Rule precedes NETWORK in DOM (left then right).
    expect(shows.indexOf("shows-hero__rule")).toBeLessThan(shows.indexOf('class="shows-hero__network"'));
    // Mark precedes rule (stacked above the line).
    expect(shows.indexOf("shows-hero__mark")).toBeLessThan(shows.indexOf("shows-hero__rule"));
    // Real CcWordmark path data (not a text substitute).
    expect(shows).toContain("M.02,26.46C.02,11.76");

    expect(shows).toContain("shows-hero__grid");
    expect(shows).toContain("shows-hero__row");
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
  });

  it("styles NETWORK right, rule left fill, mark above rule, shared stage", () => {
    const cssName = read(SHOWS).match(/assets\/(root-[^"]+\.css)/)?.[1];
    expect(cssName).toBeTruthy();
    const css = read(`assets/${cssName}`);
    expect(css).toContain("shows-hero__network");
    expect(css).toContain("scaleY(var(--shows-network-scale-y))");
    expect(css).toContain("transform-origin:100% 0");
    expect(css).toContain("color:#fff");
    expect(css).toContain("grid-template-columns:repeat(3");
    expect(css).toContain("43rem");
    expect(css).toContain("49rem");
    expect(css).toContain("54rem");
    expect(css).toContain("shows-hero__stage");
    expect(css).toContain("shows-hero__brand-left");
    expect(css).toContain("height:5px");
    expect(css).toMatch(/\.ep-wall__rule\{[^}]*background:var\(--accent\)/);
    expect(css).toContain("--shows-network-scale-y:1.3");
    // NETWORK ~15% smaller (85% of prior clamps); scaleY shape kept.
    expect(css).toContain("--shows-network-size:clamp(2.7625rem, 9.35vw, 7.225rem)");
    expect(css).toContain("--shows-network-size:clamp(2.21rem, 11.9vw, 3.57rem)");
    expect(css).toContain("--shows-network-asc:.95");
    expect(css).toContain("--shows-network-desc:.35");
    expect(css).toContain("--shows-rule-nudge:calc(var(--shows-network-size)");
    expect(css).toContain("shows-network-asc");
    // Mark and rule share the same nudge so Canarycry tracks the painted bar.
    expect(css).toContain("translateY(var(--shows-rule-nudge))");
    expect(css).toMatch(/shows-hero__mark-wrap\{[^}]*translateY\(var\(--shows-rule-nudge\)\)/);
  });
});

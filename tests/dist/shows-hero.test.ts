// Shows page: centered hero (wordmark, punch, description, bird — no cards),
// Other Works 2×2, and a Shows-only V4V band. Home is unchanged.

import { describe, expect, it } from "vite-plus/test";
import { read } from "./dist-files";

const HOME = "index.html";
const SHOWS = "shows/index.html";

describe("Shows hero, Other Works, and V4V", () => {
  it("keeps home unchanged and paints a card-free centered hero", () => {
    const home = read(HOME);
    const shows = read(SHOWS);

    expect(home).toContain("mission-hero__tag");
    expect(home).toContain("canary-cry-key-art");
    expect(home).not.toContain("shows-hero__network");
    // Home V4V copy and buttons stay as they are.
    expect(home).toContain("$ Give");
    expect(home).toContain("No advertisers. Just producers");
    expect(home).toContain("Patreon, one-time");
    expect(home).not.toContain("shows-v4v__kicker");

    expect(shows).toContain('class="mission-hero shows-hero"');
    expect(shows).toContain("mission-hero__floor-grid");
    expect(shows).toContain("shows-hero__stage");
    expect(shows).toContain("shows-hero__brand");
    expect(shows).toContain("shows-hero__title-stack");
    expect(shows).toMatch(/<h1 class="shows-hero__network"/);
    expect(shows).toContain("NETWORK");
    expect(shows).toContain("images/cc-bird-v3.webp");
    expect(shows).toContain("shows-hero__crest");
    expect(shows).toContain("M.02,26.46C.02,11.76");

    // No pyramid / show cards in the hero.
    expect(shows).not.toContain("shows-hero__flank");
    expect(shows).not.toContain("shows-hero__center");
    expect(shows).not.toContain("shows-hero__slot--tl");
    expect(shows).not.toContain("shows-hero__slot--tr");
    expect(shows).not.toContain("shows-hero__slot--blo");
    expect(shows).not.toContain("shows-hero__slot--bli");
    expect(shows).not.toContain("shows-hero__slot--bri");
    expect(shows).not.toContain("shows-hero__slot--bro");
    expect(shows).not.toContain("shows-hero__tile");
    expect(shows).not.toContain("https://share.google/dCjcd3aFLkk10RFJX");
    expect(shows).not.toContain("shows-hero__desc");

    for (const label of [
      "The Big Three",
      "Other Works",
      "Canary Cry News Talk",
      "Canary Cry Radio",
      "Canary Cry Clubhouse",
      "The Joyspiracy Theory",
      "Burning Man Research",
      "Basil's Bunker",
      "FaceLikeTheSun",
    ]) {
      expect(shows).toContain(label);
    }
    expect(shows).not.toContain("On the network");
    expect(shows).not.toContain("shows-roster");

    // Desktop pitch block (copy + yellow rule).
    expect(shows).toContain("shows-hero__pitch");
    expect(shows).toContain("shows-hero__pitch-headline");
    expect(shows).toContain("shows-hero__pitch-rule");
    expect(shows).toContain("EVERY SHOW");
    expect(shows).toContain("EVERY PROJECT");
    expect(shows).toContain("Every show, every project");
    expect(shows).toContain("shows-hero__pitch-dot");
    expect(shows).not.toContain("EVERY SHOW. EVERY PROJECT.");
    expect(shows).not.toContain("ONE NETWORK.");
    expect(shows).toContain("A collection of the shows and projects Basil and Gonz");
  });

  it("lays out Other Works as a 2×2 grid with square covers", () => {
    const shows = read(SHOWS);
    expect(shows).toContain("shows-catalog__works");
    expect(shows).not.toContain("show-card--wide");
    expect(shows).toContain("images/show-joyspiracy.webp");
    expect(shows).toContain("content/images/e2f8d5c0-83360211-6a87-d7bf-6741-59b8ca567492.jpg");
    expect(shows).toContain("images/show-basils-bunker.webp");
    expect(shows).toContain("images/show-facelikethesun.webp");
    expect(shows).toContain("FaceLikeTheSun");
    expect(shows).not.toContain("YouTube Channel");
    expect(shows).not.toContain("GonzoShimura.com");
    expect(shows).not.toContain("images/youtube-play.svg");
    expect(shows).not.toContain("images/gonz-headshot.webp");
    expect(shows).not.toContain("images/inhuman-film.webp");
    expect(shows).not.toContain("show-card__links");
  });

  it("restyles the Shows V4V band only, leaving home V4V alone", () => {
    const home = read(HOME);
    const shows = read(SHOWS);

    expect(shows).toContain("shows-v4v__wordmark");
    expect(shows).toContain("images/value4value-wordmark.svg");
    expect(shows).toContain("No advertisers, just producers.");
    expect(shows).toContain("mission-hero__give");
    expect(shows).toContain("mission-hero__patreon");
    expect(shows).toContain('href="/armageterdone-sandbox/support/"');
    expect(shows).toContain("https://www.patreon.com/ccnt");
    expect(shows).not.toContain("$ Give");
    expect(shows).not.toContain("images/v4v-mark.svg");
    expect(shows).not.toContain("Patreon, one-time");

    expect(home).toContain("$ Give");
    expect(home).toContain("mission-hero__v4v-mark");
    expect(home).toContain("Patreon, one-time");
  });

  it("styles a compact centered hero, 2×2 works, and ruled V4V band", () => {
    const cssName = read(SHOWS).match(/assets\/(root-[^"]+\.css)/)?.[1];
    expect(cssName).toBeTruthy();
    const css = read(`assets/${cssName}`);
    expect(css).toContain("shows-hero__network");
    expect(css).toContain("scaleY(var(--shows-network-scale-y))");
    expect(css).toContain("--shows-network-scale-y:1.3");
    expect(css).toContain("--shows-network-size:clamp(3.16rem, 5.5vw, 5.95rem)");
    expect(css).toContain("transform-origin:50% 0");
    expect(css).toContain("shows-hero__stage");
    expect(css).toContain("shows-hero__crest");
    expect(css).toContain("aspect-ratio:1");
    expect(css).toContain("object-fit:contain");
    expect(css).toContain("padding-block:1.75rem 2rem");
    expect(css).toContain("padding-block:1.35rem 1.75rem");
    expect(css).toContain("padding-block:2rem 2.25rem");
    expect(css).not.toContain("shows-hero__flank");
    expect(css).not.toContain("shows-hero__center");
    expect(css).not.toContain("--shows-title-pad-top");
    expect(css).not.toContain("shows-sm-scale");
    expect(css).not.toContain("--shows-card-w");
    expect(css).toContain("shows-hero__pitch");
    expect(css).toContain("shows-hero__pitch-headline");
    expect(css).toContain("shows-hero__pitch-rule");
    expect(css.includes("@media (width>=900px)") || css.includes("@media (min-width: 900px)")).toBe(
      true,
    );
    expect(css).toContain("text-align:center");

    expect(css).toContain("shows-catalog__works");
    expect(css).toContain("shows-v4v__kicker");
    expect(
      css.includes("clamp(1.65rem, 2.4vw, 2.25rem)") ||
        css.includes("clamp(1.65rem,2.4vw,2.25rem)"),
    ).toBe(true);
    expect(
      css.includes("shows-v4v::after") || css.includes("shows-v4v:after"),
    ).toBe(true);
    expect(css).toContain("110% 90% at 50% 120%");
  });
});

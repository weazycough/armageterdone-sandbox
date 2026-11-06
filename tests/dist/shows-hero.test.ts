// Blank Shows hero must share home mission-hero sizing structure (hidden).
// Markup semantics match home (h1/h2/picture>img/ShowsStrip); blank only
// swaps media to data-URI placeholders (no network art).

import { describe, expect, it } from "vite-plus/test";
import { read } from "./dist-files";

const HOME = "index.html";
const SHOWS = "shows/index.html";

const SIZING_MARKERS = [
  "mission-hero__floor-grid",
  "mission-hero__grid",
  "mission-hero__intro",
  "mission-hero__kicker",
  "mission-hero__about",
  "mission-hero__art",
  "mission-hero__tag",
  "mission-hero__shows",
  "shows-strip",
  "show-card",
  "show-card__art",
  "signal-head",
] as const;

describe("Shows blank hero sizing shell", () => {
  it("reuses home mission-hero layout markers while staying blank", () => {
    const home = read(HOME);
    const shows = read(SHOWS);

    expect(shows).toContain('class="mission-hero mission-hero--blank"');
    expect(home).not.toContain("mission-hero--blank");

    for (const marker of SIZING_MARKERS) {
      expect(home, `home missing ${marker}`).toContain(marker);
      expect(shows, `shows missing ${marker}`).toContain(marker);
    }

    // Same heading semantics as home (not div stand-ins).
    expect(shows).toMatch(/<h1 class="mission-hero__tag"/);
    expect(shows).toMatch(/<h2 class="signal-head"/);
    expect(home).toMatch(/<h1 class="mission-hero__tag"/);
    expect(home).toMatch(/<h2 class="signal-head"/);

    // Key art: home loads files; Shows uses transparent SVG data-URI <img> (same box model).
    expect(home).toContain("canary-cry-key-art");
    expect(shows).not.toContain("canary-cry-key-art");
    expect(shows).toContain("data:image/svg+xml");
    expect(shows).toMatch(/<img[^>]*width="900"[^>]*height="1036"/);
    expect(home).toMatch(/<img[^>]*width="900"[^>]*height="1036"/);
    // No aspect-ratio div sizer (that path drifted vs <img>).
    expect(shows).not.toContain("mission-hero__art-sizer");

    // Strip art uses <img width=96 height=96> on both (CSS sizes to 88px) — not span+inline 96.
    expect(shows).toMatch(/show-card__art"[^>]*width="96"[^>]*height="96"/);
    expect(home).toMatch(/show-card__art"[^>]*width="96"[^>]*height="96"/);

    expect(shows).not.toContain("shows-network__tile--news");
    expect(shows).toContain("On the network");
    expect(shows).toMatch(/mission-hero__inner[^>]*\binert\b/);
  });

  it("hides the shared body with visibility:hidden (not rem min-height)", () => {
    const cssName = read(SHOWS).match(/assets\/(root-[^"]+\.css)/)?.[1];
    expect(cssName).toBeTruthy();
    const css = read(`assets/${cssName}`);
    expect(css).toMatch(
      /\.mission-hero--blank\s+\.mission-hero__inner\s*\{[^}]*visibility:\s*hidden/,
    );
    expect(css).not.toContain("28.6875rem");
    expect(css).not.toContain("blank-sizer");
    expect(css).not.toContain("art-sizer");
  });
});

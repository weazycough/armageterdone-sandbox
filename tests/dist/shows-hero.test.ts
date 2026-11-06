// Blank Shows hero must share home mission-hero sizing structure (hidden),
// not a rem min-height shell that drifted under zoom (acfb212 → ~245px vs ~459px).

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

    // Non-loading art sizer on Shows; real key art only on home.
    expect(shows).toContain("mission-hero__art-sizer");
    expect(shows).not.toContain("canary-cry-key-art");
    expect(home).toContain("canary-cry-key-art");
    expect(home).not.toContain("mission-hero__art-sizer");

    // No visible tile wall / old copy in hero.
    expect(shows).not.toContain("shows-network__tile--news");
    expect(shows).toContain("On the network");

    // Inert sizing tree (no accessible duplicate of home hero).
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
  });
});

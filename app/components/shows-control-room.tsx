// shows-control-room.tsx — Shows page hero: blank home mission-hero shell
// (top glow, floor grid, vignette, bottom wash) with no images or copy.
// Height locked to the measured home hero footprint so the empty shell does
// not collapse or balloon.

import type * as React from "react";
import { MissionHeroFloor } from "./mission-hero-floor";

/**
 * Blank Shows hero sharing `.mission-hero` background layers with home.
 * Visible tiles/title/blurb removed; site nav, footer, and roster stay outside.
 */
export function ShowsControlRoom(): React.ReactNode {
  return (
    <section className="mission-hero mission-hero--blank" aria-label="Shows">
      <MissionHeroFloor />
      {/* Invisible spacer keeps the same content-box height as home's hero.
          Text/images stay out of the tree; sizing comes from CSS min-height
          verified against the home desktop baseline (~459px @ 1920×1072). */}
      <div className="mission-hero__blank-sizer" aria-hidden="true" />
      <h1 className="sr-only">Shows</h1>
    </section>
  );
}

// shows-control-room.tsx — Shows page hero: blank home mission-hero shell.
// Same MissionHeroBody tree as home (visibility:hidden) so height is
// content-driven and matches home across breakpoints; no visible copy/images.

import type * as React from "react";
import { MissionHeroBody } from "./mission-hero-body";
import { MissionHeroFloor } from "./mission-hero-floor";

export function ShowsControlRoom(): React.ReactNode {
  return (
    <section className="mission-hero mission-hero--blank" aria-label="Shows">
      <MissionHeroFloor />
      <MissionHeroBody blank />
      <h1 className="sr-only">Shows</h1>
    </section>
  );
}

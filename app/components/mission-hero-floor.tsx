// Shared vapor floor for .mission-hero — keep home and blank Shows in lockstep.
import type * as React from "react";

/** Perspective grid + vignette layers; parent must be `.mission-hero`. */
export function MissionHeroFloor(): React.ReactNode {
  return (
    <div className="mission-hero__floor" aria-hidden="true">
      <div className="mission-hero__floor-grid" />
    </div>
  );
}

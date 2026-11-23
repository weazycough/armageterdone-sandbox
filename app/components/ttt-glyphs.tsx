// ttt-glyphs.tsx — Time / Talent / Treasure marks for the Support model
// cards. Stroke-based, currentColor (cards set the accent), consistent
// weight, sized to pair with the card title.

import type * as React from "react";

const svg = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: false as const,
};

function ticks(): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    const major = i % 3 === 0;
    const r1 = 20;
    const r2 = major ? 15.25 : 17.6;
    nodes.push(
      <line
        key={i}
        x1={32 + r1 * Math.cos(a)}
        y1={32 + r1 * Math.sin(a)}
        x2={32 + r2 * Math.cos(a)}
        y2={32 + r2 * Math.sin(a)}
        strokeWidth={major ? 2 : 1.5}
      />,
    );
  }
  return nodes;
}

/** Analog clock, hands at 10:10. */
export function TimeGlyph({ className }: { className?: string }): React.ReactNode {
  return (
    <svg className={className} {...svg}>
      <circle cx="32" cy="32" r="22.5" />
      <circle cx="32" cy="32" r="19.25" strokeWidth="1.25" opacity="0.55" />
      {ticks()}
      {/* Hour hand (10) */}
      <line x1="32" y1="32" x2="22.47" y2="26.5" strokeWidth="2.25" />
      {/* Minute hand (12) */}
      <line x1="32" y1="32" x2="32" y2="16.5" strokeWidth="2" />
      <circle cx="32" cy="32" r="1.85" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Artist's paintbrush — rounded handle, banded ferrule, pointed tuft. */
export function TalentGlyph({ className }: { className?: string }): React.ReactNode {
  return (
    <svg className={className} {...svg}>
      {/* Handle */}
      <rect x="28.6" y="43.6" width="6.8" height="14.2" rx="3.4" />
      {/* Ferrule */}
      <rect x="27.2" y="35" width="9.6" height="10" rx="1.2" />
      <path d="M27.2 38.2 H36.8" strokeWidth="1.5" />
      <path d="M27.2 41.4 H36.8" strokeWidth="1.5" />
      {/* Bristle tuft */}
      <path d="M27.4 35 C24.8 26.8, 24.2 19.2, 32 10.6 C39.8 19.2, 39.2 26.8, 36.6 35 Z" />
      <path d="M32 15.6 C30.4 22, 29.8 27.4, 29.8 33.2" strokeWidth="1.5" />
      <path d="M32 15.6 C33.6 22, 34.2 27.4, 34.2 33.2" strokeWidth="1.5" />
    </svg>
  );
}

/** Coin with a dollar sign, double rim like a minted piece. */
export function TreasureGlyph({ className }: { className?: string }): React.ReactNode {
  return (
    <svg className={className} {...svg}>
      <circle cx="32" cy="32" r="22.5" />
      <circle cx="32" cy="32" r="18.75" strokeWidth="1.5" />
      <path d="M41 23.2 C40.6 18.4, 23.8 18.2, 23.8 25 C23.8 30.4, 40.2 30.6, 40.2 37.6 C40.2 44.8, 23.4 44.2, 23.4 39.2" />
      <path d="M32 16.75 V47.25" />
    </svg>
  );
}

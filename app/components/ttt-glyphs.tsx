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

/** Artist's paintbrush — diagonal, slim handle, banded ferrule, pointed tuft. */
export function TalentGlyph({ className }: { className?: string }): React.ReactNode {
  return (
    <svg className={className} {...svg}>
      <g transform="rotate(42 32 32)">
        {/* Long slim handle, open at the ferrule, rounded butt */}
        <path d="M30.4 33.2 V54.4 A1.6 1.6 0 0 0 33.6 54.4 V33.2" strokeLinecap="butt" />
        {/* Metal ferrule with two crimp rings */}
        <rect x="28.15" y="22.2" width="7.7" height="11" rx="0.7" />
        <path d="M28.15 25.4 H35.85" strokeWidth="1.5" />
        <path d="M28.15 29.8 H35.85" strokeWidth="1.5" />
        {/* Bristle tuft tapering to a point */}
        <path d="M28.15 22.2 L32 10.2 L35.85 22.2" strokeLinejoin="miter" />
        <path d="M32 21.2 V13.6" strokeWidth="1.5" />
        <path d="M30.3 21.4 L31.15 15.4" strokeWidth="1.25" />
        <path d="M33.7 21.4 L32.85 15.4" strokeWidth="1.25" />
      </g>
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

// ttt-glyphs.tsx — Time / Talent / Treasure marks for the Support model
// cards. Stroke-based, currentColor (cards set the accent), consistent
// weight, sized for a ~3rem slot.

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

/** Ornate framed painting — stepped molding, corner rosettes, a landscape. */
export function TalentGlyph({ className }: { className?: string }): React.ReactNode {
  return (
    <svg className={className} {...svg}>
      {/* Gallery nail and hanging wire */}
      <circle cx="32" cy="6.25" r="1.35" fill="currentColor" stroke="none" />
      <path d="M32 6.25 L16.5 14.25" strokeWidth="1.5" />
      <path d="M32 6.25 L47.5 14.25" strokeWidth="1.5" />
      {/* Stepped frame */}
      <rect x="10" y="14.25" width="44" height="43.5" rx="1.25" />
      <rect x="13.75" y="18" width="36.5" height="36" rx="0.75" strokeWidth="1.5" />
      <rect x="17.25" y="21.5" width="29.5" height="29" rx="0.5" strokeWidth="1.35" />
      {/* Corner rosettes on the mid molding */}
      <path d="M13.75 18 L16.35 15.4 L18.95 18 L16.35 20.6 Z" fill="currentColor" stroke="none" />
      <path d="M45.05 18 L47.65 15.4 L50.25 18 L47.65 20.6 Z" fill="currentColor" stroke="none" />
      <path d="M13.75 54 L16.35 51.4 L18.95 54 L16.35 56.6 Z" fill="currentColor" stroke="none" />
      <path d="M45.05 54 L47.65 51.4 L50.25 54 L47.65 56.6 Z" fill="currentColor" stroke="none" />
      {/* Landscape on the canvas */}
      <circle cx="39.25" cy="29.5" r="3" strokeWidth="1.5" />
      <path
        d="M18.75 42 C23.25 36.75, 27.25 38.5, 32 34 C36.25 39.25, 42.5 37, 45.25 42.75 V48.25 H18.75 Z"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Front-facing treasure chest with a banded lid, straps, lock, and feet. */
export function TreasureGlyph({ className }: { className?: string }): React.ReactNode {
  return (
    <svg className={className} {...svg}>
      {/* Lid dome + lip */}
      <path d="M16.5 29 C16.5 18.25, 47.5 18.25, 47.5 29" />
      <path d="M20 29 C20 22, 44 22, 44 29" strokeWidth="1.4" opacity="0.7" />
      <line x1="14.5" y1="29" x2="49.5" y2="29" />
      {/* Body */}
      <path d="M14.5 29 H49.5 V47.75 C49.5 49.75, 47.75 51.25, 45.75 51.25 H18.25 C16.25 51.25, 14.5 49.75, 14.5 47.75 Z" />
      {/* Horizontal band */}
      <path d="M14.5 37.75 H49.5" strokeWidth="1.5" />
      <path d="M14.5 41.75 H49.5" strokeWidth="1.5" />
      {/* Straps */}
      <path d="M22.25 20.25 V51.25" strokeWidth="1.5" />
      <path d="M41.75 20.25 V51.25" strokeWidth="1.5" />
      {/* Lock plate */}
      <rect x="28.25" y="35.75" width="7.5" height="9.5" rx="1.1" />
      <circle cx="32" cy="39.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M32 39.5 V42.75" strokeWidth="1.5" />
      {/* Feet */}
      <path d="M18.5 51.25 V55.5 H23" />
      <path d="M45.5 51.25 V55.5 H41" />
    </svg>
  );
}

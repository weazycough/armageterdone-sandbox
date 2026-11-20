// site-search.tsx — the header's search button, a link to the dedicated
// /search/ page (replacing the old overlay dialog).

import type * as React from "react";
import { NavLink } from "react-router";

function SearchIcon(): React.ReactNode {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function SiteSearch(): React.ReactNode {
  return (
    <NavLink to="/search/" className="theme-toggle search-toggle" aria-label="Search the show" end>
      <SearchIcon />
    </NavLink>
  );
}

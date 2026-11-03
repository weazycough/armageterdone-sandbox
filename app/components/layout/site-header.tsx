// site-header.tsx — the latest-episode ticker, brand, primary nav, theme
// toggle, search and the mobile drawer (Ghost default.hbs).

import { useState } from "react";
import type * as React from "react";
import { Link } from "react-router";
import { episodePath } from "../../lib/paths";
import { formatShortDate } from "../../lib/dates";
import { MainNav } from "./main-nav";
import { SiteSearch } from "./site-search";
import { ThemeToggle } from "./theme-toggle";
import { CcWordmark } from "../cc-wordmark";

export interface LatestEpisode {
  slug: string;
  title: string;
  published: string;
}

function Ticker({ latest }: { latest: LatestEpisode }): React.ReactNode {
  const to = episodePath(latest.slug);
  return (
    <div className="ticker" aria-label="Latest episode">
      <div className="ticker__row">
        <span>📡 New episode</span>
        <span className="ticker__sep">·</span>
        <Link className="ticker__title" to={to}>
          {latest.title}
        </Link>
        {/* The rest scrolls past on wider screens; phones show the line above. */}
        <span className="ticker__extra">
          <span className="ticker__sep">·</span>
          <span>{formatShortDate(latest.published)}</span>
          <span className="ticker__sep">·</span>
          <Link to="/episodes/">All episodes →</Link>
          <span className="ticker__sep">·</span>
          <span>Cogitare extra caveam</span>
          <span className="ticker__sep">·</span>
          <span>📡 New episode</span>
          <span className="ticker__sep">·</span>
          <Link to={to} tabIndex={-1}>
            {latest.title}
          </Link>
        </span>
      </div>
    </div>
  );
}

export function SiteBrand({ className }: { className?: string }): React.ReactNode {
  const classes = ["site-brand", className].filter(Boolean).join(" ");
  return (
    <Link className={classes} to="/">
      <CcWordmark className="site-brand__mark" />
    </Link>
  );
}

export function SiteHeader({ latest }: { latest: LatestEpisode | null }): React.ReactNode {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      {latest !== null && <Ticker latest={latest} />}
      <header className="site-header">
        <div className="container site-header__inner">
          <SiteBrand />
          <nav className="site-nav" aria-label="Primary">
            <MainNav />
          </nav>
          <div className="site-tools">
            <SiteSearch />
            <ThemeToggle />
            <button
              className="nav-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
            >
              Menu
            </button>
          </div>
        </div>
        <nav
          id="mobile-nav"
          className={menuOpen ? "mobile-nav is-open" : "mobile-nav"}
          aria-label="Mobile"
        >
          <MainNav
            onNavigate={() => {
              setMenuOpen(false);
            }}
          />
        </nav>
      </header>
    </>
  );
}

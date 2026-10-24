// site-header.tsx — the latest-episode ticker, brand, primary nav, theme
// toggle and the mobile drawer (Ghost default.hbs). The Ghost search button is
// left out until the site has its own search.

import { useState } from "react";
import type * as React from "react";
import { Link } from "react-router";
import { asset } from "../../lib/asset";
import { episodePath } from "../../lib/paths";
import { formatShortDate } from "../../lib/dates";
import { MainNav } from "./main-nav";
import { ThemeToggle } from "./theme-toggle";

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
        <Link to={to}>{latest.title}</Link>
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
      </div>
    </div>
  );
}

export function SiteBrand(): React.ReactNode {
  return (
    <Link className="site-brand" to="/">
      <img
        className="site-brand__crest"
        src={asset("images/cc-logo.webp")}
        alt=""
        width="40"
        height="40"
      />
      <span className="site-brand__name site-brand__name--short">Canary Cry</span>
      <span className="site-brand__name site-brand__name--long">Canary Cry Network</span>
      <span className="site-brand__small">— Cogitare extra caveam</span>
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

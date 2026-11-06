// shows-control-room.tsx — Shows page hero on the shared home mission-hero
// background: left-aligned Canary Cry wordmark + stretched Bebas NETWORK,
// then two centered rows of three network show tiles.

import type * as React from "react";
import type { NetworkShowTile } from "../lib/network-latest.server";
import { asset } from "../lib/asset";
import { episodePath } from "../lib/paths";
import { CcWordmark } from "./cc-wordmark";
import { MissionHeroFloor } from "./mission-hero-floor";
import { SmartLink } from "./smart-link";

/** Row 1 then row 2 — matches user order; remaining = joyspiracy / burn / bunker. */
export const SHOWS_HERO_ROWS = [
  ["news-talk", "radio", "clubhouse"],
  ["joyspiracy", "burning-man-research", "basils-bunker"],
] as const;

function tileHref(show: NetworkShowTile): string | null {
  if (show.href) return show.href;
  if (show.latest?.slug) return episodePath(show.latest.slug);
  if (show.latest?.externalUrl) return show.latest.externalUrl;
  return null;
}

function ShowTile({ show }: { show: NetworkShowTile }): React.ReactNode {
  const href = tileHref(show);
  // Prefer live latest thumb; fall back to roster art via asset() (public/).
  const artSrc = show.latest?.artUrl ?? (show.art ? asset(show.art) : null);

  const body = (
    <>
      <span className="shows-hero__frame">
        {artSrc ? (
          <img
            src={artSrc}
            alt=""
            width={320}
            height={200}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="shows-hero__missing">Art coming soon</span>
        )}
      </span>
      <span className="shows-hero__label">{show.title}</span>
    </>
  );

  if (href === null) {
    return (
      <span
        className="shows-hero__tile shows-hero__tile--soon"
        aria-label={`${show.title}: destination to come`}
      >
        {body}
      </span>
    );
  }

  return (
    <SmartLink
      className="shows-hero__tile"
      href={href}
      title={show.latest?.title ?? show.title}
    >
      {body}
    </SmartLink>
  );
}

export function ShowsControlRoom({ tiles }: { tiles: NetworkShowTile[] }): React.ReactNode {
  const bySlug = Object.fromEntries(tiles.map((t) => [t.slug, t]));

  for (const row of SHOWS_HERO_ROWS) {
    for (const slug of row) {
      if (!bySlug[slug]) throw new Error(`ShowsControlRoom: missing tile ${slug}`);
    }
  }

  return (
    <section className="mission-hero shows-hero" aria-label="Canary Cry Network shows">
      <MissionHeroFloor />
      <div className="container mission-hero__inner shows-hero__inner">
        {/* Shared centered stage: title left edge == grid left edge; width drives both. */}
        <div className="shows-hero__stage">
          <header className="shows-hero__brand">
            {/* Left: mark just above rule; right: NETWORK. Rule fills leftover width. */}
            <div className="shows-hero__brand-left">
              <span className="shows-hero__mark-wrap" aria-hidden="true">
                <CcWordmark className="shows-hero__mark" />
              </span>
              {/* Exact home Recent Episodes header rule (ep-wall__rule). */}
              <span className="ep-wall__rule shows-hero__rule" aria-hidden="true" />
            </div>
            <h1 className="shows-hero__network">
              <span className="sr-only">Canary Cry </span>
              NETWORK
            </h1>
          </header>

          <div className="shows-hero__grid" aria-label="Network shows">
            {SHOWS_HERO_ROWS.map((row) => (
              <div className="shows-hero__row" key={row.join("-")}>
                {row.map((slug) => {
                  const show = bySlug[slug];
                  if (!show) throw new Error(`ShowsControlRoom: missing tile ${slug}`);
                  return <ShowTile key={slug} show={show} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Shared mission-hero content tree for home (visible) and blank Shows
// (visibility:hidden sizing shell). Same classes/paddings/ratios so height
// stays content-driven and cannot drift from a separate rem min-height.

import type * as React from "react";
import { Link } from "react-router";
import { ShowsStrip } from "./shows-strip";
import { asset } from "../lib/asset";
import { SHOWS } from "../lib/shows";
import { episodePath } from "../lib/paths";

const KEY_ART_W = 900;
const KEY_ART_H = 1036;

const KICKER = (
  <>
    Your news
    <br className="br-d" /> and biblical
    <br className="br-m" /> views
    <br className="br-d" /> on world events
  </>
);

const ABOUT =
  "Canary Cry NewsTalk is a show that brings frequent updates on news and events happening around the world from an Alt. Christian worldview, hosted by us, Basil and Gonz of the Canary Cry Radio podcast.";

/** Home-strip art paths (same as ShowsStrip) — blank mode uses sized boxes only. */
const STRIP_ART_RATIO = 1; // 96×96 square placeholders match show-card__art box

export type MissionHeroBodyProps = {
  /** When true: inert sizing shell — no image loads, not accessible, hidden. */
  blank?: boolean;
  /** Home only: latest episode slug for the CTA (omit row if null/undefined). */
  latestSlug?: string | null;
};

/**
 * Exact home hero content structure. Home renders visible; Shows wraps with
 * `.mission-hero--blank` so this tree sizes the section while staying invisible.
 */
export function MissionHeroBody({
  blank = false,
  latestSlug = null,
}: MissionHeroBodyProps): React.ReactNode {
  const showLatest = blank || Boolean(latestSlug);

  return (
    <div
      className="container mission-hero__inner"
      {...(blank
        ? { "aria-hidden": true as const, inert: true }
        : {})}
    >
      <div className="mission-hero__grid">
        <div className="mission-hero__intro">
          <p className="mission-hero__kicker">{KICKER}</p>
          <span className="mission-hero__bar" aria-hidden="true" />
          <p className="mission-hero__about">{ABOUT}</p>
          <span className="mission-hero__bar" aria-hidden="true" />
          {showLatest ? (
            <div className="mission-hero__latest-row">
              <span className="mission-hero__latest-bar" aria-hidden="true" />
              {blank || !latestSlug ? (
                <span className="mission-hero__latest">Latest Episode</span>
              ) : (
                <Link className="mission-hero__latest" to={episodePath(latestSlug)}>
                  Latest Episode
                </Link>
              )}
              <span className="mission-hero__latest-bar" aria-hidden="true" />
            </div>
          ) : null}
        </div>

        <figure className="mission-hero__art">
          {blank ? (
            // Non-loading ratio box — same 900×1036 as key art; inherits art max sizes.
            <div
              className="mission-hero__art-sizer"
              style={{ aspectRatio: `${KEY_ART_W} / ${KEY_ART_H}`, width: "100%" }}
            />
          ) : (
            <picture>
              <source srcSet={asset("images/canary-cry-key-art.webp")} type="image/webp" />
              <img
                src={asset("images/canary-cry-key-art.png")}
                alt="Canary Cry sticker poster of hosts Basil and Gonz with a cat, UFO, and show symbols"
                width={KEY_ART_W}
                height={KEY_ART_H}
              />
            </picture>
          )}
        </figure>

        {blank ? (
          <div className="mission-hero__tag">
            <span>Think</span>
            <span>Outside</span>
            <span>The Cage</span>
          </div>
        ) : (
          <h1 className="mission-hero__tag">
            <span className="sr-only">Canary Cry: </span>
            <span>Think</span>
            <span>Outside</span>
            <span>The Cage</span>
          </h1>
        )}
      </div>

      <div className="mission-hero__shows">
        <div className="section__head">
          {blank ? (
            <div className="signal-head">
              <span className="signal-head__line">Three shows,</span>
              <span className="signal-head__line">
                One signal
                <svg className="signal-head__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="5" cy="19" r="2.2" fill="currentColor" />
                  <path
                    d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          ) : (
            <h2 className="signal-head">
              <span className="signal-head__line">Three shows,</span>
              <span className="signal-head__line">
                One signal
                <svg className="signal-head__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="5" cy="19" r="2.2" fill="currentColor" />
                  <path
                    d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          )}
        </div>

        {blank ? <BlankShowsStrip /> : <ShowsStrip />}
        <hr className="signal-rule" />
      </div>
    </div>
  );
}

/** Same strip geometry as ShowsStrip without fetching art/logos. */
function BlankShowsStrip(): React.ReactNode {
  return (
    <div className="shows-strip">
      {SHOWS.map((s) => (
        <div className="show-card" key={s.slug}>
          <span
            className="show-card__logo"
            style={{ aspectRatio: `${s.logoSize[0]} / ${s.logoSize[1]}` }}
          />
          <span
            className="show-card__art"
            style={{ aspectRatio: `${STRIP_ART_RATIO}`, width: 96, height: 96 }}
          />
          <div className="show-card__body">
            <span className="show-card__kicker">{s.kicker}</span>
            <p className="show-card__desc">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

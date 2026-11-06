// Shared mission-hero content tree for home (visible) and blank Shows
// (visibility:hidden sizing shell). Markup semantics match home exactly;
// blank only swaps media to non-network placeholders so geometry cannot drift.

import type * as React from "react";
import { Link } from "react-router";
import { ShowsStrip } from "./shows-strip";
import { asset } from "../lib/asset";
import { episodePath } from "../lib/paths";

const KEY_ART_W = 900;
const KEY_ART_H = 1036;

/** Transparent SVG matching key-art intrinsic ratio — <img> box model, no network. */
const KEY_ART_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${KEY_ART_W}" height="${KEY_ART_H}"/>`,
  );

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

export type MissionHeroBodyProps = {
  /** When true: inert sizing shell — placeholders instead of network images. */
  blank?: boolean;
  /** Home only: latest episode slug for the CTA (omit row if null/undefined). */
  latestSlug?: string | null;
};

export function MissionHeroBody({
  blank = false,
  latestSlug = null,
}: MissionHeroBodyProps): React.ReactNode {
  const showLatest = blank || Boolean(latestSlug);

  return (
    <div
      className="container mission-hero__inner"
      {...(blank ? { "aria-hidden": true as const, inert: true } : {})}
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
                <a className="mission-hero__latest" aria-hidden="true" tabIndex={-1}>
                  Latest Episode
                </a>
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
            <picture>
              <img
                src={KEY_ART_PLACEHOLDER}
                alt=""
                width={KEY_ART_W}
                height={KEY_ART_H}
                decoding="async"
              />
            </picture>
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

        <h1 className="mission-hero__tag">
          <span className="sr-only">Canary Cry: </span>
          <span>Think</span>
          <span>Outside</span>
          <span>The Cage</span>
        </h1>
      </div>

      <div className="mission-hero__shows">
        <div className="section__head">
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
        </div>

        <ShowsStrip blank={blank} />
        <hr className="signal-rule" />
      </div>
    </div>
  );
}

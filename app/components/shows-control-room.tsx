// shows-control-room.tsx — Shows hero on shared mission-hero background.
// Two-row symmetric sketch: small top cards over the inner big cards,
// centered Canary Cry / NETWORK above bannerless bird crest, four big
// cards in the bottom row. Stage width = nav .container content box.

import type * as React from "react";
import type { NetworkShowTile } from "../lib/network-latest.server";
import { asset } from "../lib/asset";
import { episodePath } from "../lib/paths";
import { CcWordmark } from "./cc-wordmark";
import { MissionHeroFloor } from "./mission-hero-floor";
import { SmartLink } from "./smart-link";

/** Sketch slots (desktop). */
export const SHOWS_HERO_SLOTS = {
  topLeft: "news-talk",
  bottomLeftOuter: "radio",
  bottomLeftInner: "clubhouse",
  topRight: "burning-man-research",
  bottomRightInner: "joyspiracy",
  bottomRightOuter: "basils-bunker",
} as const;

/** Flat order for mobile 2-up + validation. */
export const SHOWS_HERO_ORDER = [
  SHOWS_HERO_SLOTS.topLeft,
  SHOWS_HERO_SLOTS.topRight,
  SHOWS_HERO_SLOTS.bottomLeftOuter,
  SHOWS_HERO_SLOTS.bottomLeftInner,
  SHOWS_HERO_SLOTS.bottomRightInner,
  SHOWS_HERO_SLOTS.bottomRightOuter,
] as const;

/** @deprecated prior API; maps to left/right stacks for any leftover import. */
export const SHOWS_HERO_LEFT = [
  SHOWS_HERO_SLOTS.topLeft,
  SHOWS_HERO_SLOTS.bottomLeftOuter,
  SHOWS_HERO_SLOTS.bottomLeftInner,
] as const;
export const SHOWS_HERO_RIGHT = [
  SHOWS_HERO_SLOTS.topRight,
  SHOWS_HERO_SLOTS.bottomRightInner,
  SHOWS_HERO_SLOTS.bottomRightOuter,
] as const;
export const SHOWS_HERO_ROWS = [SHOWS_HERO_LEFT, SHOWS_HERO_RIGHT] as const;

function tileHref(show: NetworkShowTile): string | null {
  if (show.href) return show.href;
  if (show.latest?.slug) return episodePath(show.latest.slug);
  if (show.latest?.externalUrl) return show.latest.externalUrl;
  return null;
}

function ShowTile({
  show,
  size,
  slot,
}: {
  show: NetworkShowTile;
  size: "sm" | "lg";
  slot: string;
}): React.ReactNode {
  const href = tileHref(show);
  const artSrc = show.latest?.artUrl ?? (show.art ? asset(show.art) : null);
  const className = `shows-hero__tile shows-hero__tile--${size} ${slot}`;

  const body = (
    <>
      <span className="shows-hero__frame">
        {artSrc ? (
          <img
            src={artSrc}
            alt=""
            width={size === "lg" ? 320 : 200}
            height={size === "lg" ? 320 : 200}
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
      <span className={`${className} shows-hero__tile--soon`} aria-label={`${show.title}: destination to come`}>
        {body}
      </span>
    );
  }

  return (
    <SmartLink className={className} href={href} title={show.latest?.title ?? show.title}>
      {body}
    </SmartLink>
  );
}

export function ShowsControlRoom({ tiles }: { tiles: NetworkShowTile[] }): React.ReactNode {
  const bySlug = Object.fromEntries(tiles.map((t) => [t.slug, t]));

  function must(slug: string): NetworkShowTile {
    const show = bySlug[slug];
    if (!show) throw new Error(`ShowsControlRoom: missing tile ${slug}`);
    return show;
  }

  const S = SHOWS_HERO_SLOTS;

  return (
    <section className="mission-hero shows-hero" aria-label="Canary Cry Network shows">
      <MissionHeroFloor />
      <div className="container mission-hero__inner shows-hero__inner">
        {/* Content box inherits .container inline pad = nav logo→edge. */}
        <div className="shows-hero__stage">
          <ShowTile show={must(S.topLeft)} size="sm" slot="shows-hero__slot--tl" />
          <header className="shows-hero__brand">
            <span className="shows-hero__mark-wrap" aria-hidden="true">
              <CcWordmark className="shows-hero__mark" />
            </span>
            <h1 className="shows-hero__network">
              <span className="sr-only">Canary Cry </span>
              NETWORK
            </h1>
          </header>
          <ShowTile show={must(S.topRight)} size="sm" slot="shows-hero__slot--tr" />

          <ShowTile show={must(S.bottomLeftOuter)} size="lg" slot="shows-hero__slot--blo" />
          <ShowTile show={must(S.bottomLeftInner)} size="lg" slot="shows-hero__slot--bli" />
          <img
            className="shows-hero__crest"
            src={asset("images/cc-bird-crest.webp")}
            alt=""
            width={640}
            height={640}
            decoding="async"
            aria-hidden="true"
          />
          <ShowTile show={must(S.bottomRightInner)} size="lg" slot="shows-hero__slot--bri" />
          <ShowTile show={must(S.bottomRightOuter)} size="lg" slot="shows-hero__slot--bro" />
        </div>
      </div>
    </section>
  );
}

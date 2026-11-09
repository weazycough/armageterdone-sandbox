// shows-control-room.tsx — Shows hero on shared mission-hero background.
// Symmetric pyramids: each top card (same size as the rest) is centered over
// the gap between its side's two bottom cards. Title centered above; bannerless
// crest between the bottom pairs. Stage = nav .container content box.

import type * as React from "react";
import type { NetworkShowTile } from "../lib/network-latest.server";
import { asset } from "../lib/asset";
import { episodePath } from "../lib/paths";
import { CcWordmark } from "./cc-wordmark";
import { MissionHeroFloor } from "./mission-hero-floor";
import { SmartLink } from "./smart-link";

/** Sketch slots (desktop pyramids). */
export const SHOWS_HERO_SLOTS = {
  topLeft: "news-talk",
  bottomLeftOuter: "radio",
  bottomLeftInner: "clubhouse",
  topRight: "burning-man-research",
  bottomRightInner: "joyspiracy",
  bottomRightOuter: "basils-bunker",
} as const;

export const SHOWS_HERO_ORDER = [
  SHOWS_HERO_SLOTS.topLeft,
  SHOWS_HERO_SLOTS.topRight,
  SHOWS_HERO_SLOTS.bottomLeftOuter,
  SHOWS_HERO_SLOTS.bottomLeftInner,
  SHOWS_HERO_SLOTS.bottomRightInner,
  SHOWS_HERO_SLOTS.bottomRightOuter,
] as const;

/** @deprecated prior API. */
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

/** Wide / text-heavy thumbs that look better letterboxed than center-cropped. */
const FIT_CONTAIN = new Set(["joyspiracy"]);

function tileHref(show: NetworkShowTile): string | null {
  if (show.href) return show.href;
  if (show.latest?.slug) return episodePath(show.latest.slug);
  if (show.latest?.externalUrl) return show.latest.externalUrl;
  return null;
}

function ShowTile({
  show,
  slot,
}: {
  show: NetworkShowTile;
  slot: string;
}): React.ReactNode {
  const href = tileHref(show);
  const artSrc = show.latest?.artUrl ?? (show.art ? asset(show.art) : null);
  const fit = FIT_CONTAIN.has(show.slug) ? "shows-hero__tile--contain" : "";
  const className = ["shows-hero__tile", slot, fit].filter(Boolean).join(" ");

  const body = (
    <>
      <span className="shows-hero__frame">
        {artSrc ? (
          <img
            src={artSrc}
            alt=""
            width={320}
            height={320}
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
        <div className="shows-hero__stage">
          {/* Top cards span their pair columns and center over the gap. */}
          <ShowTile show={must(S.topLeft)} slot="shows-hero__slot--tl" />
          <header className="shows-hero__brand">
            <span className="shows-hero__mark-wrap" aria-hidden="true">
              <CcWordmark className="shows-hero__mark" />
            </span>
            <h1 className="shows-hero__network">
              <span className="sr-only">Canary Cry </span>
              NETWORK
            </h1>
          </header>
          <ShowTile show={must(S.topRight)} slot="shows-hero__slot--tr" />

          <ShowTile show={must(S.bottomLeftOuter)} slot="shows-hero__slot--blo" />
          <ShowTile show={must(S.bottomLeftInner)} slot="shows-hero__slot--bli" />
          <img
            className="shows-hero__crest"
            src={asset("images/cc-bird-crest.webp")}
            alt=""
            width={640}
            height={640}
            decoding="async"
            aria-hidden="true"
          />
          <ShowTile show={must(S.bottomRightInner)} slot="shows-hero__slot--bri" />
          <ShowTile show={must(S.bottomRightOuter)} slot="shows-hero__slot--bro" />
        </div>
      </div>
    </section>
  );
}

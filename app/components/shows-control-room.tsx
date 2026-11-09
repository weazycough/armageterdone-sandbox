// shows-control-room.tsx — Shows hero on shared mission-hero background.
// Equal-size pyramid: each top card is the same pixel size as the bottom
// cards and centered over its side's bottom-pair gap (slot wrappers make the
// width calc resolve against the 2-col span). Title centered in the top row;
// bannerless crest between bottom pairs. Stage = nav .container content box.

import type * as React from "react";
import type { NetworkShowTile } from "../lib/network-latest.server";
import { asset } from "../lib/asset";
import { episodePath } from "../lib/paths";
import { CcWordmark } from "./cc-wordmark";
import { MissionHeroFloor } from "./mission-hero-floor";
import { SmartLink } from "./smart-link";

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

function ShowTile({ show }: { show: NetworkShowTile }): React.ReactNode {
  const href = tileHref(show);
  // Joyspiracy uses dedicated square cover art; other shows keep latest thumbs.
  const artSrc =
    show.slug === "joyspiracy" && show.art
      ? asset(show.art)
      : show.latest?.artUrl ?? (show.art ? asset(show.art) : null);
  const className = "shows-hero__tile";

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
          {/* Wrappers own grid-area; top wrappers span the pair so card width
              calc((100% - gap) / 2) resolves against the 2-col span (= 1 card). */}
          <div className="shows-hero__slot shows-hero__slot--tl">
            <ShowTile show={must(S.topLeft)} />
          </div>
          <header className="shows-hero__brand">
            <span className="shows-hero__mark-wrap" aria-hidden="true">
              <CcWordmark className="shows-hero__mark" />
            </span>
            <h1 className="shows-hero__network">
              <span className="sr-only">Canary Cry </span>
              NETWORK
            </h1>
          </header>
          <div className="shows-hero__slot shows-hero__slot--tr">
            <ShowTile show={must(S.topRight)} />
          </div>

          <div className="shows-hero__slot shows-hero__slot--blo">
            <ShowTile show={must(S.bottomLeftOuter)} />
          </div>
          <div className="shows-hero__slot shows-hero__slot--bli">
            <ShowTile show={must(S.bottomLeftInner)} />
          </div>
          <img
            className="shows-hero__crest"
            src={asset("images/cc-bird-crest.webp")}
            alt=""
            width={640}
            height={640}
            decoding="async"
            aria-hidden="true"
          />
          <div className="shows-hero__slot shows-hero__slot--bri">
            <ShowTile show={must(S.bottomRightInner)} />
          </div>
          <div className="shows-hero__slot shows-hero__slot--bro">
            <ShowTile show={must(S.bottomRightOuter)} />
          </div>
        </div>
      </div>
    </section>
  );
}

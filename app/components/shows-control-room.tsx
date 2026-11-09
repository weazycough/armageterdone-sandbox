// shows-control-room.tsx — Shows page hero on the shared home mission-hero
// background: three columns — left show stack, centered Canary Cry / NETWORK
// + bird crest (no News Talk banner), right show stack. Width matches nav
// .container edges (--max-w).

import type * as React from "react";
import type { NetworkShowTile } from "../lib/network-latest.server";
import { asset } from "../lib/asset";
import { episodePath } from "../lib/paths";
import { CcWordmark } from "./cc-wordmark";
import { MissionHeroFloor } from "./mission-hero-floor";
import { SmartLink } from "./smart-link";

/** Left column top→bottom (sketch). */
export const SHOWS_HERO_LEFT = ["news-talk", "radio", "clubhouse"] as const;
/** Right column top→bottom (sketch). */
export const SHOWS_HERO_RIGHT = [
  "joyspiracy",
  "burning-man-research",
  "basils-bunker",
] as const;

/** @deprecated kept for any import that still expects rows; prefer LEFT/RIGHT. */
export const SHOWS_HERO_ROWS = [SHOWS_HERO_LEFT, SHOWS_HERO_RIGHT] as const;

function tileHref(show: NetworkShowTile): string | null {
  if (show.href) return show.href;
  if (show.latest?.slug) return episodePath(show.latest.slug);
  if (show.latest?.externalUrl) return show.latest.externalUrl;
  return null;
}

function ShowTile({ show }: { show: NetworkShowTile }): React.ReactNode {
  const href = tileHref(show);
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

function TileColumn({
  slugs,
  bySlug,
  side,
}: {
  slugs: readonly string[];
  bySlug: Record<string, NetworkShowTile>;
  side: "left" | "right";
}): React.ReactNode {
  return (
    <div
      className={`shows-hero__col shows-hero__col--${side}`}
      aria-label={side === "left" ? "Shows column left" : "Shows column right"}
    >
      {slugs.map((slug) => {
        const show = bySlug[slug];
        if (!show) throw new Error(`ShowsControlRoom: missing tile ${slug}`);
        return <ShowTile key={slug} show={show} />;
      })}
    </div>
  );
}

export function ShowsControlRoom({ tiles }: { tiles: NetworkShowTile[] }): React.ReactNode {
  const bySlug = Object.fromEntries(tiles.map((t) => [t.slug, t]));

  for (const slug of [...SHOWS_HERO_LEFT, ...SHOWS_HERO_RIGHT]) {
    if (!bySlug[slug]) throw new Error(`ShowsControlRoom: missing tile ${slug}`);
  }

  return (
    <section className="mission-hero shows-hero" aria-label="Canary Cry Network shows">
      <MissionHeroFloor />
      <div className="container mission-hero__inner shows-hero__inner">
        {/* Full container width = nav content edges (--max-w + container pad). */}
        <div className="shows-hero__stage">
          <TileColumn slugs={SHOWS_HERO_LEFT} bySlug={bySlug} side="left" />

          <div className="shows-hero__center">
            <header className="shows-hero__brand">
              <span className="shows-hero__mark-wrap" aria-hidden="true">
                <CcWordmark className="shows-hero__mark" />
              </span>
              <h1 className="shows-hero__network">
                <span className="sr-only">Canary Cry </span>
                NETWORK
              </h1>
            </header>
            {/* Crest from public/images/cc-logo.webp with NEWSTALK banner removed. */}
            <img
              className="shows-hero__crest"
              src={asset("images/cc-bird-crest.webp")}
              alt=""
              width={640}
              height={640}
              decoding="async"
              aria-hidden="true"
            />
          </div>

          <TileColumn slugs={SHOWS_HERO_RIGHT} bySlug={bySlug} side="right" />
        </div>
      </div>
    </section>
  );
}

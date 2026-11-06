// shows-control-room.tsx — Shows page hero: blue perspective grid with an
// integrated 4×2 landscape board — News Talk | title (2 cols) | Radio on top;
// Joyspiracy | Burning Man | Bunker | Clubhouse below. Thumbs from build feeds.

import type * as React from "react";
import type { NetworkShowTile } from "../lib/network-latest.server";
import { episodePath } from "../lib/paths";
import { SmartLink } from "./smart-link";

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
  const art = show.latest?.artUrl;
  const className = `shows-network__tile ${slot}`;

  const body = (
    <>
      <span className="shows-network__frame">
        {art ? (
          <img
            src={art}
            alt=""
            width={320}
            height={200}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="shows-network__missing">Latest episode art unavailable</span>
        )}
      </span>
      <span className="shows-network__label">{show.title}</span>
    </>
  );

  if (href === null) {
    return (
      <span className={`${className} shows-network__tile--soon`} aria-label={`${show.title}: destination to come`}>
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

/** Desktop 4×2 placement. */
export const SHOWS_NETWORK_LAYOUT = {
  top: ["news-talk", "radio"],
  bottom: ["joyspiracy", "burning-man-research", "basils-bunker", "clubhouse"],
} as const;

export function ShowsControlRoom({ tiles }: { tiles: NetworkShowTile[] }): React.ReactNode {
  const bySlug = Object.fromEntries(tiles.map((t) => [t.slug, t]));
  const news = bySlug["news-talk"];
  const radio = bySlug.radio;
  const joyspiracy = bySlug.joyspiracy;
  const burning = bySlug["burning-man-research"];
  const bunker = bySlug["basils-bunker"];
  const clubhouse = bySlug.clubhouse;

  if (!news || !radio || !joyspiracy || !burning || !bunker || !clubhouse) {
    throw new Error("ShowsControlRoom: expected all six network show tiles");
  }

  return (
    <section className="shows-studio" aria-label="The Canary Cry Network shows">
      <div className="shows-studio__scene">
        <div className="shows-studio__floor" aria-hidden="true">
          <div className="shows-studio__floor-grid" />
        </div>

        <div className="shows-network" aria-label="Shows">
          <ShowTile show={news} slot="shows-network__tile--news" />
          <div className="shows-network__center">
            <h1 className="shows-network__title">
              <span className="shows-network__title-line">Canary Cry</span>
              <span className="shows-network__title-line">Network</span>
            </h1>
            <p className="shows-network__kicker">Two hosts - One mission</p>
            <p className="shows-network__blurb">
              The shows and projects that Basil and Gonz have created over the years. All
              their best work in one place.
            </p>
          </div>
          <ShowTile show={radio} slot="shows-network__tile--radio" />
          <ShowTile show={joyspiracy} slot="shows-network__tile--joy" />
          <ShowTile show={burning} slot="shows-network__tile--burn" />
          <ShowTile show={bunker} slot="shows-network__tile--bunker" />
          <ShowTile show={clubhouse} slot="shows-network__tile--club" />
        </div>
      </div>
    </section>
  );
}

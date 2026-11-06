// shows-control-room.tsx — Shows page hero: blue perspective grid with a
// centered six-show mosaic (reference 3×3: News Talk 2×2 feature; Joyspiracy
// + Burning Man stacked right; Radio / Clubhouse / Basil's Bunker on the
// bottom row). Thumbs = each show's latest episode art from build-time feeds.

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
  featured = false,
  slot,
}: {
  show: NetworkShowTile;
  featured?: boolean;
  /** Mosaic placement class, e.g. shows-network__tile--joy */
  slot: string;
}): React.ReactNode {
  const href = tileHref(show);
  const art = show.latest?.artUrl;
  const className = [
    "shows-network__tile",
    featured ? "shows-network__tile--feature" : "",
    slot,
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      <span className="shows-network__frame">
        {art ? (
          <img
            src={art}
            alt=""
            width={featured ? 480 : 234}
            height={featured ? 362 : 174}
            loading={featured ? "eager" : "lazy"}
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

/** Desktop mosaic order (CSS grid places by slot class). */
export const SHOWS_NETWORK_LAYOUT = {
  feature: "news-talk",
  topRight: "joyspiracy",
  midRight: "burning-man-research",
  bottom: ["radio", "clubhouse", "basils-bunker"],
} as const;

export function ShowsControlRoom({ tiles }: { tiles: NetworkShowTile[] }): React.ReactNode {
  const bySlug = Object.fromEntries(tiles.map((t) => [t.slug, t]));
  const news = bySlug["news-talk"];
  const joyspiracy = bySlug.joyspiracy;
  const burning = bySlug["burning-man-research"];
  const radio = bySlug.radio;
  const clubhouse = bySlug.clubhouse;
  const bunker = bySlug["basils-bunker"];

  if (!news || !radio || !clubhouse || !joyspiracy || !burning || !bunker) {
    throw new Error("ShowsControlRoom: expected all six network show tiles");
  }

  return (
    <section className="shows-studio" aria-label="The Canary Cry Network shows">
      <div className="shows-studio__scene">
        <div className="shows-studio__floor" aria-hidden="true">
          <div className="shows-studio__floor-grid" />
        </div>

        <div className="shows-network" aria-label="Shows">
          <ShowTile show={news} featured slot="shows-network__tile--news" />
          <ShowTile show={joyspiracy} slot="shows-network__tile--joy" />
          <ShowTile show={burning} slot="shows-network__tile--burn" />
          <ShowTile show={radio} slot="shows-network__tile--radio" />
          <ShowTile show={clubhouse} slot="shows-network__tile--club" />
          <ShowTile show={bunker} slot="shows-network__tile--bunker" />
        </div>
      </div>

      <h1 className="shows-studio__network-title">Canary Cry Network</h1>
    </section>
  );
}

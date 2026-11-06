// shows-control-room.tsx — Shows page hero: blue perspective grid with a
// centered three-column show wall — News Talk (large left), Radio + Clubhouse
// (medium middle), Joyspiracy / Burning Man / Basil's Bunker (small right).
// Thumbs = each show's latest episode art from build-time feeds.

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
  size,
}: {
  show: NetworkShowTile;
  size: "feature" | "mid" | "small";
}): React.ReactNode {
  const href = tileHref(show);
  const art = show.latest?.artUrl;
  const className = `shows-network__tile shows-network__tile--${size}`;
  const dims = size === "feature" ? [640, 800] : size === "mid" ? [400, 300] : [280, 180];

  const body = (
    <>
      <span className="shows-network__frame">
        {art ? (
          <img
            src={art}
            alt=""
            width={dims[0]}
            height={dims[1]}
            loading={size === "feature" ? "eager" : "lazy"}
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

export const SHOWS_NETWORK_LAYOUT = {
  left: ["news-talk"],
  middle: ["radio", "clubhouse"],
  right: ["joyspiracy", "burning-man-research", "basils-bunker"],
} as const;

export function ShowsControlRoom({ tiles }: { tiles: NetworkShowTile[] }): React.ReactNode {
  const bySlug = Object.fromEntries(tiles.map((t) => [t.slug, t]));
  const news = bySlug["news-talk"];
  const radio = bySlug.radio;
  const clubhouse = bySlug.clubhouse;
  const joyspiracy = bySlug.joyspiracy;
  const burning = bySlug["burning-man-research"];
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
          <div className="shows-network__col shows-network__col--feature">
            <ShowTile show={news} size="feature" />
          </div>
          <div className="shows-network__col shows-network__col--mid" aria-label="Radio and Clubhouse">
            <ShowTile show={radio} size="mid" />
            <ShowTile show={clubhouse} size="mid" />
          </div>
          <div className="shows-network__col shows-network__col--small" aria-label="More network shows">
            <ShowTile show={joyspiracy} size="small" />
            <ShowTile show={burning} size="small" />
            <ShowTile show={bunker} size="small" />
          </div>
        </div>
      </div>

      <h1 className="shows-studio__network-title">Canary Cry Network</h1>
    </section>
  );
}

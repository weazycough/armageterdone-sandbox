// shows-control-room.tsx — Shows page hero: blue perspective grid with a
// landscape bento mosaic (4×2): Radio / Joyspiracy left; News Talk wide
// center-top; Burning Man + Bunker under it; Clubhouse tall right.
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
  slot,
}: {
  show: NetworkShowTile;
  slot: string;
}): React.ReactNode {
  const href = tileHref(show);
  const art = show.latest?.artUrl;
  const className = `shows-network__tile ${slot}`;
  const featured = slot.includes("--news");

  const body = (
    <>
      <span className="shows-network__frame">
        {art ? (
          <img
            src={art}
            alt=""
            width={featured ? 640 : 280}
            height={featured ? 280 : 280}
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

/** Desktop bento placement (4 cols × 2 rows). */
export const SHOWS_NETWORK_LAYOUT = {
  radio: "col1 row1",
  joyspiracy: "col1 row2",
  "news-talk": "cols2-3 row1",
  "burning-man-research": "col2 row2",
  "basils-bunker": "col3 row2",
  clubhouse: "col4 rows1-2",
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
          <ShowTile show={radio} slot="shows-network__tile--radio" />
          <ShowTile show={news} slot="shows-network__tile--news" />
          <ShowTile show={clubhouse} slot="shows-network__tile--club" />
          <ShowTile show={joyspiracy} slot="shows-network__tile--joy" />
          <ShowTile show={burning} slot="shows-network__tile--burn" />
          <ShowTile show={bunker} slot="shows-network__tile--bunker" />
        </div>
      </div>

      <h1 className="shows-studio__network-title">Canary Cry Network</h1>
    </section>
  );
}

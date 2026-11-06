// shows-control-room.tsx — Shows page hero: blue perspective grid with a wide
// three-column wall — News Talk/Radio/Clubhouse left; CANARY CRY / NETWORK +
// grey Bebas subhead + blurb center; Joyspiracy/Burning Man/Bunker right.
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

function ShowTile({ show }: { show: NetworkShowTile }): React.ReactNode {
  const href = tileHref(show);
  const art = show.latest?.artUrl;
  const className = "shows-network__tile";

  const body = (
    <>
      <span className="shows-network__frame">
        {art ? (
          <img
            src={art}
            alt=""
            width={400}
            height={300}
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

export const SHOWS_NETWORK_LAYOUT = {
  left: ["news-talk", "radio", "clubhouse"],
  right: ["joyspiracy", "burning-man-research", "basils-bunker"],
} as const;

export function ShowsControlRoom({ tiles }: { tiles: NetworkShowTile[] }): React.ReactNode {
  const bySlug = Object.fromEntries(tiles.map((t) => [t.slug, t]));
  const left = SHOWS_NETWORK_LAYOUT.left.map((s) => bySlug[s]);
  const right = SHOWS_NETWORK_LAYOUT.right.map((s) => bySlug[s]);

  if (left.some((t) => !t) || right.some((t) => !t)) {
    throw new Error("ShowsControlRoom: expected all six network show tiles");
  }

  return (
    <section className="shows-studio" aria-label="The Canary Cry Network shows">
      <div className="shows-studio__scene">
        <div className="shows-studio__floor" aria-hidden="true">
          <div className="shows-studio__floor-grid" />
        </div>

        <div className="shows-network">
          <div className="shows-network__col shows-network__col--left" aria-label="Flagship shows">
            {left.map((show) => (
              <ShowTile key={show!.slug} show={show!} />
            ))}
          </div>

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

          <div className="shows-network__col shows-network__col--right" aria-label="More network shows">
            {right.map((show) => (
              <ShowTile key={show!.slug} show={show!} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// shows-control-room.tsx — Shows page hero: blue perspective grid background
// with a centered six-show tile wall (News Talk feature + Radio/Clubhouse under
// it; Joyspiracy / Burning Man Research / Basil's Bunker on the right). Each
// tile uses that show's latest episode thumbnail from build-time feed data.

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
}: {
  show: NetworkShowTile;
  featured?: boolean;
}): React.ReactNode {
  const href = tileHref(show);
  const art = show.latest?.artUrl;
  const className = featured ? "shows-network__tile shows-network__tile--feature" : "shows-network__tile";

  const body = (
    <>
      <span className="shows-network__frame">
        {art ? (
          <img
            src={art}
            alt=""
            width={featured ? 640 : 320}
            height={featured ? 360 : 320}
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

const LEFT_SLUGS = ["news-talk", "radio", "clubhouse"] as const;
const RIGHT_SLUGS = ["joyspiracy", "burning-man-research", "basils-bunker"] as const;

export function ShowsControlRoom({ tiles }: { tiles: NetworkShowTile[] }): React.ReactNode {
  const bySlug = Object.fromEntries(tiles.map((t) => [t.slug, t]));
  const news = bySlug["news-talk"];
  const radio = bySlug.radio;
  const clubhouse = bySlug.clubhouse;
  const right = RIGHT_SLUGS.map((s) => bySlug[s]).filter(Boolean) as NetworkShowTile[];

  if (!news || !radio || !clubhouse) {
    throw new Error("ShowsControlRoom: expected News Talk, Radio, and Clubhouse tiles");
  }

  return (
    <section className="shows-studio" aria-label="The Canary Cry Network shows">
      <div className="shows-studio__scene">
        <div className="shows-studio__floor" aria-hidden="true">
          <div className="shows-studio__floor-grid" />
        </div>

        <div className="shows-network">
          <div className="shows-network__main">
            <ShowTile show={news} featured />
            <div className="shows-network__pair" aria-label="Radio and Clubhouse">
              <ShowTile show={radio} />
              <ShowTile show={clubhouse} />
            </div>
          </div>
          <div className="shows-network__side" aria-label="More network shows">
            {right.map((show) => (
              <ShowTile key={show.slug} show={show} />
            ))}
          </div>
        </div>
      </div>

      <h1 className="shows-studio__network-title">Canary Cry Network</h1>
    </section>
  );
}

// Keep slug order references for tests / future layout tweaks.
export const SHOWS_NETWORK_LAYOUT = { left: LEFT_SLUGS, right: RIGHT_SLUGS };

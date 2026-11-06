// shows-strip.tsx — the three shows as cards, each linking to its episode
// list (Ghost index.hbs and page-about-us-mojave.hbs).

import type * as React from "react";
import { Link } from "react-router";
import { asset } from "../lib/asset";
import { tagPath } from "../lib/paths";
import { SHOWS } from "../lib/shows";

// Home-strip art: the crest for News Talk, the round bird for Clubhouse.
const STRIP_ART: Record<string, string> = {
  "news-talk": "images/show-news-talk-crest.webp",
  clubhouse: "images/show-clubhouse-bird.webp",
};

/** Transparent 96×96 SVG so blank hero keeps <img width/height> box model without a network fetch. */
const STRIP_ART_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"/>');

export function ShowsStrip({ blank = false }: { blank?: boolean } = {}): React.ReactNode {
  return (
    <div className="shows-strip">
      {SHOWS.map((s) => {
        const body = (
          <>
            <span
              className="show-card__logo"
              role={blank ? undefined : "img"}
              aria-label={blank ? undefined : s.title}
              style={{
                ...(blank
                  ? {}
                  : {
                      maskImage: `url(${asset(s.logo)})`,
                      WebkitMaskImage: `url(${asset(s.logo)})`,
                    }),
                aspectRatio: `${s.logoSize[0]} / ${s.logoSize[1]}`,
              }}
            />
            <img
              className="show-card__art"
              src={blank ? STRIP_ART_PLACEHOLDER : asset(STRIP_ART[s.slug] ?? s.art)}
              alt=""
              width={96}
              height={96}
              loading={blank ? undefined : "lazy"}
              decoding="async"
            />
            <div className="show-card__body">
              <span className="show-card__kicker">{s.kicker}</span>
              <p className="show-card__desc">{s.desc}</p>
            </div>
          </>
        );

        // Same .show-card grid either way; blank uses <a> without navigation so
        // UA/default anchor + .show-card rules match home Link(<a>) geometry.
        if (blank) {
          return (
            <a key={s.slug} className="show-card" aria-hidden="true" tabIndex={-1}>
              {body}
            </a>
          );
        }

        return (
          <Link className="show-card" to={tagPath(s.slug)} key={s.slug}>
            {body}
          </Link>
        );
      })}
    </div>
  );
}

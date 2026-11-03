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

export function ShowsStrip(): React.ReactNode {
  return (
    <div className="shows-strip">
      {SHOWS.map((s) => (
        <Link className="show-card" to={tagPath(s.slug)} key={s.slug}>
          <span
            className="show-card__logo"
            role="img"
            aria-label={s.title}
            style={{
              maskImage: `url(${asset(s.logo)})`,
              WebkitMaskImage: `url(${asset(s.logo)})`,
              aspectRatio: `${s.logoSize[0]} / ${s.logoSize[1]}`,
            }}
          />
          <img
            className="show-card__art"
            src={asset(STRIP_ART[s.slug] ?? s.art)}
            alt=""
            width="96"
            height="96"
            loading="lazy"
          />
          <div className="show-card__body">
            <span className="show-card__kicker">{s.kicker}</span>
                        <p className="show-card__desc">{s.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

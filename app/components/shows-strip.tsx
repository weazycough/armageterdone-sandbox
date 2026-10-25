// shows-strip.tsx — the three shows as cards, each linking to its episode
// list (Ghost index.hbs and page-about-us-mojave.hbs).

import type * as React from "react";
import { Link } from "react-router";
import { asset } from "../lib/asset";
import { tagPath } from "../lib/paths";
import { SHOWS } from "../lib/shows";

export function ShowsStrip(): React.ReactNode {
  return (
    <div className="shows-strip">
      {SHOWS.map((s) => (
        <Link className="show-card" to={tagPath(s.slug)} key={s.slug}>
          <img
            className="show-card__art"
            src={asset(s.art)}
            alt=""
            width="96"
            height="96"
            loading="lazy"
          />
          <div className="show-card__body">
            <span className="show-card__kicker">{s.kicker}</span>
            <h3 className="show-card__title">{s.title}</h3>
            <p className="show-card__desc">{s.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

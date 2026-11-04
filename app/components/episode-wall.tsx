// episode-wall.tsx — featured latest episode beside a grid of thumbnails
// (home "Recent episodes" and the Episodes archive).

import type * as React from "react";
import { Link } from "react-router";
import { asset } from "../lib/asset";
import { formatLongDate, isoDay } from "../lib/dates";
import { episodePath } from "../lib/paths";

export type WallEpisode = {
  slug: string;
  title: string;
  published: string;
  artUrl?: string | undefined;
};

const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function art(e: WallEpisode): string {
  return e.artUrl ?? asset("images/cc-logo.webp");
}

export function WallHead({
  title,
  as = "h2",
  action,
}: {
  title: string;
  as?: "h1" | "h2";
  action?: React.ReactNode;
}): React.ReactNode {
  const H = as;
  return (
    <div className="ep-wall__head">
      <H className="ep-wall__heading">{title}</H>
      <span className="ep-wall__rule" aria-hidden="true" />
      {action && <span className="ep-wall__action">{action}</span>}
    </div>
  );
}

export function EpisodeWall({
  featured,
  rest,
  showTitles = false,
  aside,
}: {
  featured?: WallEpisode | undefined;
  rest: WallEpisode[];
  showTitles?: boolean;
  aside?: React.ReactNode;
}): React.ReactNode {
  return (
    <div className={featured ? "ep-wall" : "ep-wall ep-wall--full"}>
      {featured && (
        <Link className="ep-wall__feature" to={episodePath(featured.slug)}>
          <img src={art(featured)} alt="" width={400} height={400} />
          <span className="ep-wall__kicker">Latest episode</span>
          <span className="ep-wall__ftitle">{featured.title}</span>
          <time className="ep-wall__fdate" dateTime={isoDay(featured.published)}>
            {formatLongDate(featured.published)}
          </time>
        </Link>
      )}
      <ul className="ep-wall__grid">
        {rest.map((e) => (
          <li key={e.slug}>
            <Link className="ep-wall__tile" to={episodePath(e.slug)} title={e.title}>
              <time className="ep-wall__date" dateTime={isoDay(e.published)}>
                {SHORT.format(new Date(e.published))}
              </time>
              <img src={art(e)} alt={showTitles ? "" : e.title} width={200} height={200} loading="lazy" />
              {showTitles && <span className="ep-wall__ttitle">{e.title}</span>}
            </Link>
          </li>
        ))}
      </ul>
      {aside && <div className="ep-wall__aside">{aside}</div>}
    </div>
  );
}

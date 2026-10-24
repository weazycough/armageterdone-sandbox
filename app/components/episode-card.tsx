// episode-card.tsx — one episode in a grid (Ghost index.hbs / tag.hbs card).

import type * as React from "react";
import { Link } from "react-router";
import { formatCardDate, isoDay } from "../lib/dates";
import { episodePath } from "../lib/paths";

export interface EpisodeSummary {
  slug: string;
  title: string;
  published: string;
  excerpt: string;
  duration?: string | undefined;
}

export function EpisodeCard({ episode }: { episode: EpisodeSummary }): React.ReactNode {
  return (
    <article className="episode-card">
      <span className="episode-card__num">
        Episode{episode.duration === undefined ? "" : ` · ${episode.duration}`}
      </span>
      <h3 className="episode-card__title">
        <Link to={episodePath(episode.slug)}>{episode.title}</Link>
      </h3>
      <p className="episode-card__meta">
        <time dateTime={isoDay(episode.published)}>{formatCardDate(episode.published)}</time>
      </p>
      {episode.excerpt !== "" && <p className="episode-card__excerpt">{episode.excerpt}</p>}
    </article>
  );
}

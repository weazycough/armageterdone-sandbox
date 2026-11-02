// tag.tsx — one show's episodes (Ghost tag.hbs): /tag/news-talk/, /tag/radio/,
// /tag/clubhouse/, paginated like the full list. Which show an episode
// belongs to is worked out in app/lib/shows.ts.

import type * as React from "react";
import { data, Link } from "react-router";
import type { Route } from "./+types/tag";
import { EpisodeCard } from "../components/episode-card";
import { Pagination } from "../components/pagination";
import { loadEpisodes } from "../lib/content.server";
import { listPage } from "../lib/episode-list.server";
import { asset } from "../lib/asset";
import { pageTitle } from "../lib/meta";
import { tagPath } from "../lib/paths";
import { findShow, showOf } from "../lib/shows";

export function loader({ params }: Route.LoaderArgs) {
  const show = findShow(params.tag);
  if (show === undefined) throw data(null, { status: 404 });
  const episodes = loadEpisodes().filter((e) => showOf(e) === show.slug);
  return { show, ...listPage(episodes, params.page) };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const suffix = loaderData.page > 1 ? ` (page ${String(loaderData.page)})` : "";
  return pageTitle(`${loaderData.show.title}${suffix}`);
}

export default function Tag({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { show, page, pages, total, episodes } = loaderData;
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">{show.kicker}</span>
          {show.slug === "news-talk" ? (
            <h1 className="page-hero__title-logo">
              <img
                className="page-hero__logo"
                src={asset("images/newstalk-logo.webp")}
                alt={show.title}
                width={1731}
                height={674}
                decoding="async"
              />
            </h1>
          ) : (
            <h1>{show.title}</h1>
          )}
          <p className="muted">
            {show.desc} {total} episodes, newest first. <Link to="/episodes/">All episodes →</Link>
          </p>
        </div>
      </header>
      <section className="section">
        <div className="container">
          <div className="episode-grid">
            {episodes.map((e) => (
              <EpisodeCard key={e.slug} episode={e} />
            ))}
          </div>
          <Pagination page={page} pages={pages} pathFor={(n) => tagPath(show.slug, n)} />
        </div>
      </section>
    </>
  );
}

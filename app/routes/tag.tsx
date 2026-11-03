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
import { findShow, showOf, type Show } from "../lib/shows";

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

/** Title logo in the always-dark hero. */
function ShowTitleLogo({ show }: { show: Show }): React.ReactNode {
  return (
    <h1 className="page-hero__title-logo">
      <img
        className="page-hero__logo"
        src={asset(show.logo)}
        alt={show.title}
        width={show.logoSize[0]}
        height={show.logoSize[1]}
        decoding="async"
      />
    </h1>
  );
}

export default function Tag({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { show, page, pages, total, episodes } = loaderData;
  return (
    <>
      <header className="page-hero page-hero--dark">
        <div className="container">
          <span className="eyebrow">{show.kicker}</span>
          <ShowTitleLogo show={show} />
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

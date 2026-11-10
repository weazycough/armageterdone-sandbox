// tag.tsx — one show's episodes (Ghost tag.hbs): /tag/news-talk/, /tag/radio/,
// /tag/clubhouse/, paginated like the full list. Which show an episode
// belongs to is worked out in app/lib/shows.ts.

import type * as React from "react";
import { data } from "react-router";
import type { Route } from "./+types/tag";
import { EpisodeWall } from "../components/episode-wall";
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

/** Title wordmark (CANARYCRY + show name), painted via CSS mask so it can
 *  be white in dark theme and black in light without changing the gold SVGs
 *  used as masks on the home / Shows strips. */
function ShowTitleLogo({ show }: { show: Show }): React.ReactNode {
  return (
    <h1 className="page-hero__title-logo">
      <span
        className="page-hero__logo"
        role="img"
        aria-label={show.title}
        style={{
          maskImage: `url(${asset(show.logo)})`,
          WebkitMaskImage: `url(${asset(show.logo)})`,
          aspectRatio: `${String(show.logoSize[0])} / ${String(show.logoSize[1])}`,
        }}
      />
    </h1>
  );
}

export default function Tag({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { show, page, pages, episodes } = loaderData;
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="ep-wall__head">
            <ShowTitleLogo show={show} />
            <span className="ep-wall__rule" aria-hidden="true" />
          </div>
          <p className="muted ep-wall__count">
            <span className="ep-wall__kicker">{show.kicker}</span> · {show.desc}
          </p>
          <EpisodeWall
            featured={page === 1 ? episodes[0] : undefined}
            rest={page === 1 ? episodes.slice(1) : episodes}
            showTitles
          />
          <Pagination page={page} pages={pages} pathFor={(n) => tagPath(show.slug, n)} />
        </div>
      </section>
    </>
  );
}

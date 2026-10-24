// episodes.tsx — the episode list, newest first, EPISODES_PER_PAGE to a page:
// /episodes/ is page 1, /episodes/page/2/ onwards the rest (Ghost tag.hbs).

import type * as React from "react";
import { data } from "react-router";
import type { Route } from "./+types/episodes";
import { EpisodeCard } from "../components/episode-card";
import { Pagination } from "../components/pagination";
import { loadEpisodes } from "../lib/content.server";
import { EPISODES_PER_PAGE, pageCount } from "../lib/paths";

export function loader({ params }: Route.LoaderArgs) {
  const episodes = loadEpisodes();
  const pages = pageCount(episodes.length);
  const page = params.page === undefined ? 1 : Number(params.page);
  // /episodes/page/1/ is not a page: page 1 lives at /episodes/.
  if (!Number.isInteger(page) || page < 1 || page > pages || params.page === "1") {
    throw data(null, { status: 404 });
  }
  const start = (page - 1) * EPISODES_PER_PAGE;
  return {
    page,
    pages,
    total: episodes.length,
    episodes: episodes
      .slice(start, start + EPISODES_PER_PAGE)
      .map(({ slug, title, published, excerpt, duration }) => ({
        slug,
        title,
        published,
        excerpt,
        duration,
      })),
  };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const suffix = loaderData.page > 1 ? ` (page ${String(loaderData.page)})` : "";
  return [{ title: `Episodes${suffix} — Canary Cry News Talk` }];
}

export default function Episodes({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { page, pages, total, episodes } = loaderData;
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">The archive</span>
          <h1>Episodes</h1>
          <p className="muted">{total} episodes, newest first.</p>
        </div>
      </header>
      <section className="section">
        <div className="container">
          <div className="episode-grid">
            {episodes.map((e) => (
              <EpisodeCard key={e.slug} episode={e} />
            ))}
          </div>
          <Pagination page={page} pages={pages} />
        </div>
      </section>
    </>
  );
}

// episodes.tsx — the episode list, newest first, EPISODES_PER_PAGE to a page:
// /episodes/ is page 1, /episodes/page/2/ onwards the rest (Ghost tag.hbs).

import type * as React from "react";
import type { Route } from "./+types/episodes";
import { EpisodeCard } from "../components/episode-card";
import { Pagination } from "../components/pagination";
import { loadEpisodes } from "../lib/content.server";
import { listPage } from "../lib/episode-list.server";
import { pageTitle } from "../lib/meta";
import { episodeListPath } from "../lib/paths";

export function loader({ params }: Route.LoaderArgs) {
  return listPage(loadEpisodes(), params.page);
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const suffix = loaderData.page > 1 ? ` (page ${String(loaderData.page)})` : "";
  return pageTitle(`Episodes${suffix}`);
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
          <Pagination page={page} pages={pages} pathFor={episodeListPath} />
        </div>
      </section>
    </>
  );
}

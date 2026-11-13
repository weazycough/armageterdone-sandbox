// episodes.tsx — the episode list, newest first, EPISODES_PER_PAGE to a page:
// /episodes/ is page 1, /episodes/page/2/ onwards the rest (Ghost tag.hbs).

import type * as React from "react";
import type { Route } from "./+types/episodes";
import { EpisodeWall, WallHead } from "../components/episode-wall";
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
  const { page, pages, episodes } = loaderData;
  return (
    <>
      <section className="section">
        <div className="container">
          <WallHead title="Episodes" as="h1" />
          <p className="muted ep-wall__count">
            Every episode from Canary Cry News Talk, Canary Cry Radio, and Canary Cry Clubhouse, newest first.
          </p>
          <EpisodeWall
            featured={page === 1 ? episodes[0] : undefined}
            rest={page === 1 ? episodes.slice(1) : episodes}
            showTitles
          />
          <Pagination page={page} pages={pages} pathFor={episodeListPath} />
        </div>
      </section>
    </>
  );
}

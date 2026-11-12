// shows.tsx — Canary Cry Network Shows page: hero (wordmark + NETWORK +
// pitch, with The Main Shows in the right column), then Other Works and
// the Value for Value band.

import type * as React from "react";
import type { Route } from "./+types/shows";
import { WallHead } from "../../components/episode-wall";
import { ShowsControlRoom } from "../../components/shows-control-room";
import { Section } from "../../components/page-parts";
import { FaceLikeTheSunCard } from "../../components/face-like-the-sun-card";
import { ShowsV4v } from "../../components/shows-v4v";
import { ShowsStrip, type ShowsStripItem } from "../../components/shows-strip";
import { loadEpisodes } from "../../lib/content.server";
import { pageTitle } from "../../lib/meta";
import { loadNetworkLatestFile, networkShowTiles, type NetworkShowTile } from "../../lib/network-latest.server";
import { episodePath } from "../../lib/paths";
import { SHOWS } from "../../lib/shows";

const BIG_THREE_SLUGS = new Set<string>(SHOWS.map((s) => s.slug));

/** Same-origin square covers used elsewhere on the site (hero tiles, catalog). */
const WORKS_SQUARE_ART: Record<string, string> = {
  joyspiracy: "images/show-joyspiracy.webp",
  "burning-man-research": "content/images/e2f8d5c0-83360211-6a87-d7bf-6741-59b8ca567492.jpg",
  "basils-bunker": "images/show-basils-bunker.webp",
};

function otherWorkItems(tiles: NetworkShowTile[]): ShowsStripItem[] {
  return tiles
    .filter((t) => !BIG_THREE_SLUGS.has(t.slug))
    .map((t) => {
      const href =
        t.href ??
        (t.latest?.slug ? episodePath(t.latest.slug) : null) ??
        t.latest?.externalUrl ??
        null;
      const art = WORKS_SQUARE_ART[t.slug] ?? t.art ?? t.latest?.artUrl ?? null;
      return {
        slug: t.slug,
        title: t.title,
        desc: t.desc ?? "[Description to come]",
        art,
        href,
      };
    });
}

export const meta = () => pageTitle("Shows");

export function loader(_args: Route.LoaderArgs) {
  const tiles = networkShowTiles(loadEpisodes(), loadNetworkLatestFile());
  return { tiles };
}

export default function ShowsPage({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { tiles } = loaderData;
  const otherWorks = otherWorkItems(tiles);
  return (
    <article className="page shows-page">
      <ShowsControlRoom />

      <Section>
        <div className="shows-catalog">
          <div className="shows-catalog__block shows-catalog__works">
            <WallHead title="Other Works" />
            <ShowsStrip shows={otherWorks} append={<FaceLikeTheSunCard />} />
          </div>
        </div>
      </Section>

      <ShowsV4v />
    </article>
  );
}

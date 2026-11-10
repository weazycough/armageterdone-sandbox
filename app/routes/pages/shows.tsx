// shows.tsx — Canary Cry Network Shows page: hero (wordmark + NETWORK + tile grid) on the home mission-hero background, then the lower roster.

import type * as React from "react";
import type { Route } from "./+types/shows";
import { WallHead } from "../../components/episode-wall";
import { ShowsControlRoom } from "../../components/shows-control-room";
import { Section } from "../../components/page-parts";
import { FaceLikeTheSunCard } from "../../components/face-like-the-sun-card";
import { ShowsV4v } from "../../components/shows-v4v";
import { ShowsStrip, type ShowsStripItem } from "../../components/shows-strip";
import { SmartLink } from "../../components/smart-link";
import { loadEpisodes } from "../../lib/content.server";
import { pageTitle } from "../../lib/meta";
import { loadNetworkLatestFile, networkShowTiles, type NetworkShowTile } from "../../lib/network-latest.server";
import { episodePath } from "../../lib/paths";
import { NETWORK_SHOW_OPEN_ITEMS, NETWORK_SHOWS, SHOWS } from "../../lib/shows";

const BIG_THREE_SLUGS = new Set<string>(SHOWS.map((s) => s.slug));

function otherWorkItems(tiles: NetworkShowTile[]): ShowsStripItem[] {
  return tiles
    .filter((t) => !BIG_THREE_SLUGS.has(t.slug))
    .map((t) => {
      const href =
        t.href ??
        (t.latest?.slug ? episodePath(t.latest.slug) : null) ??
        t.latest?.externalUrl ??
        null;
      // Basil's Bunker has no roster art; use a same-origin copy of the
      // show logo (latest episode cover) so the round frame isn't a
      // cross-origin Libsyn URL that can fail to paint.
      const art =
        t.slug === "basils-bunker"
          ? (t.art ?? "images/show-basils-bunker.webp")
          : (t.art ?? t.latest?.artUrl ?? null);
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
      <ShowsControlRoom tiles={tiles} />

      <Section>
        <div className="shows-catalog">
          <div className="shows-catalog__block">
            <WallHead title="The Big Three" />
            <ShowsStrip />
          </div>
          <div className="shows-catalog__block">
            <WallHead title="Other Works" />
            <ShowsStrip shows={otherWorks} append={<FaceLikeTheSunCard />} />
          </div>
        </div>
      </Section>

      <ShowsV4v />

      <Section>
        <div className="shows-roster">
          <h2 className="shows-roster__heading">On the network</h2>
          <ul className="shows-roster__list">
            {NETWORK_SHOWS.map((show) => (
              <li key={show.slug} className="shows-roster__item">
                {show.href !== null ? (
                  <SmartLink href={show.href} className="shows-roster__title">
                    {show.title}
                  </SmartLink>
                ) : (
                  <span className="shows-roster__title shows-roster__title--soon">{show.title}</span>
                )}
                <p className="shows-roster__desc">
                  {show.desc ?? "[Description to come]"}
                  {show.href === null && (
                    <span className="shows-roster__open"> · Link still open</span>
                  )}
                </p>
              </li>
            ))}
          </ul>

          {NETWORK_SHOW_OPEN_ITEMS.length > 0 && (
            <p className="shows-roster__note muted">
              Open items:{" "}
              {NETWORK_SHOW_OPEN_ITEMS.map((s) => s.title).join(" and ")} still need a
              destination page and/or roster art.
            </p>
          )}
        </div>
      </Section>
    </article>
  );
}

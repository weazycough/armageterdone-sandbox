// shows.tsx — Canary Cry Network Shows page: tile grid of the six shows with
// each show's latest episode thumbnail on the blue perspective grid.

import type * as React from "react";
import type { Route } from "./+types/shows";
import { ShowsControlRoom } from "../../components/shows-control-room";
import { Section } from "../../components/page-parts";
import { SmartLink } from "../../components/smart-link";
import { loadEpisodes } from "../../lib/content.server";
import { pageTitle } from "../../lib/meta";
import { loadNetworkLatestFile, networkShowTiles } from "../../lib/network-latest.server";
import { NETWORK_SHOW_OPEN_ITEMS, NETWORK_SHOWS } from "../../lib/shows";

export const meta = () => pageTitle("Shows");

export function loader(_args: Route.LoaderArgs) {
  const tiles = networkShowTiles(loadEpisodes(), loadNetworkLatestFile());
  return { tiles };
}

export default function ShowsPage({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { tiles } = loaderData;
  return (
    <article className="page shows-page">
      <ShowsControlRoom tiles={tiles} />

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

// episode.tsx — one episode (Ghost post.hbs): title, date, artwork, the MP3
// in a native player, and the show notes (sanitised by app/lib/feed.ts).

import type * as React from "react";
import { data } from "react-router";
import type { Route } from "./+types/episode";
import { AudioPlayer } from "../components/audio-player";
import { SupportRow } from "../components/support-row";
import { loadEpisodes } from "../lib/content.server";
import { formatLongDate, isoDay } from "../lib/dates";

export function loader({ params }: Route.LoaderArgs) {
  const episode = loadEpisodes().find((e) => e.slug === params.slug);
  if (episode === undefined) throw data(null, { status: 404 });
  return { episode };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  return [{ title: `${loaderData.episode.title} — Canary Cry News Talk` }];
}

export default function Episode({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { episode } = loaderData;
  return (
    <>
      <article className="post">
        <header className="post-hero">
          <div className="container">
            <span className="eyebrow">Episode</span>
            <h1>{episode.title}</h1>
            <p className="post-hero__meta">
              <time dateTime={isoDay(episode.published)}>{formatLongDate(episode.published)}</time>
              {episode.duration !== undefined && ` · ${episode.duration}`}
            </p>
            {episode.artUrl !== undefined && (
              <div className="post-hero__feature">
                <img src={episode.artUrl} alt={`Episode artwork for ${episode.title}`} />
              </div>
            )}
            <div className="episode-player">
              <AudioPlayer src={episode.audioUrl} type={episode.audioType} title={episode.title} />
            </div>
          </div>
        </header>
        <div className="post-body">
          <div className="container">
            <section className="prose" dangerouslySetInnerHTML={{ __html: episode.notesHtml }} />
          </div>
        </div>
      </article>
      <section className="section section--alt">
        <div className="container">
          <SupportRow eyebrow="If this episode helped you" heading="Become a producer">
            Canary Cry doesn&apos;t run ads. The show survives on producers — people returning value
            for the value they got — in <strong>time, talent, or treasure</strong>. Patreon,
            one-time gifts, art submissions, Speak Pipe calls, all of it counts.
          </SupportRow>
        </div>
      </section>
    </>
  );
}

// episode.tsx — one episode (Ghost post.hbs): title, date, artwork, the MP3
// in a native player, show notes (sanitised by app/lib/feed.ts, then cleaned
// of technical boilerplate), and a Value-for-Value band.

import type * as React from "react";
import { data, Link } from "react-router";
import type { Route } from "./+types/episode";
import { AudioPlayer } from "../components/audio-player";
import { PagerButton } from "../components/pagination";
import { V4vActions } from "../components/v4v-copy";
import { asset } from "../lib/asset";
import { loadEpisodes } from "../lib/content.server";
import { formatCardDate, isoDay } from "../lib/dates";
import { formatDuration } from "../lib/duration";
import { episodePath, tagPath } from "../lib/paths";
import { cleanShowNotes } from "../lib/show-notes";
import { findShow, showOf } from "../lib/shows";

export function loader({ params }: Route.LoaderArgs) {
  const episodes = loadEpisodes();
  const index = episodes.findIndex((e) => e.slug === params.slug);
  if (index < 0) throw data(null, { status: 404 });
  const episode = episodes[index]!;
  const showSlug = showOf(episode);
  const show = showSlug !== null ? findShow(showSlug) : undefined;
  const neighbor = (e: (typeof episodes)[number]) => ({ slug: e.slug, title: e.title });
  return {
    episode,
    show:
      show !== undefined
        ? { slug: show.slug, title: show.title, logo: show.logo, logoSize: show.logoSize }
        : null,
    newer: index > 0 ? neighbor(episodes[index - 1]!) : null,
    older: index < episodes.length - 1 ? neighbor(episodes[index + 1]!) : null,
  };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  return [{ title: `${loaderData.episode.title} — Canary Cry News Talk` }];
}

export default function Episode({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { episode, show, newer, older } = loaderData;
  const art = episode.artUrl ?? asset("images/cc-logo.webp");
  const notes = cleanShowNotes(episode.notesHtml);
  return (
    <div className="episode-page">
      <article>
        <header className="episode-hero">
          <div className="container episode-hero__inner">
            {show ? (
              <Link
                className="episode-hero__show"
                to={tagPath(show.slug)}
                aria-label={show.title}
              >
                <span
                  className="episode-hero__wordmark"
                  aria-hidden="true"
                  style={{
                    maskImage: `url(${asset(show.logo)})`,
                    WebkitMaskImage: `url(${asset(show.logo)})`,
                    aspectRatio: `${String(show.logoSize[0])} / ${String(show.logoSize[1])}`,
                  }}
                />
              </Link>
            ) : (
              <span className="episode-hero__show-fallback">Episode</span>
            )}
            <h1 className="episode-hero__title">{episode.title}</h1>
            <p className="episode-hero__meta">
              <time dateTime={isoDay(episode.published)}>{formatCardDate(episode.published)}</time>
              {episode.duration !== undefined && (
                <>
                  {" · "}
                  <span>{formatDuration(episode.duration)}</span>
                </>
              )}
            </p>
            <div className="episode-hero__art">
              <img src={art} alt={`Episode artwork for ${episode.title}`} width={600} height={600} />
            </div>
            <div className="episode-player">
              <AudioPlayer src={episode.audioUrl} type={episode.audioType} title={episode.title} />
            </div>
            <nav className="pagination episode-pager" aria-label="Nearby episodes">
              <PagerButton
                className="pagination__btn newer-posts"
                to={newer ? episodePath(newer.slug) : null}
              >
                ← Newer
              </PagerButton>
              <PagerButton
                className="pagination__btn older-posts"
                to={older ? episodePath(older.slug) : null}
              >
                Older →
              </PagerButton>
            </nav>
          </div>
        </header>
        {notes.length > 0 && (
          <div className="episode-notes">
            <div className="container">
              <div className="episode-notes__head">
                <h2>Show notes</h2>
                <span className="episode-notes__rule" aria-hidden="true" />
              </div>
              <section className="prose" dangerouslySetInnerHTML={{ __html: notes }} />
            </div>
          </div>
        )}
      </article>
      <section className="episode-v4v" aria-label="Value for Value">
        <div className="container episode-v4v__inner">
          <div className="episode-v4v__copy">
            <h2>Become a producer</h2>
            <p>
              Canary Cry doesn&apos;t run ads. The show survives on producers — people returning
              value for the value they got — in <strong>time, talent, or treasure</strong>.
            </p>
          </div>
          <V4vActions className="episode-v4v__actions" />
        </div>
      </section>
    </div>
  );
}

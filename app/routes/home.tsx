// home.tsx — the homepage (Ghost index.hbs): the latest episode with its
// player, the three shows, the value-for-value row, recent episodes, the
// community art wall and the newsletter signup (preview only).

import type * as React from "react";
import { TextField } from "react-aria-components";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { AudioPlayer } from "../components/audio-player";
import { EpisodeCard } from "../components/episode-card";
import { PlatformRow } from "../components/platform-row";
import { PreviewForm } from "../components/preview-form";
import { ShowsStrip } from "../components/shows-strip";
import { SupportRow } from "../components/support-row";
import { buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { asset } from "../lib/asset";
import { loadEpisodes } from "../lib/content.server";
import { formatLongDate, isoDay } from "../lib/dates";
import { ART_RIBBON } from "../lib/fan-art";
import { episodePath } from "../lib/paths";

export function loader() {
  const episodes = loadEpisodes();
  const latest = episodes[0];
  if (latest === undefined) throw new Error("no episodes");
  return {
    // Everything but the show notes, which the homepage doesn't show.
    latest: {
      slug: latest.slug,
      title: latest.title,
      published: latest.published,
      artUrl: latest.artUrl,
      audioUrl: latest.audioUrl,
      audioType: latest.audioType,
    },
    recent: episodes.slice(0, 4).map(({ slug, title, published, excerpt, duration }) => ({
      slug,
      title,
      published,
      excerpt,
      duration,
    })),
  };
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "Canary Cry News Talk — Cogitare extra caveam" }];
}

function Brackets({ where }: { where: "mobile" | "desktop" }): React.ReactNode {
  return (
    <>
      <span className={`bracket bracket--tl bracket--${where}`} />
      <span className={`bracket bracket--tr bracket--${where}`} />
      <span className={`bracket bracket--bl bracket--${where}`} />
      <span className={`bracket bracket--br bracket--${where}`} />
    </>
  );
}

export default function Home({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { latest, recent } = loaderData;
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__inner bracket-frame">
            <Brackets where="mobile" />
            <div className="hero__title-col bracket-frame">
              <Brackets where="desktop" />
              <div className="hero__body">
                <span className="eyebrow">Latest from the watchmen</span>
                <h1>
                  <Link className="hero__title-link" to={episodePath(latest.slug)}>
                    {latest.title}
                  </Link>
                </h1>
                <p className="hero__meta">
                  <time className="hero__date" dateTime={isoDay(latest.published)}>
                    {formatLongDate(latest.published)}
                  </time>
                </p>
              </div>
            </div>

            <div className="hero__art-col">
              <div className="hero__art">
                {latest.artUrl === undefined ? (
                  <img
                    className="hero__art-fallback"
                    src={asset("images/cc-logo.webp")}
                    alt="Canary Cry crest"
                  />
                ) : (
                  <img src={latest.artUrl} alt={`Episode artwork for ${latest.title}`} />
                )}
              </div>
              <p className="hero__art-caption muted">Latest episode artwork</p>
            </div>

            <div className="hero__playback-col">
              <div className="hero__player">
                <AudioPlayer src={latest.audioUrl} type={latest.audioType} title={latest.title} />
                <Link className="hero__player-notes" to={episodePath(latest.slug)}>
                  Show notes →
                </Link>
              </div>
              <PlatformRow />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__head">
            <h2>
              <span className="eyebrow eyebrow--no-rule">Three shows, one signal</span>
              <br />
              The Canary Cry Network
            </h2>
          </div>
          <ShowsStrip />
          <div style={{ marginTop: "var(--space-7)" }}>
            <SupportRow eyebrow="Value-for-value" heading="No advertisers. Just producers.">
              Canary Cry doesn&apos;t take corporate ad money. The show runs on producers —
              listeners who return value with their <strong>time, talent, or treasure</strong> for
              the value the show puts out. Patreon, one-time gifts, Cage Rattler Coffee, art
              submissions, Speak Pipe calls — they all count.
            </SupportRow>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Recent episodes</h2>
            <Link to="/episodes/">View all &rarr;</Link>
          </div>
          <div className="episode-grid">
            {recent.map((e) => (
              <EpisodeCard key={e.slug} episode={e} />
            ))}
          </div>
        </div>
      </section>

      <section className="art-ribbon">
        <div className="container">
          <div className="art-ribbon__head">
            <span className="eyebrow">From the producers</span>
            <h2>Community art wall</h2>
            <p>
              Canary Cry has always been a producer-driven show. Sketches, edits, memes, and full
              pieces — submit yours below and it lands here.
            </p>
          </div>
          <div className="art-ribbon__grid">
            {ART_RIBBON.map((t) => (
              <Link className="art-ribbon__tile" to="/artsubmission/" title={t.title} key={t.file}>
                <img
                  src={asset(`images/fan-art/${t.file}`)}
                  alt={t.alt}
                  loading="lazy"
                  width="200"
                  height="200"
                />
              </Link>
            ))}
          </div>
          <div className="art-ribbon__cta">
            <Link className={buttonVariants({ variant: "ghost" })} to="/artsubmission/">
              Submit your work →
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="signup">
            <span className="eyebrow eyebrow--no-rule">Stay in the loop</span>
            <h2>The dispatch — straight to your inbox</h2>
            <p>
              New episode notes, deeper-cut research, and dispatches from the news cycle worth your
              attention. No spam, unsubscribe any time.
            </p>
            <PreviewForm>
              <TextField aria-label="Email address" type="email" className="flex-1">
                <Input placeholder="you@email.com" />
              </TextField>
              <button className={buttonVariants()} type="submit">
                Subscribe
              </button>
            </PreviewForm>
          </div>
        </div>
      </section>
    </>
  );
}

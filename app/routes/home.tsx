// home.tsx — the homepage: mission hero (lab #1 Option A split layout with
// Option B's always-dark band; latest episode sits under the tagline with About
// below it per Stefan's #1 feedback), then shows, value-for-value, recent episodes,
// community art, and the newsletter signup (preview only).

import type * as React from "react";
import { TextField } from "react-aria-components";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { EpisodeWall, WallHead } from "../components/episode-wall";
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
    latest: {
      slug: latest.slug,
      title: latest.title,
      published: latest.published,
      artUrl: latest.artUrl,
    },
    recent: episodes.slice(0, 11).map(({ slug, title, published, artUrl }) => ({
      slug,
      title,
      published,
      artUrl,
    })),
  };
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "Canary Cry News Talk — Cogitare extra caveam" }];
}

export default function Home({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { latest, recent } = loaderData;
  const latestArt = latest.artUrl ?? asset("images/cc-logo.webp");
  return (
    <>
      <section className="mission-hero" aria-label="Canary Cry mission">
        <div className="container">
          <div className="mission-hero__grid">
            <div className="mission-hero__copy">
              {/* Keep a real h1 for SEO/a11y; the wordmark art already shows the
                  name, so the title is sized down rather than removed. */}
              <h1 className="mission-hero__title">Canary Cry</h1>
              <p className="mission-hero__sub">Canary Cry Radio | Canary Cry News Talk</p>
              <p className="mission-hero__tag">Think Outside the Cage.</p>
              <Link className="mission-hero__latest" to={episodePath(latest.slug)}>
                <img
                  className="mission-hero__latest-art"
                  src={latestArt}
                  alt=""
                  width={72}
                  height={72}
                />
                <span>
                  <span className="mission-hero__latest-kicker">Latest episode</span>
                  <span className="mission-hero__latest-title">{latest.title}</span>
                  <span className="mission-hero__latest-date">
                    <time dateTime={isoDay(latest.published)}>
                      {formatLongDate(latest.published)}
                    </time>
                  </span>
                </span>
              </Link>
              <p className="mission-hero__about">
                <strong>A biblical take on the news and world events.</strong> CANARY CRY NEWS TALK
                is a show that brings frequent updates on news and events happening around the world
                from an Alt. Christian worldview, hosted by us, Basil and Gonz of the Canary Cry
                Radio podcast.
              </p>
            </div>
            <figure className="mission-hero__art">
              <picture>
                <source srcSet={asset("images/canary-cry-key-art.webp")} type="image/webp" />
                <img
                  src={asset("images/canary-cry-key-art.png")}
                  alt="Canary Cry sticker poster of hosts Basil and Gonz with a cat, UFO, and show symbols"
                  width={900}
                  height={1036}
                />
              </picture>
            </figure>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <WallHead title="Recent episodes" />
          <EpisodeWall featured={recent[0]} rest={recent.slice(1)} />
          <div className="ep-wall__all">
            <Link to="/episodes/">View all &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__head">
            <h2 className="signal-head">
              Three shows, one signal
              <svg className="signal-head__icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="5" cy="19" r="2.2" fill="currentColor" />
                <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </h2>
          </div>
          <ShowsStrip />
          <hr className="signal-rule" />
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

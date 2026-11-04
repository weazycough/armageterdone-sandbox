// home.tsx — the homepage: mission hero (3-col intro / key art / tagline,
// Value-for-Value band under a blue UFO beam), then recent episodes, shows,
// community art, and the newsletter signup (preview only).

import type * as React from "react";
import { TextField } from "react-aria-components";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { EpisodeWall, WallHead } from "../components/episode-wall";
import { PreviewForm } from "../components/preview-form";
import { ShowsStrip } from "../components/shows-strip";
import { buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { asset } from "../lib/asset";
import { episodePath } from "../lib/paths";
import { loadEpisodes } from "../lib/content.server";
import { ART_RIBBON } from "../lib/fan-art";
import { cn } from "../lib/utils";

export function loader() {
  const episodes = loadEpisodes();
  return {
    recent: episodes.slice(0, 11).map(({ slug, title, published, artUrl, duration }) => ({
      slug,
      title,
      published,
      artUrl,
      duration,
    })),
  };
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "Canary Cry News Talk — Cogitare extra caveam" }];
}

export default function Home({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { recent } = loaderData;
  return (
    <>
      <section className="mission-hero" aria-label="Canary Cry mission">
        <div className="mission-hero__floor" aria-hidden="true"><div className="mission-hero__floor-grid" /></div>
        <div className="container mission-hero__inner">
          <div className="mission-hero__grid">
            <div className="mission-hero__intro">
              <p className="mission-hero__kicker">
                Your news<br className="br-d" />{" "}and biblical<br className="br-m" />{" "}views
                <br className="br-d" />on world events
              </p>
              <span className="mission-hero__bar" aria-hidden="true" />
              <p className="mission-hero__about">
                Canary Cry NewsTalk is a show that brings frequent updates on news and
                events happening around the world from an Alt. Christian worldview,
                hosted by us, Basil and Gonz of the Canary Cry Radio podcast.
              </p>
              <span className="mission-hero__bar" aria-hidden="true" />
              {recent[0] ? (
                <Link className="mission-hero__latest" to={episodePath(recent[0].slug)}>
                  Latest Episode
                </Link>
              ) : null}
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
            <h1 className="mission-hero__tag">
              <span className="sr-only">Canary Cry: </span>
              <span>Think</span>
              <span>Outside</span>
              <span>The Cage</span>
            </h1>
          </div>

          <div className="mission-hero__shows">
          <div className="section__head">
            <h2 className="signal-head">
              <span className="signal-head__line">Three shows,</span>
              <span className="signal-head__line">
                One signal
              <svg className="signal-head__icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="5" cy="19" r="2.2" fill="currentColor" />
                <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              </span>
            </h2>
          </div>
          <ShowsStrip />
          <hr className="signal-rule" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="home-recent">
            <WallHead
              title="Recent episodes"
              action={<Link to="/episodes/">View all &rarr;</Link>}
            />
            <EpisodeWall featured={recent[0]} rest={recent.slice(1)} />
          </div>
        </div>
      </section>

      <section className="mission-hero mission-hero--v4v" aria-label="Value for Value">
        <div className="container mission-hero__inner">
          <div className="mission-hero__v4v">
            <img
              className="mission-hero__v4v-art"
              src={asset("images/v4v-mascots.webp")}
              alt="Crowned pixel dog holding a dollar bill beside a yellow canary"
              width={700}
              height={627}
              loading="lazy"
            />
            <div className="mission-hero__v4v-copy">
              <span className="mission-hero__v4v-eyebrow">No advertisers. Just producers</span>
              <h2 className="mission-hero__v4v-heading">What is Value-for-Value?</h2>
              <p>
                Canary Cry doesn&apos;t take corporate ad money. The show runs on producers —
                listeners who return value with their <strong>time, talent, or treasure</strong> for
                the value the show puts out. Patreon, one-time gifts, Cage Rattler Coffee, art
                submissions, Speak Pipe calls — they all count.
              </p>
            </div>
            <div className="mission-hero__v4v-actions">
              <Link
                className={cn(buttonVariants(), "rounded-full mission-hero__give")}
                to="/support/"
              >
                $ Give
              </Link>
              <a
                className={cn(buttonVariants({ variant: "blue" }), "rounded-full mission-hero__patreon")}
                href="https://www.patreon.com/ccnt"
                rel="noopener"
              >
                Patreon
              </a>
            </div>
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

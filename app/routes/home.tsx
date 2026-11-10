// home.tsx — the homepage: mission hero (3-col intro / key art / tagline,
// Value-for-Value band under a blue UFO beam), then recent episodes, shows,
// community art, and the newsletter signup (preview only).

import type * as React from "react";
import { TextField } from "react-aria-components";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { EpisodeWall, WallHead } from "../components/episode-wall";
import { PreviewForm } from "../components/preview-form";
import { MissionHeroBody } from "../components/mission-hero-body";
import { MissionHeroFloor } from "../components/mission-hero-floor";
import { V4vWordmark } from "../components/v4v-wordmark";
import { buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { asset } from "../lib/asset";
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
  return [{ title: "Canary Cry News Talk — Think Outside the Cage" }];
}

export default function Home({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { recent } = loaderData;
  return (
    <>
      <section className="mission-hero" aria-label="Canary Cry mission">
        <MissionHeroFloor />
        <MissionHeroBody latestSlug={recent[0]?.slug ?? null} />
      </section>

      <section className="section home-recent">
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
              <h2 className="mission-hero__v4v-heading">
                <span className="sr-only">Value for Value</span>
                <V4vWordmark className="mission-hero__v4v-mark" decorative />
              </h2>
              <p>
                Canary Cry doesn&apos;t take corporate ad money. The show runs on producers —
                listeners who return value with their <strong>time, talent, or treasure</strong> for
                the value the show puts out. Patreon, one-time gifts, Cage Rattler Coffee, art
                submissions, Speak Pipe calls — they all count.
              </p>
            </div>
            <div className="mission-hero__v4v-actions">
              <Link
                className={cn(buttonVariants(), "mission-hero__give")}
                to="/support/"
              >
                $ Give
              </Link>
              <a
                className={cn(buttonVariants({ variant: "blue" }), "mission-hero__patreon")}
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
            <span className="art-ribbon__rule" aria-hidden="true" />
            <h2 className="art-ribbon__title">
              <span className="art-ribbon__script">Community</span>
              <span className="art-ribbon__big">Art Wall</span>
            </h2>
            <p>
              Canary Cry has always been a producer-driven show. Sketches, edits, memes, and full
              pieces — submit yours below and it lands here.
            </p>
            <Link className="art-ribbon__submit" to="/artsubmission/">
              Submit your art
            </Link>
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
          
        </div>
      </section>

      <section className="dispatch" aria-label="Canary Cry newsletter">
        <div className="dispatch__strip" aria-hidden="true" />
        <div className="container dispatch__inner">
          <div className="dispatch__art dispatch__art--hosts">
            <img src={asset("images/newsletter-hosts.webp")} alt="Sketch portraits of hosts basiL and gonZ" width="1100" height="638" loading="lazy" />
          </div>
          <div className="dispatch__copy">
            <span className="dispatch__eyebrow">Canary Cry Newsletter</span>
            <h2 className="dispatch__heading">Straight to your inbox</h2>
            <p className="dispatch__text">
              New episode notes, deeper-cut research, and dispatches from the news cycle worth your
              attention. No spam, unsubscribe any time.
            </p>
            <PreviewForm>
              <div className="dispatch__form">
                <TextField aria-label="Email address" type="email" className="dispatch__field">
                  <Input placeholder="you@email.com" className="dispatch__input" />
                </TextField>
                <button className="dispatch__btn" type="submit">
                  Subscribe
                </button>
              </div>
            </PreviewForm>
          </div>
        </div>
      </section>
    </>
  );
}

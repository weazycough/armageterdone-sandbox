// home.tsx — the homepage: mission hero (3-col intro / key art / tagline,
// Value-for-Value band under a blue UFO beam), then recent episodes, shows,
// community art, and the newsletter signup (preview only).

import type * as React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { EpisodeWall, WallHead } from "../components/episode-wall";
import { MissionHeroBody } from "../components/mission-hero-body";
import { MissionHeroFloor } from "../components/mission-hero-floor";
import { NewsletterDispatch } from "../components/newsletter-dispatch";
import { V4vBand } from "../components/v4v-band";
import { asset } from "../lib/asset";
import { loadEpisodes } from "../lib/content.server";
import { ART_RIBBON } from "../lib/fan-art";

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

      <V4vBand />



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

      <NewsletterDispatch />
    </>
  );
}

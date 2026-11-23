// support-hero.tsx — Support-page hero in the home mission-hero language:
// shared mission-hero grid, perspective floor, teal/blue glows, stretched
// Bebas title, compact V4V monogram, producer CTAs, and the V4V mascot art.

import type * as React from "react";
import { asset } from "../lib/asset";
import { MissionHeroFloor } from "./mission-hero-floor";
import { ButtonLink } from "./page-parts";
import { V4vMark } from "./v4v-mark";

const LEDE =
  "No advertisements. No affiliate codes. No vitamin-male-enhancement supplements. The global theology of the advertising industry has no place here.";

export function SupportHero(): React.ReactNode {
  return (
    <section className="mission-hero support-mission" aria-label="Value for Value">
      <div className="support-mission__fx" aria-hidden="true">
        <MissionHeroFloor />
      </div>
      <div className="container mission-hero__inner">
        <div className="mission-hero__grid">
          <div className="mission-hero__intro support-mission__intro">
            <div className="support-mission__copy">
              <p className="mission-hero__kicker">Community Produced</p>
              <span className="mission-hero__bar" aria-hidden="true" />
              <p className="mission-hero__about">{LEDE}</p>
              <span className="mission-hero__bar" aria-hidden="true" />
            </div>
            <div className="support-mission__art-wrap">
              <img
                className="support-mission__art"
                src={asset("images/v4v-mascots.webp")}
                alt="Crowned pixel dog holding a dollar bill beside a yellow canary"
                width={700}
                height={627}
              />
            </div>
          </div>
          <div className="support-mission__center">
            <div className="support-mission__stack">
              <div className="support-mission__mark-wrap">
                <span className="sr-only">Value for Value</span>
                <V4vMark className="support-mission__mark" decorative />
              </div>
              <div className="support-mission__actions">
                <ButtonLink href="#one-time" variant="ghost" className="mission-hero__patreon">
                  One-Time Gift
                </ButtonLink>
                <ButtonLink href="#monthly" className="mission-hero__give">
                  Monthly Producer
                </ButtonLink>
              </div>
            </div>
          </div>
          <div className="support-mission__title-col">
            <h1 className="mission-hero__tag support-mission__tag">
              <span className="sr-only">Time, Talent, Treasure</span>
              <span>Time</span>
              <span>Talent</span>
              <span>Treasure</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

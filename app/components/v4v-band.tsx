// v4v-band.tsx — the home Value for Value band (mascots, wordmark, actions).
// Shared with /search/ so the two pages stay in sync.

import type * as React from "react";
import { asset } from "../lib/asset";
import { V4V_EYEBROW, V4vActions, V4vDescription } from "./v4v-copy";
import { V4vWordmark } from "./v4v-wordmark";

export function V4vBand(): React.ReactNode {
  return (
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
            <span className="mission-hero__v4v-eyebrow">{V4V_EYEBROW}</span>
            <h2 className="mission-hero__v4v-heading">
              <span className="sr-only">Value for Value</span>
              <V4vWordmark className="mission-hero__v4v-mark" decorative />
            </h2>
            <V4vDescription />
          </div>
          <V4vActions className="mission-hero__v4v-actions" />
        </div>
      </div>
    </section>
  );
}

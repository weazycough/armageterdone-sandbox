// shows-v4v.tsx — Shows-page Value for Value band: wordmark + kicker left,
// copy in the middle, stacked Give / Patreon buttons on the right. Home
// V4V is unchanged.

import type * as React from "react";
import { asset } from "../lib/asset";
import { V4vActions } from "./v4v-copy";

export function ShowsV4v(): React.ReactNode {
  return (
    <section className="shows-v4v" aria-label="Value for Value">
      <div className="container shows-v4v__inner">
        <div className="shows-v4v__brand">
          <h2 className="shows-v4v__heading">
            <img
              className="shows-v4v__wordmark"
              src={asset("images/value4value-wordmark.svg")}
              alt="Value4Value"
              width={367}
              height={55}
              decoding="async"
            />
          </h2>
          <p className="shows-v4v__kicker">No advertisers, just producers.</p>
        </div>
        <div className="shows-v4v__copy">
          <p>
            Canary Cry doesn’t take corporate ad money. It runs on producers: the
            listeners who give back with <strong>time, talent, or treasure</strong>.
          </p>
        </div>
        <V4vActions className="shows-v4v__actions" />
      </div>
    </section>
  );
}

// shows-v4v.tsx — full-bleed Value for Value band under Other Works on
// the Shows page: buttons left, copy middle, V4V mark right (spills up).

import type * as React from "react";
import { asset } from "../lib/asset";
import { V4V_EYEBROW, V4vActions, V4vDescription } from "./v4v-copy";

export function ShowsV4v(): React.ReactNode {
  return (
    <section className="shows-v4v" aria-label="Value for Value">
      <div className="container shows-v4v__inner">
        <V4vActions className="shows-v4v__actions mission-hero__v4v-actions" />
        <div className="shows-v4v__copy">
          <span className="mission-hero__v4v-eyebrow">{V4V_EYEBROW}</span>
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
          <V4vDescription />
        </div>
        <div className="shows-v4v__art-wrap">
          <img
            className="shows-v4v__art"
            src={asset("images/v4v-mark.svg")}
            alt=""
            width={111}
            height={54}
            aria-hidden="true"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

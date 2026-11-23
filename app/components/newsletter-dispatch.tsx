// newsletter-dispatch.tsx — the home newsletter signup band (preview only).
// Shared with /search/ so the two pages stay in sync.

import type * as React from "react";
import { TextField } from "react-aria-components";
import { asset } from "../lib/asset";
import { PreviewForm } from "./preview-form";
import { Input } from "./ui/input";

export function NewsletterDispatch(): React.ReactNode {
  return (
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
  );
}

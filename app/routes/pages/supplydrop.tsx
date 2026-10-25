// supplydrop.tsx — the Supply Drop producer mailer (Ghost page-supplydrop.hbs).

import type * as React from "react";
import { SupportRow } from "../../components/support-row";
import {
  BracketFrame,
  ButtonLink,
  Buttons,
  Feature,
  ProseSection,
  Section,
} from "../../components/page-parts";
import { asset } from "../../lib/asset";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("The Supply Drop");

const SUBSCRIBE = "https://buy.stripe.com/dR6eWv1MG99W0mIeUU";

export default function SupplyDrop(): React.ReactNode {
  return (
    <article className="page product-page">
      <header className="product-hero">
        <div className="container">
          <div className="product-hero__inner">
            <BracketFrame>
              <div style={{ padding: "var(--space-3) var(--space-4)" }}>
                <span className="eyebrow">Producer tier · monthly mailer</span>
                <h1>The Supply Drop</h1>
                <p className="product-hero__lede">
                  A thank-you campaign for producers of Canary Cry News Talk — by far the most
                  popular way to support the show.
                </p>
                <Buttons>
                  <ButtonLink href={SUBSCRIBE}>Subscribe — $33.33/mo →</ButtonLink>
                  <ButtonLink
                    href="https://billing.stripe.com/p/login/8wM5kU3KPgUw5ZS8ww"
                    variant="ghost"
                  >
                    Manage subscription
                  </ButtonLink>
                </Buttons>
              </div>
            </BracketFrame>
            <figure style={{ textAlign: "center" }}>
              <img
                className="product-hero__img"
                src={asset("images/supplydrop/supply-drop.webp")}
                alt="Canary Cry Supply Drop graphic"
                style={{ objectFit: "contain", padding: "var(--space-3)" }}
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </header>

      <ProseSection>
        <span className="eyebrow">
          Produce the show <em>and</em> get cool stuff
        </span>
        <h2>The most popular way to support Canary Cry.</h2>
        <p>
          You can take back control over what media lives and what media dies, without the harmful,
          subtle, and diabolical influence of corporate advertisers — and in exchange for that
          simple act of producing, you get a physical thank-you in the mail.
        </p>
        <p>
          The Supply Drop is a curated <strong>quarterly mailer</strong> for $33.33/month producers:
          hats, DVDs, prepper supplies, GMO-free seeds, mugs, aprons, stickers — things that make
          the cage smaller and the canary louder.
        </p>
      </ProseSection>

      <Section alt>
        <div className="section__head">
          <h2>What&apos;s in it</h2>
        </div>
        <div className="product-features">
          <Feature title="📦 Quarterly box">
            A physical thank-you mailer arrives every quarter.
          </Feature>
          <Feature title="🎨 Producer merch">
            Hats, DVDs, prepper supplies, GMO-free seeds, mugs, aprons, stickers, surprises.
          </Feature>
          <Feature title="📜 Show-credit">Supply Drop producers are read live on air.</Feature>
          <Feature title="✋ Cancel anytime">
            Manage your subscription through Stripe&apos;s portal — no friction, no chase calls.
          </Feature>
        </div>
      </Section>

      <Section>
        <SupportRow
          eyebrow="Time, talent, treasure"
          heading="Subscribe to the Supply Drop."
          actions={
            <>
              <ButtonLink href={SUBSCRIBE}>Subscribe →</ButtonLink>
              <ButtonLink href="/support/" variant="ghost">
                Other ways to produce the show
              </ButtonLink>
            </>
          }
        >
          One of the simplest and most rewarding ways to participate in the Value-for-Value model.
        </SupportRow>
      </Section>
    </article>
  );
}

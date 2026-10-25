// tube.tsx — CanaryCry.Tube, producer-funded video (Ghost page-tube.hbs).

import type * as React from "react";
import {
  BracketHero,
  ButtonLink,
  Buttons,
  Feature,
  ProseSection,
  Section,
  Tier,
  Tiers,
} from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("CanaryCry.Tube");

export default function Tube(): React.ReactNode {
  return (
    <article className="page tube-page">
      <BracketHero
        maxWidth="56rem"
        eyebrow="Streaming sovereignty"
        title="CanaryCry.Tube"
        lede={
          <>
            Secure your streaming sovereignty. Replace Netflix / Hulu / Disney+ with decentralized,
            producer-funded video hosting — and get early access to <em>Age of Deceit 4</em> as a
            Focus Group member.
          </>
        }
      />

      <ProseSection>
        <span className="eyebrow">The big idea</span>
        <h2>Big streaming is the cage. Build your own.</h2>
        <p>
          Every major streamer is a cage with a remote control. CanaryCry.Tube is the Canarian
          alternative — independent, producer-funded video that you can actually own, share, and
          re-watch without an algorithm steering you somewhere you didn&apos;t ask to go.
        </p>
        <p>
          Members of the <strong>Age of Deceit 4 Focus Group</strong> preview upcoming films, give
          feedback, and get their names in the credits of the final cut.
        </p>
      </ProseSection>

      <Section alt>
        <div className="section__head">
          <h2>Join the Tube</h2>
        </div>
        <Tiers two>
          <Tier
            href="/support/#monthly"
            variant="accent"
            amount="Credit / debit"
            title="Join via Stripe"
            cta="Go to Support →"
          >
            Pick a monthly producer tier — Tube access included. The recurring producer flow lives
            on the Support page.
          </Tier>
          <Tier
            href="https://www.paypal.com/donate?campaign_id=QB8E4D5WT5AHN"
            variant="highlight"
            amount="PayPal campaign"
            title="Join via PayPal"
            cta="PayPal →"
          >
            One-time or recurring through PayPal&apos;s campaign flow.
          </Tier>
        </Tiers>
      </Section>

      <Section>
        <div className="product-features">
          <Feature title="🎬 Age of Deceit 4 access">
            Focus Group members preview upcoming films before public release.
          </Feature>
          <Feature title="📜 Credits">Focus Group members are credited in the final cut.</Feature>
          <Feature title="📡 Decentralized hosting">
            Producer-funded. No corporate streamer in the loop.
          </Feature>
          <Feature title="✋ Cancel anytime">You own the relationship. Walk away whenever.</Feature>
        </div>
      </Section>

      <ProseSection alt width="42rem" center>
        <span className="eyebrow">The hard times are here</span>
        <h2>This is a V4V need.</h2>
        <p>
          Streaming sovereignty isn&apos;t a luxury anymore. Producer support is what makes it
          possible.
        </p>
        <Buttons>
          <ButtonLink href="/support/">All ways to produce the show</ButtonLink>
        </Buttons>
      </ProseSection>
    </article>
  );
}

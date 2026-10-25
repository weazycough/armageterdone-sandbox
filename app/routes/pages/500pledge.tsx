// 500pledge.tsx — the episode 500 producer pledge (Ghost page-500pledge.hbs).

import type * as React from "react";
import { BracketHero, ButtonLink, Buttons, ProseSection } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Episode 500 Producer Pledge");

export default function Pledge500(): React.ReactNode {
  return (
    <article className="page milestone-page">
      <BracketHero
        maxWidth="56rem"
        eyebrow="Milestone · join the Roundtable"
        title="Episode 500 Producer Pledge"
        titleStyle={{ fontSize: "clamp(3rem, 6vw, 4.5rem)" }}
        lede="Receive the challenge coin and take your seat at the Roundtable for the Canary Cry 500th-episode celebration."
      />

      <ProseSection>
        <span className="eyebrow">Make it accessible</span>
        <h2>Producer pledge at $20.83/month, 24 months.</h2>
        <p>
          We understand that with the financial instability in the world today, the thought of
          supporting independent media for $500 in one shot can seem daunting. We want to make this
          celebration accessible to as many producers as possible.
        </p>
        <p>
          So for those who want to commit but spread it out — break the $500 into{" "}
          <strong>24 monthly contributions of $20.83</strong> via PayPal. You still receive the
          challenge coin, you still earn your seat, and the show still gets the support it needs.
        </p>
        <Buttons>
          <ButtonLink href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-94C354942G054982LMKWMMOA">
            Pledge $20.83/mo for 24 months →
          </ButtonLink>
          <ButtonLink href="/support/" variant="ghost">
            Other ways to produce the show
          </ButtonLink>
        </Buttons>
      </ProseSection>

      <ProseSection alt width="42rem" center>
        <span className="eyebrow">Celebrate with us</span>
        <h2>A physical token. A permanent seat.</h2>
        <p>
          The 500th-episode challenge coin is a one-time mint. Producers who complete the pledge get
          one shipped — and a Knighthood/Damehood when the cumulative threshold lands.
        </p>
        <Buttons>
          <ButtonLink href="/roundtable/" variant="ghost">
            See the Roundtable
          </ButtonLink>
        </Buttons>
      </ProseSection>
    </article>
  );
}

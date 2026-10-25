// ccbc.tsx — the Canary Cry Babysitters Club (Ghost page-ccbc.hbs).

import type * as React from "react";
import { BracketHero, ProseSection, Section, Tier, Tiers } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Babysitters Club");

export default function Ccbc(): React.ReactNode {
  return (
    <article className="page ccbc-page">
      <BracketHero
        maxWidth="56rem"
        eyebrow="Canary Cry · CCBC"
        title="Babysitters Club"
        lede="The Children are our Future — and somebody has to watch them so Gonz can get to the mic."
      />

      <ProseSection>
        <span className="eyebrow">Sir Darren of the Hungry Panda · Sir Dove of Rustbeltia</span>
        <h2>Babies need sitting.</h2>
        <p>
          Over the years we&apos;ve celebrated a number of little baby Canarian Chicks being added
          to the Canary Cry family. None, however, have been as directly disruptive to the show as
          Gonz&apos;s beautiful babies. Like all good parents, the Shimura family has had to make
          hard tradeoffs to keep both the kids and the show alive.
        </p>
        <p>
          Unfortunately, due to Gonz&apos;s residence in Commiefornia, this has presented a serious
          burden to the Shimura family budget. So we&apos;re reaching out to the Canary Cry family
          of producers to help carry the load. The cost of a sitter, multiplied by a recording
          schedule, is non-trivial — and the producers are the reason the show survives that math.
        </p>
        <p>
          Previously the plan was that we&apos;d only need <strong>42 producers</strong> to join the
          Babysitters Club. Turns out that was foolishly optimistic — professional baby-sitters live
          in the same economy as the rest of us. So we were laughed out of the kingdom and had to
          refresh the model.
        </p>
        <p>
          This is one of those rare opportunities where producers can know <em>exactly</em> what
          their support is being used for. It may be one of the most important parts of the
          show&apos;s budget. <strong>Join the Club</strong> — and as a thank-you, you start
          receiving Supply Drops and on-air recognition along with the satisfaction of knowing
          exactly where the dollars went.
        </p>
      </ProseSection>

      <Section alt>
        <div className="section__head">
          <h2>Join the Babysitters Club</h2>
        </div>
        <Tiers two>
          <Tier
            href="https://buy.stripe.com/dR6eWv1MG99W0mIeUU"
            variant="accent"
            amount="Stripe · monthly"
            title="Recurring Producer (Supply Drop tier)"
            cta="Stripe checkout →"
          >
            The Babysitters Club share rides on the Supply Drop recurring tier — $33.33/mo. You get
            the quarterly box, the Shimura kids get a sitter.
          </Tier>
          <Tier
            href="https://www.paypal.com/donate/?hosted_button_id=LYZ7GMHZUBC86"
            variant="highlight"
            amount="PayPal"
            title="One-time Babysitter Producership"
            cta="PayPal →"
          >
            Drop a one-time gift specifically toward the babysitter budget via PayPal.
          </Tier>
        </Tiers>

        <p className="muted" style={{ textAlign: "center", marginTop: "var(--space-7)" }}>
          Sir Dove of Rustbeltia maintains a fundraising thermometer that updates as the club grows
          — to be re-embedded here once migrated.
        </p>
      </Section>

      <ProseSection width="42rem" center>
        <span className="eyebrow">Soli Deo Gloria</span>
        <h2>The Children are our Future.</h2>
        <p>
          The show only happens because somebody&apos;s watching the kids. Producers, that&apos;s
          you.
        </p>
      </ProseSection>
    </article>
  );
}

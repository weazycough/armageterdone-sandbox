// roundtable.tsx — the Canary Cry Roundtable of Knights, Dames and Barons
// (Ghost page-roundtable.hbs). The names are in app/lib/roundtable.ts.

import type * as React from "react";
import { SupportRow } from "../../components/support-row";
import { BracketFrame, ButtonLink, Buttons, Section } from "../../components/page-parts";
import { asset } from "../../lib/asset";
import { pageTitle } from "../../lib/meta";
import { BARONS, KNIGHTS } from "../../lib/roundtable";

export const meta = () => pageTitle("The Canary Cry Roundtable");

export default function Roundtable(): React.ReactNode {
  return (
    <article className="page roundtable-page">
      <header className="roundtable-hero">
        <div className="container">
          <div className="roundtable-hero__grid">
            <BracketFrame className="roundtable-hero__copy">
              <div style={{ padding: "var(--space-2) var(--space-4)" }}>
                <span className="eyebrow">Value-for-value</span>
                <h1>The Canary Cry Roundtable</h1>
                <p className="roundtable-hero__lede">
                  Knights, Dames, Barons and Baronesses — those who made the show possible by
                  producing it themselves.
                </p>
                <Buttons>
                  <ButtonLink href="/support/">Produce the show →</ButtonLink>
                  <ButtonLink href="#knights" variant="ghost">
                    See the Roundtable
                  </ButtonLink>
                </Buttons>
              </div>
            </BracketFrame>
            <figure className="roundtable-hero__art">
              <img
                src={asset("images/roundtable/knighthood-mid.webp")}
                alt="Two Canary Cry knights with swords, art by Producer Pete"
              />
              <figcaption className="muted">Art by Producer Pete</figcaption>
            </figure>
          </div>
        </div>
      </header>

      <Section>
        <div className="prose" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <span className="eyebrow">Value-for-value model (2012 – present)</span>
          <h2>Knighthood and Damehood</h2>
          <p>
            As you know, Canary Cry News Talk operates on the <strong>Value-for-Value Model</strong>
            . Rather than exposing our listeners to a single second of air-time to the corporate
            interests of &quot;stakeholder-capitalism&quot; (see: The Great Reset), we believe that
            true independent media is only possible when it is completely divorced from the
            manipulative economic incentives of corporations.
          </p>
          <p>
            That is why the Canary Cry Roundtable exists — to recognize and honor those on the noble
            pursuit to support true, independent media.
          </p>
        </div>
      </Section>

      <Section alt>
        <div className="roundtable-take-seat">
          <div>
            <span className="eyebrow">Eligibility</span>
            <h2>How to take your seat at the Roundtable</h2>
            <p>
              Knighthood or Damehood titles are bestowed upon generous and longstanding Producers of
              Canary Cry News Talk. Without their tireless and selfless devotion to what The King is
              doing on earth, CCNT wouldn&apos;t be possible.
            </p>
            <blockquote>
              <p>
                Therefore, let it be known that{" "}
                <strong>
                  any Canary Cry Producer who supports the show in the amount of $1000 or more
                </strong>{" "}
                — either in a single gift, or the cumulative sum over many years —{" "}
                <strong>shall be granted the esteemed title of Knight or Dame</strong> of the Canary
                Cry Roundtable. Upon them shall be bestowed the rights, privileges, respect, and
                gratitude they have shown themselves worthy of.
              </p>
            </blockquote>
          </div>
          <aside className="roundtable-cta">
            <h3>Begin your journey, today.</h3>
            <p>
              The Roundtable accepts any contribution — Patreon, Stripe, PayPal, or Cage Rattler
              Coffee club. All count toward the cumulative threshold.
            </p>
            {/* Ghost: .roundtable-cta .btn, full width. */}
            <ButtonLink href="/support/" className="mt-3 w-full">
              Produce the show!
            </ButtonLink>
          </aside>
        </div>
      </Section>

      <Section id="knights">
        <header className="roundtable-tier-head">
          <figure>
            <img
              src={asset("images/roundtable/knighthood.webp")}
              alt="The Canary Cry coat of arms — a knight on horseback with the canary shield"
              width="220"
            />
          </figure>
          <div>
            <span className="eyebrow">The Roundtable</span>
            <h2>Canary Cry Knights and Dames</h2>
            <p className="muted">
              Numbers in parentheses indicate the cumulative episode count of their support. Listed
              in order of induction.
            </p>
          </div>
        </header>

        <ol className="roundtable-list">
          {KNIGHTS.map((k) => (
            <li key={k.name}>
              {k.name} <span className="ep">({k.ep})</span>
              {k.badge !== undefined && (
                <>
                  {" "}
                  <span className="badge">{k.badge}</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section alt>
        <header className="roundtable-tier-head roundtable-tier-head--centered">
          <span className="eyebrow">A higher tier still</span>
          <h2>Barons and Baronesses</h2>
          <p className="muted">Those whose support has crossed an even further threshold.</p>
        </header>
        <ul className="roundtable-barons">
          {BARONS.map((b) => (
            <li key={b.name}>
              <h3>{b.name}</h3>
              <p>
                {b.title} <span className="ep">({b.ep})</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="prose roundtable-thanks">
          <span className="eyebrow">Crackpot and Buzzkill</span>
          <h2>Thank you, John and Adam</h2>
          <p>
            In the introduction of the Canary Cry Roundtable of Knights and Dames we are following
            the example set forth by the <em>No Agenda Show</em>, co-hosted by tech journalist John
            C. Dvorak and co-inventor of the RSS feed Adam Curry (the Podfather).
          </p>
          <p>
            We believe the Value-for-Value model is the only true way to operate independently in
            this age of information overload and open corporate-incentivized tyranny in America and
            the world. We thank both John and Adam for their service.
          </p>
        </div>
      </Section>

      <Section alt>
        <SupportRow eyebrow="Earn your seat" heading="The Roundtable is open">
          Any contribution counts — Patreon, Stripe, PayPal, Cage Rattler Coffee, art, time.
          Cumulative production over the years qualifies the same as a single gift.
        </SupportRow>
      </Section>
    </article>
  );
}

// support.tsx — Become a Producer: every way to support the show (Ghost
// page-support.hbs).

import type * as React from "react";
import { Link } from "react-router";
import {
  BracketHero,
  ButtonLink,
  Buttons,
  ProseSection,
  Prose,
  Section,
  Tier,
  Tiers,
} from "../../components/page-parts";
import { SmartLink } from "../../components/smart-link";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Become a Producer");

const OTHER_PATHS = [
  {
    href: "https://cagerattlercoffee.com/",
    eyebrow: "Drink the discernment",
    title: "Cage Rattler Coffee",
    text: "Producer-roasted coffee. Every bag funds the show.",
  },
  {
    href: "/supplydrop/",
    eyebrow: "Monthly mailer",
    title: "Supply Drop",
    text: "The most popular producer tier — a physical thank-you box.",
  },
  {
    href: "/tshirt/",
    eyebrow: "Producer artwork",
    title: "T-Shirt Council",
    text: "Years of producer art you can wear.",
  },
  {
    href: "/roundtable/",
    eyebrow: "$1000+ cumulative",
    title: "Roundtable Knighthood",
    text: "The honored tier of long-standing producers.",
  },
];

export default function Support(): React.ReactNode {
  return (
    <article className="page support-page">
      <BracketHero
        variant="support"
        maxWidth="60rem"
        eyebrow="Value for value"
        title="Become a Producer"
        lede="No advertisements. No affiliate codes. No vitamin-male-enhancement supplements. The global theology of the advertising industry has no place here."
      >
        <ButtonLink href="#one-time">Make a one-time gift</ButtonLink>
        <ButtonLink href="#monthly" variant="ghost">
          Become a monthly producer
        </ButtonLink>
      </BracketHero>

      <Section>
        <Prose>
          <span className="eyebrow">The model</span>
          <h2>Value for Value, not value for ads.</h2>
          <p>
            Big-tech Silicon Valley giants like Facebook and Google owe the lion&apos;s share of
            their profits to advertising — and the price of that &quot;free&quot; content is your
            attention, your data, and a constant nudge toward whatever the buyer wants you to feel.
          </p>
          <p>
            <strong>Canary Cry doesn&apos;t run that play.</strong> The show is built on producers —
            listeners who return value for the value they got. There are three currencies producers
            use to do that:
          </p>
        </Prose>

        <div className="ttt-grid">
          <article className="ttt-card">
            <span className="ttt-card__num">01</span>
            <h3>Time</h3>
            <p>
              Show up. Bring a friend. Attend a meet-up. Submit a Speak Pipe call. Comment in the
              Discord. The community is the show.
            </p>
            <p>
              <Link to="/meet-ups/">Meet-ups →</Link>
            </p>
          </article>
          <article className="ttt-card">
            <span className="ttt-card__num">02</span>
            <h3>Talent</h3>
            <p>
              Make art. Edit clips. Translate. Code something useful. Design a flyer. The Producer
              Art Wall is a few clicks away — and there&apos;s room for whatever skill you&apos;ve
              got.
            </p>
            <p>
              <Link to="/artsubmission/">Submit your work →</Link>
            </p>
          </article>
          <article className="ttt-card">
            <span className="ttt-card__num">03</span>
            <h3>Treasure</h3>
            <p>
              Patreon, PayPal, Stripe, Cage Rattler Coffee, the Supply Drop, the T-Shirt Council,
              crypto, snail mail. Producerships above <strong>$7.77 get read live on air</strong>.
            </p>
            <p>
              <a href="#monthly">Pick a tier →</a>
            </p>
          </article>
        </div>
      </Section>

      <Section alt id="one-time">
        <div className="section__head">
          <span className="eyebrow">Treasure · one-time</span>
          <h2>One-time gift</h2>
        </div>
        <p style={{ maxWidth: "36rem" }}>
          Choose any amount, or pick a suggestion below. Producerships above <strong>$7.77</strong>{" "}
          have their accompanying note read live on air.
        </p>
        <Tiers>
          <Tier
            href="https://www.paypal.com/donate?hosted_button_id=ZRPPGHKR9TF6L"
            amount="$3.33 · $33.33 · $333"
            title="Pockets full of 3s"
            cta="PayPal →"
          >
            Producers seem to love signaling to the Illuminati Overlords by producing in sets of 3s.
          </Tier>
          <Tier
            href="https://www.paypal.com/donate?hosted_button_id=JL8DL6FN9CDGL"
            variant="accent"
            amount="$11.11"
            title="11:11"
            cta="PayPal →"
          >
            Are you seeing 11s everywhere you look? Maybe it&apos;s time to become an 11:11
            producer.
          </Tier>
          <Tier
            href="https://www.paypal.com/donate?hosted_button_id=4P66WSKQ9NBSY"
            amount="$7.77 · $77.77 · $777"
            title="Pockets full of 7s"
            cta="PayPal →"
          >
            The perfect producership. A set of 7s — the Biblical number of perfection.
          </Tier>
          <Tier
            href="https://www.paypal.com/donate/?hosted_button_id=L39EGRV9YQJWN"
            variant="open"
            amount="Any amount"
            title="Open one-time gift"
            cta="PayPal →"
          >
            Set your own number. Notes above $7.77 are read on air.
          </Tier>
        </Tiers>
      </Section>

      <Section id="monthly">
        <div className="section__head">
          <span className="eyebrow">Treasure · monthly recurring</span>
          <h2>Monthly producer</h2>
        </div>
        <p style={{ maxWidth: "36rem" }}>
          Steady support keeps the lights on month after month. The right tier earns Roundtable
          Knighthood or Damehood faster than you&apos;d expect.
        </p>
        <Tiers>
          <Tier
            href="https://www.paypal.com/donate/?Z3JncnB0=&hosted_button_id=JL8DL6FN9CDGL"
            amount="$11.11 / month"
            title="11:11 producer"
            cta="PayPal subscription →"
          >
            The classic recurring tier. Signaling, sustained.
          </Tier>
          <Tier
            href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-9S867986SJ736822NME34SYI"
            variant="accent"
            amount="$33.33 / month"
            title="Illuminati handler producer"
            cta="PayPal subscription →"
          >
            Signal to the Overlords and reach <strong>Knighthood in 30 months</strong>. The fastest
            mid-tier path to the Roundtable.
          </Tier>
          <Tier
            href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-3DG07689C2717291SME34YCI"
            variant="highlight"
            amount="$83.33 / month"
            title="One-year Knighthood"
            cta="PayPal subscription →"
          >
            Always wanted to be a Knight or Dame of the Canary Cry Roundtable? At $83.33/month, it
            only takes one year. A seat is reserved.
          </Tier>
        </Tiers>
        <p className="page-buttons page-buttons--center" style={{ marginTop: "var(--space-7)" }}>
          <ButtonLink href="https://www.patreon.com/ccnt" variant="ghost">
            Or subscribe via Patreon →
          </ButtonLink>
        </p>
      </Section>

      <Section alt>
        <div className="section__head">
          <span className="eyebrow">Per-episode tiers</span>
          <h2>Associate &amp; Executive Producership</h2>
        </div>
        <p style={{ maxWidth: "40rem" }}>
          The title of <strong>Associate Executive Producer</strong> is granted to producers who
          support the show <strong>$100+ for any single episode</strong>. The title of{" "}
          <strong>Executive Producer</strong> goes to the producer with the highest single-episode
          support above $100.
        </p>
        <Tiers two>
          <Tier
            href="https://www.paypal.com/donate/?Z3JncnB0=&hosted_button_id=FBGDFZ6TXVSDW"
            variant="accent"
            amount="$100+"
            title="Associate Producer"
            cta="PayPal →"
          >
            Titled for any single episode.
          </Tier>
          <Tier
            href="https://www.paypal.com/donate/?hosted_button_id=EM35LPN9GM2SW"
            variant="highlight"
            amount="$100+"
            title="Executive Producer"
            cta="PayPal →"
          >
            The highest contributor of the episode wins this seat.
          </Tier>
        </Tiers>
      </Section>

      <Section>
        <div className="section__head">
          <h2>Other paths to produce</h2>
        </div>
        <div className="other-paths">
          {OTHER_PATHS.map((p) => (
            <SmartLink className="other-path" href={p.href} key={p.href}>
              <span className="eyebrow">{p.eyebrow}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </SmartLink>
          ))}
        </div>
        <div className="other-paths">
          <div className="other-path other-path--info">
            <span className="eyebrow">Anonymous, no fees</span>
            <h3>Cryptocurrency</h3>
            <p>
              Consider yourself a Crypto Chad? Crypto producerships arrive anonymously — please
              email for show credit.
            </p>
            <p>
              <a href="mailto:canarycryradio@protonmail.com">
                Email for wallets &amp; show credit →
              </a>
            </p>
          </div>
          <SmartLink className="other-path" href="https://donate.stripe.com/aEU8y7fDw3PCfhC4gh">
            <span className="eyebrow">Card · no PayPal</span>
            <h3>Stripe direct (V4V)</h3>
            <p>
              One-time gift via Stripe checkout — for producers who&apos;d rather skip PayPal
              entirely.
            </p>
          </SmartLink>
          <div className="other-path other-path--info">
            <span className="eyebrow">Snail mail</span>
            <h3>Cash, check, or postcard</h3>
            <address>
              Canary Cry Radio (or News Talk)
              <br />
              P.O. BOX 1026
              <br />
              Bonsall, CA 92003
            </address>
            <p className="muted">
              Checks to &quot;Gonzo Shimura&quot;. New mailing address coming.
            </p>
          </div>
        </div>
      </Section>

      <ProseSection alt>
        <span className="eyebrow">Skills, talents, time</span>
        <h2>Money isn&apos;t the only currency.</h2>
        <p>
          Canary Cry News Talk grows and thrives thanks to the participation and skills of
          producers. Want to help out the show in ways that money can&apos;t buy — clip editing,
          art, transcripts, translation, code, design? Reach out and tell us what you&apos;ve got.
        </p>
        <Buttons>
          <ButtonLink
            href="https://docs.google.com/forms/d/e/1FAIpQLSfZ-Jv4t0zAmcWmeENve2V8i9FpmTTqG2CSuKd3SrkpdzQUiQ/viewform?usp=sf_link"
            newTab
          >
            Volunteer your skills →
          </ButtonLink>
          <ButtonLink href="/artsubmission/" variant="ghost">
            Submit producer art
          </ButtonLink>
        </Buttons>
      </ProseSection>

      <ProseSection width="42rem" center>
        <span className="eyebrow">Think Outside the Cage</span>
        <h2>Thank you for keeping the canary singing.</h2>
        <p>
          Every producer — at every tier — is the reason this show exists outside the cage of
          corporate media. <strong>Soli Deo Gloria</strong>.
        </p>
      </ProseSection>
    </article>
  );
}

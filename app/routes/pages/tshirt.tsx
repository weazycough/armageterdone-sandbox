// tshirt.tsx — the T-Shirt Council (Ghost page-tshirt.hbs). The Stripe
// pricing table is still a placeholder: it needs the team's Stripe ids, and
// Stripe's script would be the site's first third-party script.

import type * as React from "react";
import { SupportRow } from "../../components/support-row";
import {
  BracketFrame,
  ButtonLink,
  Buttons,
  Feature,
  Placeholder,
  ProseSection,
  Section,
} from "../../components/page-parts";
import { asset } from "../../lib/asset";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("The T-Shirt Council");

const SHIRTS = [
  { file: "logo-black-tshirt-2mb.webp", alt: "Crest logo shirt", name: "The Crest" },
  { file: "ufo-shirt.webp", alt: "UFO shirt", name: "UFO" },
  { file: "rocketman-shirt.webp", alt: "Rocketman shirt", name: "Rocketman" },
  { file: "arm-and-hammer-shirt-2mb.webp", alt: "Arm & Hammer shirt", name: "Arm & Hammer" },
  { file: "baby-shirt-2mb.webp", alt: "Baby shirt", name: "The Baby" },
  { file: "rooster-shit-2mb.webp", alt: "Rooster shirt", name: "Rooster" },
  { file: "angry-canaries-shirt-2mb.webp", alt: "Angry Canaries shirt", name: "Angry Canaries" },
  { file: "sammons-shirt-2mb.webp", alt: "Sir Sammons shirt", name: "Sir Sammons" },
  { file: "charliecharlie-shirt-2-mb.webp", alt: "Charlie Charlie shirt", name: "Charlie Charlie" },
  {
    file: "antarctica-samurai-shirt-2mb.webp",
    alt: "Antarctica Samurai shirt",
    name: "Antarctica Samurai",
  },
];

export default function TShirt(): React.ReactNode {
  return (
    <article className="page product-page">
      <header className="product-hero">
        <div className="container">
          <div className="product-hero__inner">
            <BracketFrame>
              <div style={{ padding: "var(--space-3) var(--space-4)" }}>
                <span className="eyebrow">Producer merch · wearable canon</span>
                <h1>The T-Shirt Council</h1>
                <p className="product-hero__lede">
                  In the smokey back rooms of the Canarium, an elite group of producers gather to
                  support quality, Biblically-informed mainstream news analysis and deconstruction.
                  They are united not only by truth — but by wearing it.
                </p>
                <Buttons>
                  <ButtonLink href="#tiers">See the Council tiers</ButtonLink>
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
                src={asset("images/tshirts/logo-black-tshirt-2mb.webp")}
                alt="Canary Cry t-shirt with the crest logo"
                loading="lazy"
              />
              <figcaption className="muted" style={{ marginTop: "var(--space-2)" }}>
                The flagship crest shirt — one of the dozens in rotation.
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      <ProseSection>
        <span className="eyebrow">Years of producer artwork</span>
        <h2>Truth will never go out of style.</h2>
        <p>
          The T-Shirt Council is the producer art wall turned wearable. Years of submitted artwork —
          Sir Sammons, Dove, Allie, MarkA, the rest of the producer roster — rotated into a monthly
          drop.
        </p>
        <p>
          Council members get a new shirt regularly, with the artwork that defined that month&apos;s
          episodes. The producers behind the art get credit. The show gets sustained. The cage stays
          open.
        </p>
      </ProseSection>

      <Section alt id="tiers">
        <div className="section__head">
          <h2>The Council tiers</h2>
        </div>
        <p className="muted" style={{ maxWidth: "36rem", margin: "0 0 var(--space-6)" }}>
          Stripe handles the subscription. Pricing tiers and per-month shirt counts are managed in
          the embedded pricing table below — values stay in sync with what&apos;s configured on the
          show&apos;s Stripe account.
        </p>
        <Placeholder label="Stripe pricing table embed slot">
          <p className="placeholder-box__note">
            The team&apos;s existing Stripe Pricing Table will be embedded here at launch.
          </p>
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "var(--space-3)" }}>
            (The original Squarespace page used{" "}
            <code>https://js.stripe.com/v3/pricing-table.js</code> with a publishable key +
            pricing-table ID. Send the same two values in an issue and the table goes here.)
          </p>
        </Placeholder>
      </Section>

      <Section>
        <div className="section__head">
          <h2>The producer-art shirt gallery</h2>
          <span className="muted">A rotation of submitted designs over the years</span>
        </div>
        <div className="tshirt-gallery">
          {SHIRTS.map((s) => (
            <figure className="tshirt-gallery__tile" key={s.file}>
              <img
                src={asset(`images/tshirts/${s.file}`)}
                alt={s.alt}
                loading="lazy"
                width="300"
                height="300"
              />
              <figcaption>{s.name}</figcaption>
            </figure>
          ))}
        </div>
        <p
          className="muted"
          style={{ textAlign: "center", marginTop: "var(--space-5)", fontSize: "0.85rem" }}
        >
          And dozens more in the producer archive. The Council ships one fresh design per quarter —
          never the same shirt twice.
        </p>
      </Section>

      <Section>
        <div className="product-features">
          <Feature title="🎨 Wear producer art">
            Council shirts feature the same producer art that lives on the art wall.
          </Feature>
          <Feature title="📜 Artist credit">
            Every shirt credits the producer behind the art.
          </Feature>
          <Feature title="🪧 Show-credit">Council producers get read on air.</Feature>
          <Feature title="✋ Manage anytime">
            Stripe billing portal for size changes, holds, and cancellations.
          </Feature>
        </div>
      </Section>

      <Section alt>
        <SupportRow
          eyebrow="Want to design a shirt?"
          heading="Submit producer art."
          actions={
            <>
              <ButtonLink href="/artsubmission/">Submit your art</ButtonLink>
              <ButtonLink href="/support/" variant="ghost">
                Other ways to produce the show
              </ButtonLink>
            </>
          }
        >
          The Council&apos;s shirts come straight from producer submissions. If you draw, you can
          clothe a Canarian.
        </SupportRow>
      </Section>
    </article>
  );
}

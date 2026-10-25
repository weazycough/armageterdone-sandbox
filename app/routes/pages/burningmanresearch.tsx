// burningmanresearch.tsx — a decade of Burning Man research (Ghost
// page-burningmanresearch.hbs).

import type * as React from "react";
import { BracketHero, ButtonLink, Buttons, ProseSection } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Burning Man Research");

const PRODUCE = "https://buy.stripe.com/eVq00jdiccy777s9Xv3F607";

export default function BurningManResearch(): React.ReactNode {
  return (
    <article className="page bmr-page">
      <BracketHero
        maxWidth="56rem"
        eyebrow="Decade-long research"
        title="So you think you know about Burning Man?"
        lede="It's not just a pilgrimage. The show has covered Burning Man for over a decade — annual fieldwork, theological analysis, and producer-funded ground-truthing."
      >
        <ButtonLink href={PRODUCE}>Produce Burning Man Research →</ButtonLink>
        <ButtonLink href="#archive" variant="ghost">
          Decade archive ↓
        </ButtonLink>
      </BracketHero>

      <ProseSection>
        <span className="eyebrow">Start with the most recent</span>
        <h2>The Burning Man 2023 Mudpacalypse mega-episode.</h2>
        <p>
          <strong>
            &quot;What Were Christians Doing at Burning Man 2023? Church Intel Report&quot;
          </strong>{" "}
          — Social engineering, mass trauma, Babylon reborn, squeaky toys. The most thorough
          single-episode reference for the field. Find it on the Episodes page or via your podcast
          app of choice.
        </p>
        <Buttons>
          <ButtonLink href="/episodes/" variant="ghost">
            Find the episode →
          </ButtonLink>
        </Buttons>
      </ProseSection>

      <ProseSection alt id="archive">
        <span className="eyebrow">A decade of research</span>
        <h2>The archive.</h2>
        <p>
          The show has covered Burning Man every year since the early run. Each year&apos;s coverage
          is tagged in the episode archive — search by year or pull the deep cuts in the Roundtable
          conversations (CCConvo 008 and 009 are essential).
        </p>
        <Buttons>
          <ButtonLink href="/episodes/" variant="ghost">
            Browse the archive →
          </ButtonLink>
        </Buttons>
      </ProseSection>

      <ProseSection>
        <span className="eyebrow">Get involved</span>
        <h2>Help fund the next field season.</h2>
        <p>
          Burning Man Research isn&apos;t an armchair project. Producers funded ground-truthing
          trips, recording equipment, interviews, and the time it takes to do the analysis right. If
          you want to help carry the next year:
        </p>
        <Buttons>
          <ButtonLink href={PRODUCE}>Produce Burning Man Research →</ButtonLink>
          <ButtonLink
            href="mailto:canarycryradio@protonmail.com?subject=Burning%20Man%20Research"
            variant="ghost"
          >
            Get in touch
          </ButtonLink>
        </Buttons>
      </ProseSection>
    </article>
  );
}

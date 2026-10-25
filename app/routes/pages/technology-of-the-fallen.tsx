// technology-of-the-fallen.tsx — the long-form essay as a PDF (Ghost
// page-technology-of-the-fallen.hbs).

import type * as React from "react";
import { Embed } from "../../components/embed";
import { BracketHero, Prose, Section } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Technology of the Fallen");

const PDF =
  "https://www.dropbox.com/scl/fi/n8m1ksc4omwv2m7aqcdrx/PDF_Technology-of-the-Fallen-April-2024.pdf?raw=1";

export default function TechnologyOfTheFallen(): React.ReactNode {
  return (
    <article className="page book-page">
      <BracketHero
        maxWidth="52rem"
        eyebrow="Long-form essay"
        title="Technology of the Fallen"
        lede="A long-running theme on the show — collected into a single document."
      />

      <Section>
        <Prose>
          <p>
            The PDF below is a working draft from April 2024. It connects threads that the show has
            pulled at across years of episodes — the spiritual dimension of modern technology, the
            question of who is building what, and a Biblical frame for it.
          </p>
        </Prose>

        <div style={{ maxWidth: "56rem", margin: "var(--space-6) auto" }}>
          <Embed
            service="Dropbox"
            title="Technology of the Fallen — April 2024 PDF"
            src={PDF}
            openHref={PDF}
            openLabel="Download the PDF instead"
            style={{ aspectRatio: "4 / 5" }}
          />
        </div>

        <p className="muted" style={{ textAlign: "center", fontSize: "0.85rem" }}>
          Hosted on Dropbox. The team can swap in a copy hosted on this site once one is sent in.
        </p>
      </Section>
    </article>
  );
}

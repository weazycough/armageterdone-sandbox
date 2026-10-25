// artsubmission.tsx — the producer art submission page and gallery (Ghost
// page-artsubmission.hbs).

import type * as React from "react";
import { ArtGallery } from "../../components/art-gallery";
import { BracketFrame, ButtonLink, Section } from "../../components/page-parts";
import { ART_RIBBON } from "../../lib/fan-art";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Art Submission Portal");

const FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSe_2COkOqBZrODNFLgZB8pALerwt6miCXw7qgiuOJvfSGjk3w/viewform";

export default function ArtSubmission(): React.ReactNode {
  return (
    <article className="page artsubmission-page">
      <header className="artsub-hero">
        <div className="container">
          <BracketFrame className="artsub-hero__inner">
            <div style={{ padding: "var(--space-3) var(--space-4)" }}>
              <span className="eyebrow">From the producers</span>
              <h1>CanaryCry Art Submission Portal</h1>
              <p className="artsub-hero__lede">
                Canary Cry News Talk is a podcast that provides therapeutic reflection and
                processing of our troubling world. Producers express the themes, moments, and even
                the jokes from the show through art.
              </p>
            </div>
          </BracketFrame>
        </div>
      </header>

      <Section>
        <div className="artsub-cta">
          <div className="artsub-cta__copy">
            <span className="eyebrow">Submit your art</span>
            <h2>The Value-for-Value model includes art.</h2>
            <p>
              We love profiling the talents of our producers — it&apos;s a core resource for the
              ever-growing Canary Cry culture. While we make every attempt to credit and present all
              art submitted, submissions are not guaranteed to appear on the next episode.
            </p>
            <p>
              <strong>
                Submit your art and participate in the Value-for-Value model as a producer of the
                show.
              </strong>
            </p>
          </div>
          <aside className="artsub-cta__form">
            <p className="muted" style={{ marginBottom: "var(--space-3)" }}>
              Google Form — opens in a new tab
            </p>
            {/* Ghost: .artsub-cta__form .btn, full width and larger. */}
            <ButtonLink href={FORM} newTab className="w-full px-[1.2rem] py-4 text-[0.95rem]">
              Click here to upload art →
            </ButtonLink>
          </aside>
        </div>
      </Section>

      <Section alt>
        <header style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <span className="eyebrow">Producer art wall</span>
          <h2>Submitted artwork</h2>
          <p className="muted">
            Tap any thumbnail to view the full piece. Press Esc or tap outside to close.
          </p>
        </header>

        <ArtGallery tiles={ART_RIBBON} />

        <p className="page-buttons page-buttons--center" style={{ marginTop: "var(--space-7)" }}>
          <ButtonLink href={FORM} newTab>
            Submit your art →
          </ButtonLink>
        </p>
      </Section>
    </article>
  );
}

// transcripts.tsx — episode transcripts (Ghost page-transcripts.hbs). None
// are published yet, so this is the template's empty state; the Ghost
// version listed posts tagged "transcript" once there were any.

import type * as React from "react";
import { Link } from "react-router";
import {
  BracketHero,
  ButtonLink,
  Buttons,
  Prose,
  ProseSection,
  Section,
} from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Episode Transcripts");

export default function Transcripts(): React.ReactNode {
  return (
    <article className="page transcripts-page">
      <BracketHero
        maxWidth="48rem"
        eyebrow="Searchable archive"
        title="Episode Transcripts"
        lede="Transcripts make the show searchable, citable, and accessible. They're also one of the highest-impact ways producers can contribute talent."
      />

      <Section>
        <Prose>
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px dashed var(--line-strong)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-5)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>No transcripts published yet.</h2>
            <p>
              The plan: as transcripts land, they&apos;ll appear here. Until then, the latest
              episodes are over at <Link to="/episodes/">/episodes</Link>.
            </p>
            <p>
              <strong>Want to help transcribe?</strong> The fastest route is to volunteer your time:
            </p>
            <Buttons>
              <ButtonLink
                href="https://docs.google.com/forms/d/e/1FAIpQLSfZ-Jv4t0zAmcWmeENve2V8i9FpmTTqG2CSuKd3SrkpdzQUiQ/viewform?usp=sf_link"
                newTab
              >
                Volunteer your skills →
              </ButtonLink>
            </Buttons>
          </div>
        </Prose>
      </Section>

      <ProseSection alt width="42rem">
        <span className="eyebrow">Why transcripts matter</span>
        <h2>Search, accessibility, citation.</h2>
        <p>
          Producers with hearing loss can read the show. Researchers can cite it. Search engines can
          index it. Future episodes can reference past ones with a working link. Every transcript is
          a permanent contribution to the archive.
        </p>
      </ProseSection>
    </article>
  );
}

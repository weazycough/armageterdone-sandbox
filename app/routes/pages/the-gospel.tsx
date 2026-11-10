// the-gospel.tsx — The Gospel (Ghost page-the-gospel.hbs). The hosts haven't
// written it yet, so this is the template's scaffold, marked as a
// placeholder. When the text arrives it replaces the middle sections.

import type * as React from "react";
import { BracketHero, ProseSection, Section, Prose } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("The Gospel");

export default function Gospel(): React.ReactNode {
  return (
    <article className="page gospel-page">
      <BracketHero
        maxWidth="52rem"
        eyebrow="The whole point"
        title="The Gospel"
        lede="Everything else on this site — the news takes, the discernment work, the producer roundtable, the merch — is downstream of this."
      />

      <Section>
        <Prose>
          <p
            className="muted"
            style={{
              border: "1px dashed var(--line-strong)",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <strong>Placeholder.</strong> Send the text for this page and it will replace this
            section. The structure below is a suggestion — feel free to keep it, rewrite it, or
            replace it entirely.
          </p>

          <span className="eyebrow">The short version</span>
          <h2>God made it. We broke it. Jesus fixed it. He&apos;s coming back.</h2>
          <p>
            That&apos;s the headline. The longer version walks through Creation, Fall, Redemption,
            and Restoration — the four-act story Scripture tells from Genesis 1 to Revelation 22.
          </p>

          <h3>Creation</h3>
          <p>
            God created the world, and it was good. Humans were made in His image to know Him,
            reflect Him, and steward what He made. We were never meant to be alone in our heads, and
            we were never meant to be in charge.
          </p>

          <h3>Fall</h3>
          <p>
            We broke trust with God. The whole creation has been groaning under that break ever
            since — including every news cycle this show covers. The discernment work makes no sense
            apart from this diagnosis.
          </p>

          <h3>Redemption</h3>
          <p>
            Jesus — fully God, fully man — lived the life we couldn&apos;t, died the death we
            earned, and rose again as proof that the deal closed. The offer to be reconciled to God
            comes through trusting in Him, not through being good enough, woke enough, or red-pilled
            enough.
          </p>

          <h3>Restoration</h3>
          <p>
            He&apos;s coming back to set everything right. Until then, His people are ambassadors of
            that coming Kingdom in a world that is groaning. The show&apos;s work is one tiny
            version of that.
          </p>

          <h3>If you want to talk to someone</h3>
          <p>
            Email <a href="mailto:canarycryradio@protonmail.com">canarycryradio@protonmail.com</a>{" "}
            or reach out via the Discord. The hosts and producers will gladly point you toward a
            faithful local church and good reading.
          </p>
        </Prose>
      </Section>

      <ProseSection alt width="42rem">
        <span className="eyebrow">Where to go next</span>
        <h2>Sources we trust</h2>
        <p className="muted">
          Suggested by the team — to be filled in. Candidates: solid local churches in the network,
          classic gospel reads (Mere Christianity, The Reason for God, etc.), good catechisms,
          Biblical study tools.
        </p>
      </ProseSection>

      <ProseSection width="42rem" center>
        <span className="eyebrow">Soli Deo Gloria</span>
        <h2>Think outside the cage.</h2>
        <p>The cage is real. The way out has a Name.</p>
      </ProseSection>
    </article>
  );
}

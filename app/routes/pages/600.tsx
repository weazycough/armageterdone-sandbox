// 600.tsx — the road from episode 600 to 666 (Ghost page-600.hbs).

import type * as React from "react";
import { BracketHero, ButtonLink, Buttons, ProseSection } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("600: The Road to Episode 666");

export default function Road600(): React.ReactNode {
  return (
    <article className="page milestone-page">
      <BracketHero
        maxWidth="52rem"
        eyebrow="Milestone · prepare for battle"
        title="600"
        titleStyle={{ fontSize: "clamp(3rem, 7vw, 5rem)" }}
        lede="The Road to Episode 666."
      />

      <ProseSection>
        <span className="eyebrow">Not a celebration. A preparation.</span>
        <h2>It&apos;s not a celebration — it&apos;s preparation.</h2>
        <p>
          That&apos;s right. It&apos;s episode <strong>600</strong>, which means episode{" "}
          <strong>666</strong> is on its way. Obviously that&apos;s a conundrum.
        </p>
        <p>
          So instead of celebrating 600, we&apos;re taking the next 66 episodes to{" "}
          <strong>prepare for battle</strong>. The lead-up to that number is a moment to sharpen the
          show, deepen the producer base, and walk into 666 with our armor on rather than our party
          hats.
        </p>
        <p>
          Producers who help carry the show through this stretch get a permanent place in the
          record. The Roundtable seats fill faster when the road feels steep.
        </p>
        <Buttons>
          <ButtonLink href="/support/">Produce the road to 666</ButtonLink>
          <ButtonLink href="/roundtable/" variant="ghost">
            The Roundtable
          </ButtonLink>
        </Buttons>
      </ProseSection>

      <ProseSection alt width="42rem" center>
        <span className="eyebrow">Soli Deo Gloria</span>
        <h2>The cage doesn&apos;t survive Christ.</h2>
        <p>The countdown is a posture, not a panic. Stay sharp.</p>
      </ProseSection>
    </article>
  );
}

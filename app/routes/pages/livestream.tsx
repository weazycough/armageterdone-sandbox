// livestream.tsx — the Canary Cry Living Room, the thrice-weekly livestream
// (Ghost page-livestream.hbs). The Restream player URL carries Restream's
// public embed token; it is the same one on the live site.

import type * as React from "react";
import { Embed } from "../../components/embed";
import { ButtonLink, Buttons, PageHero, ProseSection, Section } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Canary Cry Living Room");

export default function Livestream(): React.ReactNode {
  return (
    <article className="page livestream-page">
      <PageHero
        eyebrow="M · W · F"
        title="Canary Cry Living Room"
        lede="Livestreaming thrice weekly — Monday, Wednesday, Friday."
      />

      <Section>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <Embed
            service="Restream"
            title="Canary Cry Restream player"
            src="https://player.restream.io/?token=1e92a90355e14eb58dd0c014add709c4"
            openHref="https://rumble.com/c/CanaryCryNewsTalk"
            openLabel="Watch on Rumble instead"
            allow="autoplay; fullscreen"
          />
        </div>
        <p
          className="muted"
          style={{ textAlign: "center", marginTop: "var(--space-4)", fontSize: "0.9rem" }}
        >
          Schedule: Monday / Wednesday / Friday. Times announced in the show notes and the producer
          Discord.
        </p>
      </Section>

      <ProseSection alt width="42rem" center>
        <span className="eyebrow">Multi-platform mirror</span>
        <h2>Same show, your platform.</h2>
        <p>
          Restream pushes the livestream to Rumble + YouTube + the Twitch channel simultaneously.
          Pick the one that fits.
        </p>
        <Buttons>
          <ButtonLink href="/watch/">Watch + chat (Twitch)</ButtonLink>
          <ButtonLink href="https://rumble.com/c/CanaryCryNewsTalk" variant="ghost">
            Rumble
          </ButtonLink>
        </Buttons>
      </ProseSection>
    </article>
  );
}

// mixtape.tsx — the Canary Cry Mixtape playlist (Ghost page-mixtape.hbs).

import type * as React from "react";
import { Embed } from "../../components/embed";
import { ButtonLink, Buttons, PageHero, ProseSection, Section } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Canary Cry Mixtape");

const PLAYER =
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1399555342&color=%23e6b40f&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true";

export default function Mixtape(): React.ReactNode {
  return (
    <article className="page mixtape-page">
      <PageHero
        eyebrow="Tunes to rattle your cage"
        title="Canary Cry Mixtape"
        lede="A rotating Canarian-curated playlist on SoundCloud."
      />

      <Section>
        <div
          style={{
            maxWidth: "56rem",
            margin: "0 auto",
            background: "var(--bg-surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3)",
          }}
        >
          <Embed
            service="SoundCloud"
            title="Canary Cry Mixtape — SoundCloud playlist"
            src={PLAYER}
            openHref="https://soundcloud.com/canarycrymixtape/sets/canary-cry-mixtape"
            allow="autoplay"
            className="embed-box"
            style={{ height: 450 }}
          />
        </div>
        <p
          className="muted"
          style={{ textAlign: "center", marginTop: "var(--space-4)", fontSize: "0.85rem" }}
        >
          Producer submissions welcome — DM the show or post in Discord with a track + an
          explanation of why it belongs.
        </p>
      </Section>

      <ProseSection alt width="42rem" center>
        <span className="eyebrow">Submit a track</span>
        <h2>Get your favorite track on the Mixtape.</h2>
        <p>
          Producer-submitted music keeps the playlist alive. Send candidates via Discord or email.
        </p>
        <Buttons>
          <ButtonLink href="https://discord.gg/qRcTvUUqtr">Discord</ButtonLink>
          <ButtonLink
            href="mailto:canarycryradio@gmail.com?subject=Mixtape%20submission"
            variant="ghost"
          >
            Email
          </ButtonLink>
        </Buttons>
      </ProseSection>
    </article>
  );
}

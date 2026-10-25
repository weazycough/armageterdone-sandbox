// watch.tsx — the Twitch player and chat (Ghost page-watch.hbs). Twitch only
// plays inside a page whose hostname is in the embed's `parent=`; it is
// filled in from the page's own address when the visitor loads the player,
// so the same build works on GitHub Pages (stucny.github.io), in local
// previews and on the show's own domain later.

import type * as React from "react";
import { Embed } from "../../components/embed";
import { ButtonLink, Buttons, PageHero, ProseSection, Section } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Watch the show");

const CHANNEL = "canarycryradio";

export default function Watch(): React.ReactNode {
  return (
    <article className="page watch-page">
      <PageHero
        eyebrow="Live + archived video"
        title="Watch the show"
        lede="Streaming live three times a week, with the archive on Twitch + Rumble + YouTube."
      />

      <Section>
        <div className="watch-grid">
          <div className="watch-grid__player">
            <h2>Live player</h2>
            <Embed
              service="Twitch"
              title="Canary Cry Twitch stream"
              src={`https://player.twitch.tv/?channel=${CHANNEL}`}
              parent
              openHref={`https://www.twitch.tv/${CHANNEL}`}
            />
          </div>
          <div className="watch-grid__chat">
            <h2>Chat</h2>
            <Embed
              service="Twitch"
              title="Canary Cry Twitch chat"
              src={`https://www.twitch.tv/embed/${CHANNEL}/chat`}
              parent
              openHref={`https://www.twitch.tv/${CHANNEL}`}
              className="video-frame video-frame--tall"
            />
          </div>
        </div>
      </Section>

      <ProseSection alt width="42rem" center>
        <span className="eyebrow">Or watch on the open platforms</span>
        <h2>Pick your video home.</h2>
        <p>
          The show mirrors to <strong>Rumble</strong> + <strong>YouTube</strong> for the audience
          that prefers those platforms — and for the censorship-resistance Canarians ask for.
        </p>
        <Buttons>
          <ButtonLink href="https://rumble.com/c/CanaryCryNewsTalk">Rumble channel</ButtonLink>
          <ButtonLink href="https://www.youtube.com/c/CanaryCryNewsTalk" variant="ghost">
            YouTube channel
          </ButtonLink>
        </Buttons>
      </ProseSection>
    </article>
  );
}

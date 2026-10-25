// streetteam.tsx — the Canary Cry Street Team flyers (Ghost
// page-streetteam.hbs). The flyer pack is still a placeholder.

import type * as React from "react";
import {
  BracketHero,
  ButtonLink,
  Buttons,
  Placeholder,
  ProseSection,
  Section,
} from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Canary Cry Street Team");

export default function StreetTeam(): React.ReactNode {
  return (
    <article className="page streetteam-page">
      <BracketHero
        maxWidth="52rem"
        eyebrow="Take CCNT to the streets"
        title="Canary Cry Street Team"
        lede="The streets will thank you."
      />

      <ProseSection>
        <span className="eyebrow">From Sir Dove of Rustbeltia</span>
        <h2>Print, post, photograph.</h2>
        <p>
          Does your community have a noticeable lack of awesome Canary Cry News Talk flyers? We got
          you.
        </p>
        <p>
          Sir Dove, Knight of Rustbeltia, has been lovingly crafting Canary Cry Street Team flyers
          for months. Now it&apos;s up to you. Save the flyers to your computer, get to printing,
          and put them up around your town — each one has its own provocative theme to help wake up
          your neighbors.
        </p>
        <p>
          <strong>Don&apos;t forget to take pictures of your work and send them in</strong> — they
          show up on the show.
        </p>
      </ProseSection>

      <Section alt>
        <div className="section__head">
          <h2>Flyer pack</h2>
          <span className="muted">Updated regularly — print, post, photograph</span>
        </div>
        <Placeholder label="Flyer downloads from Sir Dove's set">
          <p className="placeholder-box__note">
            To be migrated — send the flyer PDFs/PNGs in and they will be linked here.
          </p>
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "var(--space-3)" }}>
            The Squarespace site hosted them as image downloads. Drop the files in the
            repository&apos;s assets inbox (or use the team&apos;s preferred file host).
          </p>
        </Placeholder>
      </Section>

      <ProseSection center>
        <span className="eyebrow">Show off your work</span>
        <h2>Send your photos.</h2>
        <p>
          Email <a href="mailto:canarycryradio@gmail.com">canarycryradio@gmail.com</a> or tag the
          show on social media. The best photos get aired.
        </p>
        <Buttons>
          <ButtonLink href="mailto:canarycryradio@gmail.com?subject=Street%20Team%20photo">
            Email your photos
          </ButtonLink>
          <ButtonLink href="https://discord.gg/qRcTvUUqtr" variant="ghost">
            Post in Discord
          </ButtonLink>
        </Buttons>
      </ProseSection>
    </article>
  );
}

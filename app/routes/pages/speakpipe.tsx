// speakpipe.tsx — Speak Pipe voicemail (Ghost page-speakpipe.hbs). The widget
// is still a placeholder: the team's account isn't known.

import type * as React from "react";
import { BracketHero, ButtonLink, Buttons, ProseSection } from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Speak Pipe");

export default function SpeakPipe(): React.ReactNode {
  return (
    <article className="page speakpipe-page">
      <BracketHero
        maxWidth="52rem"
        eyebrow="Voicemail · talent contribution"
        title="Speak Pipe"
        lede="Leave a voicemail for the show. Producer call-ins make the Clubhouse episodes — and the best ones get aired across the network."
      />

      <ProseSection>
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px dashed var(--line-strong)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-5)",
          }}
        >
          <span className="eyebrow">Widget slot</span>
          <h2 style={{ marginTop: "var(--space-2)" }}>Speak Pipe embed goes here</h2>
          <p>
            The Squarespace site historically embedded a Speak Pipe widget on this page (and on the
            homepage). The team account / widget ID couldn&apos;t be recovered from a read-only
            audit of the current pages — it looks like the embed has been removed or replaced.
          </p>
          <p>
            <strong>To re-wire this:</strong> log into the Speak Pipe account, copy the standard
            widget snippet (a <code>&lt;script&gt;</code> + a <code>&lt;div&gt;</code> with the
            account ID), and send it in an issue on this repository.
          </p>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Until then, the email fallback below works just as well.
          </p>
        </div>
      </ProseSection>

      <ProseSection alt>
        <span className="eyebrow">In the meantime</span>
        <h2>Email a voice memo.</h2>
        <p>
          Record a voice memo on your phone (most phones have a Voice Memos / Recorder app built in)
          and email the file to the show. Keep it under a minute or two — the best clips are crisp.
        </p>
        <Buttons>
          <ButtonLink href="mailto:canarycryradio@protonmail.com?subject=Voicemail%20for%20the%20show">
            Email a voice memo
          </ButtonLink>
          <ButtonLink href="https://discord.gg/qRcTvUUqtr" variant="ghost">
            Or post in Discord
          </ButtonLink>
        </Buttons>
        <p className="muted" style={{ fontSize: "0.9rem", marginTop: "var(--space-4)" }}>
          File formats accepted: <strong>m4a, mp3, wav, ogg</strong>. Keep it under 5 MB if
          possible.
        </p>
      </ProseSection>
    </article>
  );
}

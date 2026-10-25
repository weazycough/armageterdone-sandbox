// contact-us-mojave.tsx — how to reach the show (Ghost
// page-contact-us-mojave.hbs).

import type * as React from "react";
import { BracketHero, ButtonLink, Prose, Section } from "../../components/page-parts";
import { SmartLink } from "../../components/smart-link";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Contact");

const PATHS = [
  {
    href: "mailto:canarycryradio@gmail.com",
    eyebrow: "If you like it easy",
    title: "canarycryradio@gmail.com",
    text: "Standard email — fine for most things. The team checks it regularly.",
  },
  {
    href: "mailto:canarycryradio@protonmail.com",
    eyebrow: "If you like to keep it secret",
    title: "canarycryradio@protonmail.com",
    text: "Encrypted via Proton. Use this for tips, sources, anything that needs to stay private.",
  },
  {
    href: "https://discord.gg/qRcTvUUqtr",
    eyebrow: "Real-time chat",
    title: "Discord",
    text: "Hop into the producer community Discord — fastest way to reach other Canarians.",
  },
  {
    href: "http://canarycry.community/",
    eyebrow: "Long-form",
    title: "canarycry.community",
    text: "The community forum. Threads, deeper conversations, less ephemeral.",
  },
];

export default function Contact(): React.ReactNode {
  return (
    <article className="page contact-page">
      <BracketHero
        maxWidth="48rem"
        eyebrow="Get in touch"
        title="We'd love to hear from you."
        lede="Tips, questions, art, prayer requests, episode feedback, producer stories — pick whichever inbox feels right."
      />

      <Section>
        <div className="other-paths">
          {PATHS.map((p) => (
            <SmartLink className="other-path" href={p.href} key={p.href}>
              <span className="eyebrow">{p.eyebrow}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </SmartLink>
          ))}
        </div>

        <p className="page-buttons page-buttons--center" style={{ marginTop: "var(--space-7)" }}>
          <ButtonLink href="/speakpipe/">Leave a Speak Pipe voicemail</ButtonLink>
          <ButtonLink href="/artsubmission/" variant="ghost">
            Send producer art
          </ButtonLink>
        </p>
      </Section>

      <Section alt>
        <Prose width="42rem">
          <span className="eyebrow">Snail mail</span>
          <h2>Or send a postcard.</h2>
          <address style={{ fontStyle: "normal", lineHeight: 1.6, fontSize: "1.05rem" }}>
            Canary Cry Radio (or News Talk)
            <br />
            P.O. BOX 1026
            <br />
            Bonsall, CA 92003
          </address>
          <p className="muted" style={{ marginTop: "var(--space-3)" }}>
            Checks payable to &quot;Gonzo Shimura&quot;. A new mailing address is on the way — this
            one still works in the meantime.
          </p>
        </Prose>
      </Section>
    </article>
  );
}

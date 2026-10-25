// about-us-mojave.tsx — about the show, the network and the hosts (Ghost
// page-about-us-mojave.hbs).

import type * as React from "react";
import { PlatformRow } from "../../components/platform-row";
import {
  BracketHero,
  ButtonLink,
  Buttons,
  ProseSection,
  Section,
} from "../../components/page-parts";
import { ShowsStrip } from "../../components/shows-strip";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("About the show");

const HOSTS = [
  {
    role: "Co-host · FaceLikeTheSun",
    name: "Gonz",
    bio: "Gonz Shimura runs FaceLikeTheSun alongside Canary Cry News Talk. A long-time discernment broadcaster, his focus is at the intersection of technology, theology, and the strange shape of the times we're living in.",
    links: [
      { label: "Personal site", href: "https://gonzoshimura.com/" },
      { label: "X / FaceLikeTheSun", href: "https://x.com/FaceLikeTheSun" },
      { label: "Facebook", href: "https://www.facebook.com/GonzoShimura/" },
      { label: "FaceLikeTheSun Patreon", href: "https://www.patreon.com/facelikethesun" },
    ],
  },
  {
    role: "Co-host",
    name: "Basil Rosewater",
    bio: "Basil brings news-cycle granularity and a producer's eye for the seams in the story. Steady, sharp, and reliably contrarian to whichever side is currently telling you what to think.",
    links: [{ label: "X / @basil_rosewater", href: "https://x.com/basil_rosewater" }],
  },
];

export default function About(): React.ReactNode {
  return (
    <article className="page about-page">
      <BracketHero
        maxWidth="56rem"
        eyebrow="Cogitare extra caveam"
        title="Think outside the cage."
        lede="Canary Cry News Talk is a podcast and streaming show that analyzes and deconstructs news and current events as reported by Legacy Corporate Media and Alternative Media — all from a Biblical worldview."
      />

      <ProseSection>
        <span className="eyebrow">About the show</span>
        <h2>Contrarian Canarian?</h2>
        <p>
          If you find yourself perpetually skeptical of the front-page narrative — whether it comes
          from CNN or from the loudest &quot;independent&quot; pundit on YouTube — you&apos;re in
          the right place. Canary Cry News Talk holds the news up to the lamp of Scripture and asks:
          what&apos;s actually going on, who benefits, and what should a believer do about it?
        </p>
        <p>
          The show isn&apos;t politics-as-team-sport. It&apos;s discernment. Healthy skepticism,
          careful sourcing, theological clarity, and a willingness to follow the thread wherever it
          leads — even when it&apos;s uncomfortable.
        </p>
      </ProseSection>

      <Section alt>
        <div className="section__head">
          <span className="eyebrow">Three shows, one signal</span>
          <h2>The Canary Cry Network</h2>
        </div>
        <ShowsStrip />
      </Section>

      <Section>
        <div className="section__head">
          <span className="eyebrow">The bird-boys</span>
          <h2>Meet the hosts</h2>
        </div>
        <div className="hosts-grid">
          {HOSTS.map((h) => (
            <article className="host-card" key={h.name}>
              <span className="host-card__role">{h.role}</span>
              <h3>{h.name}</h3>
              <p className="host-card__bio">{h.bio}</p>
              <div className="host-card__links">
                {h.links.map((l) => (
                  <a className="host-card__link" href={l.href} rel="me noopener" key={l.href}>
                    {l.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <ProseSection alt>
        <span className="eyebrow">No advertisers. Just producers.</span>
        <h2>Value for Value.</h2>
        <p>
          No advertisements. No affiliate codes. No vitamin-male-enhancement supplements. Canary Cry
          runs on listeners — producers — who return value for the value they got, in{" "}
          <strong>time, talent, or treasure</strong>.
        </p>
        <p>
          That&apos;s the deal: the show stays honest because no advertiser is paying it to be
          otherwise.
        </p>
        <Buttons>
          <ButtonLink href="/support/">Ways to produce the show</ButtonLink>
          <ButtonLink href="/roundtable/" variant="ghost">
            The Roundtable
          </ButtonLink>
        </Buttons>
      </ProseSection>

      <ProseSection>
        <span className="eyebrow">Listen</span>
        <h2>Catch the show wherever you listen.</h2>
        <p>
          Daily News Talk, long-form Radio interviews, and live Clubhouse conversations — all from
          one feed.
        </p>
        <div style={{ marginTop: "var(--space-4)" }}>
          <PlatformRow />
        </div>
      </ProseSection>
    </article>
  );
}

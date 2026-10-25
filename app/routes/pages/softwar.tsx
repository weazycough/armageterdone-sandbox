// softwar.tsx — Jason P. Lowery's Softwar, required reading (Ghost
// page-softwar.hbs).

import type * as React from "react";
import { Link } from "react-router";
import { BracketHero, ButtonLink, Buttons, ProseSection } from "../../components/page-parts";
import { buttonVariants } from "../../components/ui/button";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("Softwar");

export default function Softwar(): React.ReactNode {
  return (
    <article className="page book-page">
      <BracketHero
        maxWidth="52rem"
        eyebrow="Required reading"
        title={<em>Softwar</em>}
        lede="A Novel Theory on Power Projection and the National Strategic Significance of Bitcoin — by Jason P. Lowery."
      />

      <ProseSection>
        <span className="eyebrow">Background</span>
        <h2>Why the show keeps coming back to this book.</h2>
        <p>
          <em>Softwar</em> is Jason P. Lowery&apos;s MIT thesis-turned-book, arguing that Bitcoin is
          best understood as a non-violent power-projection protocol — the same way nation-states
          have historically projected power through military force. It reframes the conversation
          about Bitcoin from &quot;investment&quot; to &quot;geopolitics&quot;.
        </p>
        <p>
          Whether you agree with the thesis or not, the framing is essential. The show has
          referenced it across dozens of episodes — start here if you&apos;ve heard it come up and
          want to read the source.
        </p>
      </ProseSection>

      <ProseSection alt>
        <span className="eyebrow">Read the book</span>
        <h2>Get the PDF.</h2>
        <p>
          The book is freely available for download. Right-click the link below and save the PDF, or
          click through to the executive summary.
        </p>
        <Buttons>
          <a className={buttonVariants()} id="pdf-download" href="#pdf-download">
            Download the PDF (right-click → Save)
          </a>
          <ButtonLink
            href="https://nationalsecurityreport.org/wp-content/uploads/2023/03/Softwar.pdf"
            variant="ghost"
            newTab
          >
            Read online
          </ButtonLink>
        </Buttons>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          The download link above needs to be wired to wherever the team hosts the PDF. The original
          Squarespace page used a direct file attachment; send the file in (see the
          repository&apos;s assets inbox) and it will be linked here.
        </p>
      </ProseSection>

      <ProseSection>
        <span className="eyebrow">Episodes that reference it</span>
        <h2>Where the show engages the thesis.</h2>
        <p>
          Browse the <Link to="/episodes/">episode archive</Link> and search &quot;Softwar&quot; or
          &quot;Lowery&quot; — the references span over a year of coverage, both in News Talk and
          the long-form Radio interviews.
        </p>
      </ProseSection>
    </article>
  );
}

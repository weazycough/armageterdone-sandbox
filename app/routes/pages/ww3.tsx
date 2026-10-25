// ww3.tsx — the WW3 nation tracker (Ghost page-ww3.hbs).

import type * as React from "react";
import {
  BracketHero,
  ButtonLink,
  Buttons,
  ProseSection,
  Section,
} from "../../components/page-parts";
import { pageTitle } from "../../lib/meta";

export const meta = () => pageTitle("WW3 Nation Tracker");

type Entry = { nation: string; note?: string } | { group: string; nations: string[] };

const TEAMS: {
  side: "east" | "west" | "neutral";
  eyebrow: string;
  title: string;
  desc: string;
  entries: Entry[];
}[] = [
  {
    side: "east",
    eyebrow: "Team East",
    title: "YUAN bloc",
    desc: "Centered on China and the digital renminbi. Resource-and-currency-based alignment.",
    entries: [
      { nation: "China", note: "(Yuan, Digital Renminbi — bloc anchor)" },
      { nation: "Russia" },
      { nation: "Iran" },
      { nation: "Saudi Arabia" },
      { nation: "North Korea" },
      { group: "Africa", nations: ["Kenya", "Nigeria", "Uganda", "Egypt"] },
      { group: "South America", nations: ["Argentina", "Venezuela", "Brazil", "Honduras"] },
    ],
  },
  {
    side: "west",
    eyebrow: "Team West",
    title: "NATO + allies",
    desc: "Trans-Atlantic security umbrella + major non-NATO allies.",
    entries: [
      { nation: "USA" },
      { nation: "UK" },
      {
        group: "NATO (30 members)",
        nations: [
          "Albania",
          "Belgium",
          "Bulgaria",
          "Canada",
          "Croatia",
          "Czechia",
          "Denmark",
          "Estonia",
          "France",
          "Germany",
          "Greece",
          "Hungary",
          "Iceland",
          "Italy",
          "Latvia",
          "Lithuania",
          "Luxembourg",
          "Montenegro",
          "Netherlands",
          "North Macedonia",
          "Norway",
          "Poland",
          "Portugal",
          "Romania",
          "Slovakia",
          "Slovenia",
          "Spain",
          "Türkiye",
        ],
      },
      {
        group: "Major non-NATO allies",
        nations: [
          "Colombia",
          "Tunisia",
          "Qatar",
          "Taiwan",
          "Thailand",
          "Philippines",
          "New Zealand",
        ],
      },
    ],
  },
  {
    side: "neutral",
    eyebrow: "Free agents",
    title: "Unaligned (so far)",
    desc: "In play. Either contested, hedging, or genuinely uncommitted.",
    entries: [
      { nation: "Iraq" },
      { nation: "Pakistan" },
      { nation: "Ukraine" },
      { nation: "Somalia" },
      { nation: "India" },
      { nation: "Finland / Sweden", note: "(recent NATO accessions in transition)" },
    ],
  },
];

export default function Ww3(): React.ReactNode {
  return (
    <article className="page ww3-page">
      <BracketHero
        maxWidth="56rem"
        eyebrow="Tracker · world war 3"
        title="WW3 Nation Tracker"
        lede="Who's lined up with whom — and who's still in play. Updated as the board moves."
      />

      <Section>
        <div className="ww3-grid">
          {TEAMS.map((team) => (
            <article className={`ww3-team ww3-team--${team.side}`} key={team.side}>
              <header>
                <span className="eyebrow">{team.eyebrow}</span>
                <h2>{team.title}</h2>
                <p className="muted">{team.desc}</p>
              </header>
              <ul className="ww3-list">
                {team.entries.map((e) =>
                  "group" in e ? (
                    <li className="ww3-list__group" key={e.group}>
                      <span>{e.group}</span>
                      <span className="ww3-list__nations">{e.nations.join(" · ")}</span>
                    </li>
                  ) : (
                    <li key={e.nation}>
                      <strong>{e.nation}</strong>
                      {e.note !== undefined && (
                        <>
                          {" "}
                          <span className="muted">{e.note}</span>
                        </>
                      )}
                    </li>
                  ),
                )}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <ProseSection alt width="42rem">
        <span className="eyebrow">How to read the board</span>
        <h2>Alignments shift. The frame doesn&apos;t.</h2>
        <p>
          This tracker exists so producers and listeners can see the moves in one place. As nations
          re-align — and they do — the board updates.
        </p>
        <p>
          The discernment work happens on the episodes themselves. The board is just the scorecard.
        </p>
        <Buttons>
          <ButtonLink href="/episodes/">Episodes on the conflict</ButtonLink>
          <ButtonLink href="/support/" variant="ghost">
            Produce the show
          </ButtonLink>
        </Buttons>
      </ProseSection>
    </article>
  );
}

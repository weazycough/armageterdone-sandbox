// meet-ups.tsx — listener meet-ups, upcoming and past (Ghost
// page-meet-ups.hbs).
//
// The Ghost page listed each host's personal email (and one phone number and
// X handle). Those are private people's details, which the preview must not
// publish (AGENTS.md); here every contact goes through the show's own inbox,
// with the place in the subject line, until the hosts agree to be listed.

import type * as React from "react";
import { SupportRow } from "../../components/support-row";
import { BracketHero, ButtonLink, Section } from "../../components/page-parts";
import { loadPages } from "../../lib/content.server";
import { pageTitle } from "../../lib/meta";
import type { Route } from "./+types/meet-ups";

export const meta = () => pageTitle("Meet-Ups");

const SHOW_INBOX = "canarycryradio@gmail.com";

/** A link to the show's inbox about one meet-up. */
function ViaShow({ place }: { place: string }): React.ReactNode {
  return (
    <a href={`mailto:${SHOW_INBOX}?subject=${encodeURIComponent(`Meet-up: ${place}`)}`}>
      email the show
    </a>
  );
}

interface Meetup {
  month: string;
  day: string;
  place: string;
  meta: string;
  text?: string;
  /** How to reach the host; ends up as "… — email the show." */
  contact?: string;
  kind?: "upcoming" | "call";
}

const UPCOMING: Meetup[] = [
  {
    month: "June",
    day: "21",
    place: "Trondheim, Norway",
    meta: "EU producer chapter · Hosted by Dame Madelyn",
    text: "The first Canary Cry European meet-up. Coffee, conversation, and the chance to compare notes with fellow watchmen from across the continent.",
    contact: "To confirm attendance",
    kind: "upcoming",
  },
  {
    month: "Anyone?",
    day: "TBA",
    place: "Humboldt County, California",
    meta: "Looking for a host or attendees",
    text: "Marti (Not Sir) K. is open to organizing if there's interest. NorCal producers — make yourself known.",
    contact: "To reach Marti",
    kind: "call",
  },
  {
    month: "Anyone?",
    day: "TBA",
    place: "Pennsylvania area",
    meta: "Looking for a host or attendees",
    text: "Rustbeltia producers — there's interest in a PA gathering but no host yet. Step up if you can swing it.",
    contact: "To get involved",
    kind: "call",
  },
];

const PAST: Meetup[] = [
  {
    month: "May",
    day: "24",
    place: "Houston, TX",
    meta: "BATL Axe Throwing · 1431 W 20th St, Unit B, Houston, 77008",
    contact: "To reach the host",
  },
  {
    month: "May",
    day: "03",
    place: "North / South Carolina",
    meta: "Neha's Ice Cream · 1409 E Main St, Cherryville, NC 28021 · 2–6 PM",
    text: "Optional pre-activity: hike Crowders Mountain (Linwood Rd access, 9 a.m., 4–6 miles).",
    contact: "Host: Dame Sarah. To reach her",
  },
  {
    month: "Apr",
    day: "25",
    place: "Kansas City, MO",
    meta: "Kelly's Westport Inn · 12:45 PM",
    text: '"Look for two guys in CCNT T-Shirts." Optional Demon Hunter concert in the evening.',
  },
  {
    month: "Mar",
    day: "03",
    place: "Los Angeles, CA",
    meta: "YUKO KITCHEN · 101 W 5th St, Los Angeles, CA 90013 · 3–6 PM",
    contact: "Host: Andy. To RSVP",
  },
  {
    month: "—",
    day: "KY",
    place: "Louisville, KY",
    meta: "Kentucky producer chapter",
    contact: "To reach the host",
  },
  {
    month: "—",
    day: "CA",
    place: "NorCal (Humboldt County, CA)",
    meta: "Marti (Not Sir) K. — open to organizing again",
    contact: "To reach Marti",
  },
];

function MeetupCard({ m }: { m: Meetup }): React.ReactNode {
  return (
    <article
      className={m.kind === undefined ? "meetup-card" : `meetup-card meetup-card--${m.kind}`}
    >
      <div
        className={
          m.kind === "call" ? "meetup-card__date meetup-card__date--call" : "meetup-card__date"
        }
      >
        <span className="meetup-card__month">{m.month}</span>
        <span className="meetup-card__day">{m.day}</span>
      </div>
      <div className="meetup-card__body">
        <h3>{m.place}</h3>
        <p className="meetup-card__meta">{m.meta}</p>
        {m.text !== undefined && <p>{m.text}</p>}
        {m.contact !== undefined && (
          <p className="meetup-card__contact">
            {m.contact}, <ViaShow place={m.place} />.
          </p>
        )}
      </div>
    </article>
  );
}

export function loader() {
  // The Ghost template printed the page's date beside "Upcoming meet-ups":
  // when the list was last brought up to date.
  const page = loadPages().find((p) => p.slug === "meet-ups");
  if (page === undefined) throw new Error("content/pages/meet-ups.json is missing");
  return {
    month: new Date(`${page.updatedAt.replace(" ", "T")}Z`).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
  };
}

export default function MeetUps({ loaderData }: Route.ComponentProps): React.ReactNode {
  return (
    <article className="page meetups-page">
      <BracketHero
        variant="meetups"
        maxWidth="56rem"
        eyebrow="Canary Cry Meet-Ups"
        title="Birds of a feather flock together."
        lede={
          <>
            It&apos;s important to find people in your local community who think outside the cage,
            just like you do. Over the years, the most common question we get is, &quot;Do you know
            someone in <em>[insert location]</em> who talks about the stuff you guys do?&quot; So we
            know it&apos;s something everyone wants. Attend a meet-up — or host your own.
          </>
        }
      >
        <ButtonLink href="#upcoming">See upcoming meet-ups</ButtonLink>
        <ButtonLink href="#host-your-own" variant="ghost">
          Host your own →
        </ButtonLink>
      </BracketHero>

      <Section id="upcoming">
        <div className="section__head">
          <h2>Upcoming meet-ups</h2>
          <span className="muted">{loaderData.month}</span>
        </div>
        <div className="meetup-grid">
          {UPCOMING.map((m) => (
            <MeetupCard m={m} key={m.place} />
          ))}
        </div>
      </Section>

      <Section alt id="host-your-own">
        <div className="meetups-howto">
          <div>
            <span className="eyebrow">Want to host?</span>
            <h2>Start your own meet-up.</h2>
            <p>
              Pick a place — a diner, a backyard, an axe-throwing range, a coffee shop. Pick a date.
              Pick a way to reach you (Proton mail works great). Send the details to the show and
              they go up on this page.
            </p>
            <p>
              You don&apos;t need a venue partner. You don&apos;t need a host with a name. You just
              need to put a flag in the ground so other producers can find you.
            </p>
          </div>
          <aside className="meetups-howto__heads">
            <h3>Heads on Sticks</h3>
            <p>
              Print your very own Basil and Gonz heads, put them on sticks, and bring them to the
              meet-up. That way the bird-boys can attend in spirit — and producers who want to keep
              their identity anonymous have a built-in mask.
            </p>
            <p>
              <ButtonLink href="/artsubmission/" variant="ghost">
                Producer art →
              </ButtonLink>
            </p>
          </aside>
        </div>
      </Section>

      <Section>
        <div className="section__head">
          <h2>Meet-ups gone by</h2>
          <span className="muted">Reach out to past hosts — many would gladly do it again.</span>
        </div>
        <div className="meetup-grid meetup-grid--past">
          {PAST.map((m) => (
            <MeetupCard m={m} key={m.place} />
          ))}
        </div>
        <p className="muted" style={{ textAlign: "center", marginTop: "var(--space-7)" }}>
          More past meet-ups in the archive — these are the most recent. The full list of locations
          the show has touched will be migrated soon.
        </p>
      </Section>

      <Section alt>
        <SupportRow
          eyebrow="Time, talent, treasure"
          heading="Showing up counts as producing."
          actions={
            <>
              <ButtonLink href="#upcoming">See upcoming meet-ups</ButtonLink>
              <ButtonLink href="/support/" variant="ghost">
                Other ways to produce the show
              </ButtonLink>
            </>
          }
        >
          Coming to a meet-up — or hosting one — is one of the most concrete forms of
          value-for-value there is. Producers meeting producers, in the same room, no algorithm
          between them.
        </SupportRow>
      </Section>
    </article>
  );
}

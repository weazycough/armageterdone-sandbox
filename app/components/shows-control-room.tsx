import { CcWordmark } from "./cc-wordmark";
import { MissionHeroFloor } from "./mission-hero-floor";
import { ShowsStrip } from "./shows-strip";

export const SHOWS_HERO_PITCH = {
  headline: "EVERY SHOW EVERY PROJECT",
  accessibleHeadline: "Every show, every project",
  description:
    "A collection of the shows and projects Basil and Gonz have built over the years, from daily news and deep-cut interviews to call-ins, research and side projects, all under the Canary Cry banner.",
} as const;

/**
 * Shows-page hero: left column is CANARYCRY + NETWORK, the punch line
 * and description, all on one centerline; the right column is the three
 * main shows, stacked. Other Projects stays below.
 */
export function ShowsControlRoom() {
  return (
    <section className="mission-hero shows-hero" aria-label="Canary Cry Network">
      <MissionHeroFloor />
      <div className="container mission-hero__inner shows-hero__inner">
        <div className="shows-hero__layout">
          <div className="shows-hero__stage">
            <header className="shows-hero__brand">
              <div className="shows-hero__title-stack">
                <span className="shows-hero__mark-wrap">
                  <CcWordmark className="shows-hero__mark" />
                </span>
                <h1 className="shows-hero__network">NETWORK</h1>
              </div>
            </header>
            <aside className="shows-hero__pitch">
              <p className="shows-hero__pitch-headline">
                <span className="sr-only">{SHOWS_HERO_PITCH.accessibleHeadline}</span>
                <span className="shows-hero__pitch-line" aria-hidden="true">
                  EVERY SHOW
                  <span className="shows-hero__pitch-dot" />
                  EVERY PROJECT
                </span>
              </p>
              <span className="shows-hero__pitch-rule" aria-hidden="true" />
              <p className="shows-hero__pitch-body">{SHOWS_HERO_PITCH.description}</p>
            </aside>
          </div>
          <div className="shows-hero__main-shows">
            <ShowsStrip />
          </div>
        </div>
      </div>
    </section>
  );
}

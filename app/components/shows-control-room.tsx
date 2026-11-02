// shows-control-room.tsx — Option C from lab #9: six show monitors in a
// control-room arc over the commissioned news-desk art of Basil and Gonz.
// The studio stays dark in both themes (it is artwork). On a phone the arc
// flattens into a sideways snap-scroll row.

import type * as React from "react";
import { Link } from "react-router";
import { asset } from "../lib/asset";
import { NETWORK_SHOWS, type NetworkShow } from "../lib/shows";

function MonitorScreen({ show }: { show: NetworkShow }): React.ReactNode {
  if (show.art === null) {
    return (
      <span className="shows-monitor__screen shows-monitor__screen--testcard">
        <span>Art to come</span>
      </span>
    );
  }
  return (
    <span className="shows-monitor__screen">
      <img src={asset(show.art)} alt="" width="512" height="512" loading="lazy" />
    </span>
  );
}

function Monitor({ show }: { show: NetworkShow }): React.ReactNode {
  const body = (
    <>
      <span className="shows-monitor__bezel">
        <MonitorScreen show={show} />
        <span className="shows-monitor__led" aria-hidden="true" />
      </span>
      <span className="shows-monitor__label">{show.title}</span>
    </>
  );

  if (show.href === null) {
    return (
      <span
        className="shows-monitor shows-monitor--soon"
        aria-label={`${show.title}: page and art to come`}
      >
        {body}
      </span>
    );
  }

  return (
    <Link className="shows-monitor" to={show.href}>
      {body}
    </Link>
  );
}

export function ShowsControlRoom(): React.ReactNode {
  return (
    <section className="shows-studio" aria-label="The Canary Cry Network shows">
      <div className="shows-studio__scene">
        <picture className="shows-studio__hero">
          <source srcSet={asset("images/newsdesk-hosts.webp")} type="image/webp" />
          <img
            src={asset("images/newsdesk-hosts.jpg")}
            alt="Basil and Gonz at the Canary Cry news desk"
            width="1920"
            height="1080"
            decoding="async"
          />
        </picture>

        <div className="shows-studio__overlay">
          <header className="shows-studio__title">
            <p className="shows-studio__eyebrow">The Canary Cry Network</p>
            <h1>Shows</h1>
          </header>

          <ul className="shows-arc" aria-label="Shows">
            {NETWORK_SHOWS.map((show) => (
              <li key={show.slug}>
                <Monitor show={show} />
              </li>
            ))}
          </ul>
          <p className="shows-arc__swipe" aria-hidden="true">
            Swipe for more shows →
          </p>
        </div>
      </div>
    </section>
  );
}

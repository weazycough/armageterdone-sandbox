// shows-control-room.tsx — Option C from lab #9: six show monitors as a
// news-station wall behind the commissioned Basil & Gonz desk art. The studio
// stays dark in both themes. Desktop: a wide perspective arc. Phone: a 2×3
// monitor panel behind the hosts (no swipe row).

import type * as React from "react";
import { Link } from "react-router";
import { asset } from "../lib/asset";
import { NETWORK_SHOWS, type NetworkShow } from "../lib/shows";
import { CcWordmark } from "./cc-wordmark";

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
        {/* Wall sits behind the desk art; hero is the foreground strip. */}
        <div className="shows-studio__wall">
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
        </div>

        <div className="shows-studio__hero">
          <picture>
            <source srcSet={asset("images/newsdesk-hosts.webp")} type="image/webp" />
            <img
              src={asset("images/newsdesk-hosts.png")}
              alt="Basil and Gonz at the Canary Cry news desk"
              width="1920"
              height="1080"
              decoding="async"
            />
          </picture>
          <CcWordmark className="shows-studio__desk-mark" title="Canary Cry" />
        </div>
      </div>
    </section>
  );
}

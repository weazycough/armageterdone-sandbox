// shows-control-room.tsx — Option C from lab #9: six show monitors as a
// news-station wall behind the commissioned Basil & Gonz desk art. The studio
// stays dark in both themes. Desktop: a wide perspective arc. Phone: a 2×3
// monitor panel behind the hosts (no swipe row).

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
        {/* Home-style perspective grid along the bottom of the scene. */}
        <div className="shows-studio__floor" aria-hidden="true"><div className="shows-studio__floor-grid" /></div>
        {/* Wall sits behind the desk art; hero is the foreground strip. */}
        <div className="shows-studio__wall">
          <ul className="shows-arc" aria-label="Shows">
            {NETWORK_SHOWS.map((show) => (
              <li key={show.slug}>
                <Monitor show={show} />
              </li>
            ))}
          </ul>
        </div>

        <div className="shows-studio__stage">
          <div className="shows-studio__mark" aria-hidden="true">
            <svg
              className="shows-studio__mark-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 111.48 54.02"
              fill="currentColor"
            >
              <path d="M0,54.02V0s10.01,0,10.01,0v35.55s.14,0,.14,0L34.39,0h12.34S8.69,54.02,8.69,54.02H0Z" />
              <path d="M64.75,54.02V0s10.01,0,10.01,0v35.55s.14,0,.14,0L99.14,0h12.34s-38.04,54.01-38.04,54.01h-8.69Z" />
              <path d="M51.77,0l-28.17,40.08h27.29v13.94s10,0,10,0V.01h-9.12ZM50.89,30.74h-8.91l8.76-12.92h.15v12.92Z" />
            </svg>
          </div>

          <div className="shows-studio__hero">
            <picture>
              <source srcSet={asset("images/newsdesk-hosts-v5.webp")} type="image/webp" />
              <img
                src={asset("images/newsdesk-hosts-v5.png")}
                alt="Basil and Gonz in anchor chairs at the Canary Cry news desk"
                width="1920"
                height="1080"
                decoding="async"
              />
            </picture>
          </div>

          <p className="shows-studio__blurb">
            Explore the shows Basil and Gonz have been part of, together or on their
            own. One network. All their broadcasts.
          </p>
        </div>
      </div>
      {/* Same display style as home mission-hero__tag; one line; clips into scene bottom. */}
      <h1 className="shows-studio__network-title">Canary Cry Network</h1>
    </section>
  );
}

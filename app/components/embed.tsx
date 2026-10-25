// embed.tsx — a third-party player (Twitch, Restream, SoundCloud) that
// loads only when the visitor asks for it. The Ghost theme put these iframes
// straight in the page; here the page makes no request to the other site
// until the button is pressed, so the preview stays tracker-free by default
// (tests/dist/third-party.test.ts checks the built HTML has no iframes).

import { useState } from "react";
import type * as React from "react";
import { EMBED_SANDBOX, embedUrl } from "../lib/embed-url";
import { buttonVariants } from "./ui/button";

export function Embed({
  service,
  title,
  src,
  parent = false,
  openHref,
  openLabel,
  allow,
  className = "video-frame",
  style,
}: {
  /** Who serves it, as the visitor knows them: "Twitch". */
  service: string;
  /** The iframe's accessible title. */
  title: string;
  /** The iframe URL. */
  src: string;
  /** Add the page's hostname as `parent=` when loading (Twitch). */
  parent?: boolean;
  /** The same content on the other site, for visitors who'd rather go there. */
  openHref: string;
  /** Defaults to "Open it on <service> instead". */
  openLabel?: string;
  allow?: string;
  className?: string;
  style?: React.CSSProperties;
}): React.ReactNode {
  const [url, setUrl] = useState<string | null>(null);
  const host = new URL(src).hostname;
  return (
    <div className={className} style={style}>
      {url === null ? (
        <div className="embed-facade">
          <span className="eyebrow eyebrow--no-rule">{service}</span>
          <button
            className={buttonVariants()}
            type="button"
            onClick={() => {
              setUrl(embedUrl(src, parent, window.location.hostname));
            }}
          >
            Load the {service} player
          </button>
          <p className="embed-facade__note">
            Loads content from {host}, which may set cookies.{" "}
            <a href={openHref} rel="noopener">
              {openLabel ?? `Open it on ${service} instead`}
            </a>
            .
          </p>
        </div>
      ) : (
        <iframe src={url} title={title} allow={allow} allowFullScreen sandbox={EMBED_SANDBOX} />
      )}
    </div>
  );
}

// shows-strip.tsx — the three shows as cards, each linking to its episode
// list (Ghost index.hbs and page-about-us-mojave.hbs). Also used on the
// Shows page for The Main Shows (default SHOWS) and Other Works (passed in).

import type * as React from "react";
import { Link } from "react-router";
import { asset } from "../lib/asset";
import { tagPath } from "../lib/paths";
import { SHOWS } from "../lib/shows";
import { SmartLink } from "./smart-link";

// Home-strip art: the crest for News Talk, the round bird for Clubhouse.
const STRIP_ART: Record<string, string> = {
  "news-talk": "images/show-news-talk-crest.webp",
  clubhouse: "images/show-clubhouse-bird.webp",
};

/** Transparent 96×96 SVG so blank hero keeps <img width/height> box model without a network fetch. */
const STRIP_ART_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"/>');

/** A show card in the strip. Optional fields are filled for Other Works. */
export type ShowsStripItem = {
  slug: string;
  title: string;
  kicker?: string | null;
  desc?: string | null;
  /** Public asset path (via asset()) or an absolute image URL. */
  art?: string | null;
  logo?: string | null;
  logoSize?: readonly [number, number];
  href?: string | null;
};

function artSrc(art: string | null | undefined, blank: boolean): string {
  if (blank || !art) return STRIP_ART_PLACEHOLDER;
  if (/^https?:\/\//i.test(art) || art.startsWith("data:")) return art;
  return asset(art);
}

function ShowCardBody({
  item,
  blank,
}: {
  item: ShowsStripItem;
  blank: boolean;
}): React.ReactNode {
  return (
    <>
      {item.logo ? (
        <span
          className="show-card__logo"
          role={blank ? undefined : "img"}
          aria-label={blank ? undefined : item.title}
          style={{
            ...(blank
              ? {}
              : {
                  maskImage: `url(${asset(item.logo)})`,
                  WebkitMaskImage: `url(${asset(item.logo)})`,
                }),
            aspectRatio: item.logoSize ? `${item.logoSize[0]} / ${item.logoSize[1]}` : undefined,
          }}
        />
      ) : (
        <span className="show-card__logo show-card__logo--text">{item.title}</span>
      )}
      <img
        className="show-card__art"
        src={artSrc(item.art, blank)}
        alt=""
        width={96}
        height={96}
        loading={blank ? undefined : "lazy"}
        decoding="async"
      />
      <div className="show-card__body">
        {item.kicker ? <span className="show-card__kicker">{item.kicker}</span> : null}
        {item.desc ? <p className="show-card__desc">{item.desc}</p> : null}
      </div>
    </>
  );
}

export function ShowsStrip({
  blank = false,
  shows,
  append,
}: {
  blank?: boolean;
  shows?: ShowsStripItem[];
  /** Extra node after the cards (Other Works FaceLikeTheSun card). */
  append?: React.ReactNode;
} = {}): React.ReactNode {
  const items: ShowsStripItem[] =
    shows ??
    SHOWS.map((s) => ({
      slug: s.slug,
      title: s.title,
      kicker: s.kicker,
      desc: s.desc,
      art: STRIP_ART[s.slug] ?? s.art,
      logo: s.logo,
      logoSize: s.logoSize,
      href: tagPath(s.slug),
    }));

  return (
    <div className="shows-strip">
      {items.map((item) => {
        const body = <ShowCardBody item={item} blank={blank} />;

        // Same .show-card grid either way; blank uses <a> without navigation so
        // UA/default anchor + .show-card rules match home Link(<a>) geometry.
        if (blank) {
          return (
            <a key={item.slug} className="show-card" aria-hidden="true" tabIndex={-1}>
              {body}
            </a>
          );
        }

        if (!item.href) {
          return (
            <div
              key={item.slug}
              className="show-card show-card--soon"
              aria-label={`${item.title}: destination to come`}
            >
              {body}
            </div>
          );
        }

        // Default Big Three path keeps <Link> so home/about markup is unchanged.
        if (!shows) {
          return (
            <Link className="show-card" to={item.href} key={item.slug}>
              {body}
            </Link>
          );
        }

        return (
          <SmartLink className="show-card" href={item.href} key={item.slug}>
            {body}
          </SmartLink>
        );
      })}
      {append}
    </div>
  );
}

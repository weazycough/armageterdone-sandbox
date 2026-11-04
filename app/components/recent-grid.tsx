// recent-grid.tsx — home "Recent episodes": big latest card + 2x2 horizontal cards.

import type * as React from "react";
import { Link } from "react-router";
import { asset } from "../lib/asset";
import { isoDay } from "../lib/dates";
import { episodePath } from "../lib/paths";

export type RecentEp = {
  slug: string;
  title: string;
  published: string;
  artUrl?: string | undefined;
  duration?: string | undefined;
};

const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function art(e: RecentEp): string {
  return e.artUrl ?? asset("images/cc-logo.webp");
}

function Dur({ d }: { d?: string | undefined }): React.ReactNode {
  if (!d) return null;
  return (
    <span className="recent-grid__dur">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10 8l6 4-6 4z" fill="currentColor" />
      </svg>
      {d}
    </span>
  );
}

export function RecentGrid({ episodes }: { episodes: RecentEp[] }): React.ReactNode {
  const [lead, ...rest] = episodes;
  if (!lead) return null;
  return (
    <div className="recent-grid">
      <Link className="recent-grid__lead" to={episodePath(lead.slug)}>
        <img src={art(lead)} alt="" width={600} height={600} />
        <span className="recent-grid__pill">Latest episode</span>
        <span className="recent-grid__lead-body">
          <span className="recent-grid__lead-title">{lead.title}</span>
          <span className="recent-grid__lead-meta">
            <time dateTime={isoDay(lead.published)}>{SHORT.format(new Date(lead.published))}</time>
            {lead.duration && <> | {lead.duration}</>}
          </span>
        </span>
      </Link>
      <ul className="recent-grid__list">
        {rest.slice(0, 4).map((e) => (
          <li key={e.slug}>
            <Link className="recent-grid__card" to={episodePath(e.slug)} title={e.title}>
              <img src={art(e)} alt="" width={200} height={200} loading="lazy" />
              <span className="recent-grid__card-body">
                <time className="recent-grid__date" dateTime={isoDay(e.published)}>
                  {SHORT.format(new Date(e.published))}
                </time>
                <span className="recent-grid__title">{e.title}</span>
                <Dur d={e.duration} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

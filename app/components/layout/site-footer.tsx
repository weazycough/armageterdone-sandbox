// site-footer.tsx — brand, motto, social links and the four link columns
// (Ghost default.hbs footer).

import type * as React from "react";
import { Link } from "react-router";
import { SiteBrand } from "./site-header";
import { FOOTER_COLUMNS } from "../../lib/nav";
import { SmartLink } from "../smart-link";

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCuxgIViDUSfJ9_C9ruJFhOA",
    icon: (
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.5v-7L16 12l-6.4 3.5z" />
    ),
  },
  {
    label: "Rumble",
    href: "https://rumble.com/c/CanaryCryNewsTalk",
    icon: (
      <path d="M14.4528 13.5458c.8064-.6542.9297-1.8381.2756-2.6445a1.8802 1.8802 0 0 0-.2756-.2756 21.2127 21.2127 0 0 0-4.3121-2.776c-1.066-.51-2.256.2-2.4261 1.414a23.5226 23.5226 0 0 0-.14 5.5021c.116 1.23 1.292 1.964 2.372 1.492a19.6285 19.6285 0 0 0 4.5062-2.704v-.008zm6.9322-5.4002c2.0335 2.228 2.0396 5.637.014 7.8723A26.1487 26.1487 0 0 1 8.2946 23.846c-2.6848.6713-5.4168-.914-6.1662-3.5781-1.524-5.2002-1.3-11.0803.17-16.3045.772-2.744 3.3521-4.4661 6.0102-3.832 4.9242 1.174 9.5443 4.196 13.0764 8.0121v.002z" />
    ),
  },
  {
    label: "X",
    href: "https://twitter.com/CanaryCryRadio",
    icon: (
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    ),
  },
  {
    label: "Patreon",
    href: "https://www.patreon.com/ccnt",
    icon: (
      <>
        <circle cx="15" cy="9" r="7" />
        <rect x="3" y="2" width="3" height="20" />
      </>
    ),
  },
];

export function SiteFooter({ year }: { year: number }): React.ReactNode {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__cols">
          <div>
            <SiteBrand className="site-brand--footer" />
            <p className="site-footer__motto">
              &ldquo;Cogitare extra caveam — think outside the cage.&rdquo;
            </p>
            <div className="site-footer__socials" aria-label="Social channels">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} rel="noopener" aria-label={s.label} title={s.label}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href}>{l.label}</SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="site-footer__legal">
          <span>&copy; {year} Canary Cry News Talk.</span>
          <span>
            <Link to="/textprivacy/">Privacy</Link> · <Link to="/contact-us-mojave/">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

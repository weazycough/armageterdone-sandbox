// main-nav.tsx — the primary nav (Ghost partials/main-nav.hbs). Rendered twice,
// as the desktop bar and inside the mobile drawer, each with its own state.
// A dropdown opens on click (touch, keyboard, mouse) via aria-expanded, and
// on hover where the device has one (theme CSS). One open at a time; a click
// outside or Escape closes it.

import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import { PRIMARY_NAV } from "../../lib/nav";
import { SmartLink } from "../smart-link";

function Chevron(): React.ReactNode {
  return (
    <svg className="nav__chevron" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
      <path
        d="M1.5 1.5l4.5 4.5 4.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MainNav({ onNavigate }: { onNavigate?: () => void }): React.ReactNode {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open === null) return;
    function onClick(e: MouseEvent): void {
      if (e.target instanceof Node && ref.current?.contains(e.target) !== true) setOpen(null);
    }
    function onKey(e: KeyboardEvent): void {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function followed(): void {
    setOpen(null);
    onNavigate?.();
  }

  return (
    <ul className="nav" ref={ref}>
      {PRIMARY_NAV.map((item) =>
        item.menu === undefined ? (
          <li className="nav__item" key={item.label}>
            <SmartLink
              href={item.href ?? "/"}
              className={item.cta === true ? "nav__link nav__link--cta" : "nav__link"}
              onClick={followed}
            >
              {item.label}
            </SmartLink>
          </li>
        ) : (
          <li className="nav__item nav__item--has-menu" key={item.label}>
            <button
              className="nav__link nav__trigger"
              type="button"
              aria-expanded={open === item.label}
              onClick={() => {
                setOpen(open === item.label ? null : item.label);
              }}
            >
              {item.label} <Chevron />
            </button>
            <ul className="nav__menu">
              {item.menu.map((link) => (
                <li key={link.label}>
                  <SmartLink href={link.href} onClick={followed}>
                    {link.label}
                  </SmartLink>
                  {link.meta !== undefined && <span className="nav__menu-meta">{link.meta}</span>}
                </li>
              ))}
            </ul>
          </li>
        ),
      )}
    </ul>
  );
}

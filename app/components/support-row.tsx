// support-row.tsx — the value-for-value call to action (Ghost index.hbs,
// post.hbs and most page templates). The buttons default to Support + Patreon.

import type * as React from "react";
import { Link } from "react-router";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

/** On the smallest phones a long label wraps instead of overflowing. */
const WRAP_WHEN_NARROW = "max-[400px]:shrink max-[400px]:whitespace-normal";

export function SupportRow({
  eyebrow,
  heading,
  actions,
  children,
}: {
  eyebrow: string;
  heading: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="support-row">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h3>{heading}</h3>
        <p>{children}</p>
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
        {actions ?? <DefaultActions />}
      </div>
    </div>
  );
}

function DefaultActions(): React.ReactNode {
  return (
    <>
      <Link className={cn(buttonVariants(), WRAP_WHEN_NARROW)} to="/support/">
        Ways to produce the show
      </Link>
      <a
        className={buttonVariants({ variant: "ghost" })}
        href="https://www.patreon.com/ccnt"
        rel="noopener"
      >
        Patreon
      </a>
    </>
  );
}

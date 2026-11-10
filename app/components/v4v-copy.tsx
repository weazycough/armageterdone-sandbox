// v4v-copy.tsx — shared Value for Value copy and action buttons so the
// home band and the Shows band stay in sync.

import type * as React from "react";
import { Link } from "react-router";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";

export const V4V_EYEBROW = "No advertisers. Just producers";

export function V4vDescription(): React.ReactNode {
  return (
    <p>
      Canary Cry doesn’t take corporate ad money. It runs on producers: the
      listeners who give back with <strong>time, talent, or treasure</strong>. Patreon, one-time
      gifts, Cage Rattler Coffee, art, and Speak Pipe calls all count.
    </p>
  );
}

export function V4vActions({ className }: { className?: string } = {}): React.ReactNode {
  return (
    <div className={className}>
      <Link className={cn(buttonVariants(), "mission-hero__give")} to="/support/">
        $ Give
      </Link>
      <a
        className={cn(buttonVariants({ variant: "blue" }), "mission-hero__patreon")}
        href="https://www.patreon.com/ccnt"
        rel="noopener"
      >
        Patreon
      </a>
    </div>
  );
}

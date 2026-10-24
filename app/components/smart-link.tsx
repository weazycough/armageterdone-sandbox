// smart-link.tsx — a router <Link> for site paths ("/support/"), a plain
// <a rel="noopener"> for everything else. Router links get the base path.

import type * as React from "react";
import { Link } from "react-router";

type SmartLinkProps = Omit<React.ComponentProps<"a">, "href"> & { href: string };

export function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function SmartLink({ href, children, ...props }: SmartLinkProps): React.ReactNode {
  if (isInternal(href)) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} rel="noopener" {...props}>
      {children}
    </a>
  );
}

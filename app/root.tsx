// root.tsx — the document shell every page shares: <head> (no-index, theme
// boot script, fonts and styles), the header and footer.
//
// The robots meta is in the server-rendered HTML of every page on purpose:
// the site is public but must never be indexed, and crawlers that don't run
// JS must still see it. tests/dist checks every built HTML file for it.

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type * as React from "react";
import type { Route } from "./+types/root";
import { SiteFooter } from "./components/layout/site-footer";
import { SiteHeader } from "./components/layout/site-header";
import { asset } from "./lib/asset";
import { THEME_BOOT_SCRIPT } from "./lib/theme";
import "./styles/app.css";

export function Layout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow, noarchive" />
        {/* The preview's address stays out of other sites' referrer logs. */}
        <meta name="referrer" content="no-referrer" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fdf8eb" media="(prefers-color-scheme: light)" />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <link rel="icon" type="image/png" href={asset("favicon.png")} />
        <Meta />
        <Links />
      </head>
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <SiteHeader latest={__SITE__.latest} />
        <main id="main">{children}</main>
        <SiteFooter year={__SITE__.year} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App(): React.ReactNode {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): React.ReactNode {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <article className="page">
      <header className="page-hero">
        <div className="container">
          <h1>{notFound ? "Page not found" : "Something went wrong"}</h1>
          <p className="muted">
            {notFound ? "That page isn't on the preview site." : "Try reloading the page."}
          </p>
        </div>
      </header>
    </article>
  );
}

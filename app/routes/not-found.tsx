// not-found.tsx — any path the site doesn't have. Prerendered once as
// 404.html, which GitHub Pages serves for every missing URL.

import type * as React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/not-found";

export function meta(): Route.MetaDescriptors {
  return [{ title: "Page not found — Canary Cry News Talk" }];
}

export default function NotFound(): React.ReactNode {
  return (
    <article className="page">
      <header className="page-hero">
        <div className="container">
          <h1>Page not found</h1>
          <p className="muted">That page isn&apos;t on the preview site.</p>
        </div>
      </header>
      <div className="page-body">
        <div className="container" style={{ textAlign: "center" }}>
          <Link to="/">Back to the homepage</Link> · <Link to="/episodes/">All episodes</Link>
        </div>
      </div>
    </article>
  );
}

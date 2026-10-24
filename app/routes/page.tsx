// page.tsx — the generic page template (Ghost page.hbs) for every page
// extracted from the Ghost export (content/pages). Pages with a custom Ghost
// design get their own route later; until then they render here.

import type * as React from "react";
import { data } from "react-router";
import type { Route } from "./+types/page";
import { loadPages } from "../lib/content.server";
import { withBase } from "../lib/paths";

export function loader({ params }: Route.LoaderArgs) {
  const page = loadPages().find((p) => p.slug === params.slug);
  if (page === undefined) throw data(null, { status: 404 });
  return { title: page.title, html: withBase(page.html) };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  return [{ title: `${loaderData.title} — Canary Cry News Talk` }];
}

export default function Page({ loaderData }: Route.ComponentProps): React.ReactNode {
  const { title, html } = loaderData;
  return (
    <article className="page">
      <header className="page-hero">
        <div className="container">
          <h1>{title}</h1>
        </div>
      </header>
      <div className="page-body post-body">
        <div className="container">
          {html === "" ? (
            <section className="prose">
              <p className="muted">This page is still being written.</p>
            </section>
          ) : (
            <section className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
      </div>
    </article>
  );
}

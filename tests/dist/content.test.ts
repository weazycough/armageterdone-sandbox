// content.test.ts — the build produced every page it should, and the forms
// on the preview send nothing.

import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { DESIGNED_PAGES } from "../../app/lib/designed-pages";
import { episodeListSchema } from "../../app/lib/feed";
import { EPISODES_JSON, PAGES_DIR, pageCount, tagPath } from "../../app/lib/paths";
import { SHOWS, showOf } from "../../app/lib/shows";
import { files, htmlFiles, read } from "./dist-files";

const episodes = episodeListSchema.parse(JSON.parse(readFileSync(EPISODES_JSON, "utf8")));
const pageSlugs = readdirSync(PAGES_DIR).map((f) => f.replace(/\.json$/, ""));

describe("pages", () => {
  it("has the homepage and the 404 page", () => {
    expect(files).toContain("index.html");
    expect(files).toContain("404.html");
    expect(read("404.html")).toContain("Page not found");
  });

  it("has every episode list page", () => {
    const lists = htmlFiles.filter(
      (f) => f === "episodes/index.html" || /^episodes\/page\/\d+\/index\.html$/.test(f),
    );
    expect(lists).toHaveLength(pageCount(episodes.length));
    expect(files).not.toContain("episodes/page/1/index.html");
  });

  it("has one page per RSS episode, with its audio", () => {
    expect(episodes.length).toBeGreaterThan(900);
    const missing = episodes.filter((e) => !files.includes(`episodes/${e.slug}/index.html`));
    expect(missing.map((e) => e.slug)).toEqual([]);
    const sample = episodes[0]!;
    expect(read(`episodes/${sample.slug}/index.html`)).toContain(
      `<source src="${sample.audioUrl.replace(/&/g, "&amp;")}"`,
    );
  });

  it("has every page extracted from Ghost", () => {
    expect(pageSlugs.length).toBeGreaterThan(30);
    expect(pageSlugs.filter((s) => !files.includes(`${s}/index.html`))).toEqual([]);
  });
});

describe("designed pages and show lists", () => {
  it("renders each designed page with its own template, not the generic one", () => {
    const generic = DESIGNED_PAGES.filter(
      (slug) => !/<article class="page [a-z0-9-]+-page"/.test(read(`${slug}/index.html`)),
    );
    expect(generic).toEqual([]);
  });

  it("has every page of every show's list", () => {
    for (const show of SHOWS) {
      const count = episodes.filter((e) => showOf(e) === show.slug).length;
      expect(count, show.slug).toBeGreaterThan(10);
      const lists = htmlFiles.filter((f) => f.startsWith(`tag/${show.slug}/`));
      expect(lists, show.slug).toHaveLength(pageCount(count));
      expect(files).toContain(`${tagPath(show.slug).slice(1)}index.html`);
    }
  });
});

describe("forms", () => {
  it("submit nowhere: no action, no method, no named fields, and say so", () => {
    const bad: string[] = [];
    for (const f of htmlFiles) {
      const html = read(f);
      for (const form of html.match(/<form\b[\s\S]*?<\/form>/g) ?? []) {
        if (/\s(?:action|method)=/.test(form.slice(0, form.indexOf(">"))))
          bad.push(`${f}: form has action/method`);
        if (/<(?:input|select|textarea)\b[^>]*\sname=/.test(form)) bad.push(`${f}: named field`);
      }
      if (html.includes("<form") && !html.includes("Preview only"))
        bad.push(`${f}: no preview-only notice`);
    }
    expect(bad).toEqual([]);
  });
});

describe("404 page", () => {
  it("is static: no app scripts to hydrate against the wrong route", () => {
    const html = read("404.html");
    expect(html).toContain('class="static-page"');
    expect(html).not.toMatch(/<script\b[^>]*type="module"/);
    expect(html).not.toContain("modulepreload");
    expect(html).not.toContain("__reactRouterContext");
  });
});

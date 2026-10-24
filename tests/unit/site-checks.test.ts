// The dist checks on hand-written pages like design labs: any quoting style,
// every srcset candidate, styles, pings, refreshes and forms.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import {
  cssProblems,
  pageUrls,
  parseAttrs,
  robotsProblem,
  thirdPartyProblems,
} from "../site-checks";

const page = (head: string, body = "") =>
  `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;
const ROBOTS = '<meta name="robots" content="noindex, nofollow, noarchive">';

describe("robotsProblem", () => {
  it.each([
    ROBOTS,
    '<meta name="robots" content="noindex, nofollow, noarchive"/>',
    "<meta name='robots' content='noindex,nofollow,noarchive' />",
    '<meta  content="noarchive, noindex, nofollow"  name=ROBOTS >',
  ])("accepts %s", (meta) => {
    expect(robotsProblem(page(meta))).toBeNull();
  });

  it("rejects a missing, partial or body-only tag, and a page without </head>", () => {
    expect(robotsProblem(page(""))).not.toBeNull();
    expect(robotsProblem(page('<meta name="robots" content="noindex">'))).not.toBeNull();
    expect(robotsProblem(page("", ROBOTS))).not.toBeNull();
    expect(robotsProblem(`<html><head><title>x</title><body>${ROBOTS}`)).toBe("no </head>");
    expect(robotsProblem(page(`<!-- ${ROBOTS} -->`))).not.toBeNull();
  });

  it("the lab list in public/ passes", () => {
    expect(robotsProblem(readFileSync("public/labs/index.html", "utf8"))).toBeNull();
  });
});

describe("parseAttrs", () => {
  it("reads double, single and unquoted values", () => {
    const a = parseAttrs(` src="a.png" alt='it&#39;s' width=200 hidden`);
    expect([a.get("src"), a.get("alt"), a.get("width"), a.has("hidden")]).toEqual([
      "a.png",
      "it's",
      "200",
      true,
    ]);
  });
});

describe("thirdPartyProblems", () => {
  const problems = (body: string, head = "") =>
    thirdPartyProblems(page(ROBOTS + head, body), "labs/1-x/index.html");

  it("allows same-site, relative and episode-media loads", () => {
    expect(
      problems(
        `<img src="art.png" srcset="art.png 1x, /Armageterdone/images/a.webp 2x"><img src=https://static.libsyn.com/p/a.png>
         <audio src='https://traffic.libsyn.com/a.mp3'></audio><script src="lab.js"></script><a href="https://x.example/">ok</a>
         <div style="background:url(bg.png)"></div><script>console.log(1)</script>`,
        `<link rel=stylesheet href=lab.css><style>@font-face{src:url("jost.woff2")}</style>`,
      ),
    ).toEqual([]);
  });

  it.each([
    ["an unquoted remote script", "<script src=https://cdn.example/x.js></script>"],
    [
      "a single-quoted remote stylesheet",
      "<link rel='stylesheet' href='https://cdn.example/x.css'>",
    ],
    ["a preconnect", '<link rel="preconnect" href="https://fonts.example">'],
    [
      "a remote image in the second srcset candidate",
      '<img src="a.png" srcset="a.png 1x, https://img.example/b.png 2x">',
    ],
    ["a remote video poster", '<video poster="https://img.example/p.jpg"></video>'],
    ["an iframe", '<iframe src="https://www.youtube.com/embed/x"></iframe>'],
    ["a ping", '<a href="/x" ping="https://track.example/p">x</a>'],
    [
      "a refresh to another site",
      '<meta http-equiv="refresh" content="0; url=https://elsewhere.example/">',
    ],
    ["a form action", '<form action="/subscribe"><button>Go</button></form>'],
    [
      "a remote url() in a style attribute",
      `<div style="background:url('https://img.example/bg.png')"></div>`,
    ],
    ["a remote @import in a style block", '<style>@import "https://fonts.example/css";</style>'],
    ["a tracker in an inline script", "<script>gtag('config','x')</script>"],
  ])("flags %s", (_name, body) => {
    expect(problems(body)).not.toEqual([]);
  });

  it("allows an iframe only from the page's allow-listed hosts", () => {
    expect(
      thirdPartyProblems(
        page(ROBOTS, '<iframe src="https://player.example/x"></iframe>'),
        "watch/index.html",
      ),
    ).not.toEqual([]);
  });
});

describe("cssProblems", () => {
  it("flags remote url() and @import, allows local and data URLs", () => {
    expect(cssProblems(`a{background:url(https://img.example/a.png)}`)).not.toEqual([]);
    expect(cssProblems(`@import 'https://fonts.example/x.css';`)).not.toEqual([]);
    expect(
      cssProblems(
        `@font-face{src:url(/Armageterdone/assets/a.woff2)}b{background:url(data:image/png;base64,AA==)}`,
      ),
    ).toEqual([]);
  });
});

describe("pageUrls", () => {
  it("collects every link and every srcset candidate", () => {
    expect(
      pageUrls(
        `<a href='x/'>x</a><img src=a.png srcset="a.png 1x, b.png 2x"><link href="s.css" rel=stylesheet>`,
      ),
    ).toEqual(["x/", "a.png", "a.png", "b.png", "s.css"]);
  });
});

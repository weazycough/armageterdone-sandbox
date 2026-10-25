import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { DESIGNED_PAGES } from "./lib/designed-pages";

// Every path is prerendered (react-router.config.ts lists them).
export default [
  index("routes/home.tsx"),
  route("episodes", "routes/episodes.tsx", { id: "episodes" }),
  route("episodes/page/:page", "routes/episodes.tsx", { id: "episodes-page" }),
  route("episodes/:slug", "routes/episode.tsx"),
  route("tag/:tag", "routes/tag.tsx", { id: "tag" }),
  route("tag/:tag/page/:page", "routes/tag.tsx", { id: "tag-page" }),
  // Pages with their own design (Ghost page-<slug>.hbs), one file each.
  ...DESIGNED_PAGES.map((slug) => route(slug, `routes/pages/${slug}.tsx`)),
  // Every other page from content/pages, in the generic template.
  route(":slug", "routes/page.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;

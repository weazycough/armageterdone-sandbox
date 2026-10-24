import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Every path is prerendered (react-router.config.ts lists them).
export default [
  index("routes/home.tsx"),
  route("episodes", "routes/episodes.tsx", { id: "episodes" }),
  route("episodes/page/:page", "routes/episodes.tsx", { id: "episodes-page" }),
  route("episodes/:slug", "routes/episode.tsx"),
  route(":slug", "routes/page.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;

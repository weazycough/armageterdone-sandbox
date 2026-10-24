// vite.config.ts — Vite+ config: the build (React Router + Tailwind), the
// lint/type-check gate (`vp check`) and the tests (`vp test`).

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "vite-plus";
import type { Plugin } from "vite-plus";
import { BASE, SITE_JSON } from "./app/lib/paths";

/** In dev, serve a design lab folder ("/Armageterdone/labs/12-x/") as its
 *  index.html, as GitHub Pages does. Without it the router takes the URL. */
function labIndexes(): Plugin {
  return {
    name: "lab-indexes",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const labs = `${BASE}labs/`;
        if (req.url?.startsWith(labs) === true)
          req.url = req.url.replace(/\/(?=[?#]|$)/, "/index.html");
        next();
      });
    },
  };
}

/** Header/footer facts from scripts/prepare-content.ts; see app/site-info.d.ts. */
function siteInfo(): string {
  if (existsSync(SITE_JSON)) return readFileSync(SITE_JSON, "utf8");
  return JSON.stringify({ latest: null, year: new Date().getUTCFullYear() });
}

export default defineConfig({
  base: BASE,
  define: { __SITE__: siteInfo() },
  // React Router's plugin builds the app; tests import modules directly.
  plugins: process.env.VITEST === undefined ? [labIndexes(), tailwindcss(), reactRouter()] : [],
  lint: {
    ignorePatterns: [
      "build/**",
      "dist/**",
      ".react-router/**",
      ".cache/**",
      "content/**",
      "public/**",
    ],
    plugins: ["typescript", "react", "unicorn", "oxc"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      // The type-aware rules agents most often trip over (golden path).
      "typescript/no-floating-promises": "error",
      "typescript/no-misused-promises": "error",
      "typescript/switch-exhaustiveness-check": "error",
      "typescript/no-unnecessary-condition": "error",
      "typescript/await-thenable": "error",
      // React Router's loaders throw `data(…, { status: 404 })` by design.
      "typescript/only-throw-error": [
        "error",
        { allow: [{ from: "package", package: "react-router", name: "DataWithResponseInit" }] },
      ],
      "typescript/prefer-promise-reject-errors": "error",
      "typescript/restrict-template-expressions": "error",
      "react/rules-of-hooks": "error",
    },
  },
  fmt: {
    ignorePatterns: [
      "build/**",
      "dist/**",
      ".react-router/**",
      ".cache/**",
      "content/**",
      "public/**",
      "pnpm-lock.yaml",
      // The client's own feedback doc stays as they wrote it.
      "docs/canary-cry-website-issues.md",
    ],
  },
  check: {
    // Formatting is advisory here (`vp fmt`), not a gate.
    fmt: false,
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["app/**/*.test.ts", "scripts/**/*.test.ts", "tests/unit/**/*.test.ts"],
        },
      },
      {
        // Run by `pnpm build` after the site is assembled: they read dist/.
        // Each test reads all of dist/ (about 60 MB, 1,100+ pages): seconds, not
        // the default 5 s limit, on a CI runner.
        test: { name: "dist", include: ["tests/dist/**/*.test.ts"], testTimeout: 120_000 },
      },
    ],
  },
});

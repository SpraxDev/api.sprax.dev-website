# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Showcase website for api.sprax.dev (a Minecraft-related REST API): interactive endpoint previews, statistics, and a path to the developer docs.
Static one-pager built with SvelteKit + `adapter-static`; all data is fetched client-side from the live `https://api.sprax.dev` (permissive CORS, no proxy needed in dev).

## Commands

- `npm run dev` — dev server (talks directly to the live API)
- `npm run build` — static output in `build/`; `npm run preview` serves it
- `npm run check` — svelte-check type checking (`check:watch` for watch mode). There is deliberately no eslint/prettier (mirrors other sprax projects) — `check` is the quality gate and must pass.
- `npm test` — run all unit tests once (`test:coverage` for coverage, `test:unit` for watch mode)
- Single test file: `npm run test:unit -- --run src/lib/motd.spec.ts`
- `./deployToLunar.sh` — build and rsync to production (only when explicitly asked)

## Testing setup

Vitest is configured with two projects in `vite.config.ts`:

- **server**: plain `*.spec.ts` files, run in Node.
- **client**: `*.svelte.spec.ts` files, run in real headless Firefox **and** Chromium via Playwright (`vitest-browser-svelte`).
  Coverage uses istanbul (not v8) because v8 is Chromium-only. Needs `npx playwright install firefox chromium` once per machine.

`expect.requireAssertions` is enabled — every test must make at least one assertion. Select one project with `--project client` / `--project server` if needed.

Visual changes should be verified in a real browser against `npm run dev` before being considered done (use the Playwright MCP if connected) — check both themes and loading/error states, not just the happy path.

## Architecture

There is **no `svelte.config.js`** — all SvelteKit config (adapter-static, CSP, compiler options) lives inside the `sveltekit()` plugin options in `vite.config.ts`.
Runes mode is forced for all project code (non-runes syntax won't compile); this is a Svelte 5 codebase.
The official Svelte MCP server MUST be used when writing or editing Svelte code (`claude mcp add --transport http svelte https://mcp.svelte.dev/mcp` if not connected).

- `src/routes/+layout.ts` sets `prerender = true`; the whole site is pre-rendered, there is no server-side code. Anything username-specific must be resolved client-side so the pre-rendered HTML stays username-agnostic.
- `src/lib/api.ts` — pure URL builders for the live API. Built URLs are user-visible/copyable, so parameters matching API defaults are intentionally omitted to keep them minimal.
- `src/lib/state/*.svelte.ts` — global state as rune-based classes exported as singletons. `username` drives every preview card;
  `profile` exposes a `$derived` fetch promise shared by all consumers so the profile is fetched once per username change;
  `theme` follows the system until the user toggles (pre-paint inline script in `src/app.html` — its CSP hash lives in `vite.config.ts` and must be updated if that script changes).
- `src/lib/components/cards/` — one showcase card per API endpoint, composed on the single page in `src/routes/+page.svelte`.
- `src/lib/data/` — curated content: known usernames, sample server hostnames, "used by" projects.
- `src/routes/docs/` — API reference page rendered with `@scalar/api-reference`.

### Styling

**Custom CSS only** — no Bootstrap, no Tailwind, and don't suggest adding them.
Scoped Svelte styles plus a design-tokens file (`src/lib/styles/tokens.css`); dark/light theme via CSS `light-dark()` tokens.
The site must look distinctive, not like a template. The visual direction ("pixel-lit") in practice:
the pixel grid is the shared design DNA — corner radii ≤ 2px, 1px borders, spacing on a 4px grid,
skin renders displayed with `image-rendering: pixelated` at integer multiples of their source pixels.
The chrome never cosplays Minecraft — the data supplies the Minecraft feel.
Respect `prefers-reduced-motion` and give every data-loading spot a skeleton/empty state.

### Content-Security-Policy

A restrictive CSP is emitted as `<meta http-equiv>` tags at build time (configured in `vite.config.ts`).
Any new external resource (images, fetch targets, etc.) must be allowlisted in the `csp.directives` there, or it will be blocked in production;
currently only `self` and `https://api.sprax.dev` are allowed. `frame-ancestors`/`report-uri`/`sandbox` don't work in meta tags — those would need nginx.

## Licensing note

Code is GPL-3.0-or-later, but project logos in `src/lib/assets/projects/` belong to their owners (shown with permission) and the Departure Mono font is OFL-licensed.

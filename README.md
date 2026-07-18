# api.sprax.dev – Website

Showcase website for [api.sprax.dev](https://api.sprax.dev/) ([SpraxDev/api.sprax.dev](https://github.com/SpraxDev/api.sprax.dev)):
interactive endpoint previews, publicly interesting statistics and a path into the full developer docs.

Static one-pager built with SvelteKit + `adapter-static`, served at the API's root by the same nginx
that fronts the API. All data is fetched client-side from the public API.

The full plan/spec currently lives in the API repository (`WEBSITE_PLAN.md`).

## Developing

```bash
npm install
npm run dev
```

The dev server talks directly to the live `https://api.sprax.dev` (permissive CORS), no proxy needed.

## Building

```bash
npm run build     # static output in build/
npm run preview   # serve the production build locally
```

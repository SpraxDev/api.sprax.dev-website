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

## License

The code in this repository is licensed under [GPL-3.0-or-later](LICENSE). Exceptions:

- **Project logos** in `src/lib/assets/projects/` belong to their respective owners and are
  **not** covered by the GPL — they are shown with permission in the "Used by" section only.
- **Departure Mono** (`src/lib/assets/fonts/`) is licensed under the SIL Open Font License
  (see `DepartureMono-LICENSE` next to it).

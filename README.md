# api.sprax.dev – Website

Showcase website for [api.sprax.dev](https://api.sprax.dev/) ([SpraxDev/api.sprax.dev](https://github.com/SpraxDev/api.sprax.dev)):
interactive endpoint previews, publicly interesting statistics and a path into the full developer docs.

## Developing
You need [Node.js and npm](https://nodejs.org/en/download) on your machine.

The project uses *vite*, so the commands might feel familiar:
* Install project dependencies using `npm ci`
* Run the dev server using `npm run dev`, which allows you to instantly see edits directly in your browser

### Building
You can build the project using `npm run build`, which will generate the static files and put them in `build/`.
You can then use `npm run preview`, to preview the built website – This allows you to view the website in 'production mode', so to say.


## License
The code in this repository is licensed under [GPL-3.0-or-later](LICENSE).

Exceptions:
* **Project logos** in `src/lib/assets/projects/` belong to their respective owners and are
  **not** covered by the GPL — they are shown with permission in a "Used by" kind of section only
* **Departure Mono** (`src/lib/assets/fonts/`) is licensed under the SIL Open Font License
  (see `DepartureMono-LICENSE` next to it).

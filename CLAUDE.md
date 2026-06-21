# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Taste-Tales is a recipe/food blog single-page app built with Create React App (React 18), Redux Toolkit, React Router, and Tailwind CSS. Users browse, view, create, edit, and delete recipe "articles" with rich-text content.

## Commands

- `npm start` — run the dev server at http://localhost:3000
- `npm run build` — production build into `build/`
- `npm test` — Jest + React Testing Library in interactive watch mode
- `npm test -- --watchAll=false` — run tests once (e.g. for CI)
- `npm test -- src/App.test.js` — run a single test file
- `npm run deploy` — build and publish `build/` to GitHub Pages via `gh-pages`

### Backend (required for the app to function)

The frontend talks to a REST API at `http://localhost:8000/` (hardcoded in `src/api/posts.js`) with a single `/blogs` resource. There is **no backend in this repo and no npm script for it** — `data/db.json` is a [json-server](https://github.com/typicode/json-server) database. Start it manually before running the app:

```
npx json-server --watch data/db.json --port 8000
```

Note the mismatch worth knowing: json-server's default route would be `/blogs` matching the API, but the `db.json` records use string `id`s.

## Architecture

**Data flow:** Components dispatch async thunks → thunks call service functions → services call the shared axios instance → reducers update the store → components re-render via `useSelector`. The layering is strict:

- `src/api/posts.js` — the single axios instance (only place the base URL lives).
- `src/services/apiPostes.js` — thin CRUD wrappers (`fetchArticles`, `createArticle`, `deleteArticle`, `updateArticle`, `fetchArticleById`) over `/blogs`. (Filename is intentionally `apiPostes`.)
- `src/features/article/articleSlice.js` — `createAsyncThunk`s wrap the services; `extraReducers` apply results to `state.article.articles`. Also holds `selectedCategory` (category filter) and `notifications`.
- `src/features/ui/uiSlice.js` — UI-only state (mobile menu, notifications dropdown). Note `notifications` exists in *both* slices; the app reads `state.article.notifications` (see `App.js`), so `uiSlice.notifications` is effectively unused.
- `src/app/store.js` — combines `ui` and `article` reducers.

**Entry & routing:** `src/index.js` wraps `<App>` in the Redux `<Provider>`. `App.js` defines all routes inside `<Router>` and dispatches `getAllArticles()` once on mount. `NavBar`, `HeroSection`, and `Footer` render on every page (outside `<Routes>`). Routes: `/` (Home), `/articles` (AddArticle), `/articles/:id` (ViewArticle), `/edit-article/:id` (EditArticle), `/about`, `*` (NoPage).

**Pages vs components:** `src/pages/` are route targets; `src/components/` are reusable building blocks (Home composes `Categories`, `TrendyRecipes`, `RecipeBlogs`, `Sidebar`, `Subscription`, etc.).

**Image uploads** go directly from the browser to Cloudinary (unsigned upload), not through the backend — see `AddArticle.jsx`/`EditArticle.jsx`. The Cloudinary cloud name (`dvnwx89ao`) and unsigned upload preset (`cg4zfcut`) are hardcoded; the returned `secure_url` is stored as the article's `imageUrl`.

**Rich text:** Article `content` is HTML produced by `react-quill` and rendered with `dangerouslySetInnerHTML` / Tailwind Typography (`prose`) in the view page. New article IDs are generated client-side with `uuid`.

## Styling

Tailwind CSS (config in `tailwind.config.js`, PostCSS in `postcss.config.js`). `darkMode: 'class'`, a custom `primary` blue color scale, Inter as the default font, and the `@tailwindcss/typography` plugin for rendered article HTML.

## Deployment

Two deployment paths exist:
- **GitHub Pages** — `.github/workflows/ci.yml` runs on push to `main`: installs deps, builds with `CI=false npm run build` (so warnings don't fail the build), and publishes `build/` via `peaceiris/actions-gh-pages`. `npm run deploy` does the same locally.
- **SPA host (Netlify-style)** — `public/_redirects` (`/* /index.html 200`) supports client-side routing.

`package.json` `homepage` points at a GitHub Pages URL; update it if the deploy target changes.

## Conventions

- ESLint uses CRA's `react-app` / `react-app/jest` config (no separate lint script; lint runs during `npm start`/`build`).
- Pages use `.jsx`; Redux/infra files use `.js`.
- Category and tag option lists are hardcoded in the Add/Edit page components — keep them in sync if you change categories.

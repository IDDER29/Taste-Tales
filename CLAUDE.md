# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Taste-Tales is a recipe/food blog app built with Next.js 14 (App Router), React 18, TypeScript (strict), Redux Toolkit, and Tailwind CSS. Users browse, view, create, edit, and delete recipe "articles" with rich-text content.

## Commands

- `npm run dev` — run the Next dev server at http://localhost:3000
- `npm run build` — production build (`next build`)
- `npm start` — serve the production build (`next start`)
- `npm run test` — Jest (via `next/jest`) + React Testing Library in watch mode
- `npm run test:ci` — run tests once (e.g. for CI)
- `npm run typecheck` — type-check with `tsc --noEmit`
- `npm run server` — json-server mock backend at http://localhost:8000

### Backend (required for the app to function in dev)

The frontend talks to a REST API at `http://localhost:8000/` (base URL in `src/api/posts.ts`, configured via `NEXT_PUBLIC_API_URL`) with a single `/blogs` resource. There is **no real backend in this repo** — `data/db.json` is a [json-server](https://github.com/typicode/json-server) database. Run it alongside `npm run dev`:

```
npm run server
```

Note the mismatch worth knowing: json-server's default route would be `/blogs` matching the API, but the `db.json` records use string `id`s.

## Architecture

**Data flow:** Components dispatch async thunks → thunks call service functions → services call the shared axios instance → reducers update the store → components re-render via `useSelector`. The layering is strict:

- `src/api/posts.ts` — the single axios instance (only place the base URL lives; reads `NEXT_PUBLIC_API_URL`).
- `src/services/apiPostes.ts` — thin CRUD wrappers (`fetchArticles`, `createArticle`, `deleteArticle`, `updateArticle`, `fetchArticleById`) over `/blogs`. (Filename is intentionally `apiPostes`.)
- `src/features/article/articleSlice.ts` — `createAsyncThunk`s wrap the services; `extraReducers` apply results to `state.article.articles`. Also holds `selectedCategory` (category filter) and `notifications`.
- `src/features/ui/uiSlice.ts` — UI-only state (mobile menu, notifications dropdown). Note `notifications` exists in *both* slices; the app reads `state.article.notifications`, so `uiSlice.notifications` is effectively unused.
- `src/app/store.ts` — combines `ui` and `article` reducers.

**Entry & routing (App Router):** Routes are file-based under `app/`. `app/layout.tsx` is the root layout: it renders `NavBar`, the page, and `Footer` inside a client `Providers` component (`app/providers.tsx`) that wraps the Redux `<Provider>` and dispatches `getAllArticles()` once on mount. `app/globals.css` holds the Tailwind directives. Routes: `app/page.tsx` (Home), `app/articles/page.tsx` (create), `app/articles/[id]/page.tsx` (view), `app/edit-article/[id]/page.tsx` (edit), `app/about`, `app/saved`, `app/cook`, and `app/not-found.tsx` (404). Most components/pages are Client Components (`"use client"`); the app is still client-rendered and fetches from json-server via the axios instance — SSR/data-fetching moves server-side when the real backend lands. `HeroSection` renders only on Home (not globally).

**Route files vs views vs components:** The `app/` route files are thin wrappers that render the page components, which live in **`src/views/`** (renamed from `src/pages/`, which Next reserves). `src/components/` holds reusable building blocks (Home composes `Categories`, `TrendyRecipes`, `RecipeBlogs`, `Sidebar`, `Subscription`, etc.).

**Image uploads** go directly from the browser to Cloudinary (unsigned upload), not through the backend — see the Add/Edit article views. The Cloudinary cloud name and unsigned upload preset come from `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`; the returned `secure_url` is stored as the article's `imageUrl`.

**Rich text:** Article `content` is HTML produced by `react-quill`, sanitized with `isomorphic-dompurify` (`src/utils/sanitize.ts`), then rendered with `dangerouslySetInnerHTML` / Tailwind Typography (`prose`) in the view page. New article IDs are generated client-side with `uuid`.

## Styling

Tailwind CSS (config in `tailwind.config.js`, PostCSS in `postcss.config.js`). `darkMode: 'class'`, a custom `primary` blue color scale, Inter as the default font, and the `@tailwindcss/typography` plugin for rendered article HTML.

## Deployment

Deployment targets **Vercel** (a Next.js SSR host) via Vercel's GitHub integration — Vercel builds and deploys automatically on push. `.github/workflows/ci.yml` is now a quality gate only (install → typecheck → test → build); it does not deploy. The old GitHub Pages / `gh-pages` / `peaceiris` flow and `public/_redirects` have been removed.

## Testing

Jest is configured via `next/jest` (`jest.config.js`, setup in `jest.setup.ts`) with the jsdom environment and React Testing Library.

## Conventions

- TypeScript throughout (strict mode); type-check with `npm run typecheck`.
- Route files live under `app/` (`.tsx`); page components in `src/views/`; reusable building blocks in `src/components/`.
- Category and tag option lists are hardcoded in the Add/Edit views — keep them in sync if you change categories.
- Browser-exposed env vars must be prefixed `NEXT_PUBLIC_` (see README).

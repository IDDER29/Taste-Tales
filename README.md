# Taste-Tales

Taste-Tales is a recipe/food blog app built with Next.js 14 (App Router), React 18, TypeScript (strict), Redux Toolkit, and Tailwind CSS. Users can browse, view, create, edit, and delete recipe "articles" with rich-text content. Article images are uploaded directly from the browser to Cloudinary, and article data is served by a [json-server](https://github.com/typicode/json-server) backend.

> Note: there is no backend code in this repository. `data/db.json` is the json-server database used as the REST API during development.

## Prerequisites

- Node.js 18

## Setup

```bash
npm install
cp .env.example .env.local
```

Then adjust the values in `.env.local` for your environment (see [Environment Variables](#environment-variables)).

## Running the backend

The frontend talks to a REST API serving recipe articles. In development this is provided by json-server using `data/db.json`. It must be running for the app to load and persist data:

```bash
npm run server
```

This serves the API at http://localhost:8000.

## Running the app

In a separate terminal:

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Testing

```bash
npm run test     # Jest watch mode
npm run test:ci  # single run, non-watch (used in CI)
npm run typecheck # type-check with tsc --noEmit
```

## Building

```bash
npm run build  # next build
npm start      # next start — serve the production build
```

`next build` produces an optimized production build in the `.next/` folder.

## Deployment

Deployment targets **Vercel** (a Next.js SSR host) via Vercel's GitHub integration: Vercel builds and deploys automatically on every push. The repo's `.github/workflows/ci.yml` is a quality gate only — it installs dependencies, type-checks, runs tests, and builds, but does not deploy.

## Environment Variables

Next.js only exposes variables prefixed with `NEXT_PUBLIC_` to the browser. Copy `.env.example` to `.env.local` and set:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the blog REST API (e.g. `http://localhost:8000/` for json-server). |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name used for unsigned image uploads. |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset. |
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | Optional. Enables the AI "Cook From Your Pantry" recipe generator. Leave unset to disable AI (the pantry matcher still works). |
| `NEXT_PUBLIC_ANTHROPIC_MODEL` | Optional. Model id for AI generation (defaults to `claude-opus-4-8`). |

Image uploads go directly from the browser to Cloudinary using the cloud name and unsigned upload preset above; the returned image URL is stored on the article.

### AI "Cook From Your Pantry" (`/cook`)

Enter the ingredients you have and the app ranks existing recipes by how many you already have (works with no API key, using the structured ingredient data). If `NEXT_PUBLIC_ANTHROPIC_API_KEY` is set, you can also generate a brand-new recipe with Claude.

> **Security note:** the AI feature calls the Anthropic API directly from the browser, which exposes the API key in the client bundle. This is fine for a local/demo build only — a production deployment should proxy these calls through a backend so the key is never shipped to the browser.

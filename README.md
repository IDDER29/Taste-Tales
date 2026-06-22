# Taste-Tales

Taste-Tales is a recipe/food blog single-page app built with React 18, TypeScript, Redux Toolkit, React Router, and Tailwind CSS. Users can browse, view, create, edit, and delete recipe "articles" with rich-text content. Article images are uploaded directly from the browser to Cloudinary, and article data is served by a [json-server](https://github.com/typicode/json-server) backend.

> Note: there is no backend code in this repository. `data/db.json` is the json-server database used as the REST API during development.

## Prerequisites

- Node.js 18

## Setup

```bash
npm install
cp .env.example .env
```

Then adjust the values in `.env` for your environment (see [Environment Variables](#environment-variables)).

## Running the backend

The frontend talks to a REST API serving recipe articles. In development this is provided by json-server using `data/db.json`. It must be running for the app to load and persist data:

```bash
npm run server
```

This serves the API at http://localhost:8000.

## Running the app

In a separate terminal:

```bash
npm start
```

The app runs at http://localhost:3000.

## Testing

```bash
npm test        # interactive watch mode
npm run test:ci # single run, non-watch (used in CI)
```

## Building

```bash
npm run build
```

Produces an optimized production build in the `build/` folder.

## Deployment

- **GitHub Pages** — CI publishes the build on every push to `main` (see `.github/workflows/ci.yml`). The workflow installs dependencies, runs tests, builds, and deploys `build/` to GitHub Pages. You can also deploy locally with `npm run deploy`.
- **Netlify-style SPA hosts** — `public/_redirects` (`/* /index.html 200`) rewrites all routes to `index.html` so client-side routing works.

## Environment Variables

Create React App only exposes variables prefixed with `REACT_APP_`. Copy `.env.example` to `.env` and set:

| Variable | Description |
| --- | --- |
| `REACT_APP_API_URL` | Base URL of the blog REST API (e.g. `http://localhost:8000/` for json-server). |
| `REACT_APP_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name used for unsigned image uploads. |
| `REACT_APP_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset. |
| `REACT_APP_ANTHROPIC_API_KEY` | Optional. Enables the AI "Cook From Your Pantry" recipe generator. Leave unset to disable AI (the pantry matcher still works). |
| `REACT_APP_ANTHROPIC_MODEL` | Optional. Model id for AI generation (defaults to `claude-opus-4-8`). |

Image uploads go directly from the browser to Cloudinary using the cloud name and unsigned upload preset above; the returned image URL is stored on the article.

### AI "Cook From Your Pantry" (`/cook`)

Enter the ingredients you have and the app ranks existing recipes by how many you already have (works with no API key, using the structured ingredient data). If `REACT_APP_ANTHROPIC_API_KEY` is set, you can also generate a brand-new recipe with Claude.

> **Security note:** the AI feature calls the Anthropic API directly from the browser, which exposes the API key in the client bundle. This is fine for a local/demo build only — a production deployment should proxy these calls through a backend so the key is never shipped to the browser.

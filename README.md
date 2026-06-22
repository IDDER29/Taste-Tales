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

Image uploads go directly from the browser to Cloudinary using the cloud name and unsigned upload preset above; the returned image URL is stored on the article.

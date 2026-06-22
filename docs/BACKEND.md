# Backend (Prisma + Auth.js) — setup & status

This documents the Phase 1 backend scaffolding: a Postgres data layer (Prisma),
email/password auth (Auth.js / NextAuth v5), and REST API route handlers under
`app/api/`. It is **ready to wire up in an environment that has Postgres** — this
sandbox has none, so the code is verified by `tsc` + `next build` (the handlers
compile) but has not been run against a live database.

## What exists

| Area | Files |
|---|---|
| Data model | `prisma/schema.prisma` — `User`, `Recipe`, `Review`, `SavedRecipe`, `VerificationToken` (+ `Role`, `RecipeStatus` enums) |
| Prisma client | `lib/prisma.ts` (singleton) |
| Auth | `auth.ts` (Credentials + JWT sessions), `types/next-auth.d.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/api/auth/register/route.ts` |
| Passwords | `lib/password.ts` (bcryptjs, cost 12) |
| Validation | `lib/validation.ts` (Zod schemas for register/login/recipe/review) |
| API | `app/api/recipes` (GET list+paginate, POST create), `app/api/recipes/[id]` (GET/PUT/DELETE with **ownership checks**), `app/api/recipes/[id]/reviews` (GET, POST upsert — one per user) |
| Seed | `prisma/seed.ts` (imports the old `data/db.json` recipes) |

Server-side **sanitization** of recipe `content` happens in the create/update
handlers (`sanitizeHtml`), in addition to the existing client-side sanitization.

## One-time setup

1. **Provision Postgres** (e.g. a free [Neon](https://neon.tech) project).
2. **Configure env** — copy `.env.example` to `.env.local` and set both connection
   strings plus the auth secret:
   ```
   # POOLED (PgBouncer) — used by the app at runtime. On Neon: the "-pooler" host.
   DATABASE_URL=postgresql://…-pooler.…/db?sslmode=require&pgbouncer=true&connection_limit=1
   # DIRECT (non-pooled) — used by prisma migrate/generate. On Neon: same host WITHOUT "-pooler".
   DIRECT_URL=postgresql://….neon.tech/db?sslmode=require
   AUTH_SECRET=…                    # openssl rand -base64 32
   ```
   > Why two URLs: serverless functions open many short-lived connections and will
   > exhaust Postgres on the direct endpoint under load. The app uses the pooled URL;
   > Prisma migrations need the direct one (configured via `directUrl` in `schema.prisma`).
3. **Create the schema & client:**
   ```bash
   npm run prisma:migrate     # prisma migrate dev — creates tables
   npm run prisma:generate    # regenerate the typed client (also runs in migrate)
   ```
4. **Seed data (optional):**
   ```bash
   npm run db:seed            # imports data/db.json; creates demo@taste-tales.test / password123
   ```
5. **Run the app:** `npm run dev` (the API routes live at `/api/*`).
6. **Optional features (set keys to enable — no code change):** see `.env.example` for
   `ANTHROPIC_API_KEY` + `NEXT_PUBLIC_AI_ENABLED` (AI generation), `CLOUDINARY_API_KEY`/
   `CLOUDINARY_API_SECRET` (signed uploads), and `UPSTASH_REDIS_REST_URL`/`_TOKEN` (rate limiting).
   Each degrades gracefully when unset.

## API reference

All responses use the envelope `{ data, meta? }` on success and
`{ error: { code, message, details? } }` on failure. Domain resources are versioned
under `/api/v1`; Auth.js stays at `/api/auth` (framework convention).

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/health` | — | liveness + DB ping (`{ status, db }`) |
| POST | `/api/auth/register` | — | `{ email, password, name? }` → creates a user (rate-limited) |
| `*` | `/api/auth/[...nextauth]` | — | Auth.js sign-in/out/session endpoints |
| GET | `/api/v1/recipes` | — | `?page=&pageSize=&category=&q=&sort=` → `{ data: [...], meta }` |
| POST | `/api/v1/recipes` | required | create (author = current user; rate-limited) |
| GET | `/api/v1/recipes/[id]` | — | single recipe |
| PUT / PATCH | `/api/v1/recipes/[id]` | owner/admin | update |
| DELETE | `/api/v1/recipes/[id]` | owner/admin | delete (reviews & saves cascade) |
| GET | `/api/v1/recipes/[id]/reviews` | — | list reviews |
| POST | `/api/v1/recipes/[id]/reviews` | required | upsert caller's review (1/user, no self-review; updates rating aggregates) |
| GET | `/api/v1/saved` | required | the user's saved recipes |
| POST | `/api/v1/saved` | required | `{ recipeId }` → save (idempotent) |
| DELETE | `/api/v1/saved?recipeId=` | required | unsave (idempotent) |
| POST | `/api/v1/uploads/sign` | required | signed Cloudinary upload payload |
| POST | `/api/v1/ai/recipes/generate` | required | `{ ingredients }` → AI recipe (rate-limited, server key) |

Rate limiting (auth/AI/writes) and Cloudinary signing activate automatically when
their env vars are present; without them the app still runs (limits no-op, uploads
fall back to the unsigned preset).

## Frontend (already wired)

- **Auth UI:** `/login` and `/register` pages (`src/views/Login.tsx`, `src/views/Register.tsx`),
  `SessionProvider` in `app/providers.tsx`, and the NavBar now shows the signed-in
  user + Log out (Auth.js `signIn`/`signOut`/`useSession`).
- **RTK Query data layer:** `src/features/api/apiSlice.ts` — typed `getRecipes`,
  `getRecipe`, `create/update/deleteRecipe`, `getReviews`, `addReview` hooks pointed
  at `/api`, with `transformResponse` mapping the API shape to the app's `Article`/`Review`
  types. Registered in the store (`src/app/store.ts`) with its middleware.

These are built and type-checked but exercise the live backend only once `DATABASE_URL`
+ `AUTH_SECRET` are set and migrations have run.

## Done (backend hardening — ready to flip on with keys)

- **Server-side AI proxy** (`/api/v1/ai/recipes/generate`): the Anthropic key is server-only;
  the client calls our route. UI gated by `NEXT_PUBLIC_AI_ENABLED`.
- **Signed Cloudinary uploads** (`/api/v1/uploads/sign`): secret server-only; client falls back
  to the unsigned preset when signing isn't configured.
- **Rate limiting** (Upstash Redis) on auth/register, AI, recipe writes, reviews — no-op until
  `UPSTASH_REDIS_REST_*` are set.
- **Consistent API**: `/api/v1` versioning, `{ data, meta }` / `{ error }` envelopes, Zod validation,
  central `ApiError` handling, ownership/role checks, self-review block, transactional rating aggregates.
- **Server-synced Recipe Box** endpoints (`/api/v1/saved`) + RTK Query `useGetSaved/useSave/useUnsave`.
- **Health check** (`/api/health`) for uptime monitors.

## Still to do (needs a live DB / browser to verify)

- **Flip the frontend** from json-server thunks (`articleSlice`/`reviewSlice`, `NEXT_PUBLIC_API_URL`)
  to the RTK Query hooks; migrate the Recipe Box from localStorage to `/api/v1/saved` (merge guest saves on login).
- **Route protection** for create/edit pages (Auth.js v5 edge-safe split-config for middleware).
- **Email verification + password reset** (`VerificationToken` + Resend, sent via QStash).
- **Idempotency keys** on create endpoints; **observability** (Sentry + structured logs).

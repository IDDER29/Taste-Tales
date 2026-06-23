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
| POST | `/api/auth/register` | — | `{ email, password, name? }` → creates a user + sends verification email (rate-limited) |
| `*` | `/api/auth/[...nextauth]` | — | Auth.js sign-in/out/session endpoints |
| POST | `/api/auth/forgot-password` | — | `{ email }` → emails a reset link (always 200; rate-limited) |
| POST | `/api/auth/reset-password` | — | `{ token, password }` → sets a new password |
| POST | `/api/auth/verify-email` | — | `{ token }` → marks the email verified |
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
| POST | `/api/v1/recipes/[id]/report` | required | flag a recipe for moderation (rate-limited) |
| POST | `/api/v1/uploads/sign` | required | signed Cloudinary upload payload |
| POST | `/api/v1/ai/recipes/generate` | required | `{ ingredients }` → AI recipe (rate-limited, server key) |
| PATCH | `/api/v1/account` | required | update name/email/password |
| DELETE | `/api/v1/account` | required | delete account (cascades) |
| GET | `/api/v1/account/export` | required | GDPR-style data export |
| GET | `/api/v1/admin/reports` | admin | moderation queue (`?status=`) |
| PATCH | `/api/v1/admin/reports/[id]` | admin | resolve/dismiss (optionally delete recipe) |
| POST | `/api/jobs/send-email` | QStash sig | async email worker (internal) |
| GET | `/api/openapi` | — | OpenAPI 3.1 contract (JSON) |

Rate limiting (auth/AI/writes) and Cloudinary signing activate automatically when
their env vars are present; without them the app still runs (limits no-op, uploads
fall back to the unsigned preset).

## Frontend (wired to the real backend)

The app no longer uses json-server. The Redux thunk/service layer now talks to
`/api/v1`:

- **Data layer:** `src/api/posts.ts` (axios → `/api/v1`, `withCredentials`),
  `src/api/mappers.ts` (API ↔ `Article`/`Review`), `src/services/apiPostes.ts` +
  `apiReviews.ts` (CRUD over `/recipes` and nested reviews). `articleSlice`/`reviewSlice`
  consume these unchanged; all read components/selectors are untouched. (The standalone
  RTK Query `apiSlice` was removed to keep a single source of truth.)
- **Auth UI:** `/login` + `/register`, `SessionProvider`, NavBar session state.
- **Auth-gated writes:** create/edit pages redirect to `/login` when signed out; reviews
  require sign-in; Edit/Delete render only for the owner/admin; delete uses a confirm dialog.
- **Account & moderation UI:** `/account` (profile/password/export/delete), a Report control on
  recipes, and an admin `/admin/reports` moderation queue (NavBar links when signed in / admin).
- **Password recovery UI:** `/forgot-password`, `/reset-password`, `/verify-email`.

Everything is built and type-checked; it exercises the live backend once `DATABASE_URL`
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
- **Server-synced Recipe Box** endpoints (`/api/v1/saved`) — backend ready (client still uses localStorage; see below).
- **Health check** (`/api/health`) for uptime monitors.
- **Frontend cutover:** the app reads/writes through `/api/v1` (json-server retired); writes are auth-gated.
- **Server-synced Recipe Box:** `savedSlice` uses `/api/v1/saved` when signed in (optimistic
  save/unsave), falls back to localStorage for guests, and merges a guest's local saves into
  their account on login. The whole app is now off json-server *and* localStorage for data.
- **Email verification + password reset:** `lib/email.ts` (Resend; logs instead of sending when
  `RESEND_API_KEY` is unset), `lib/tokens.ts` (single-use `VerificationToken`s), endpoints
  (`forgot-password`/`reset-password`/`verify-email`), and UI flows (`/forgot-password`,
  `/reset-password`, `/verify-email`). Registration sends a verification email best-effort.
- **Observability:** structured JSON logging (`lib/logger.ts`) + Sentry (`lib/observability.ts`,
  `sentry.*.config.ts`, `instrumentation.ts`). Disabled (no-op) without a DSN; the build only
  wraps with the Sentry plugin when `NEXT_PUBLIC_SENTRY_DSN`/`SENTRY_AUTH_TOKEN` are set. Unhandled
  API errors are logged + captured with a `requestId` returned to the client.
- **Edge middleware** (`auth.config.ts` split-config + `middleware.ts`): server-side route
  protection for `/articles` (create) and `/edit-article/*`, Prisma-free on the edge.
- **Idempotency** (`lib/idempotency.ts`): `Idempotency-Key` on `POST /api/v1/recipes` replays the
  first result (Upstash); no-op without Redis. Shared client in `lib/redis.ts`.
- **Async jobs** (`lib/queue.ts` + `/api/jobs/send-email`): emails dispatch via QStash when
  configured (signature-verified worker), else inline.
- **Account management:** update profile/password, email change w/ re-verification, data export,
  account deletion — endpoints + `/account` settings page.
- **Moderation:** report a recipe (`/api/v1/recipes/[id]/report`), admin queue
  (`/api/v1/admin/reports`) + `/admin/reports` page; self-review already blocked.
- **OpenAPI** contract served at `/api/openapi`.

## Still to do (ops / scale — needs live infra)

- **Alerting + log drains:** wire Vercel log drains → Axiom/Better Stack; configure Sentry alerts.
- **Block unverified logins** if desired (currently login is allowed pre-verification; product call).
- **CSP + security headers** (via `next.config` headers) — hardening pass.
- **Read replicas / search service** — only when traffic warrants (see `BACKEND_ARCHITECTURE.md`).

The backend is **feature-complete for launch**: every capability above is implemented and builds;
each external dependency (DB, Auth, Anthropic, Cloudinary, Upstash Redis/QStash, Resend, Sentry)
is key-gated and degrades gracefully. Going live = set env keys + `prisma:migrate` + `db:seed`.

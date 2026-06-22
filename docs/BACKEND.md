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

1. **Provision Postgres** (e.g. a free [Neon](https://neon.tech) project) and copy its connection string.
2. **Configure env** — copy `.env.example` to `.env.local` and set:
   ```
   DATABASE_URL=postgresql://...    # from Neon
   AUTH_SECRET=...                  # openssl rand -base64 32
   ```
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

## API reference

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | — | `{ email, password, name? }` → creates a user |
| `*` | `/api/auth/[...nextauth]` | — | Auth.js sign-in/out/session endpoints |
| GET | `/api/recipes` | — | `?page=&pageSize=&category=` → `{ data, total, page, pageSize }` |
| POST | `/api/recipes` | required | create a recipe (author = current user) |
| GET | `/api/recipes/[id]` | — | single recipe |
| PUT | `/api/recipes/[id]` | owner/admin | update |
| DELETE | `/api/recipes/[id]` | owner/admin | delete |
| GET | `/api/recipes/[id]/reviews` | — | list reviews |
| POST | `/api/recipes/[id]/reviews` | required | add/update the caller's review (1 per user) |

## Still to do (next Phase 1 steps)

- **Rewire the frontend** from json-server (`NEXT_PUBLIC_API_URL`) to these `/api`
  routes (adopt RTK Query); move the recipe box & reviews server-side.
- **Login/Register UI** + wire the fake NavBar Login/Logout to Auth.js `signIn`/`signOut`.
- **Email verification + password reset** (the `VerificationToken` model + an email provider like Resend).
- **Route protection** (middleware) for create/edit pages — note Auth.js v5 needs the
  edge-safe split-config pattern since Credentials/Prisma can't run on the edge.
- **Signed Cloudinary uploads** + **proxy the Anthropic AI call** through a server route
  (so neither key ships to the browser).
- **Rate limiting** on auth, write, and AI endpoints.

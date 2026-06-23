# Taste-Tales — Backend Architecture & Engineering Blueprint

Production-oriented backend architecture, grounded in the actual stack
(Next.js App Router route handlers, Prisma + Neon Postgres, Auth.js email/password,
Vercel, Cloudinary, Anthropic). Tags: **(in place)**, **(must-fix)**, **(defer)**.

> Framing: Taste-Tales should be a **modular monolith deployed as serverless functions** —
> NOT microservices / Kubernetes / Kafka. This doc says what to build now, what to defer,
> and the few things that will actually bite (connection pooling, secrets, idempotency).

---

## 1. Backend Vision & System Goals

- **Must achieve:** fast cacheable recipe reads; authenticated writes with correct authz +
  validation; two async-ish workloads (AI generation, email); cheap and operable by a tiny team.
- **Scale (honest):** read-heavy (~95% reads); early **10–50 rps sustained, bursts to a few hundred**,
  single region, thousands of recipes / low-thousands MAU. Design the *path* to 10×, not 1000×.
- **Principles:** managed > self-hosted; stateless compute; validate at the edge (Zod); read from
  cache / write to Postgres; idempotent writes; security + observability are features; one codebase,
  clear module boundaries.
- **Performance:** cached read p95 <100 ms; uncached <300 ms; write <500 ms; AI <8 s (async UX).
- **Reliability:** reads 99.9% (CDN absorbs origin blips), writes 99.5% initially.
- **Security:** OWASP Top 10 covered; secrets server-only; least privilege.
- **DX:** push-to-deploy (Vercel); `prisma migrate`; typed end-to-end (Zod + Prisma + RTK Query).

---

## 2. System Architecture

**Style: modular monolith, serverless deploy.** The backend is Next.js Route Handlers
(`app/api/*`) running as Vercel functions, organized into domain modules.

```
            ┌──────── Vercel Edge / CDN ─────────┐
 Browser ──►│ static assets · cached GET (ISR/SWR)│
 (SPA)      └───────────────┬─────────────────────┘
                            │ miss / mutations
                   ┌────────▼─────────┐  serverless functions (node runtime)
                   │ Route Handlers    │  auth · recipes · reviews · saved
                   │ /api/*            │  uploads(sign) · ai(proxy)
                   └──┬──────┬──────┬──┘
          ┌───────────┘      │      └───────────┐
     ┌────▼────┐      ┌──────▼─────┐      ┌──────▼──────┐
     │ Neon PG │      │ Upstash    │      │ QStash/Cron │
     │ (+pooler)│      │ Redis      │      │ → workers   │
     └─────────┘      │(cache,RL)  │      └──────┬──────┘
                      └────────────┘             │
   3rd-party: Cloudinary · Anthropic · Resend ◄──┘
```

- **Modules (not microservices):** auth, recipes, reviews, saved, uploads (signed Cloudinary),
  ai (server proxy), shared (`lib/prisma|auth|validation|rate-limit|errors`).
- **Communication:** browser↔backend HTTPS/JSON (RTK Query); backend↔Postgres via Prisma.
- **Sync:** all CRUD + initial AI call. **Async (queue):** email, batch/expensive AI.
- **Monolith vs microservices:** monolith — one bounded context; microservices add network
  calls + distributed txns + ops for zero benefit. Revisit only if AI/search must scale independently.

---

## 3. Technology Stack

| Concern | Choice | Why / tradeoffs |
|---|---|---|
| Framework/API | **Next.js Route Handlers** (in place) | One codebase FE+BE, typed, Vercel-native; tradeoff: cold starts, no long processes. |
| Runtime | **Node** for data routes; Edge only for light reads | Prisma/bcrypt need Node, not Edge. |
| DB | **Neon Postgres** (in place) | Serverless PG, branching, autoscale; **pooled** conn for app, **direct** for migrations. |
| ORM | **Prisma** (in place) | Type-safe + migrations; manage serverless connections (pooler/Accelerate). |
| Auth | **Auth.js v5 (Credentials+JWT)** (in place) | Stateless = serverless-friendly; revocation harder (short TTL + rotation). |
| Cache / rate limit | **Upstash Redis** (HTTP) | No pool issues, pay-per-request. |
| Queue / async | **Upstash QStash + Vercel Cron** | Serverless-native; no broker to run. |
| Search | **Postgres FTS** → Typesense/Meilisearch later | Free early; move at 10k+ recipes / heavy search. |
| Realtime | **Defer**; Ably/Pusher if needed | Don't run WebSockets on serverless. |
| File storage | **Cloudinary** (in place) + signed uploads | Transform/CDN; store canonical URLs to limit lock-in. |
| Email | **Resend/Postmark** | Simple API; send async via QStash. |
| Logging | Structured JSON → Axiom/Better Stack | Cheap, queryable; Vercel log drains. |
| Errors | **Sentry** | From MVP; releases + traces. |
| Monitoring | Vercel Analytics + Sentry + Checkly/Better Uptime | Low-effort coverage. |
| AI | **Anthropic** server proxy | Keys server-only; cache + rate limit + async. |
| IaC/DevOps | Vercel + Neon dashboards; Terraform later | Avoid premature IaC. |

---

## 4. Database Architecture

- **Entities (in place):** `User`, `Recipe`, `Review`, `SavedRecipe`, `VerificationToken`,
  enums `Role`/`RecipeStatus`. Add later: `Collection(+CollectionRecipe)`, `Report`,
  `Notification`, `AuditLog`, `AiGeneration`.
- **Relationships:** User 1—N Recipe; Recipe 1—N Review; User N—N Recipe (SavedRecipe / Collection).
  Cascade deletes on children (in place).
- **Schema strategy:** normalized core; **denormalize** `ratingAvg`/`ratingCount` on Recipe
  (transactional update on review write) to avoid read-time aggregation; keep
  `ingredients`/`instructions`/`nutrition` as **JSONB** (read/written as a unit).
- **Multi-tenant:** N/A (consumer app) — do not add tenant scoping.
- **Indexing (in place + add):** `[status, publishedAt]`, `[category]`, `[authorId]`, unique `slug`,
  unique `[recipeId, authorId]`; **add** GIN FTS index, `[userId, createdAt]` on SavedRecipe,
  partial index on `status='PUBLISHED'`, `[status, ratingAvg]` for "top rated".
- **Query optimization:** always paginate; `select` needed columns; avoid N+1 (`include/select`);
  precompute aggregates.
- **Read/write scaling:** CDN + cache first → Neon read replicas later. Writes low-volume → single
  primary for a long time. **Sharding: not needed** (trap at this scale).
- **Connection management (#1 gotcha):** serverless functions exhaust DB connections. **Required:**
  app uses Neon **pooled** URL (`-pooler … ?pgbouncer=true&connection_limit=1`), migrations use a
  **direct** URL via Prisma `directUrl = env("DIRECT_URL")`. Adopt Prisma **Accelerate** at higher concurrency.
- **Backup/recovery:** Neon PITR + branching; periodic `pg_dump` offsite. RPO ≤5 min (PITR), RTO <1h.
- **Migrations:** `prisma migrate dev` → committed files → `migrate deploy` to staging then prod;
  **expand/contract** for zero-downtime breaking changes.
- **Retention:** soft-delete recipes (`deletedAt`, purge 30d); expire+purge tokens via cron;
  audit logs 1y; on account deletion cascade + anonymize reviews.

```prisma
model Recipe {
  // ...existing...
  ratingAvg   Float @default(0)
  ratingCount Int   @default(0)
  deletedAt   DateTime?
  @@index([status, ratingAvg])
}
```

---

## 5. API Design Standards

- **REST (resource-oriented), not GraphQL** — simple cacheable access patterns; RTK Query gets HTTP caching.
- **Versioning:** introduce `/api/v1/*` at the cutover (reserve now to avoid a future migration).
- **Conventions:** plural nouns, nested for ownership; `camelCase` JSON; verbs map to CRUD (`PATCH` partial, `PUT` full).
- **Envelope:**
```json
{ "data": [ ... ], "meta": { "total": 120, "page": 1, "pageSize": 12 } }   // list
{ "data": { ... } }                                                         // single
{ "error": { "code": "VALIDATION_ERROR", "message": "…",
             "details": [ { "path": "email", "message": "…" } ] } }         // error
```
- **Errors:** stable machine `code` + message + optional `details`; correct status (400/401/403/404/409/422/429/500);
  no stack traces; `requestId` in every error + log.
- **Pagination:** offset now (max pageSize 50) → cursor at scale; always return `meta`.
- **Filtering/sort/search:** `?category=&diet=&maxTime=&sort=-publishedAt&q=`; **whitelist** sortable/filterable
  fields server-side; `q` → Postgres FTS.
- **Rate limiting:** per-IP + per-user (Upstash sliding window); strict on auth/AI; `429` + `Retry-After` + `RateLimit-*`.
- **Idempotency:** create mutations accept `Idempotency-Key` (store key→result 24h) for safe retries (flaky
  kitchen networks); reviews naturally idempotent (upsert, one-per-user).
- **Authn/authz:** Auth.js session; every write `auth()`→401, ownership/role→403; published reads public.

```
GET    /api/v1/recipes?page=1&pageSize=12&category=Dessert&sort=-ratingAvg
GET    /api/v1/recipes/{id}
POST   /api/v1/recipes                 (auth)        Idempotency-Key: <uuid>
PATCH  /api/v1/recipes/{id}            (owner/admin)
DELETE /api/v1/recipes/{id}            (owner/admin)
GET    /api/v1/recipes/{id}/reviews
POST   /api/v1/recipes/{id}/reviews    (auth, upsert)
POST   /api/v1/uploads/sign            (auth)        → signed Cloudinary params
POST   /api/v1/ai/recipes:generate     (auth, rate-limited)
```

---

## 6. Authentication & Authorization

- **Flow:** email/password → Auth.js Credentials → bcrypt verify → **JWT session** (stateless).
  Register hashes bcrypt(12) (in place) → optional email verification.
- **Token/session:** short TTL (15–30 min) rolling refresh; **httpOnly, Secure, SameSite=Lax** cookie;
  `userId`+`role` in token (in place) — no per-request DB lookup.
- **Revocation tradeoff:** stateless can't instant-revoke → short TTL + `tokenVersion`/`sessionInvalidatedAt`
  check on sensitive actions, or DB sessions if instant revocation required.
- **OAuth/social, MFA:** deferred (add Auth.js `Account`/`Session` tables / TOTP later, non-breaking).
- **RBAC:** `Role` enum (USER/AUTHOR/ADMIN) (in place); centralize `requireUser()`/`requireOwnerOrAdmin()`;
  authz in handlers + thin policy module; never trust client.
- **API keys / S2S:** none now; later HMAC-signed inbound webhooks + hashed scoped API keys.
- **Risks/hardening:** credential stuffing/brute force → rate limit + backoff; secrets server-only
  (**move `NEXT_PUBLIC_ANTHROPIC_API_KEY` server-side — must-fix**); rotate `AUTH_SECRET` carefully.

---

## 7. Scalability & Performance

- **Horizontal scaling:** automatic (stateless Vercel functions); no LB to manage.
- **Caching is the strategy** (read-heavy): CDN/edge cache GET lists+detail (`s-maxage` + `stale-while-revalidate`,
  tag-based revalidation on write); Upstash Redis for hot aggregates, rate-limit counters, AI response cache
  (same ingredients → cached recipe); indexed queries + precomputed aggregates.
- **Async:** email + expensive/batch AI via QStash; keep request path fast. **CDN** for images + assets.
  **Edge** for cacheable reads; Node region near Neon for mutations/auth.
- **Targets:** 10–50 rps sustained, burst few-hundred (CDN absorbs); cached read p95 <100 ms, uncached <300 ms,
  write <500 ms. Single region until geo-distribution justified.
- **Bottlenecks to avoid:** (1) DB connection exhaustion (use pooler); (2) uncached reads hitting PG;
  (3) Prisma N+1; (4) read-time rating aggregation; (5) synchronous uncapped AI; (6) large image payloads.

---

## 8. Background Jobs & Async

Serverless has **no long-running workers** → HTTP-triggered functions + managed queue/cron.

- **Queue:** Upstash **QStash** → worker routes (`/api/jobs/*`) with retries/backoff + **DLQ**.
  Uses: email (verify/reset/review-notify), AI batch/expensive, image post-processing, search-index sync.
- **Scheduled (Vercel Cron):** purge expired tokens, recompute trending, nightly `pg_dump`, cleanup
  soft-deleted, digest emails.
- **Event-driven (light):** on write, enqueue side-effects (publish → index + notify). Simple "emit job",
  not Kafka/event-sourcing.
- **Webhooks (inbound):** verify HMAC; respond 2xx fast; process async.
- **Idempotent jobs:** keyed (e.g. `email:verify:{userId}:{tokenId}`); check "done" before acting; safe replay.
- **Failure recovery:** retries → DLQ → Sentry alert → replay (safe, idempotent).
- **Monitoring:** job success/failure metrics + DLQ-depth alarm.
- **AI pipeline:** MVP synchronous proxy (cache + rate limit); scale → enqueue → worker → store
  `AiGeneration` → notify (poll/realtime). Always label, cap per-user cost, cache by ingredient set.

---

## 9. Security Architecture

- **Standards:** OWASP Top 10 checklist; defense in depth; least privilege; validate (Zod) + sanitize
  rich text (sanitize-html server+client — in place).
- **Injection:** Prisma parameterizes; whitelist filter/sort fields.
- **XSS:** server `sanitize-html` (in place) + React escaping + **CSP** (allowlist Cloudinary/Anthropic).
- **CSRF:** Auth.js SameSite cookies + CSRF tokens; check `Origin`/`Sec-Fetch-Site` on mutations.
- **AuthZ:** ownership/role on every write (in place); add report/moderation guards; **block self-review**.
- **Encryption:** TLS everywhere; bcrypt(12); secrets at rest (Vercel/Neon); PII minimization (email + name).
- **Secrets:** Vercel env, server-only; **AI key server-side + signed Cloudinary uploads (must-fix)**;
  careful `AUTH_SECRET` rotation.
- **Audit logs:** `AuditLog` (who/what/when/ip) for admin/auth-sensitive actions.
- **Abuse:** rate limits (auth/AI/writes), moderation/report, optional CAPTCHA on register, AI cost caps.
- **DDoS:** Vercel edge/WAF; rate-limit expensive endpoints hardest.
- **Privacy/compliance:** GDPR export + delete; cookie/consent if analytics added; DPAs with
  Cloudinary/Anthropic/Resend.
- **Critical attack surfaces:** auth/register, AI proxy (cost-abuse), image upload (signing + size/type),
  rich text (XSS), reviews (manipulation/spam). **Top hardening now:** server-side AI key, signed uploads,
  rate limiting, CSP, self-review block.

---

## 10. Realtime & Event Systems

**Not in MVP.** Cooking doesn't need realtime; don't run WebSockets on serverless. If later needed
(live review feeds, AI progress, collaborative collections): use a **managed** provider (Ably/Pusher/
Supabase Realtime); publish events after writes; clients subscribe; **fallback to polling** (RTK Query).
**Event sourcing: not recommended** — a simple post-commit outbox/"emit job" suffices for reliable side-effects.

---

## 11. Observability & Monitoring

- **Logging:** structured JSON (level, requestId, userId, route, latency); no secrets/PII; ship via Vercel
  log drains to Axiom/Better Stack. Add `lib/logger` + per-request `requestId` (returned in error envelope).
- **Errors:** **Sentry** (server+client) from day one; releases + source maps.
- **Tracing:** Sentry Performance / OTel on DB/AI/external spans when debugging latency.
- **Metrics:** rate/latency/error-rate (Vercel + Sentry) + business events (view/save/generate/publish/review).
- **Health:** `/api/health` (DB ping + deps) for uptime monitors; synthetics on critical flows.
- **Alerting:** error spike, p95 latency, DLQ depth, AI spend, DB connection saturation, uptime → Slack/email.
- **Audit/incident:** AuditLog + Sentry issues + runbook.

---

## 12. Infrastructure & DevOps

- **Deployment:** Vercel via GitHub — branch → preview deploy; `main` → prod (in place; CI is the gate).
- **CI/CD:** GH Actions gate (install → typecheck → test → build — in place); add `prisma migrate deploy`
  to staging then prod (manual approval for prod migrations) + Sentry release + post-deploy smoke test.
- **Environments:** local (Neon branch / local PG), preview (per-PR Neon branch), staging (prod-like seeded),
  production. Use **Neon branching** for isolated per-PR DBs.
- **Containers/K8s:** **No** — serverless removes the need; K8s is pure cost/complexity here.
- **IaC:** dashboard config + committed `vercel.json`/env docs now; **Terraform** only when infra grows.
- **Rollback:** Vercel instant rollback; DB via expand/contract + Neon PITR/branch (never destructive in one step).
- **Autoscaling:** automatic. **HA:** Vercel multi-AZ edge + Neon HA; single region early. **DR:** PITR +
  offsite dump; documented RTO/RPO; restore drills.
- **Local dev:** `.env.local` (pooled DATABASE_URL + DIRECT_URL + AUTH_SECRET) → `prisma migrate dev` →
  `db:seed` → `next dev`. json-server kept only as offline fallback.

---

## 13. Engineering Standards

```
app/api/v1/<domain>/route.ts   # thin: parse → authz → service → respond
lib/
  prisma.ts auth.ts errors.ts logger.ts rate-limit.ts
  validation/   # zod per domain
  services/     # domain logic (pure, unit-testable)
  policies/     # authorization checks
prisma/         # schema, migrations, seed
```
- Handlers thin; logic in `lib/services` (testable without HTTP) — the key boundary that keeps a monolith maintainable.
- **Naming:** domain-driven; `camelCase` TS, `PascalCase` types/models, `kebab` routes.
- **Testing:** unit (services/validation/mappers — Jest, in place) + integration (handlers vs test Neon branch)
  + few E2E (Playwright) on critical flows. Coverage on services/authz, not vanity %.
- **Docs:** OpenAPI for `/api/v1` (derive from Zod via `zod-to-openapi` so it never drifts); ADRs in `docs/`;
  `BACKEND.md` runbook (in place).
- **Review/Git:** required PR review + green CI + no secrets + reviewed migrations; trunk-based, short-lived
  branches → squash merge to protected `main`; conventional commits.

---

## 14. Reliability & Failure Handling

- **Retries:** client retries idempotent GETs; mutations only with `Idempotency-Key`; server→external
  exponential backoff + jitter, capped.
- **Timeouts/circuit:** hard timeouts on external calls (AI 10s, Cloudinary 5s); fail fast with friendly message.
- **Graceful degradation:** AI down → pantry matcher works (designed); search down → Postgres FTS; Redis down →
  fail-open cache (read DB), conservative on AI cost rate-limit.
- **Partial failure:** write DB first, then enqueue side-effects; reconciliation cron catches missed jobs (outbox-lite).
- **Consistency:** single Postgres = strong consistency; transactions for multi-row invariants (review + rating);
  cache eventually consistent (bounded by SWR + tag invalidation).
- **During outages:** DB down → reads stale from CDN/cache, writes 503 + retry guidance; region issue → edge serves
  cached. Users see cached recipes + clear non-destructive errors; never data loss / silent failure.

---

## 15. Cost Optimization

- **Now:** Vercel + Neon + Upstash/QStash + Cloudinary + Resend + Sentry — realistically **low tens of $/month**.
- **Biggest risks:** (1) **AI inference** — cap per-user/day, cache by ingredient set, cheaper model (Haiku),
  async batching; (2) **Cloudinary** transforms/bandwidth — fixed presets, lazy-load, cache; (3) DB compute/egress
  — caching + Neon autosuspend; (4) function invocations — CDN-cache reads.
- **Optimize early:** read caching (kills dominant cost), AI caps, image discipline. **Later:** read replicas,
  search service, multi-region.
- **Lock-in:** Postgres/Prisma/Auth.js portable; Cloudinary stickiest (store canonical URLs, keep originals);
  Vercel-specific bits small/replaceable.

---

## 16. MVP vs Enterprise

- **MVP (now):** Neon + Prisma **pooled connections**; Auth.js email/password + reset; recipe/review/saved CRUD
  on `/api` (Zod + authz + sanitization); **server-side AI proxy + signed Cloudinary + rate limiting**; Sentry +
  structured logs + `/api/health`; CI migrate-deploy; Postgres FTS; QStash/Cron for email + token cleanup.
- **Production-ready (next):** idempotency keys; rating aggregates + tag cache; audit logs; account deletion/export;
  moderation/report; OpenAPI docs; synthetic monitoring + alerting; DR drills; expand/contract discipline.
- **Enterprise (later):** read replicas; search service; managed realtime; multi-region; Prisma Accelerate;
  advanced RBAC/orgs; SSO/SAML; data warehouse; SOC2 controls.
- **Do NOT build now:** microservices, K8s, Kafka/event-sourcing, self-hosted WebSockets, sharding,
  multi-tenancy, GraphQL, service mesh, custom IaC platform.

---

## 17. Final Recommendations

**Critical priorities (in order):**
1. **Connection pooling** (Neon pooled URL + `DIRECT_URL` for migrations) — without it, serverless + Prisma
   exhausts connections under load.
2. **Secrets server-side** — AI proxy + signed Cloudinary (current `NEXT_PUBLIC_ANTHROPIC_API_KEY` is a live exposure).
3. **Rate limiting** (Upstash) on auth + AI + writes before launch.
4. **API cutover** to `/api/v1` (consistent envelope, Zod, authz, errors) + lock contract (OpenAPI).
5. **Caching** (CDN + tag invalidation) — the scaling lever.
6. **Observability** (Sentry + structured logs + health) from day one.

**Major risks / weaknesses:** serverless connection exhaustion (#1); synchronous uncapped AI (cost+latency);
uncached reads (DB load); JWT revocation gap (short TTL); migration foot-guns (expand/contract + Neon branches);
over-engineering (every deferred item).

**Implementation order:** pooling → secrets/AI proxy/signed uploads → rate limiting → API cutover
(reads → writes) → caching → observability → async (email/cron) → search → account/moderation → hardening.

**Tech-debt / scaling risks:** dual data sources during json-server→`/api` transition (retire thunks promptly);
JSONB recipe fields aren't relationally queryable (plan FTS); rating aggregates must be transactional;
cache invalidation correctness; AI cost growth.

**Decide before coding:** `DIRECT_URL` + pooling; idempotency-key policy; cache TTL/invalidation tags per resource;
rate-limit tiers + AI cost caps; email provider + verification UX; analytics/event taxonomy; data-retention/deletion;
OpenAPI as contract source.

---

*Right-sized for Taste-Tales: a modular monolith on serverless, cheap and operable now, with low-regret upgrade
paths. The single most important near-term action is #1 (connection pooling) — a ~15-minute config + schema change
that prevents the one failure that will otherwise appear under load.*

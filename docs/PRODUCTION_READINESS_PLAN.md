# Taste-Tales — Production Readiness Plan

**Goal:** take Taste-Tales from a strong portfolio app to a real product that hundreds of people can use reliably and safely.
**Date:** 2026-06-21
**Scale target:** ~hundreds of active users (low-thousands of recipes). This plan optimizes for **reliability, security, and SEO**, not hyperscale — we deliberately avoid over-engineering for millions.

---

## 1. Executive summary

Taste-Tales is currently an excellent **front-end** app — TypeScript (strict), Redux Toolkit, structured recipes, schema.org rich results, ratings/reviews, recipe box, an AI feature, tests, and CI. But it is **not yet a product**: there is no real backend, no authentication, secrets are exposed in the browser, user HTML is rendered without sanitization, and the build toolchain carries 100+ known vulnerabilities.

Reaching production is mostly a **backend, security, and operations** effort. The realistic path is **3 phases over ~6–10 focused weeks** (one developer), or faster with help:

- **Phase 1 — Launch blockers (must-have):** real backend + database, authentication & ownership, move secrets server-side, fix the XSS hole, modernize the build, hosting + CI/CD to a real host.
- **Phase 2 — Production hardening:** observability, rate limiting, content moderation, SEO/SSR, performance, accessibility, legal pages.
- **Phase 3 — Scale & polish:** caching/CDN tuning, search at scale, email, PWA, analytics, richer profiles.

---

## 2. Current state snapshot

### Strengths (keep)
- React 18 + **TypeScript strict**, Redux Toolkit, typed hooks, clean feature-sliced structure.
- **Structured recipe model** + schema.org/Recipe JSON-LD (great SEO foundation).
- Real features: search/filter, ratings & reviews, serving scaler, cook mode, recipe box, AI pantry.
- **28 unit tests**, CI runs typecheck + tests + build.

### Critical gaps (block production)
| Area | Current state | Risk |
|---|---|---|
| Backend | **json-server** mock; no real persistence | Data loss, no integrity, can't scale |
| Auth | None (Login/Logout are fake) | Anyone can create/edit/delete anything |
| Secrets | Cloudinary **unsigned** preset + **Anthropic API key** shipped in the browser | Key theft, quota abuse, financial loss |
| XSS | Article `content` rendered via `dangerouslySetInnerHTML` **without sanitization** | Stored XSS — a malicious recipe can run JS in every visitor's browser |
| Dependencies | 113 vulns (3 critical) via `react-scripts`/webpack | Supply-chain & build risk |
| Hosting | GitHub Pages (static only) | Can't host a backend or secrets |
| Ops | No error tracking, logging, monitoring, backups | Blind to outages and data loss |

---

## 3. Top launch-blocking risks (fix first)

1. **Stored XSS** via unsanitized rich-text `content` (and AI output). → Sanitize on render (DOMPurify) **and** on write (server-side).
2. **Exposed API keys** (Anthropic, Cloudinary). → Proxy all third-party calls through the backend; use signed Cloudinary uploads; never ship secrets to the browser.
3. **No authentication / authorization.** → Real accounts + ownership checks before any write reaches production.
4. **No real database.** → A managed Postgres with migrations and backups.
5. **Vulnerable, unmaintained build tool.** → Migrate off `react-scripts`.

---

## 4. Recommended target architecture

> **DECISION (locked):** Next.js (App Router) + Postgres (Prisma) + Auth.js. Hosting, auth providers, budget, and timeline are still open — see §8.

For a content-driven recipe site, **SEO and a real API are the two biggest levers.** The chosen stack consolidates both:

```
                      ┌─────────────────────────────────────────┐
   Browser  ◀────────▶│  Next.js (App Router) on Vercel          │
   (React UI)         │   • SSR/ISR pages (SEO, fast first load) │
                      │   • Route Handlers = the API layer       │
                      │   • Auth.js (NextAuth) sessions          │
                      └───────────────┬──────────────────────────┘
                                      │ Prisma
                        ┌─────────────▼─────────────┐
                        │  Managed Postgres (Neon)   │  ◀── backups, migrations
                        └─────────────┬─────────────┘
              server-side proxies ────┼───────────────┐
                          ▼           ▼               ▼
                    Cloudinary   Anthropic API    Email (Resend)
                  (signed upload) (key server-side) (verify/reset)
```

**Why Next.js:** server-side rendering / incremental static regeneration makes recipe pages crawlable and fast (critical for organic discovery — the gap analysis flagged SEO as table-stakes), and its Route Handlers give us an API + a safe place for secrets in **one deployable**. Reuses the existing React/TS components and the schema.org JSON-LD we already build.

**Faster alternative (if SEO is deprioritized or you want minimal backend code):**
- **Vite SPA** (migrate CRA → Vite to kill the vulns) **+ Supabase** (Postgres + Auth + Storage + Row-Level Security) as an all-in-one backend. Less custom code; SEO needs a prerender step (e.g. `prerender.io`) since it stays client-rendered.

**Decision needed:** Next.js (recommended, best SEO/control) vs Vite + Supabase (fastest to a backend). The phases below are written to apply to either; differences are noted inline.

---

## 5. Data model (first cut)

```
User        id, email(unique), passwordHash, name, role(USER|AUTHOR|ADMIN),
            emailVerifiedAt, avatarUrl, createdAt
Recipe      id, authorId→User, title, subtitle, slug(unique), category,
            cuisine, diet[], tags[], imageUrl, prepTime, cookTime, servings,
            nutrition(json), ingredients(json|table), instructions(json|table),
            content(sanitized html), status(DRAFT|PUBLISHED), views, likes,
            publishedAt, createdAt, updatedAt
Review      id, recipeId→Recipe, authorId→User, rating(1-5), comment,
            createdAt   (unique[recipeId, authorId])
SavedRecipe id, userId→User, recipeId→Recipe, createdAt  (server-side recipe box)
```
- Indexes on `Recipe.slug`, `Recipe.status+publishedAt`, `Recipe.category`, `Review.recipeId`, full-text index on title/ingredients.
- Ownership rule: only `authorId` (or ADMIN) may edit/delete a recipe; one review per user per recipe.

---

## 6. Phased roadmap

Effort: **S** ≈ ≤1 day, **M** ≈ 2–4 days, **L** ≈ 1–2 weeks. Priority: **P0** launch blocker, **P1** needed soon after, **P2** later.

### Phase 1 — Launch blockers (~3–5 weeks)

| # | Workstream | Tasks | Pri | Effort |
|---|---|---|---|---|
| 1.1 | **Build modernization** | Migrate CRA→Vite (or adopt Next.js); remove `react-scripts`; re-wire env vars, Jest→Vitest, Tailwind/PostCSS; verify `npm audit` is near-clean | P0 | M–L |
| 1.2 | **Backend + DB** | Stand up Postgres (Neon/Supabase); Prisma schema + migrations; CRUD API for recipes/reviews/saved with server-side validation (Zod); seed from `data/db.json`; pagination on list endpoints | P0 | L |
| 1.3 | **Auth & authorization** | Email/password (Argon2/bcrypt) + at least one OAuth (Google); sessions or JWT; email verification + password reset; protected routes; **ownership checks** on every write; replace fake Login/Logout UI | P0 | L |
| 1.4 | **Secrets server-side** | Move Anthropic call to a backend endpoint (rate-limited, auth-gated); switch Cloudinary to **signed** uploads via a server signature endpoint; remove all `REACT_APP_*` secrets | P0 | M |
| 1.5 | **Fix XSS** | Sanitize recipe `content` on write (server) and on render (DOMPurify); constrain the rich-text editor’s allowed tags; sanitize/escape review text | P0 | S–M |
| 1.6 | **Wire frontend to real API** | Replace the axios/json-server calls with the new API; adopt **RTK Query** (or React Query) for fetching/caching/loading/error; server-backed recipe box & reviews | P0 | M |
| 1.7 | **Hosting + CI/CD** | Deploy to a real host (Vercel/Netlify + managed DB, or Supabase); staging + production envs; CI: lint→typecheck→test→build→`npm audit`→deploy; secrets in the platform’s secret store; custom domain + TLS | P0 | M |

**Phase 1 done = a logged-in user can safely create/edit/delete only their own recipes, data persists in Postgres, no secrets in the browser, no XSS, deployed on a real host.**

### Phase 2 — Production hardening (~2–3 weeks)

| # | Workstream | Tasks | Pri | Effort |
|---|---|---|---|---|
| 2.1 | **Security hardening** | Security headers (CSP, HSTS, X-Frame-Options) via `helmet`/host config; CORS allowlist; rate limiting (auth, AI, write endpoints); CSRF protection if cookie sessions; brute-force/lockout; secrets rotation | P1 | M |
| 2.2 | **Observability** | Error tracking (Sentry, FE+BE); structured logging; uptime + health checks; Web Vitals (RUM); alerting on error spikes/downtime | P1 | M |
| 2.3 | **Reliability** | Automated DB backups + tested restore; migration strategy; graceful error boundaries; ret/idempotent writes; 4xx/5xx handling and friendly error pages | P1 | M |
| 2.4 | **Content moderation** | Spam/abuse controls on recipes & reviews (rate limits, profanity/spam filter, report button, admin review queue, soft-delete); image content checks | P1 | M |
| 2.5 | **SEO** | SSR/ISR for recipe pages (Next.js) or prerender (SPA); sitemap.xml + robots.txt; canonical URLs; per-page meta + Open Graph; keep/verify schema.org Recipe + aggregateRating; slugs | P1 | M |
| 2.6 | **Performance** | Route-level code splitting/lazy; Cloudinary responsive transforms (`srcset`, WebP/AVIF, lazy below-the-fold, eager LCP); HTTP caching/CDN; DB indexes; target CWV (LCP≤2.5s, INP≤200ms, CLS≤0.1) | P1 | M |
| 2.7 | **Accessibility** | WCAG 2.1 AA pass: keyboard nav, focus management, alt text, color contrast, form labels; automated `axe` checks in CI; fix the known `jsx-a11y` warnings (anchor-is-valid, redundant alt) | P1 | M |
| 2.8 | **Testing depth** | Backend/API tests; component tests; **E2E (Playwright)** for signup→create→review→save; coverage threshold in CI; a11y tests | P1 | M |
| 2.9 | **Legal/compliance** | Privacy Policy + Terms; cookie consent (if needed); GDPR/CCPA data export & delete-account; DMCA/contact; license/attribution for images | P1 | S–M |

### Phase 3 — Scale & polish (ongoing)

| # | Workstream | Tasks | Pri | Effort |
|---|---|---|---|---|
| 3.1 | **Search at scale** | Postgres full-text or Alglia/Meilisearch; faceted server-side search; typo tolerance | P2 | M |
| 3.2 | **Email & notifications** | Transactional email (Resend/Postmark): verification, reset, "new review on your recipe"; newsletter (real provider) | P2 | M |
| 3.3 | **User profiles** | Public author profiles, avatars, their recipes; follow/notifications (optional) | P2 | M |
| 3.4 | **PWA / offline** | Installable, offline recipe box, caching strategy | P2 | M |
| 3.5 | **Analytics** | Privacy-friendly product analytics (Plausible/PostHog); conversion funnels | P2 | S |
| 3.6 | **UX polish** | Loading skeletons, optimistic updates, infinite scroll/pagination UI, image cropping on upload, increment views safely | P2 | M |
| 3.7 | **Pipeline maturity** | Dependabot/Renovate, preview deploys per PR, automated rollback, load test for expected traffic | P2 | M |

---

## 7. Cross-cutting "definition of production-ready" checklist

- [ ] Real database with migrations + automated, tested backups
- [ ] Authentication, email verification, password reset, RBAC, ownership enforced server-side
- [ ] No secrets in the client bundle; signed uploads; AI proxied + rate-limited
- [ ] All user content sanitized (no XSS); security headers + CORS + rate limiting
- [ ] `npm audit` clean (or documented, accepted exceptions)
- [ ] Error tracking + logging + uptime monitoring + alerting live
- [ ] SSR/prerender + sitemap + meta/OG + schema.org validated in Google Rich Results test
- [ ] Core Web Vitals in the "good" range on mobile
- [ ] WCAG 2.1 AA (documented audit, 0 critical axe violations)
- [ ] E2E happy paths green in CI; coverage threshold enforced
- [ ] Staging + production environments; secrets in a secret manager; custom domain + TLS
- [ ] Privacy Policy, Terms, account deletion/data export; content moderation + report flow
- [ ] Runbook + architecture docs + OpenAPI/API docs

---

## 8. Decisions needed from you

1. ~~**Framework/SEO**~~ — ✅ **DECIDED: Next.js (App Router).**
2. ~~**Backend approach**~~ — ✅ **DECIDED: custom API via Next.js Route Handlers + Prisma + Postgres (Auth.js for auth).**
3. **Hosting & budget:** Vercel + Neon (recommended for this stack), or a cloud (AWS/Render/Fly)? Expected monthly budget?
4. **Auth providers:** email/password only, or also Google/GitHub OAuth?
5. **Timeline & people:** target launch date and how many developers?
6. **Scope at launch:** is AI generation a launch feature (needs cost controls) or post-launch?

---

## 9. Suggested sequencing (single developer, ~6–10 weeks)

1. **Week 1:** Build migration (1.1) + DB/Prisma schema & seed (1.2 start).
2. **Weeks 2–3:** Backend CRUD + validation (1.2), Auth + ownership (1.3).
3. **Week 4:** Secrets server-side + signed uploads + AI proxy (1.4), XSS fix (1.5).
4. **Week 5:** Wire FE to API with RTK Query (1.6), hosting + CI/CD + staging (1.7) → **soft launch**.
5. **Weeks 6–7:** Observability, security hardening, reliability/backups, moderation (2.1–2.4).
6. **Weeks 8–9:** SEO/SSR, performance, a11y, E2E tests, legal (2.5–2.9) → **public launch**.
7. **Ongoing:** Phase 3.

> Recommended first concrete step regardless of decisions: **migrate the build off `react-scripts`** (clears the vulnerability cliff and unblocks using the official Anthropic SDK), then stand up the database. I can start on either as soon as you pick the framework/backend direction in §8.

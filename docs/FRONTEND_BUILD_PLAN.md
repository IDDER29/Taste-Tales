# Taste-Tales — Frontend Build Plan (MVP)

Turns the MVP scope from `PRODUCT_EXPERIENCE_BLUEPRINT.md` §11 into a sequenced,
ticketed plan. Ordered so each phase unblocks the next and the app stays shippable
(green `tsc` + `next build` + tests) after every phase.

**Legend** — Size: S (≤0.5d), M (~1–2d), L (~3–5d). Status reflects current repo.
**Hard dependency:** most data work needs a live Postgres (Neon) + `DATABASE_URL`/`AUTH_SECRET`
(see `docs/BACKEND.md`). Phases that need it are marked **[needs DB]**.

---

## Phase 0 — Foundations (no DB required)  — ✅ DONE (F0.1–F0.4), 🟡 PARTIAL (F0.5)

Build the primitives everything else inherits. Do this first to prevent UI divergence.
Implemented in `src/components/ui/` (barrel `index.ts`); see `docs/UI_PRIMITIVES.md`.

- **F0.1 — Design tokens & Tailwind theme.** `M` — ✅ **done**
  `brand` accent scale + animations in `tailwind.config.js`; `cn()` helper (`src/utils/cn.ts`);
  app glob added to Tailwind content. *(Red-on-white contrast still to audit per-component in F8.1.)*
- **F0.2 — Core UI primitives.** `L` — ✅ **done**
  `Button, Badge, Card/CardBody, Input, Textarea, Select, Field, Avatar, Spinner, Skeleton,
  Rating, Tabs, Modal, AppImage` (cva variants, forwardRef, focus/a11y states).
- **F0.3 — Standard state-set components.** `M` — ✅ **done**
  `LoadingState`, `EmptyState`, `ErrorState` (retry), `AsyncBoundary`.
- **F0.4 — Toast + confirm-dialog system.** `S` — ✅ **done**
  `useToast()` + `useConfirm()` via `UIProvider` (mounted in `app/providers.tsx`).
- **F0.5 — `next/image` migration + image aspect ratios.** `M` — 🟡 **partial**
  `AppImage` (aspect-ratio box, no CLS) built; `next/image` enabled (`images.unoptimized: true`
  so any host works). **Deferred:** mass-migrating existing `<img>` usages (needs visual QA) and
  re-enabling optimization (`remotePatterns`) once images normalize to Cloudinary.

---

## Phase 1 — Auth-gated interaction pattern  [needs DB to verify end-to-end]

Auth UI is scaffolded (`/login`, `/register`, NavBar session). This phase makes it *usable*.

- **F1.1 — "Preserve intent" auth pattern.** `M`
  Reusable `requireAuth(action)` / `<SignInPrompt>` modal: when a guest triggers save/create/review,
  prompt to sign in, then complete the original action. Use `callbackUrl`. *AC:* guest save → sign in
  → the intended recipe is saved without re-navigation.
- **F1.2 — Password reset flow.** `M` *(uses `VerificationToken` model)*
  `/forgot-password` + `/reset-password` pages, `POST /api/auth/forgot` & `/reset` route handlers,
  token issue/verify. Email send stubbed behind a provider interface (Resend later). *AC:* request →
  token persisted → reset sets new hash → can log in.
- **F1.3 — Auth error & session-expiry UX.** `S`
  Friendly invalid-credential errors; gentle re-sign-in on expiry preserving location. *AC:* no dead ends.
- **F1.4 — Route protection for create/edit.** `M`
  Client guard now; document the Auth.js v5 edge-safe split-config for middleware later. *AC:* unauthenticated
  visit to `/articles` (create) or `/edit-article/[id]` redirects to login with callback.

---

## Phase 2 — Cut over to the real API  [needs DB]

Retire json-server; make `/api` the source of truth. Highest-risk phase (data-shape cutover).

- **F2.1 — Stand up DB + migrate + seed.** `S` *(ops)*
  Neon project, env vars, `prisma migrate dev`, `db:seed`. *AC:* `/api/recipes` returns seeded data.
- **F2.2 — Adopt RTK Query in read paths.** `L`
  Switch Home, Browse, Recipe detail, Recipe Box reads to `useGetRecipes/useGetRecipe/useGetReviews`.
  Verify the `Article`/`Review` mappers against live data (`publishedDate`↔`publishedAt`, author→publisher).
  *AC:* pages render from `/api`; loading/empty/error states wired.
- **F2.3 — Adopt RTK Query in write paths.** `M`
  Create/Edit/Delete + AddReview via mutations with optimistic updates + tag invalidation. *AC:* create →
  redirect to new recipe; edit/delete enforce ownership (server already checks); duplicate-submit guard.
- **F2.4 — Retire thunk slices & json-server.** `M`
  Remove `articleSlice`/`reviewSlice` server-fetch thunks (keep UI-only state); drop `NEXT_PUBLIC_API_URL`
  usage; remove `npm run server` from the core loop (keep for offline dev if desired). *AC:* no dual sources
  of truth; build/tests green.

---

## Phase 3 — Account-synced Recipe Box  [needs DB]

- **F3.1 — Server-backed saves.** `M`
  `GET/POST/DELETE /api/saved` using the `SavedRecipe` model; RTK Query `useGetSaved/useToggleSave`.
  *AC:* saves persist server-side for logged-in users; reflected across devices.
- **F3.2 — Guest fallback + merge on login.** `M`
  Keep localStorage for guests; on first login, merge local saves into the account, then clear local.
  *AC:* a guest's saves survive signup; no duplicates.
- **F3.3 — Optimistic save UX.** `S`
  Bookmark fills instantly, rolls back on failure; toast. *AC:* feels instant; consistent across card + detail.

---

## Phase 4 — Recipe detail & cooking experience (no DB required for most)

The screen where cooking happens — make it best-in-class.

- **F4.1 — "Jump to recipe" + sticky in-page nav.** `S` *AC:* one tap from top to method.
- **F4.2 — Serving scaler.** `M`
  Scale ingredient quantities from structured data; remember last value. *AC:* doubling servings doubles quantities;
  handles null quantities gracefully.
- **F4.3 — Metric/imperial toggle.** `M` *AC:* converts common units; persists preference.
- **F4.4 — Cook Mode.** `L`
  Full-screen step-by-step, large fonts, step checkoff, keep-awake (extend existing wake-lock), inline timers,
  swipe between steps on mobile. *AC:* screen stays awake; works one-handed; exits cleanly.
- **F4.5 — Print + share.** `S` *AC:* clean print stylesheet; share via Web Share API w/ fallback copy-link.

---

## Phase 5 — Discovery: search & filters (client now, server later)

- **F5.1 — Persistent faceted filters.** `M`
  Diet, cuisine, time, meal type as chips; persisted (URL params + preference). *AC:* refresh keeps filters;
  shareable filtered URLs.
- **F5.2 — Search UX + empty states.** `M`
  Search overlay (`/` shortcut), result counts, "no results → clear filters" guidance. Client filter now;
  **plan Postgres FTS** for scale (ticket F8.x). *AC:* typo-tolerant enough for MVP; never a blank screen.
- **F5.3 — Home re-order for the core loop.** `M`
  Lead with structured search + pantry CTA above trendy/blog content so the differentiator is visible in 30s.
  *AC:* first viewport communicates "find/cook," not "read."

---

## Phase 6 — Trust, safety & AI hardening

- **F6.1 — Server-side AI proxy.** `M` *(security must-fix)*
  Move Anthropic call to `POST /api/ai/generate`; remove `NEXT_PUBLIC_ANTHROPIC_API_KEY` from client.
  Add rate limiting. *AC:* key never in browser bundle; pantry generate still works.
- **F6.2 — Signed Cloudinary uploads.** `M`
  `POST /api/uploads/sign`; client uploads with a signed payload instead of an unsigned preset. *AC:* no
  unsigned preset shipped; uploads work in create/edit.
- **F6.3 — AI labeling + regenerate + save.** `S`
  "AI-generated, not kitchen-tested" badge; regenerate; "save to my recipes." *AC:* AI output clearly labeled and durable.
- **F6.4 — Review integrity + moderation/report.** `M`
  Prevent authors rating their own recipe; `POST /api/recipes/[id]/report`; basic admin queue (roles exist).
  *AC:* self-review blocked; reports recorded.

---

## Phase 7 — Account, profile, settings  [needs DB]

- **F7.1 — Account settings.** `M` — change email/password; default units & dietary defaults. *AC:* persisted; re-auth on email change.
- **F7.2 — Account deletion / data export.** `M` — trust + compliance. *AC:* delete cascades; export returns user's recipes/saves/reviews.
- **F7.3 — Public creator profile + "My Recipes" dashboard.** `L` — drafts/published, views, ratings. *AC:* creator can manage content; public profile lists published recipes.
- **F7.4 — Notification preferences.** `S` — in-app on/off (email later). *AC:* respected by the notification system.

---

## Phase 8 — Polish & platform

- **F8.1 — A11y pass (WCAG 2.1 AA).** `M` — keyboard, focus, alt text enforcement, contrast, reduced motion, labels. *AC:* axe clean on key pages.
- **F8.2 — Microinteractions & keyboard shortcuts.** `S` — hover/animation polish; `/ j k s Esc`. *AC:* respects reduced motion.
- **F8.3 — Analytics/event taxonomy.** `S` — instrument view, save, cook-mode-start, generate, publish, review. *AC:* core-loop funnel measurable.
- **F8.4 — Postgres full-text search.** `M` — replace client filtering for scale. *AC:* server-side search endpoint backs F5.2.
- **F8.5 — Perf budget + CWV monitoring.** `S` — bundle budget per route (watch heavy deps like sanitize-html on `/articles/[id]`). *AC:* budgets enforced in CI or documented.

---

## Suggested sequencing

1. **Phase 0** (foundations) — start now, no DB.
2. **Phase 4 / F5.3** (recipe detail + Home re-order) — high user value, mostly no DB.
3. Provision DB → **Phase 2** (API cutover) → **Phase 1** (auth usable) → **Phase 3** (synced box).
4. **Phase 6** (security/AI hardening) — do before AI/create get more frontend.
5. **Phase 5** (discovery), **Phase 7** (account), **Phase 8** (polish).

## Explicitly out of scope for MVP
Teams/enterprise collaboration; billing/subscriptions (Stripe); social feeds/DMs; native apps; meal planner;
grocery integrations; i18n. Revisit after retention is proven (see blueprint §11).

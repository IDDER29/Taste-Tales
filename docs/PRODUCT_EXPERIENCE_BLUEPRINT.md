# Taste-Tales — Product Experience Blueprint

A senior product + UX architecture document defining the full product experience
**before** further frontend implementation. It is grounded in the current codebase
and tags items as **(exists)**, **(scaffolded)**, or **(not built)** so the team can
act directly.

> Strategic premise: Taste-Tales is currently a *recipe blog with app-like features*.
> The most important decision before building more frontend is **what the core loop is** —
> passive reading (blog) vs. active cooking/saving/contributing (app). This document
> assumes the **app** model; the structured-recipe, pantry, and Recipe Box features only
> pay off in that model. Where the assumption changes priorities, it is flagged.

---

## 1. Product Vision

**What it does.** A community recipe platform where home cooks discover structured,
trustworthy recipes, cook from ingredients they already have (pantry matcher + AI),
save favorites to a personal Recipe Box, and share their own recipes with ratings and reviews.

**Who it's for.** Primarily *home cooks* (25–45, "what do I make tonight"); secondarily
*recipe creators/food bloggers* who want a structured, low-friction place to publish.

**Core value proposition.** "Every flavor tells a story — and every recipe is actually
cookable." The differentiator vs. SEO recipe blogs is **structured data** (real ingredient
lists, times, servings, nutrition) that powers useful tools: search by what you have,
filter by diet/time, and generate a recipe when nothing matches.

**What makes users stay.** The Recipe Box (personal investment), the pantry matcher
(solves the daily "what can I make now"), trust signals (ratings/reviews + clean recipes),
and a frictionless creator loop with audience + feedback.

**First 30 seconds — what a user must instantly understand:**
1. A place to **find recipes I can actually make** (not a personal-essay blog).
2. I can **search/filter immediately** without signing up.
3. Something a blog doesn't have (the **"Cook from your pantry"** entry point).
4. Saving and contributing are possible once I'm in.

> Flag: today Home leads with hero + trendy recipes (blog feel). Within 30s users should
> *see the pantry/structured-search promise*, or the differentiation is invisible.

---

## 2. User Expectations

- **Speed.** Sub-second navigation; instant search/filter; no image jank. Fast on kitchen mobile data.
- **Simplicity.** Find → open → cook. No mandatory signup to read. No dark patterns.
- **Trust.** Ratings, review counts, "works" signals, author identity, sane nutrition, no spam.
- **Transparency.** Authorship, dates, AI-vs-human labeling, free-vs-gated clarity.
- **Ease of use.** Obvious nav, forgiving forms, readable type, hands-busy recipe layout.
- **Reliability.** Saves persist; submissions don't vanish; reviews post; no loss on flaky connections.
- **AI quality (applies).** Plausible, safe, formatted recipes; "AI-generated, not kitchen-tested" labels; graceful failure.
- **Collaboration.** Reviews (exist); following/sharing/collections (not built).
- **Mobile responsiveness.** Mobile-first cooking: step mode, large targets, screen-wake (partial).
- **Accessibility.** Keyboard nav, alt text, contrast, screen-reader recipe structure, reduced motion.
- **Performance.** Good Core Web Vitals (LCP, CLS, INP). SSR/SEO for recipe pages (currently client-rendered).

---

## 3. Platform Promises

**Promises:** (1) recipes you can actually cook; (2) cook with what you have; (3) save it and
it'll be there; (4) real feedback from real cooks; (5) publish your recipe easily.

**Outcomes users expect:** less time deciding, fewer failed dishes, a growing library,
recognition/feedback for creators.

**What breaks trust:** a saved recipe disappears/doesn't sync; broken HTML / nonsense
nutrition / spam / XSS (stored-XSS path already fixed — keep that bar); AI presented as
tested or unsafe; fake/manipulable ratings (esp. authors rating their own recipes); silent
submission failure losing work; flaky login that loses the box.

**Experiences that disappoint:** forced signup to read; ad/interstitial-heavy slow pages;
pantry search dead-ends; tiny targets / unreadable steps; missing empty/loading/error states.

---

## 4. Competitor-Level UX Analysis

Reference: Allrecipes, NYT Cooking, Serious Eats, Yummly, Tasty, Mealime/Paprika; Medium/Substack (publishing side).

**Patterns users expect:** recipe card grid (image, title, rating, time, **save icon on card**);
canonical recipe layout (hero → meta → ingredients w/ scaler & add-to-list → numbered steps →
nutrition → reviews); **"Jump to recipe"**; faceted filters + chips + sort; **save to collections**;
ratings/reviews with photos & counts; **serving scaling** + **metric/imperial toggle**; print/share;
**shopping-list generation**; creator WYSIWYG + image upload + draft/publish/preview.

**UI conventions:** clear top nav, bookmark = save, star rating, back/breadcrumb, card hover
elevation, skeleton loaders, toasts, modal confirms for destructive actions.

**Assumed-by-default (annoying if missing):** account-synced saves, "jump to recipe," serving
scaler, add-to-shopping-list, diet/allergen + time filters, typo-tolerant search, mobile cook mode + keep-awake.

**Modern interactions:** optimistic save/like, instant client filtering, "load more"/infinite scroll,
command-palette search, step-by-step cook mode, labeled AI generation with regenerate.

> Gap/opportunity: Taste-Tales has the *structured data* to do scaling, shopping lists, and unit
> toggles — envied competitor features — but they aren't built yet. Asymmetric opportunity.

---

## 5. User Personas

**A. "Weeknight" Wendy — Beginner / non-technical (primary).** Goals: decide dinner fast; cook
with what's in the fridge. Pains: decision fatigue, blog preambles, vague quantities, failures.
Motivation: feed family well, low stress. Skill: low-med, phone-on-counter. Flow: browse/pantry →
open → cook mode → save → maybe rate.

**B. "Meal-Prep" Marcus — Power user.** Goals: reliable library, weekly plan, macros. Pains:
scattered saves, no scaling, re-finding. Motivation: efficiency, fitness. Skill: med-high. Flow:
filter (diet+time+macros) → collections → scale → export list → review thoroughly.

**C. "Creator" Carla — Author / food blogger (supply).** Goals: publish easily, grow audience,
get feedback. Pains: maintaining own site/SEO, weak editors, no audience. Motivation: recognition,
later monetization. Skill: med. Flow: create → rich editor + structured fields + image → preview →
publish → respond to reviews → track views/likes.

**D. "Dietary" Dana — Constraint-driven (vegan/GF/allergy).** Goals: strict matching, trustworthy
labels. Pains: mislabeled diets, hidden allergens. Motivation: safety, health, ethics. Skill: med.
Flow: set persisted diet/allergen filters → trust badges → verify ingredients → save.

**E. "Builder" Bashir — Technical/admin (future B2B).** Goals: moderate, ensure data quality &
safety. Pains: spam, XSS, bad data, no admin tooling. Motivation: platform health. Skill: high.
Flow: admin dashboard → moderate recipes/reviews → manage users/roles (USER/AUTHOR/ADMIN enum exists)
→ monitor metrics.

> Teams/business users are **not** a current fit — defer unless pivoting to family meal-planning or B2B-creator.

---

## 6. Complete User Stories

**Onboarding**
- As a new visitor, I want to browse and open recipes without an account, so that I can evaluate before committing.
- As a new visitor, I want a non-blocking prompt to sign up when I try to save, so that I understand why it helps.
- As a new user, I want a 2-field signup (email/password, optional name), so that I start fast. *(scaffolded)*

**Authentication**
- As a user, I want email/password sign-in that persists across visits, so that my box persists. *(scaffolded)*
- As a user, I want clear bad-credential errors and password reset, so that I'm never stuck. *(reset not built; VerificationToken exists)*
- As a user, I want to log out from any menu/device, so that I control access. *(NavBar wired)*

**Dashboard / personal space**
- As a returning user, I want a personalized home (recently saved, recommended, continue cooking), so that it feels mine.
- As a creator, I want "My Recipes" (drafts, published, views, ratings), so that I can manage content. *(not built)*

**Main feature usage**
- As a cook, I want ingredients, numbered steps, time, servings, nutrition, so that I cook confidently. *(exists)*
- As a cook, I want "Jump to recipe" + Cook Mode that keeps the screen awake, so that hands-busy cooking is easy. *(wake-lock partial)*
- As a cook, I want to scale servings and toggle metric/imperial, so that quantities fit. *(not built; data supports)*
- As a creator, I want a rich editor + structured fields + image upload, so that publishing is quick/consistent. *(exists)*

**Pantry / AI**
- As a cook, I want to enter ingredients and see ranked existing recipes, so that I waste less food. *(exists)*
- As a cook, when nothing matches, I want labeled, regenerable AI recipes, so that I still get an idea. *(exists; needs labeling + server proxy)*

**Search / filtering**
- As a user, I want typo-tolerant full-text search, so that I find recipes despite imperfect queries. *(client filter only)*
- As Dana, I want persistent diet/allergen/time/cuisine filters, so that results always respect constraints.

**Notifications**
- As a creator, I want to be notified when someone reviews my recipe, so that I engage. *(in-app scaffold exists)*
- As a user, I want notification preferences (in-app/email/off), so that I'm not spammed.

**Settings / preferences**
- As a user, I want default units, dietary defaults, and profile info, so that the app adapts. *(not built)*

**Collaboration**
- As a user, I want to rate/review (one per recipe, optional photo), so that I help others. *(rating+comment exist; one-per-user enforced; photos not built)*
- As a user, I want to follow creators and share recipes, so that I build a feed and send recipes. *(not built)*

**Error handling**
- As a user, if a save/submit fails, I want a clear error with my input preserved, so that I don't lose work.
- As a user, if AI fails, I want a friendly message + retry, so that I'm not blocked. *(partial)*

**Mobile usage**
- As a mobile cook, I want large targets, sticky actions, and offline-readable saves, so that I cook anywhere.

**Account management**
- As a user, I want to change email/password and delete my account/data, so that I trust the platform. *(not built)*

**Billing / subscriptions** *(only if monetized — none today)*
- As a power user, I want optional premium (ad-free, advanced nutrition/meal-planning, unlimited AI). → **Defer (§11).**

**AI interactions**
- As a user, I want to see what the AI used, edit/regenerate, and save the result to my box, so that AI output becomes durable.

---

## 7. Full Workflow Mapping

Per step: **Intent → UI action → System response → Expected feedback → Friction risks.**

**A. First-time user**
1. Land Home → sees value prop + search/pantry CTA → fast content load → "what is this" clear → *Risk: blog-y hero hides pantry.*
2. Search/category → instant filtered grid (skeletons) → count + chips → *Risk: no 0-result guidance.*
3. Open recipe → image, meta, ingredients, steps, reviews; "Jump to recipe"; rating → *Risk: CLS from late image; long intro.*
4. Try to save → "Create a free account to save" (preserve intended save) → modal not full redirect → *Risk: losing intended save post-auth.*
5. Sign up → auto sign-in, return to recipe, save completes → toast "Saved to Recipe Box" → *Risk: round-trip jank / callback handling.*

**B. Returning user**
1. Open → authenticated → personalized home → name in nav → *Risk: cold blank if no personalization.*
2. Recipe Box → searchable grid of saves → *Risk: no organization at scale.*
3. Cook → Cook Mode, screen awake, check off steps → *Risk: accidental nav losing place.*

**C. Publish a recipe (creator)**
1. Create → form: image (Cloudinary), title, rich text, structured ingredients/steps, category/diet/nutrition; draft/autosave → *Risk: no autosave → lost work (big today).*
2. Preview → faithful preview → *Risk: preview ≠ final.*
3. Publish → server validates + sanitizes → redirect to recipe → success toast + share prompt → *Risk: silent validation failure; mid-form image upload failure.*

**D. Failure / recovery**
1. Network drop on submit → inline error, input retained, retry; rollback optimistic → *Risk: duplicate submit; needs idempotency.*
2. 404 → friendly not-found + search/back *(NoPage exists).*
3. AI failure / no key → explanatory message, pantry matches still shown, retry *(partial).*
4. Auth expired → silent refresh or gentle re-sign-in preserving intent.

**E. Upgrade / payment** *(future)* — hit premium limit → contextual paywall → plan select → Stripe
checkout → instant entitlement + receipt → manage/cancel in settings. Keep core cooking free; gate power features only.

**F. Team collaboration** *(defer)* — likely "shared collections / family meal plan": invite by email →
shared cookbook → role (viewer/editor) → activity feed. Not MVP.

---

## 8. Frontend Architecture Recommendations

**Required pages:** Home *(exists)*, Search/Browse w/ filters *(partial)*, Recipe detail *(exists)*,
Create/Edit *(exists)*, Recipe Box *(exists)*, Pantry+AI *(exists)*, Login/Register *(scaffolded)*,
Profile/public creator page *(not built)*, Account settings *(not built)*, My Recipes dashboard *(not built)*,
Admin/moderation *(not built; roles exist)*, 404/error/offline *(404 exists)*, About *(exists)*.

**Navigation.** Top nav: Logo · Browse/Search · Cook (Pantry) · Recipe Box · Create · notifications + account menu.
Mobile: **bottom tab bar** (Home, Search, Pantry, Box, Account) for thumb reach. Keep ≤2 levels.

**Information hierarchy.** Discovery leads with **image + title + rating + time**. Recipe page prioritizes
method over prose ("Jump to recipe" pinned). Author/trust secondary but visible.

**Component system.** Adopt a small design system (tokens for color/space/type; primitives: Button, Input,
Select, Card, Badge/Chip, Modal, Toast, Skeleton, Rating, Tabs, EmptyState, Avatar). Consolidate now
(Headless UI + Tailwind already partly used) before pages multiply.

**State management.** **RTK Query for server state** (recipes/reviews — scaffolded), local React state for UI,
thin slice for cross-cutting UI (menus/toasts). Move `saved` from localStorage-only to **server-synced for
logged-in users with local fallback** for guests. Retire parallel hand-rolled thunk slices once RTK Query lands
(avoid dual sources of truth).

**Responsive.** Mobile-first; fluid grids 1→2→3→4; Cook Mode distinct mobile layout; forms single-column on
mobile; `next/image` with explicit aspect ratios to kill CLS (currently plain `<img>`).

**State sets (define for every data surface):** *Loading* skeletons (not blank spinners); *Empty* with guidance
(pantry "try fewer / generate with AI", box "browse", search "clear filters"); *Error* inline, actionable,
input-preserving, retry; *Success* toasts.

**Accessibility (WCAG 2.1 AA):** full keyboard operability + visible focus; required alt text on uploads;
semantic recipe markup + **schema.org Recipe JSON-LD** (`RecipeJsonLd` exists); contrast audit of red palette;
`prefers-reduced-motion`; labeled fields with error association.

---

## 9. UX Details & Microinteractions

- **Hover:** card elevation + subtle image zoom; bookmark fills; buttons darken.
- **Animations/transitions:** 150–250ms ease; section fades; modal scale-in; respect reduced motion.
- **Feedback:** optimistic save/like with instant fill + rollback; star rating animates on select.
- **Messaging:** toast system (success/error with retry); inline field errors.
- **Confirmation:** destructive actions (delete recipe/account) use explicit modal; "unsaved changes" guard on editor.
- **Keyboard shortcuts:** `/` focus search, `j/k` navigate cards, `s` save focused, `Esc` close modal/cook mode.
- **Mobile gestures:** swipe between cook steps; pull-to-refresh lists; long-press card → quick actions; 44px+ targets.
- **Cook Mode:** keep-awake (wake lock), step checkoff, big fonts, inline timers.

---

## 10. Trust & Retention Factors

**Builds trust:** authentic ratings/reviews with counts; clear authorship/profile; accurate structured data;
visible AI labeling; fast ad-light pages; sanitized content; honest empty/error states; HTTPS + sane sessions.

**Increases retention:** Recipe Box (sunk-cost library), collections, personalization/recommendations,
review-activity notifications, weekly "what to cook," creator feedback loops.

**Creates delight:** the pantry "you can make this *now*" moment; satisfying one-tap save; serving scaler +
auto shopping list; genuinely good AI ideas; Cook Mode that "just works."

**Frustrates:** forced signup to read; janky images; pantry dead-ends; tiny targets; lost form data;
non-persistent filters; untrustworthy reviews.

**Causes churn:** saves that don't sync; login pain; low-quality content flooding discovery; no reason to return.

**Premium feel:** speed, polish, consistency, thoughtful empty states, accessibility, *useful* (not flashy) AI.

---

## 11. MVP vs Future Features

**Must-have MVP (finish a trustworthy core loop):**
- Email/password auth + session persistence + **password reset** *(scaffolded; reset missing)*.
- **Account-synced Recipe Box** (migrate off localStorage-only) — *critical gap*.
- Real backend + recipe CRUD wired to `/api` (routes/RTK Query scaffolded) with **server-side sanitization** *(in progress)*.
- Recipe detail polish: "Jump to recipe," serving scaler, Cook Mode + keep-awake.
- Browse/search with persistent diet/time/cuisine filters; **all four state sets** everywhere.
- Ratings/reviews (one-per-user, author identity) + basic moderation/report *(reviews exist)*.
- Pantry + AI with clear labeling and **server-side AI key proxy** — *security must-fix*.
- Mobile bottom-nav + responsive, `next/image`, basic a11y pass.
- SEO: SSR recipe pages + JSON-LD *(component exists)*.

**Nice-to-have (fast followers):** collections/cookbooks, shopping list, metric/imperial toggle, creator
dashboard, follow/share, review photos, recommendations, notification preferences, account deletion/export.

**Advanced / future:** meal planner & calendar, macro tracking, grocery integrations, multi-step AI
(substitutions, "make it vegan"), import-from-URL, offline PWA, i18n, **premium subscription (Stripe)**,
B2B/creator monetization, teams/shared family plans.

**Should NOT be included initially:** teams/enterprise collaboration; billing/subscriptions; social network
features (DMs/feeds beyond reviews); heavy AI everywhere; native mobile apps (PWA first).

---

## 12. Final Recommendations

**UX priorities:** (1) make the differentiator visible in 30s (lead with structured search + pantry);
(2) best-in-class recipe detail (jump-to-recipe, scaler, Cook Mode); (3) Recipe Box as retention engine
(account-synced); (4) states everywhere; (5) mobile cooking ergonomics.

**Frontend priorities:** (1) shared design-system layer before more pages; (2) cut server state to RTK Query,
retire thunk slices; (3) auth-gating UX that preserves intent; (4) `next/image` + SSR recipe pages;
(5) account-synced saved recipes with guest fallback.

**Risks:** identity drift (blog vs app); trust/safety (review manipulation, spam, AI labeling,
**client-exposed AI/Cloudinary secrets** — move server-side); data-shape cutover (`publishedDate`↔`publishedAt`)
needing end-to-end verification; dual state sources during transition; bundle-size perf regressions.

**Missing considerations to decide now:** guest→user Recipe Box migration; moderation & reporting flow;
account deletion/export; notification channels & preferences; scalable search (Postgres FTS or service);
analytics/event taxonomy (view, save, cook-mode-start, generate, publish, review).

**Critical improvements before development continues:**
1. Decide the core loop (app) and re-order Home to express it.
2. Lock the API data contract; finish json-server → `/api` cutover.
3. Define design-system primitives + the standard state set as reusable components.
4. Move secrets server-side (AI + signed Cloudinary).
5. Spec the auth-gated interaction pattern once, reuse everywhere.

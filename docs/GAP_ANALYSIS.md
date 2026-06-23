# Taste-Tales — Competitive Feature & Gap Analysis

**Benchmark:** major recipe platforms (Allrecipes, BuzzFeed Tasty, NYT Cooking, Epicurious, Serious Eats, Food Network)
**Goal:** make Taste-Tales a standout software-engineering **portfolio piece**
**Date:** 2026-06-21

---

## TL;DR

Taste-Tales today is a **CRUD blog that happens to be about food**, not a recipe app. The single most important gap is that recipes are stored as **free-form rich-text HTML** instead of **structured data** (ingredients, steps, times, yield, nutrition). Almost every high-value feature on real recipe sites — search/filtering, the serving scaler, shopping lists, schema.org rich results, nutrition — is *impossible* until the data is structured. So the structured recipe model is the keystone fix; most other features unlock from it.

For **portfolio impact specifically**, the research is consistent: hiring managers screen on a live deployment, real auth (hashing + RBAC), automated tests + CI/CD, TypeScript, WCAG AA accessibility, and domain-appropriate touches like schema.org/Recipe JSON-LD — ideally with quantified metrics. Several of those are cheap to add and disproportionately impressive.

---

## 1. Feature comparison matrix

Legend: ✅ have · ⚠️ partial · ❌ missing · 🏆 = high portfolio value

### Recipe content (the core)
| Feature | Major sites | Taste-Tales | Gap |
|---|---|---|---|
| Structured ingredients (qty + unit) | Universal | ❌ (HTML blob) | **Critical** 🏆 |
| Step-by-step numbered instructions | Universal | ❌ (HTML blob) | **Critical** 🏆 |
| Prep / cook / total time | Universal | ❌ | High |
| Servings / yield | Universal | ❌ | High |
| Nutrition (≥ calories/serving) | Very common | ❌ | Medium |
| Completed-dish photo | Universal (required by Google) | ✅ (Cloudinary) | — |
| "Jump to recipe" / recipe card | Near-universal | ❌ | Low |
| Serving-size scaler | Partial | ❌ | Medium 🏆 (great demo) |
| US/metric unit conversion | Partial | ❌ | Low |
| Step photos / video | Partial (Tasty=video-first) | ❌ | Low |
| Cook Mode (screen-awake) | Partial (Wake Lock API) | ❌ | Low 🏆 (cheap "wow") |

### Discovery & social
| Feature | Major sites | Taste-Tales | Gap |
|---|---|---|---|
| Full-text search | Universal | ❌ (search bar is decorative) | **High** 🏆 |
| Faceted filtering (diet, cuisine, time, course) | Universal | ⚠️ single-category filter only | High 🏆 |
| Include/exclude-ingredient search | Allrecipes, Tasty | ❌ | Medium 🏆 |
| Star ratings | Universal | ⚠️ static "likes" only | High |
| Written reviews | Universal | ❌ | High |
| Comments / Q&A / notes | Universal | ❌ | Medium |
| Related / recommended recipes | Universal | ❌ | Medium |
| Editorial/seasonal collections | Universal | ⚠️ hardcoded dummy lists | Low |

### Accounts & utilities
| Feature | Major sites | Taste-Tales | Gap |
|---|---|---|---|
| User accounts / auth | Universal (NYT paywalled) | ❌ (Login is fake) | **High** 🏆 |
| Save / favorite / recipe box | Universal | ❌ | High 🏆 |
| Collections / folders | Universal | ❌ | Medium |
| Meal planning | Site-specific (often paid) | ❌ | Medium 🏆 |
| Shopping/grocery list from ingredients | Near-universal (Instacart/Walmart) | ❌ | Medium 🏆 |
| Print-friendly view | Universal | ❌ | Low (cheap) |
| Newsletter / email | Common | ⚠️ form does nothing | Low |

### Technical / SEO / quality
| Feature | Best practice | Taste-Tales | Gap |
|---|---|---|---|
| schema.org/Recipe JSON-LD | Required for rich results | ❌ | **High** 🏆 |
| Accessibility (WCAG AA) | "Definition of done" 2026 | ⚠️ partial (alt issues, etc.) | High 🏆 |
| Core Web Vitals (LCP≤2.5s, INP≤200ms, CLS≤0.1) | Expected | ❓ unmeasured | Medium |
| Image optimization (srcset, WebP/AVIF, lazy) | Standard | ⚠️ Cloudinary, not optimized | Medium |
| PWA / mobile | Common | ⚠️ CRA manifest only | Low |
| TypeScript | Expected default | ❌ (plain JS) | High 🏆 |
| Automated tests + CI/CD | "Sets you apart" | ⚠️ 1 smoke test + build CI | High 🏆 |
| Live deployment | Mandatory screening filter | ⚠️ gh-pages but no backend | **High** 🏆 |

---

## 2. The keystone problem: unstructured content

The app stores a recipe's body as a single HTML string from React-Quill. Real recipe sites model a recipe as **data**:

```jsonc
{
  "name": "...", "image": ["...16x9", "...4x3", "...1x1"],
  "prepTime": "PT20M", "cookTime": "PT45M", "totalTime": "PT65M",  // ISO 8601
  "recipeYield": "4 servings",
  "recipeIngredient": [ { "qty": 2, "unit": "lb", "item": "pork shoulder" } ],
  "recipeInstructions": [ { "step": 1, "text": "..." } ],
  "nutrition": { "calories": "320 kcal" },
  "recipeCuisine": "American", "recipeCategory": "Main Course",
  "aggregateRating": { "ratingValue": 4.6, "ratingCount": 128 }
}
```

Why this is the keystone:
- **Search/filter** by time, diet, ingredient needs structured fields.
- **Serving scaler** needs numeric quantities.
- **Shopping list** needs itemized ingredients.
- **Nutrition** per serving needs `recipeYield`.
- **schema.org/Recipe rich results** map almost 1:1 to these fields (Google requires only `name` + `image`, but ingredients + instructions are needed for the richest results and Assistant guidance; times must be ISO 8601; `nutrition.calories` requires `recipeYield`).

**Fix:** evolve the article model into a structured recipe (keep the HTML "story" as an optional intro — that mirrors how real recipe pages have a narrative + a structured recipe card). This one change unlocks ~8 downstream features.

---

## 3. Table-stakes vs differentiators (2025–2026)

**Table-stakes** (users now expect): structured recipe card, real search + faceted filters, ratings & reviews, user accounts, save/recipe-box, shopping list, mobile + good Core Web Vitals, schema.org markup.

**Differentiators**: AI ingredient-based "what can I cook from what I have," LLM recipe/meal-plan generation, smart auto-consolidated shopping lists (NLP), voice/hands-free cook mode, learned personalization, nutrition tracking, short-form video.

Market context: recipe-app market ~$1.4B→$1.6B (2025→26, 13.4% CAGR); AI meal-planning is a distinct, fast-growing, monetizable sub-category — so an AI feature reads as on-trend, not gimmicky.

---

## 4. Prioritized roadmap (impact × effort, for portfolio)

### Tier 0 — Make it real & credible (do first; cheap, high screening value)
1. **Stand up a real backend + live deployment** (the current app can't reach `localhost:8000` in prod). A live, clickable URL is effectively a screening filter. 🏆
2. **Real authentication** — hashing (bcrypt/Argon2), JWT-vs-session decision, protected routes, RBAC. Strongest single full-stack signal. 🏆
3. **Migrate to TypeScript** — now the expected default for pro front-end roles. 🏆
4. **Expand tests + CI** — you already have the harness; add component/thunk tests and run them in CI (already wired). Quantify ("X% coverage"). 🏆

### Tier 1 — Become an actual recipe app (the keystone + what it unlocks)
5. **Structured recipe model** (ingredients/steps/times/yield/nutrition). Keystone. 🏆
6. **schema.org/Recipe JSON-LD** — small once data is structured; demonstrates SEO/structured-data skill; optional fields reportedly lift clicks 20–30%. 🏆
7. **Real search + faceted filtering** (diet, cuisine, time, course; include/exclude ingredients). 🏆
8. **Ratings + reviews** (replace the static likes).
9. **Save / recipe box** (needs auth from Tier 0).

### Tier 2 — Utility features that demo systems integration
10. **Serving scaler** (pure-function showcase, great in interviews). 🏆
11. **Shopping list generation** from a recipe's ingredients (+ optional grocery API). 🏆
12. **Print-friendly view** & **Cook Mode** (Wake Lock API) — both cheap "wow" touches. 🏆
13. **Meal planner** (calendar → auto shopping list).

### Tier 3 — Differentiators that make it memorable
14. **AI "what can I cook from these ingredients?"** and/or **LLM recipe generation** — on-trend, integrates an external API, strong talking point. 🏆
15. **Accessibility pass to WCAG AA** with a documented audit ("definition of done" in 2026). 🏆
16. **Core Web Vitals + image optimization** (srcset, WebP/AVIF, correct lazy-loading; don't lazy-load the LCP image) — then publish the before/after numbers. 🏆

> Portfolio tip the research kept surfacing: **quantify everything** ("reduced LCP from 4.1s→1.9s", "WCAG AA, 0 axe violations", "92% Lighthouse SEO"). Metrics beat adjectives.

---

## 5. Suggested "portfolio narrative"
A tight, impressive scope without boiling the ocean: **Tiers 0–1 + items 10, 14, 15.** That yields a deployed, typed, tested, authenticated recipe app with structured data, real search, ratings, a serving scaler, an AI ingredient-search feature, schema.org rich results, and an accessibility audit — each a concrete interview talking point.

---

## Sources
**Recipe structure & schema:** developers.google.com/search/docs/appearance/structured-data/recipe · schema.org/Recipe · bootstrapped.ventures/components-of-a-recipe · bootstrapped.ventures/cook-mode · wptasty.com/recipe-cards-importance · recipestripper.com/blog/jump-to-recipe-button-not-enough
**Discovery/social:** flavor365.com (Allrecipes search/saved) · eathealthy365.com (Epicurious, Food Network) · play.google.com Tasty listing · buzzfeed.com/amirshake/introducing-tips-ratings · apps.apple.com NYT Cooking · foodnetwork.com/saves
**Accounts/utility:** umatechnology.org (Epicurious recipe box/list) · company.instacart.com (NYT integration) · corporate.walmart.com (Tasty shoppable recipes) · tomsguide.com & help.foodnetwork.com (FN Kitchen sub) · guides.lib.uni.edu (NYT paywall)
**Performance/a11y:** web.dev/articles/vitals · web.dev/articles/defining-core-web-vitals-thresholds · web.dev/learn/performance/image-performance · webaim.org/standards/wcag/checklist · w3.org/WAI/tips/writing
**Trends/portfolio:** thebusinessresearchcompany.com (market report) · researchandmarkets.com (AI meal-planning) · foodieprep.ai · memberkitchens.com · honeydewcook.com · whatisthesalary.com · strapi.io/blog/api-project-ideas · nucamp.co · refontelearning.com · codewithseb.com · recipekit.com

*Compiled from 5 parallel research streams (~50 sources); cross-checked. Some site-specific details (e.g., Serious Eats internals, exact current NYT Cooking pricing) were not fully verifiable from authoritative sources and are flagged as such in the underlying notes.*

// src/utils/recipe.ts
// Shared helpers + option lists for the structured recipe model.
// This is the single source of truth for recipe data shape, formatting,
// scaling, filtering, and schema.org/Recipe JSON-LD. Keep forms, the view,
// and discovery filters in sync via these exports.

import type { FilterCriteria, Rating } from "../types";

// ---- Option lists (keep AddArticle/EditArticle forms and filters aligned) ----

export const CATEGORY_OPTIONS = ["Breakfast", "Main Course", "Appetizer", "Dessert"];

export const CUISINE_OPTIONS = [
    "American", "Italian", "Mexican", "Indian", "Chinese",
    "Japanese", "French", "Mediterranean", "Thai", "Other",
];

export const DIET_OPTIONS = [
    "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb", "Nut-Free",
];

export const UNIT_OPTIONS = [
    "", "tsp", "tbsp", "cup", "cups", "oz", "lb", "g", "kg",
    "ml", "l", "clove", "cloves", "pinch", "slice", "piece", "pieces",
];

// Loose structural shapes — these helpers only read the fields they need, so
// both full Article objects and lighter inputs satisfy them.
type Numeric = number | string | null | undefined;
type QtyIngredient = { quantity?: number | null; unit?: string; name?: string };

interface FilterableRecipe {
    title?: string;
    subtitle?: string;
    category?: string;
    cuisine?: string;
    diet?: string[];
    tags?: string[];
    prepTime?: number | null;
    cookTime?: number | null;
    ingredients?: QtyIngredient[];
}

interface RecipeContent {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    publisher?: { name?: string } | null;
    publishedDate?: string;
    category?: string;
    cuisine?: string;
    tags?: string[];
    prepTime?: number | null;
    cookTime?: number | null;
    servings?: number | null;
    ingredients?: QtyIngredient[];
    instructions?: string[];
    nutrition?: { calories?: number | null } | null;
}

// True when the record carries structured recipe data (vs. a legacy HTML-only post).
export const hasStructuredRecipe = (
    article?: { ingredients?: unknown[] | null; instructions?: unknown[] | null } | null
): boolean =>
    Boolean(
        (article?.ingredients && article.ingredients.length) ||
        (article?.instructions && article.instructions.length)
    );

// Total time in minutes (prep + cook).
export const totalMinutes = (
    article?: { prepTime?: Numeric; cookTime?: Numeric } | null
): number => (Number(article?.prepTime) || 0) + (Number(article?.cookTime) || 0);

// ---- Time formatting ----

// 65 -> "1 hr 5 min", 30 -> "30 min", 0/null -> ""
export const formatMinutes = (min: Numeric): string => {
    const m = Number(min) || 0;
    if (m <= 0) return "";
    const h = Math.floor(m / 60);
    const rem = m % 60;
    const parts: string[] = [];
    if (h) parts.push(`${h} hr`);
    if (rem) parts.push(`${rem} min`);
    return parts.join(" ");
};

// 65 -> "PT1H5M" (ISO 8601 duration, required by Google for recipe rich results)
export const minutesToISO = (min: Numeric): string | undefined => {
    const m = Number(min) || 0;
    if (m <= 0) return undefined;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return `PT${h ? `${h}H` : ""}${rem ? `${rem}M` : ""}`;
};

// ---- Quantity formatting & scaling ----

const FRACTIONS: [number, string][] = [
    [1 / 8, "⅛"], [1 / 4, "¼"], [1 / 3, "⅓"], [3 / 8, "⅜"],
    [1 / 2, "½"], [5 / 8, "⅝"], [2 / 3, "⅔"], [3 / 4, "¾"], [7 / 8, "⅞"],
];

// 0.5 -> "½", 1.5 -> "1 ½", 2 -> "2", null -> ""
export const formatQuantity = (n: Numeric): string => {
    if (n == null || Number.isNaN(Number(n))) return "";
    const num = Number(n);
    const whole = Math.floor(num);
    const frac = num - whole;
    if (frac < 0.02) return String(whole);
    let best = "";
    let bestDiff = Infinity;
    for (const [val, glyph] of FRACTIONS) {
        const diff = Math.abs(frac - val);
        if (diff < bestDiff) {
            bestDiff = diff;
            best = glyph;
        }
    }
    // If the remainder isn't close to a common fraction, fall back to a decimal.
    if (bestDiff > 0.06) return String(Math.round(num * 100) / 100);
    return whole ? `${whole} ${best}` : best;
};

// Multiply ingredient quantities by a factor (for the serving scaler).
export const scaleIngredients = <T extends { quantity?: number | null }>(
    ingredients: T[] | null | undefined,
    factor: number
): T[] =>
    (ingredients || []).map((ing) => ({
        ...ing,
        quantity:
            ing.quantity == null || Number.isNaN(Number(ing.quantity))
                ? ing.quantity
                : Math.round(Number(ing.quantity) * factor * 1000) / 1000,
    }));

// "{qty} {unit} {name}" with collapsed spaces, e.g. "1 ½ cups flour"
export const ingredientToLine = (ing?: QtyIngredient | null): string => {
    if (!ing) return "";
    const qty = formatQuantity(ing.quantity);
    return [qty, ing.unit, ing.name].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
};

// ---- Discovery: filtering ----

// Filter an article list by criteria. Generic so the input type flows to output.
export const filterRecipes = <T extends FilterableRecipe>(
    articles: T[] | null | undefined,
    criteria: FilterCriteria = {}
): T[] => {
    const { query = "", category = null, cuisine = null, diets = [], maxTime = null } =
        criteria;
    const q = query.trim().toLowerCase();

    return (articles || []).filter((a) => {
        if (category && a.category !== category) return false;
        if (cuisine && a.cuisine !== cuisine) return false;

        if (diets && diets.length) {
            const aDiet = a.diet || [];
            if (!diets.every((d) => aDiet.includes(d))) return false;
        }

        if (maxTime) {
            const t = totalMinutes(a);
            if (t === 0 || t > maxTime) return false;
        }

        if (q) {
            const haystack = [
                a.title,
                a.subtitle,
                a.category,
                a.cuisine,
                ...(a.tags || []),
                ...(a.ingredients || []).map((i) => i.name),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            if (!haystack.includes(q)) return false;
        }

        return true;
    });
};

// ---- Pantry matching ("what can I cook from what I have") ----

export interface PantryMatch<T> {
    recipe: T;
    have: string[];
    missing: string[];
    score: number; // fraction of the recipe's ingredients the user has
}

// Rank recipes by how many of their ingredients the user already has.
// Matching is a loose case-insensitive substring check (so "chicken" matches
// "chicken breast"). Recipes with no structured ingredients are skipped.
export const matchPantry = <T extends { ingredients?: QtyIngredient[] }>(
    recipes: T[] | null | undefined,
    owned: string[]
): PantryMatch<T>[] => {
    const terms = owned.map((o) => o.trim().toLowerCase()).filter(Boolean);
    if (!terms.length) return [];

    const results: PantryMatch<T>[] = [];
    for (const recipe of recipes || []) {
        const names = (recipe.ingredients || [])
            .map((i) => (i.name || "").toLowerCase())
            .filter(Boolean);
        if (!names.length) continue;

        const have: string[] = [];
        const missing: string[] = [];
        for (const name of names) {
            if (terms.some((t) => name.includes(t))) have.push(name);
            else missing.push(name);
        }
        if (have.length) {
            results.push({ recipe, have, missing, score: have.length / names.length });
        }
    }
    return results.sort((a, b) => b.score - a.score);
};

// ---- Ratings ----

// Average rating from a list of reviews -> { value, count }.
export const averageRating = (
    reviews?: { rating: number | string }[] | null
): Rating => {
    if (!reviews || !reviews.length) return { value: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return { value: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
};

// ---- SEO: schema.org/Recipe JSON-LD ----

// Build a schema.org/Recipe object suitable for a <script type="application/ld+json">.
// Only `name` and `image` are strictly required by Google; everything else is
// included when available. Undefined keys are stripped. An optional `rating`
// ({ value, count }) adds aggregateRating when count > 0.
export const buildRecipeJsonLd = (
    article?: RecipeContent | null,
    rating?: Rating
): Record<string, unknown> | null => {
    if (!article) return null;
    const total = totalMinutes(article);

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org/",
        "@type": "Recipe",
        name: article.title,
        image: article.imageUrl ? [article.imageUrl] : undefined,
        description: article.subtitle || undefined,
        author: article.publisher?.name
            ? { "@type": "Person", name: article.publisher.name }
            : undefined,
        datePublished: article.publishedDate || undefined,
        recipeCategory: article.category || undefined,
        recipeCuisine: article.cuisine || undefined,
        keywords: article.tags?.length ? article.tags.join(", ") : undefined,
        prepTime: minutesToISO(article.prepTime),
        cookTime: minutesToISO(article.cookTime),
        totalTime: minutesToISO(total),
        recipeYield: article.servings ? `${article.servings} servings` : undefined,
        recipeIngredient: article.ingredients?.length
            ? article.ingredients.map(ingredientToLine)
            : undefined,
        recipeInstructions: article.instructions?.length
            ? article.instructions.map((text, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  text,
              }))
            : undefined,
        nutrition: article.nutrition?.calories
            ? {
                  "@type": "NutritionInformation",
                  calories: `${article.nutrition.calories} calories`,
              }
            : undefined,
    };

    if (rating && rating.count > 0) {
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: rating.value,
            ratingCount: rating.count,
        };
    }

    // Strip undefined values for clean output.
    Object.keys(jsonLd).forEach((k) => {
        if (jsonLd[k] === undefined) delete jsonLd[k];
    });
    return jsonLd;
};

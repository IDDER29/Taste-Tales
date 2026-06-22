// src/utils/recipe.js
// Shared helpers + option lists for the structured recipe model.
// This is the single source of truth for recipe data shape, formatting,
// scaling, filtering, and schema.org/Recipe JSON-LD. Keep forms, the view,
// and discovery filters in sync via these exports.

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

/**
 * Structured recipe shape (additive — older "article" records may lack these):
 * {
 *   ingredients: [{ quantity: number|null, unit: string, name: string }],
 *   instructions: string[],          // ordered steps
 *   prepTime: number|null,           // minutes
 *   cookTime: number|null,           // minutes
 *   servings: number|null,
 *   cuisine: string,
 *   diet: string[],
 *   nutrition: { calories, protein, carbs, fat } | null,  // per serving
 *   content: string                  // optional HTML "story"/intro (legacy)
 * }
 */

// True when the record carries structured recipe data (vs. a legacy HTML-only post).
export const hasStructuredRecipe = (article) =>
    Boolean(
        (article?.ingredients && article.ingredients.length) ||
        (article?.instructions && article.instructions.length)
    );

// Total time in minutes (prep + cook).
export const totalMinutes = (article) =>
    (Number(article?.prepTime) || 0) + (Number(article?.cookTime) || 0);

// ---- Time formatting ----

// 65 -> "1 hr 5 min", 30 -> "30 min", 0/null -> ""
export const formatMinutes = (min) => {
    const m = Number(min) || 0;
    if (m <= 0) return "";
    const h = Math.floor(m / 60);
    const rem = m % 60;
    const parts = [];
    if (h) parts.push(`${h} hr`);
    if (rem) parts.push(`${rem} min`);
    return parts.join(" ");
};

// 65 -> "PT1H5M" (ISO 8601 duration, required by Google for recipe rich results)
export const minutesToISO = (min) => {
    const m = Number(min) || 0;
    if (m <= 0) return undefined;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return `PT${h ? `${h}H` : ""}${rem ? `${rem}M` : ""}`;
};

// ---- Quantity formatting & scaling ----

const FRACTIONS = [
    [1 / 8, "⅛"], [1 / 4, "¼"], [1 / 3, "⅓"], [3 / 8, "⅜"],
    [1 / 2, "½"], [5 / 8, "⅝"], [2 / 3, "⅔"], [3 / 4, "¾"], [7 / 8, "⅞"],
];

// 0.5 -> "½", 1.5 -> "1 ½", 2 -> "2", null -> ""
export const formatQuantity = (n) => {
    if (n == null || Number.isNaN(Number(n))) return "";
    const num = Number(n);
    const whole = Math.floor(num);
    const frac = num - whole;
    if (frac < 0.02) return String(whole);
    let best = null;
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
export const scaleIngredients = (ingredients, factor) =>
    (ingredients || []).map((ing) => ({
        ...ing,
        quantity:
            ing.quantity == null || Number.isNaN(Number(ing.quantity))
                ? ing.quantity
                : Math.round(Number(ing.quantity) * factor * 1000) / 1000,
    }));

// "{qty} {unit} {name}" with collapsed spaces, e.g. "1 ½ cups flour"
export const ingredientToLine = (ing) => {
    if (!ing) return "";
    const qty = formatQuantity(ing.quantity);
    return [qty, ing.unit, ing.name].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
};

// ---- Discovery: filtering ----

/**
 * Filter an article list by criteria.
 * @param {Array} articles
 * @param {{ query?: string, category?: string|null, cuisine?: string|null,
 *           diets?: string[], maxTime?: number|null }} criteria
 */
export const filterRecipes = (articles, criteria = {}) => {
    const { query = "", category = null, cuisine = null, diets = [], maxTime = null } = criteria;
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
                ...((a.ingredients || []).map((i) => i.name)),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            if (!haystack.includes(q)) return false;
        }

        return true;
    });
};

// ---- Ratings ----

// Average rating from a list of reviews -> { value, count }.
export const averageRating = (reviews) => {
    if (!reviews || !reviews.length) return { value: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return { value: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
};

// ---- SEO: schema.org/Recipe JSON-LD ----

// Build a schema.org/Recipe object suitable for a <script type="application/ld+json">.
// Only `name` and `image` are strictly required by Google; everything else is
// included when available. Undefined keys are stripped. An optional `rating`
// ({ value, count }) adds aggregateRating when count > 0.
export const buildRecipeJsonLd = (article, rating) => {
    if (!article) return null;
    const total = totalMinutes(article);

    const jsonLd = {
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
    Object.keys(jsonLd).forEach((k) => jsonLd[k] === undefined && delete jsonLd[k]);
    return jsonLd;
};

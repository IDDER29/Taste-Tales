import {
  formatMinutes,
  minutesToISO,
  formatQuantity,
  scaleIngredients,
  ingredientToLine,
  totalMinutes,
  hasStructuredRecipe,
  filterRecipes,
  buildRecipeJsonLd,
} from "./recipe";

describe("time formatting", () => {
  test("formatMinutes renders hours and minutes", () => {
    expect(formatMinutes(0)).toBe("");
    expect(formatMinutes(30)).toBe("30 min");
    expect(formatMinutes(60)).toBe("1 hr");
    expect(formatMinutes(65)).toBe("1 hr 5 min");
  });

  test("minutesToISO produces ISO 8601 durations", () => {
    expect(minutesToISO(0)).toBeUndefined();
    expect(minutesToISO(30)).toBe("PT30M");
    expect(minutesToISO(65)).toBe("PT1H5M");
    expect(minutesToISO(120)).toBe("PT2H");
  });

  test("totalMinutes sums prep and cook", () => {
    expect(totalMinutes({ prepTime: 15, cookTime: 45 })).toBe(60);
    expect(totalMinutes({})).toBe(0);
  });
});

describe("quantity formatting and scaling", () => {
  test("formatQuantity renders common fractions", () => {
    expect(formatQuantity(null)).toBe("");
    expect(formatQuantity(2)).toBe("2");
    expect(formatQuantity(0.5)).toBe("½");
    expect(formatQuantity(1.5)).toBe("1 ½");
    expect(formatQuantity(0.25)).toBe("¼");
  });

  test("scaleIngredients multiplies numeric quantities and preserves nulls", () => {
    const ingredients = [
      { quantity: 2, unit: "cup", name: "flour" },
      { quantity: null, unit: "", name: "Salt to taste" },
    ];
    const scaled = scaleIngredients(ingredients, 2);
    expect(scaled[0].quantity).toBe(4);
    expect(scaled[1].quantity).toBeNull();
  });

  test("ingredientToLine joins quantity, unit, and name", () => {
    expect(ingredientToLine({ quantity: 1.5, unit: "cups", name: "flour" })).toBe(
      "1 ½ cups flour"
    );
    expect(ingredientToLine({ quantity: null, unit: "", name: "Salt to taste" })).toBe(
      "Salt to taste"
    );
  });
});

describe("hasStructuredRecipe", () => {
  test("true when ingredients or instructions exist", () => {
    expect(hasStructuredRecipe({ ingredients: [{ name: "x" }] })).toBe(true);
    expect(hasStructuredRecipe({ instructions: ["step"] })).toBe(true);
  });
  test("false for legacy HTML-only posts", () => {
    expect(hasStructuredRecipe({ content: "<p>hi</p>" })).toBe(false);
    expect(hasStructuredRecipe({})).toBe(false);
  });
});

describe("filterRecipes", () => {
  const recipes = [
    {
      title: "Vegan Tacos",
      category: "Main Course",
      cuisine: "Mexican",
      diet: ["Vegan", "Vegetarian"],
      prepTime: 10,
      cookTime: 10,
      ingredients: [{ name: "black beans" }],
      tags: ["quick"],
    },
    {
      title: "Beef Stew",
      category: "Main Course",
      cuisine: "American",
      diet: [],
      prepTime: 30,
      cookTime: 120,
      ingredients: [{ name: "beef" }],
      tags: [],
    },
  ];

  test("text query matches title and ingredients", () => {
    expect(filterRecipes(recipes, { query: "tacos" })).toHaveLength(1);
    expect(filterRecipes(recipes, { query: "beans" })[0].title).toBe("Vegan Tacos");
  });

  test("diet filter is an AND match", () => {
    expect(filterRecipes(recipes, { diets: ["Vegan"] })).toHaveLength(1);
    expect(filterRecipes(recipes, { diets: ["Vegan", "Keto"] })).toHaveLength(0);
  });

  test("cuisine and maxTime filters apply", () => {
    expect(filterRecipes(recipes, { cuisine: "Mexican" })).toHaveLength(1);
    expect(filterRecipes(recipes, { maxTime: 30 })).toHaveLength(1); // only the 20-min recipe
  });

  test("no criteria returns all", () => {
    expect(filterRecipes(recipes, {})).toHaveLength(2);
  });
});

describe("buildRecipeJsonLd", () => {
  const article = {
    title: "Test Recipe",
    subtitle: "A test",
    imageUrl: "https://example.com/img.jpg",
    publisher: { name: "Chef" },
    category: "Dessert",
    cuisine: "French",
    prepTime: 15,
    cookTime: 13,
    servings: 4,
    nutrition: { calories: 480 },
    ingredients: [{ quantity: 4, unit: "oz", name: "chocolate" }],
    instructions: ["Melt chocolate", "Bake"],
    tags: ["chocolate"],
  };

  test("produces a valid schema.org Recipe object", () => {
    const ld = buildRecipeJsonLd(article);
    expect(ld["@type"]).toBe("Recipe");
    expect(ld.name).toBe("Test Recipe");
    expect(ld.image).toEqual(["https://example.com/img.jpg"]);
    expect(ld.totalTime).toBe("PT28M");
    expect(ld.recipeYield).toBe("4 servings");
    expect(ld.recipeIngredient).toEqual(["4 oz chocolate"]);
    expect(ld.recipeInstructions).toHaveLength(2);
    expect(ld.recipeInstructions[0]).toMatchObject({
      "@type": "HowToStep",
      position: 1,
      text: "Melt chocolate",
    });
    expect(ld.nutrition.calories).toBe("480 calories");
  });

  test("omits undefined fields and requires only name/image at minimum", () => {
    const ld = buildRecipeJsonLd({ title: "Bare", imageUrl: "x" });
    expect(ld.name).toBe("Bare");
    expect("recipeIngredient" in ld).toBe(false);
    expect("cookTime" in ld).toBe(false);
  });
});

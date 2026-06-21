import React from "react";
import { CUISINE_OPTIONS, DIET_OPTIONS, UNIT_OPTIONS } from "../utils/recipe";

// Controlled, reusable structured-recipe fields shared by AddArticle/EditArticle.
// `value` is { ingredients, instructions, prepTime, cookTime, servings,
// cuisine, diet, nutrition }; `onChange` receives the full updated object.
const RecipeFormFields = ({ value, onChange }) => {
  const recipe = value;

  const update = (patch) => onChange({ ...recipe, ...patch });

  // ---- Ingredients ----
  const handleIngredientChange = (index, field, fieldValue) => {
    const ingredients = recipe.ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: fieldValue } : ing
    );
    update({ ingredients });
  };

  const addIngredient = () => {
    update({
      ingredients: [
        ...recipe.ingredients,
        { quantity: "", unit: "", name: "" },
      ],
    });
  };

  const removeIngredient = (index) => {
    update({
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  };

  // ---- Instructions ----
  const handleInstructionChange = (index, fieldValue) => {
    const instructions = recipe.instructions.map((step, i) =>
      i === index ? fieldValue : step
    );
    update({ instructions });
  };

  const addInstruction = () => {
    update({ instructions: [...recipe.instructions, ""] });
  };

  const removeInstruction = (index) => {
    update({
      instructions: recipe.instructions.filter((_, i) => i !== index),
    });
  };

  // ---- Diet (multi toggle) ----
  const toggleDiet = (diet) => {
    const has = recipe.diet.includes(diet);
    update({
      diet: has
        ? recipe.diet.filter((d) => d !== diet)
        : [...recipe.diet, diet],
    });
  };

  // ---- Nutrition ----
  const handleNutritionChange = (field, fieldValue) => {
    update({ nutrition: { ...recipe.nutrition, [field]: fieldValue } });
  };

  return (
    <div className="space-y-10">
      {/* Times & servings */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Prep time (min)
            </label>
            <input
              type="number"
              min="0"
              value={recipe.prepTime ?? ""}
              onChange={(e) => update({ prepTime: e.target.value })}
              className="w-full border rounded p-3 focus:outline-none"
              placeholder="e.g. 15"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Cook time (min)
            </label>
            <input
              type="number"
              min="0"
              value={recipe.cookTime ?? ""}
              onChange={(e) => update({ cookTime: e.target.value })}
              className="w-full border rounded p-3 focus:outline-none"
              placeholder="e.g. 30"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Servings
            </label>
            <input
              type="number"
              min="0"
              value={recipe.servings ?? ""}
              onChange={(e) => update({ servings: e.target.value })}
              className="w-full border rounded p-3 focus:outline-none"
              placeholder="e.g. 4"
            />
          </div>
        </div>
      </div>

      {/* Cuisine */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Cuisine
        </label>
        <select
          value={recipe.cuisine || ""}
          onChange={(e) => update({ cuisine: e.target.value })}
          className="w-full border rounded p-3 focus:outline-none"
        >
          <option value="">Select a cuisine...</option>
          {CUISINE_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Diet */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Diet
        </label>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((diet) => {
            const active = recipe.diet.includes(diet);
            return (
              <button
                key={diet}
                type="button"
                onClick={() => toggleDiet(diet)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {diet}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Ingredients
        </label>
        <div className="space-y-3">
          {recipe.ingredients.map((ing, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={ing.quantity ?? ""}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                className="w-20 border rounded p-2 focus:outline-none"
                placeholder="Qty"
              />
              <select
                value={ing.unit || ""}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                className="w-28 border rounded p-2 focus:outline-none"
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit === "" ? "—" : unit}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                className="flex-1 border rounded p-2 focus:outline-none"
                placeholder="Ingredient name"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-gray-400 hover:text-red-500 text-xl px-2"
                aria-label="Remove ingredient"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-3 text-indigo-600 font-medium hover:underline"
        >
          + Add ingredient
        </button>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Instructions
        </label>
        <div className="space-y-3">
          {recipe.instructions.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="mt-2 w-16 shrink-0 text-sm font-medium text-gray-600">
                Step {index + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="flex-1 border rounded p-2 focus:outline-none"
                rows={2}
                placeholder="Describe this step..."
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="mt-1 text-gray-400 hover:text-red-500 text-xl px-2"
                aria-label="Remove step"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addInstruction}
          className="mt-3 text-indigo-600 font-medium hover:underline"
        >
          + Add step
        </button>
      </div>

      {/* Nutrition */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Nutrition (per serving, optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Calories</label>
            <input
              type="number"
              min="0"
              value={recipe.nutrition?.calories ?? ""}
              onChange={(e) =>
                handleNutritionChange("calories", e.target.value)
              }
              className="w-full border rounded p-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              min="0"
              value={recipe.nutrition?.protein ?? ""}
              onChange={(e) => handleNutritionChange("protein", e.target.value)}
              className="w-full border rounded p-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Carbs (g)</label>
            <input
              type="number"
              min="0"
              value={recipe.nutrition?.carbs ?? ""}
              onChange={(e) => handleNutritionChange("carbs", e.target.value)}
              className="w-full border rounded p-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Fat (g)</label>
            <input
              type="number"
              min="0"
              value={recipe.nutrition?.fat ?? ""}
              onChange={(e) => handleNutritionChange("fat", e.target.value)}
              className="w-full border rounded p-2 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeFormFields;

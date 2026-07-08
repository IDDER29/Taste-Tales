"use client";

import React from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CUISINE_OPTIONS, DIET_OPTIONS, UNIT_OPTIONS } from "../utils/recipe";
import { cn } from "../utils/cn";
import type { Ingredient, RecipeFormValue } from "../types";

interface RecipeFormFieldsProps {
  value: RecipeFormValue;
  onChange: (next: RecipeFormValue) => void;
}

const inputBase =
  "w-full rounded-xl border border-sand-300 bg-white px-3.5 py-2.5 text-sand-950 placeholder:text-sand-400 transition-shadow focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15";
const labelBase = "mb-1.5 block text-sm font-semibold text-sand-800";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sand-200/70 bg-white p-6 shadow-soft">
      <h3 className="font-display text-lg font-semibold text-sand-950">{title}</h3>
      {description && <p className="mt-1 text-sm text-sand-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

// Controlled, reusable structured-recipe fields shared by AddArticle/EditArticle.
const RecipeFormFields = ({ value, onChange }: RecipeFormFieldsProps) => {
  const recipe = value;

  const update = (patch: Partial<RecipeFormValue>) =>
    onChange({ ...recipe, ...patch });

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    fieldValue: string
  ) => {
    const ingredients = recipe.ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: fieldValue } : ing
    ) as Ingredient[];
    update({ ingredients });
  };

  const addIngredient = () => {
    update({
      ingredients: [
        ...recipe.ingredients,
        { quantity: "", unit: "", name: "" } as unknown as Ingredient,
      ],
    });
  };

  const removeIngredient = (index: number) => {
    update({ ingredients: recipe.ingredients.filter((_, i) => i !== index) });
  };

  const handleInstructionChange = (index: number, fieldValue: string) => {
    const instructions = recipe.instructions.map((step, i) =>
      i === index ? fieldValue : step
    );
    update({ instructions });
  };

  const addInstruction = () => {
    update({ instructions: [...recipe.instructions, ""] });
  };

  const removeInstruction = (index: number) => {
    update({ instructions: recipe.instructions.filter((_, i) => i !== index) });
  };

  const toggleDiet = (diet: string) => {
    const has = recipe.diet.includes(diet);
    update({
      diet: has ? recipe.diet.filter((d) => d !== diet) : [...recipe.diet, diet],
    });
  };

  const handleNutritionChange = (
    field: keyof RecipeFormValue["nutrition"],
    fieldValue: string
  ) => {
    update({ nutrition: { ...recipe.nutrition, [field]: fieldValue } });
  };

  const addButton =
    "inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-300 px-4 py-2 text-sm font-semibold text-brand-600 transition-colors hover:border-brand-400 hover:bg-brand-50";

  return (
    <div className="space-y-6">
      {/* Times, servings & cuisine */}
      <Section title="Time & yield">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className={labelBase}>Prep (min)</label>
            <input
              type="number"
              min="0"
              value={recipe.prepTime ?? ""}
              onChange={(e) => update({ prepTime: e.target.value })}
              className={inputBase}
              placeholder="15"
            />
          </div>
          <div>
            <label className={labelBase}>Cook (min)</label>
            <input
              type="number"
              min="0"
              value={recipe.cookTime ?? ""}
              onChange={(e) => update({ cookTime: e.target.value })}
              className={inputBase}
              placeholder="30"
            />
          </div>
          <div>
            <label className={labelBase}>Servings</label>
            <input
              type="number"
              min="0"
              value={recipe.servings ?? ""}
              onChange={(e) => update({ servings: e.target.value })}
              className={inputBase}
              placeholder="4"
            />
          </div>
          <div>
            <label className={labelBase}>Cuisine</label>
            <select
              value={recipe.cuisine || ""}
              onChange={(e) => update({ cuisine: e.target.value })}
              className={inputBase}
            >
              <option value="">Select…</option>
              {CUISINE_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className={labelBase}>Diet</label>
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map((diet) => {
              const active = recipe.diet.includes(diet);
              return (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleDiet(diet)}
                  className={cn("chip", active && "chip-active")}
                >
                  {diet}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Ingredients */}
      <Section title="Ingredients" description="Add each ingredient with an optional quantity and unit.">
        <div className="space-y-2.5">
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
                className={cn(inputBase, "w-20 flex-none px-2.5")}
                placeholder="Qty"
              />
              <select
                value={ing.unit || ""}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                className={cn(inputBase, "w-28 flex-none px-2.5")}
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
                className={cn(inputBase, "flex-1")}
                placeholder="Ingredient name"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-sand-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                aria-label="Remove ingredient"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addIngredient} className={cn(addButton, "mt-4")}>
          <PlusIcon className="h-4 w-4" />
          Add ingredient
        </button>
      </Section>

      {/* Instructions */}
      <Section title="Instructions" description="Break the method into clear, numbered steps.">
        <div className="space-y-3">
          {recipe.instructions.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="mt-1.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className={cn(inputBase, "flex-1")}
                rows={2}
                placeholder="Describe this step…"
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-full text-sand-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                aria-label="Remove step"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addInstruction} className={cn(addButton, "mt-4")}>
          <PlusIcon className="h-4 w-4" />
          Add step
        </button>
      </Section>

      {/* Nutrition */}
      <Section title="Nutrition" description="Per serving — optional.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { key: "calories" as const, label: "Calories" },
            { key: "protein" as const, label: "Protein (g)" },
            { key: "carbs" as const, label: "Carbs (g)" },
            { key: "fat" as const, label: "Fat (g)" },
          ].map((n) => (
            <div key={n.key}>
              <label className={cn(labelBase, "text-xs font-medium text-sand-600")}>
                {n.label}
              </label>
              <input
                type="number"
                min="0"
                value={recipe.nutrition?.[n.key] ?? ""}
                onChange={(e) => handleNutritionChange(n.key, e.target.value)}
                className={inputBase}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default RecipeFormFields;

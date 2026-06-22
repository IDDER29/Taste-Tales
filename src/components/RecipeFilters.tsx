import React from "react";
import { CUISINE_OPTIONS, DIET_OPTIONS } from "../utils/recipe";
import type { FilterCriteria } from "../types";

interface RecipeFiltersProps {
  value: FilterCriteria;
  onChange: (next: FilterCriteria) => void;
}

interface TimeOption {
  label: string;
  value: number | null;
}

const TIME_OPTIONS: TimeOption[] = [
  { label: "Any time", value: null },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
];

const EMPTY_FILTERS: FilterCriteria = {
  query: "",
  cuisine: "",
  diets: [],
  maxTime: null,
};

const RecipeFilters = ({ value, onChange }: RecipeFiltersProps) => {
  const filters = { ...EMPTY_FILTERS, ...value } as Required<FilterCriteria>;

  const update = (patch: Partial<FilterCriteria>) =>
    onChange({ ...filters, ...patch });

  const toggleDiet = (diet: string) => {
    const diets = filters.diets.includes(diet)
      ? filters.diets.filter((d) => d !== diet)
      : [...filters.diets, diet];
    update({ diets });
  };

  const clearFilters = () => onChange({ ...EMPTY_FILTERS });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search recipes, ingredients..."
            value={filters.query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              update({ query: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>

        <div className="min-w-[160px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cuisine
          </label>
          <select
            value={filters.cuisine ?? ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              update({ cuisine: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-lg w-full"
          >
            <option value="">All</option>
            {CUISINE_OPTIONS.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[160px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Max total time
          </label>
          <select
            value={filters.maxTime == null ? "" : String(filters.maxTime)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              update({
                maxTime: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="p-2 border border-gray-300 rounded-lg w-full"
          >
            {TIME_OPTIONS.map((opt) => (
              <option
                key={opt.label}
                value={opt.value == null ? "" : String(opt.value)}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="p-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-4">
        <span className="block text-sm font-semibold text-gray-700 mb-2">
          Diet
        </span>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((diet) => {
            const active = filters.diets.includes(diet);
            return (
              <button
                key={diet}
                type="button"
                onClick={() => toggleDiet(diet)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  active
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {diet}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecipeFilters;

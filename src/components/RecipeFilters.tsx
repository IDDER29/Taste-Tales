"use client";

import React from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CUISINE_OPTIONS, DIET_OPTIONS } from "../utils/recipe";
import { cn } from "../utils/cn";
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

const selectClass =
  "h-11 rounded-xl border border-sand-300 bg-white px-3.5 text-sm font-medium text-sand-800 transition-shadow focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15";

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

  const activeCount =
    (filters.query ? 1 : 0) +
    (filters.cuisine ? 1 : 0) +
    (filters.maxTime != null ? 1 : 0) +
    filters.diets.length;

  return (
    <div className="rounded-3xl border border-sand-200/70 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-sand-400" />
          <input
            type="text"
            placeholder="Search recipes, ingredients…"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            className="h-11 w-full rounded-xl border border-sand-300 bg-white pl-11 pr-3 text-sm text-sand-950 placeholder:text-sand-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters.cuisine ?? ""}
            onChange={(e) => update({ cuisine: e.target.value })}
            className={selectClass}
            aria-label="Cuisine"
          >
            <option value="">All cuisines</option>
            {CUISINE_OPTIONS.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>

          <select
            value={filters.maxTime == null ? "" : String(filters.maxTime)}
            onChange={(e) =>
              update({
                maxTime: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className={selectClass}
            aria-label="Max total time"
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

          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-sand-600 transition-colors hover:bg-sand-100 hover:text-sand-900"
            >
              <XMarkIcon className="h-4 w-4" />
              Clear ({activeCount})
            </button>
          )}
        </div>
      </div>

      {/* Diet chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand-100 pt-4">
        <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-medium text-sand-500">
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          Diet
        </span>
        {DIET_OPTIONS.map((diet) => {
          const active = filters.diets.includes(diet);
          return (
            <button
              key={diet}
              type="button"
              onClick={() => toggleDiet(diet)}
              aria-pressed={active}
              className={cn("chip", active && "chip-active")}
            >
              {diet}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeFilters;

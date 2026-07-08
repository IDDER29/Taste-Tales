"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaClock,
  FaUtensils,
  FaUsers,
  FaMinus,
  FaPlus,
  FaPrint,
  FaLightbulb,
} from "react-icons/fa";
import {
  totalMinutes,
  formatMinutes,
  scaleIngredients,
  ingredientToLine,
} from "../utils/recipe";
import { cn } from "../utils/cn";
import type { Article } from "../types";

interface RecipeDetailsProps {
  article: Article;
}

// Minimal Wake Lock API typings: the DOM lib shipped with this TS version does
// not yet include them, so declare the small surface this component uses.
interface WakeLockSentinel extends EventTarget {
  release: () => Promise<void>;
}
interface WakeLock {
  request: (type: "screen") => Promise<WakeLockSentinel>;
}

const wakeLockSupported =
  typeof navigator !== "undefined" && "wakeLock" in navigator;

// Access the experimental property without widening the global Navigator type.
const wakeLockApi =
  typeof navigator !== "undefined"
    ? (navigator as Navigator & { wakeLock?: WakeLock }).wakeLock
    : undefined;

const RecipeDetails = ({ article }: RecipeDetailsProps) => {
  const originalServings = Number(article?.servings) || 1;

  const [servings, setServings] = useState<number>(originalServings);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [cookMode, setCookMode] = useState<boolean>(false);

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch (e) {
        // ignore
      }
      wakeLockRef.current = null;
    }
  }, []);

  const acquireWakeLock = useCallback(async () => {
    if (!wakeLockSupported || !wakeLockApi) return;
    try {
      wakeLockRef.current = await wakeLockApi.request("screen");
      wakeLockRef.current.addEventListener("release", () => {
        wakeLockRef.current = null;
      });
    } catch (e) {
      // request can fail (e.g. low battery, tab not visible) — fail silently
      wakeLockRef.current = null;
    }
  }, []);

  // Acquire/release the wake lock when cook mode toggles.
  useEffect(() => {
    if (cookMode) {
      acquireWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [cookMode, acquireWakeLock, releaseWakeLock]);

  // Re-acquire the lock when the tab becomes visible again (locks drop on hide).
  useEffect(() => {
    if (!wakeLockSupported) return undefined;
    const handleVisibility = () => {
      if (cookMode && document.visibilityState === "visible" && !wakeLockRef.current) {
        acquireWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [cookMode, acquireWakeLock]);

  // Clean up on unmount.
  useEffect(
    () => () => {
      releaseWakeLock();
    },
    [releaseWakeLock]
  );

  const factor = servings / originalServings;
  const scaled = scaleIngredients(article?.ingredients || [], factor);

  const total = totalMinutes(article);
  const prepLabel = formatMinutes(article?.prepTime);
  const cookLabel = formatMinutes(article?.cookTime);
  const totalLabel = formatMinutes(total);

  const decrement = () => setServings((s) => Math.max(1, s - 1));
  const increment = () => setServings((s) => s + 1);
  const setMultiplier = (mult: number) =>
    setServings(Math.max(1, Math.round(originalServings * mult)));

  const toggleChecked = (idx: number) =>
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const nutrition = article?.nutrition;

  const metaItems = [
    { show: !!prepLabel, icon: FaClock, label: "Prep", value: prepLabel },
    { show: !!cookLabel, icon: FaUtensils, label: "Cook", value: cookLabel },
    { show: !!totalLabel, icon: FaClock, label: "Total", value: totalLabel },
    { show: true, icon: FaUsers, label: "Serves", value: String(servings) },
  ].filter((m) => m.show);

  return (
    <section className="mt-8 space-y-6">
      {/* Meta row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metaItems.map((m) => (
          <div
            key={m.label}
            className="flex flex-col items-center gap-1 rounded-2xl border border-sand-200/70 bg-sand-50/60 py-4"
          >
            <m.icon className="mb-1 h-5 w-5 text-brand-500" />
            <span className="text-xs uppercase tracking-wide text-sand-500">
              {m.label}
            </span>
            <span className="font-semibold text-sand-900">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 print:hidden">
        {wakeLockSupported && (
          <button
            onClick={() => setCookMode((c) => !c)}
            aria-pressed={cookMode}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-4",
              cookMode
                ? "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500/30"
                : "border border-sand-300 text-sand-800 hover:bg-sand-50 focus-visible:ring-sand-400/30"
            )}
          >
            <FaLightbulb className="h-4 w-4" />
            {cookMode ? "Cook mode: on" : "Cook mode"}
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-sand-300 px-4 py-2.5 text-sm font-semibold text-sand-800 transition-colors hover:bg-sand-50"
        >
          <FaPrint className="h-4 w-4" />
          Print
        </button>
      </div>

      {/* Serving scaler */}
      <div className="rounded-2xl border border-sand-200/70 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-sand-950">
              Adjust servings
            </h3>
            <p className="text-sm text-sand-500">Ingredients scale automatically.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              disabled={servings <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-sand-300 text-sand-700 transition-colors hover:bg-sand-100 disabled:opacity-40"
              aria-label="Decrease servings"
            >
              <FaMinus className="h-3 w-3" />
            </button>
            <span className="w-10 text-center font-display text-2xl font-bold text-sand-950">
              {servings}
            </span>
            <button
              onClick={increment}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700"
              aria-label="Increase servings"
            >
              <FaPlus className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {[1, 2, 3].map((mult) => {
            const active =
              servings === Math.max(1, Math.round(originalServings * mult));
            return (
              <button
                key={mult}
                onClick={() => setMultiplier(mult)}
                className={cn("chip", active && "chip-active")}
              >
                {mult}×
              </button>
            );
          })}
        </div>
      </div>

      {/* Ingredients checklist */}
      {scaled.length > 0 && (
        <div className="rounded-2xl border border-sand-200/70 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-sand-950">
              Ingredients
            </h3>
            <span className="text-sm text-sand-500">
              {checkedCount}/{scaled.length}
            </span>
          </div>
          <ul className="space-y-1">
            {scaled.map((ing, idx) => (
              <li key={idx}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-sand-50",
                    checked[idx] && "opacity-60"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checked[idx])}
                    onChange={() => toggleChecked(idx)}
                    className="h-5 w-5 rounded-md border-sand-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span
                    className={cn(
                      "text-sand-800",
                      checked[idx] && "text-sand-400 line-through"
                    )}
                  >
                    {ingredientToLine(ing)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {article?.instructions && article.instructions.length > 0 && (
        <div className="rounded-2xl border border-sand-200/70 bg-white p-6 shadow-soft">
          <h3 className="mb-6 font-display text-lg font-semibold text-sand-950">
            Instructions
          </h3>
          <ol className="space-y-6">
            {article.instructions.map((step: string, idx: number) => (
              <li key={idx} className="relative flex gap-4">
                {idx < article.instructions!.length - 1 && (
                  <span
                    className="absolute left-[15px] top-9 h-[calc(100%+0.5rem)] w-px bg-sand-200"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {idx + 1}
                </span>
                <p className="pt-1 leading-relaxed text-sand-800">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Nutrition */}
      {nutrition?.calories && (
        <div className="rounded-2xl border border-sand-200/70 bg-white p-6 shadow-soft">
          <h3 className="font-display text-lg font-semibold text-sand-950">
            Nutrition
          </h3>
          <p className="mb-4 text-sm text-sand-500">Per serving</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Calories", value: nutrition.calories, unit: "" },
              { label: "Protein", value: nutrition.protein, unit: "g" },
              { label: "Carbs", value: nutrition.carbs, unit: "g" },
              { label: "Fat", value: nutrition.fat, unit: "g" },
            ]
              .filter((n) => n.value != null)
              .map((n) => (
                <div
                  key={n.label}
                  className="rounded-2xl bg-gradient-to-br from-sand-50 to-brand-50/40 py-4 text-center"
                >
                  <span className="block font-display text-2xl font-bold text-sand-950">
                    {n.value}
                    {n.unit}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-sand-500">
                    {n.label}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipeDetails;

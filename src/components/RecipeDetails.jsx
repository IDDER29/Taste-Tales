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

const wakeLockSupported =
  typeof navigator !== "undefined" && "wakeLock" in navigator;

const RecipeDetails = ({ article }) => {
  const originalServings = Number(article?.servings) || 1;

  const [servings, setServings] = useState(originalServings);
  const [checked, setChecked] = useState({});
  const [cookMode, setCookMode] = useState(false);

  const wakeLockRef = useRef(null);

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
    if (!wakeLockSupported) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
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
  useEffect(() => () => {
    releaseWakeLock();
  }, [releaseWakeLock]);

  const factor = servings / originalServings;
  const scaled = scaleIngredients(article?.ingredients || [], factor);

  const total = totalMinutes(article);
  const prepLabel = formatMinutes(article?.prepTime);
  const cookLabel = formatMinutes(article?.cookTime);
  const totalLabel = formatMinutes(total);

  const decrement = () => setServings((s) => Math.max(1, s - 1));
  const increment = () => setServings((s) => s + 1);
  const setMultiplier = (mult) =>
    setServings(Math.max(1, Math.round(originalServings * mult)));

  const toggleChecked = (idx) =>
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const nutrition = article?.nutrition;

  return (
    <section className="mb-8 space-y-6">
      {/* Meta row */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-6 justify-around text-center">
        {prepLabel && (
          <div className="flex flex-col items-center">
            <FaClock className="w-5 h-5 text-red-500 mb-1" />
            <span className="text-xs uppercase tracking-wide text-gray-500">
              Prep
            </span>
            <span className="font-semibold text-gray-800">{prepLabel}</span>
          </div>
        )}
        {cookLabel && (
          <div className="flex flex-col items-center">
            <FaUtensils className="w-5 h-5 text-red-500 mb-1" />
            <span className="text-xs uppercase tracking-wide text-gray-500">
              Cook
            </span>
            <span className="font-semibold text-gray-800">{cookLabel}</span>
          </div>
        )}
        {totalLabel && (
          <div className="flex flex-col items-center">
            <FaClock className="w-5 h-5 text-green-500 mb-1" />
            <span className="text-xs uppercase tracking-wide text-gray-500">
              Total
            </span>
            <span className="font-semibold text-gray-800">{totalLabel}</span>
          </div>
        )}
        <div className="flex flex-col items-center">
          <FaUsers className="w-5 h-5 text-green-500 mb-1" />
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Servings
          </span>
          <span className="font-semibold text-gray-800">{servings}</span>
        </div>
      </div>

      {/* Actions: cook mode + print */}
      <div className="flex flex-wrap gap-3 print:hidden">
        {wakeLockSupported && (
          <button
            onClick={() => setCookMode((c) => !c)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
              cookMode
                ? "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400"
            }`}
            aria-pressed={cookMode}
          >
            <FaLightbulb className="w-4 h-4" />
            <span>{cookMode ? "Cook Mode: On" : "Cook Mode"}</span>
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-4 py-2 rounded-md shadow-md bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          <FaPrint className="w-4 h-4" />
          <span>Print</span>
        </button>
      </div>

      {/* Serving scaler */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Adjust Servings</h3>
            <p className="text-sm text-gray-500">
              Ingredients scale automatically.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={decrement}
              disabled={servings <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Decrease servings"
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <span className="text-2xl font-bold text-gray-900 w-10 text-center">
              {servings}
            </span>
            <button
              onClick={increment}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Increase servings"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {[1, 2, 3].map((mult) => (
            <button
              key={mult}
              onClick={() => setMultiplier(mult)}
              className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
                servings === Math.max(1, Math.round(originalServings * mult))
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {mult}x
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients checklist */}
      {scaled.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ingredients</h3>
          <ul className="space-y-2">
            {scaled.map((ing, idx) => (
              <li key={idx}>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={Boolean(checked[idx])}
                    onChange={() => toggleChecked(idx)}
                    className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-400"
                  />
                  <span
                    className={`text-gray-800 ${
                      checked[idx] ? "line-through text-gray-400" : ""
                    }`}
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
      {article?.instructions?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Instructions</h3>
          <ol className="space-y-4">
            {article.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-sm">
                  {idx + 1}
                </span>
                <p className="text-gray-800 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Nutrition */}
      {nutrition?.calories && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Nutrition</h3>
          <p className="text-sm text-gray-500 mb-4">Per serving</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-md py-3">
              <span className="block text-2xl font-bold text-gray-900">
                {nutrition.calories}
              </span>
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Calories
              </span>
            </div>
            {nutrition.protein != null && (
              <div className="bg-gray-50 rounded-md py-3">
                <span className="block text-2xl font-bold text-gray-900">
                  {nutrition.protein}g
                </span>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  Protein
                </span>
              </div>
            )}
            {nutrition.carbs != null && (
              <div className="bg-gray-50 rounded-md py-3">
                <span className="block text-2xl font-bold text-gray-900">
                  {nutrition.carbs}g
                </span>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  Carbs
                </span>
              </div>
            )}
            {nutrition.fat != null && (
              <div className="bg-gray-50 rounded-md py-3">
                <span className="block text-2xl font-bold text-gray-900">
                  {nutrition.fat}g
                </span>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  Fat
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipeDetails;

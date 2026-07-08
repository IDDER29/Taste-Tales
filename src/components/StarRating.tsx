"use client";

import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  value: number;
  onChange?: (n: number) => void;
  size?: string;
}

// Reusable 5-star widget.
// - Read-only when no `onChange` is provided (just displays `value`).
// - Interactive when `onChange` is provided: clicking star N calls onChange(N),
//   with a hover preview and keyboard-focusable buttons.
function StarRating({ value = 0, onChange, size = "text-xl" }: StarRatingProps) {
  const [hover, setHover] = useState<number>(0);
  const interactive = typeof onChange === "function";

  // For display, the active count is the hovered value (when interacting) or
  // the rounded `value`.
  const active = hover || Math.round(Number(value) || 0);

  if (!interactive) {
    return (
      <span className={`inline-flex items-center text-accent-400 ${size}`}>
        {[1, 2, 3, 4, 5].map((n) =>
          n <= active ? <FaStar key={n} /> : <FaRegStar key={n} />
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center text-accent-400 ${size}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="cursor-pointer p-0.5 leading-none focus:outline-none focus:ring-2 focus:ring-accent-400 rounded"
          aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange!(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
        >
          {n <= active ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </span>
  );
}

export default StarRating;

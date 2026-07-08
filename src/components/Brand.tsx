import Link from "next/link";
import { cn } from "../utils/cn";

interface BrandProps {
  className?: string;
  /** Render the wordmark in white (for dark/colored backgrounds). */
  inverted?: boolean;
  href?: string;
}

/**
 * Taste-Tales wordmark: a hand-crafted mark (a stylized fork + leaf) next to the
 * name set in the display serif. Used in the NavBar and Footer so the brand
 * reads consistently everywhere.
 */
export default function Brand({ className, inverted, href = "/" }: BrandProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30",
        className
      )}
      aria-label="Taste-Tales home"
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow transition-transform duration-300 group-hover:-rotate-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          {/* fork */}
          <path
            d="M7 3v5a2 2 0 0 0 2 2v0m0 0V3m0 7v11M5 3v5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* spoon */}
          <path
            d="M16 3c-1.7 0-3 1.8-3 4s1.3 4 3 4 3-1.8 3-4-1.3-4-3-4Zm0 8v10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            inverted ? "text-white" : "text-sand-950"
          )}
        >
          Taste&nbsp;Tales
        </span>
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.2em]",
            inverted ? "text-white/70" : "text-brand-600"
          )}
        >
          Every flavor, a story
        </span>
      </span>
    </Link>
  );
}

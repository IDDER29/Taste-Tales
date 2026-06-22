import { cn } from "../../utils/cn";

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

const initials = (name?: string | null) =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";

// Circular avatar; falls back to initials when no image is available.
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const base = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
    sizes[size],
    className
  );
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name || ""} className={cn(base, "object-cover")} />;
  }
  return (
    <span
      className={cn(base, "bg-brand-100 font-semibold text-brand-700")}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

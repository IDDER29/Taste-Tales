import Image, { type ImageProps } from "next/image";
import { cn } from "../../utils/cn";

export interface AppImageProps extends Omit<ImageProps, "fill"> {
  // Aspect-ratio utility for the wrapper (reserves space -> no layout shift).
  ratio?: string;
  wrapperClassName?: string;
  alt: string;
}

// Image wrapper that reserves space via an aspect-ratio box (kills CLS) and
// requires alt text. Uses next/image with `fill`. Optimization is toggled
// globally in next.config (currently unoptimized so arbitrary remote hosts work;
// flip on once images are normalized to Cloudinary).
export function AppImage({
  ratio = "aspect-[4/3]",
  wrapperClassName,
  className,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: AppImageProps) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden bg-gray-100",
        ratio,
        wrapperClassName
      )}
    >
      <Image
        fill
        sizes={sizes}
        alt={alt}
        className={cn("object-cover", className)}
        {...props}
      />
    </span>
  );
}

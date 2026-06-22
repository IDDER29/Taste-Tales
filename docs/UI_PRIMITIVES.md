# UI Primitives (`src/components/ui`)

The shared design-system layer (Phase 0). Import from the barrel:

```ts
import { Button, Card, CardBody, Field, Input, useToast } from "@/src/components/ui";
```

## Design tokens
Defined in `tailwind.config.js` → `theme.extend`:
- **`brand-*`** — the accent scale (red). Use `bg-brand-500`, `text-brand-600`, etc.
  Re-theme the whole UI by editing this one scale.
- **`primary-*`** — existing blue scale, retained.
- Animations: `animate-fade-in`, `animate-scale-in`, `animate-slide-in-right`.
- `cn(...)` (`src/utils/cn.ts`) merges classes and resolves Tailwind conflicts.

## Primitives
| Component | Notes |
|---|---|
| `Button` | variants: primary/secondary/outline/ghost/danger; sizes sm/md/lg/icon; `loading`, `block`. |
| `Badge` | variants: brand/neutral/success/warning/danger/outline; sizes sm/md. |
| `Card` / `CardBody` | surface; `interactive` adds hover elevation. |
| `Input` / `Textarea` / `Select` | form controls; `invalid` for error styling. |
| `Field` | label + control + hint/error wrapper with a11y associations. |
| `Avatar` | image or initials fallback; sizes sm/md/lg. |
| `Spinner` / `Skeleton` | loading primitives. |
| `Rating` | re-export of the star widget (display or interactive). |
| `Tabs` | controlled, accessible tablist (render panels yourself). |
| `Modal` | Headless UI dialog with title/description/footer + transitions. |
| `AppImage` | `next/image` in an aspect-ratio box (no CLS); requires `alt`. |

## State sets
Use the same four states on every data surface:
- `LoadingState` — spinner + label (use `Skeleton` for content grids).
- `EmptyState` — icon/title/description/action.
- `ErrorState` — message + optional `onRetry`.
- `AsyncBoundary` — wraps a region and renders loading/error/empty/success in one place.

```tsx
<AsyncBoundary
  isLoading={isLoading}
  isError={isError}
  isEmpty={items.length === 0}
  onRetry={refetch}
  loadingFallback={<RecipeGridSkeleton />}
  emptyFallback={<EmptyState title="No recipes yet" />}
>
  <RecipeGrid items={items} />
</AsyncBoundary>
```

## Toast & confirm
`UIProvider` (mounted in `app/providers.tsx`) hosts both. From any client component:

```tsx
const { toast } = useToast();
toast({ title: "Saved to Recipe Box", variant: "success" });

const confirm = useConfirm();
if (await confirm({ title: "Delete recipe?", danger: true, confirmLabel: "Delete" })) {
  // proceed
}
```

## Migration note (F0.5)
`AppImage` exists and `next/image` is enabled (`images.unoptimized: true` so arbitrary
remote hosts work today). Migrating existing `<img>` tags across views to `AppImage` is
intentionally deferred to a pass with visual QA, and re-enabling Next image optimization
(drop `unoptimized`, add `remotePatterns`) lands once images are normalized to Cloudinary.

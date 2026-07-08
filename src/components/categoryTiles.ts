// Shared category tile definitions (name + emoji + blurb + gradient) used by the
// interactive Categories filter and the CategoryStrip teaser so they never drift.
export interface CategoryTile {
  name: string;
  emoji: string;
  blurb: string;
  gradient: string;
}

export const CATEGORY_TILES: CategoryTile[] = [
  { name: "Breakfast", emoji: "🍳", blurb: "Bright morning starts", gradient: "from-accent-400 to-brand-500" },
  { name: "Main Course", emoji: "🍝", blurb: "Hearty centerpieces", gradient: "from-brand-500 to-brand-700" },
  { name: "Appetizer", emoji: "🥗", blurb: "Small, shareable bites", gradient: "from-accent-500 to-brand-600" },
  { name: "Dessert", emoji: "🍰", blurb: "Sweet finishes", gradient: "from-brand-600 to-accent-500" },
];

// Shared domain types for Taste-Tales.

export interface Publisher {
  name: string;
  image: string;
}

export interface Ingredient {
  quantity: number | null;
  unit: string;
  name: string;
}

export interface Nutrition {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

export interface Article {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  views: number;
  likes: number;
  publisher: Publisher;
  subtitle?: string;
  cuisine?: string;
  diet?: string[];
  tags?: string[];
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  nutrition?: Nutrition | null;
  ingredients?: Ingredient[];
  instructions?: string[];
  content?: string;
  publishedDate?: string;
}

export interface Review {
  id: string;
  blogId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Rating {
  value: number;
  count: number;
}

export interface AppNotification {
  type: string;
  message: string;
}

export interface FilterCriteria {
  query?: string;
  category?: string | null;
  cuisine?: string | null;
  diets?: string[];
  maxTime?: number | null;
}

// The editable structured portion of a recipe used by the create/edit forms.
export interface RecipeFormValue {
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number | string | null;
  cookTime: number | string | null;
  servings: number | string | null;
  cuisine: string;
  diet: string[];
  nutrition: {
    calories: number | string | null;
    protein: number | string | null;
    carbs: number | string | null;
    fat: number | string | null;
  };
}

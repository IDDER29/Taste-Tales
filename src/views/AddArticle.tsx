"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "../app/hooks";
import { addArticle } from "../features/article/articleSlice";
import { uploadImage } from "../api/cloudinary";
import { v4 as uuidv4 } from "uuid"; // to generate unique id
import { PhotoIcon } from "@heroicons/react/24/outline";
import RecipeFormFields from "../components/RecipeFormFields";
import { useToast, Button } from "../components/ui";
import { CATEGORY_OPTIONS } from "../utils/recipe";
import type { Article, RecipeFormValue } from "../types";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Coerce a possibly-blank value to a Number, or null when empty/invalid.
const toNumberOrNull = (v: number | string | null | undefined): number | null => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const emptyRecipe: RecipeFormValue = {
  // Ingredient quantity is kept as an empty string while editing the controlled
  // input; it is coerced to number|null on submit. Cast to satisfy Ingredient.
  ingredients: [{ quantity: "" as unknown as number | null, unit: "", name: "" }],
  instructions: [""],
  prepTime: "",
  cookTime: "",
  servings: "",
  cuisine: "",
  diet: [],
  nutrition: { calories: "", protein: "", carbs: "", fat: "" },
};

type SelectOption = { value: string; label: string };

const AddArticle = () => {
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<SelectOption[]>([]);
  const [category, setCategory] = useState<SelectOption | null>(null); // Changed to single category state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [recipe, setRecipe] = useState<RecipeFormValue>(emptyRecipe);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { status: authStatus } = useSession();

  // Creating a recipe requires an account.
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/articles");
    }
  }, [authStatus, router]);

  const tagOptions = [
    { value: "Tech", label: "Tech" },
    { value: "Health", label: "Health" },
    { value: "Food", label: "Food" },
  ];

  const categoryOptions = CATEGORY_OPTIONS.map((c) => ({
    value: c,
    label: c,
  }));

  const handleTagChange = (selectedOptions: any) => {
    setTags(selectedOptions);
  };

  const handleCategoryChange = (selectedOption: any) => {
    setCategory(selectedOption);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const selected = e.target.files?.[0];
      if (!selected) return;
      setFile(selected);
      setImageUrl(URL.createObjectURL(selected));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!category) {
      toast({ title: "Please select a category.", variant: "error" });
      return;
    }
    if (!file) {
      toast({ title: "Please add a cover image.", variant: "error" });
      return;
    }

    const imageUrl = await uploadImage(file);

    const cleanedIngredients = recipe.ingredients
      .filter((ing) => ing.name && ing.name.trim())
      .map((ing) => ({
        quantity: toNumberOrNull(ing.quantity),
        unit: ing.unit || "",
        name: ing.name.trim(),
      }));

    const cleanedInstructions = recipe.instructions
      .map((step) => step.trim())
      .filter((step) => step);

    const articleData: Article = {
      id: uuidv4(),
      title,
      subtitle,
      content,
      tags: tags.map((tag) => tag.value),
      category: category.value, // Accessing single category value
      imageUrl,
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions,
      prepTime: toNumberOrNull(recipe.prepTime),
      cookTime: toNumberOrNull(recipe.cookTime),
      servings: toNumberOrNull(recipe.servings),
      cuisine: recipe.cuisine || "",
      diet: recipe.diet,
      nutrition: {
        calories: toNumberOrNull(recipe.nutrition.calories),
        protein: toNumberOrNull(recipe.nutrition.protein),
        carbs: toNumberOrNull(recipe.nutrition.carbs),
        fat: toNumberOrNull(recipe.nutrition.fat),
      },
      views: 0,
      likes: 0,
      publishedDate: new Date().toISOString(),
      publisher: {
        name: "Anonymous",
        image: "https://via.placeholder.com/40x40.png?text=JD",
      },
    };

    try {
      const created = await dispatch(addArticle(articleData)).unwrap();
      toast({ title: "Recipe published!", variant: "success" });
      router.push(`/articles/${created.id}`);
    } catch {
      toast({
        title: "Could not publish",
        description: "Please make sure you're signed in and try again.",
        variant: "error",
      });
    }
  };

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="mb-8">
        <span className="eyebrow">Create</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950 sm:text-5xl">
          Share a recipe
        </h1>
        <p className="mt-2 text-sand-600">
          Tell its story and capture every detail — cooks will thank you.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Cover image */}
          <div>
            <span className="mb-2 block text-sm font-semibold text-sand-800">
              Cover image
            </span>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById("image")?.click()}
              className="group relative block w-full overflow-hidden rounded-2xl border-2 border-dashed border-sand-300 bg-white transition-colors hover:border-brand-400 hover:bg-brand-50/30"
            >
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Cover preview"
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 flex-col items-center justify-center gap-2 text-sand-500">
                  <PhotoIcon className="h-10 w-10 text-sand-300" />
                  <p className="font-medium">Click to upload a cover image</p>
                  <p className="text-xs text-sand-400">PNG or JPG, landscape looks best</p>
                </div>
              )}
              {imageUrl && (
                <span className="absolute bottom-3 right-3 rounded-full bg-sand-950/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  Change image
                </span>
              )}
            </button>
          </div>

          {/* Title & subtitle */}
          <div className="rounded-2xl border border-sand-200/70 bg-white p-6 shadow-soft">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 border-b border-sand-200 bg-transparent px-0 py-2 font-display text-3xl font-semibold text-sand-950 placeholder:text-sand-300 focus:border-brand-400 focus:outline-none focus:ring-0"
              placeholder="Recipe title"
              required
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-4 w-full border-0 border-b border-sand-200 bg-transparent px-0 py-2 text-lg text-sand-700 placeholder:text-sand-300 focus:border-brand-400 focus:outline-none focus:ring-0"
              placeholder="A short, tasty subtitle"
            />
          </div>

          {/* Story */}
          <div className="rounded-2xl border border-sand-200/70 bg-white p-6 shadow-soft">
            <label className="mb-3 block font-display text-lg font-semibold text-sand-950">
              Intro / story{" "}
              <span className="text-sm font-normal text-sand-400">(optional)</span>
            </label>
            <ReactQuill
              value={content}
              onChange={setContent}
              className="mb-12 h-64"
              theme="snow"
              placeholder="Share the story behind this recipe…"
            />
          </div>

          <RecipeFormFields value={recipe} onChange={setRecipe} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-sand-200/70 bg-white p-6 shadow-soft lg:sticky lg:top-24">
            <h3 className="font-display text-lg font-semibold text-sand-950">
              Publish details
            </h3>
            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-semibold text-sand-800"
                >
                  Category <span className="text-brand-500">*</span>
                </label>
                <Select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  className="basic-single-select"
                  classNamePrefix="select"
                  isClearable
                  placeholder="Select a category…"
                />
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="mb-1.5 block text-sm font-semibold text-sand-800"
                >
                  Tags
                </label>
                <Select
                  id="tags"
                  isMulti
                  value={tags}
                  onChange={handleTagChange}
                  options={tagOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Add tags…"
                />
              </div>
            </div>

            <Button type="submit" size="lg" block className="mt-6">
              Publish recipe
            </Button>
            <p className="mt-3 text-center text-xs text-sand-400">
              You can edit or delete it anytime.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddArticle;

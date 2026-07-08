"use client";

// src/pages/EditArticle.tsx
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

// react-quill touches `document` at import time — load it client-side only.
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import {
  getArticleById,
  updateAnArticle,
  selectArticleById,
  selectArticlesStatus,
} from "../features/article/articleSlice";
import { PhotoIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { uploadImage } from "../api/cloudinary";
import RecipeFormFields from "../components/RecipeFormFields";
import { useToast, Button, buttonVariants } from "../components/ui";
import { CATEGORY_OPTIONS } from "../utils/recipe";
import type { Article, RecipeFormValue } from "../types";

// Coerce a possibly-blank value to a Number, or null when empty/invalid.
const toNumberOrNull = (v: number | string | null | undefined): number | null => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

type SelectOption = { value: string; label: string };

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

const EditArticle = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { status: authStatus } = useSession();

  // Editing requires an account (ownership is enforced server-side too).
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/login?callbackUrl=/edit-article/${id}`);
    }
  }, [authStatus, router, id]);

  const article = useAppSelector(selectArticleById(id));
  const status = useAppSelector(selectArticlesStatus);

  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<SelectOption | null>(null);
  const [recipe, setRecipe] = useState<RecipeFormValue>(emptyRecipe);

  const categoryOptions = CATEGORY_OPTIONS.map((c) => ({
    value: c,
    label: c,
  }));

  useEffect(() => {
    if (!article) {
      dispatch(getArticleById(id));
    } else {
      setTitle(article.title);
      setSubtitle(article.subtitle ?? "");
      setContent(article.content ?? "");
      setImageUrl(article.imageUrl);
      setCategory(
        categoryOptions.find((cat) => cat.value === article.category) ?? null
      );
      setRecipe({
        ingredients:
          article.ingredients && article.ingredients.length
            ? article.ingredients.map((ing) => ({
                quantity: (ing.quantity ?? "") as unknown as number | null,
                unit: ing.unit || "",
                name: ing.name || "",
              }))
            : [{ quantity: "" as unknown as number | null, unit: "", name: "" }],
        instructions:
          article.instructions && article.instructions.length
            ? article.instructions
            : [""],
        prepTime: article.prepTime ?? "",
        cookTime: article.cookTime ?? "",
        servings: article.servings ?? "",
        cuisine: article.cuisine || "",
        diet: article.diet || [],
        nutrition: {
          calories: article.nutrition?.calories ?? "",
          protein: article.nutrition?.protein ?? "",
          carbs: article.nutrition?.carbs ?? "",
          fat: article.nutrition?.fat ?? "",
        },
      });
    }
  }, [dispatch, id, article]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    let uploadedImageUrl = imageUrl || article!.imageUrl;
    if (file) {
      uploadedImageUrl = await uploadImage(file);
    }

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

    const updatedArticleData: Article = {
      id,
      title,
      subtitle,
      content,
      imageUrl: uploadedImageUrl,
      category: category ? category.value : article!.category,
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
      views: article!.views,
      likes: article!.likes,
      publishedDate: article!.publishedDate,
      publisher: article!.publisher,
    };

    try {
      await dispatch(updateAnArticle({ id, data: updatedArticleData })).unwrap();
      toast({ title: "Recipe updated!", variant: "success" });
      router.push(`/articles/${id}`);
    } catch {
      toast({
        title: "Could not update",
        description: "You can only edit your own recipes.",
        variant: "error",
      });
    }
  };

  if (!article) {
    if (status === "failed" || status === "succeeded") {
      return (
        <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <MagnifyingGlassIcon className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-sand-950">
            Recipe not found
          </h1>
          <p className="mt-2 max-w-md text-sand-600">
            The recipe you&apos;re trying to edit doesn&apos;t exist or could not
            be loaded.
          </p>
          <Link href="/" className={`mt-6 ${buttonVariants({})}`}>
            Back to home
          </Link>
        </div>
      );
    }
    return (
      <div className="container-page py-20 text-center text-sand-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="mb-8">
        <span className="eyebrow">Edit</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950 sm:text-5xl">
          Edit recipe
        </h1>
        <p className="mt-2 text-sand-600">Refine the details and save your changes.</p>
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
            <div className="mt-5">
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm font-semibold text-sand-800"
              >
                Category <span className="text-brand-500">*</span>
              </label>
              <Select
                id="category"
                value={category}
                onChange={(selectedOption: any) => setCategory(selectedOption)}
                options={categoryOptions}
                className="basic-single-select"
                classNamePrefix="select"
                isClearable
                placeholder="Select a category…"
              />
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button type="submit" size="lg" block>
                Save changes
              </Button>
              <Link
                href={`/articles/${id}`}
                className={buttonVariants({ variant: "ghost" })}
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;

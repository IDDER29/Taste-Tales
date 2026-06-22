"use client";

// src/pages/EditArticle.tsx
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../app/hooks";

// react-quill touches `document` at import time — load it client-side only.
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import {
  getArticleById,
  updateAnArticle,
  selectArticleById,
  selectArticlesStatus,
} from "../features/article/articleSlice";
import { uploadImage } from "../api/cloudinary";
import RecipeFormFields from "../components/RecipeFormFields";
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
      alert("Please select a category.");
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

    await dispatch(updateAnArticle({ id, data: updatedArticleData }));
    router.push(`/articles/${id}`);
  };

  if (!article) {
    if (status === "failed" || status === "succeeded") {
      return (
        <div className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Article not found
          </h1>
          <p className="text-gray-600 mb-6">
            The article you're trying to edit doesn't exist or could not be
            loaded.
          </p>
          <Link href="/" className="text-red-500 font-medium hover:underline">
            Back to Home
          </Link>
        </div>
      );
    }
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Edit Your Article</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="md:col-span-3">
          <div className="relative mb-8">
            <label
              htmlFor="image"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Main Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer"
              onClick={() => document.getElementById("image")?.click()}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="rounded-md shadow-md w-full object-cover h-72"
                />
              ) : (
                <p className="text-center text-gray-500">
                  Click to upload an image
                </p>
              )}
            </div>
          </div>
          <div className="mb-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold p-3 border-b-2 focus:outline-none"
              placeholder="Enter your title here..."
              required
            />
          </div>
          <div className="mb-8">
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full text-2xl font-semibold p-3 border-b-2 focus:outline-none"
              placeholder="Enter your subtitle here..."
            />
          </div>
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Intro / story (optional)
            </label>
            <ReactQuill
              value={content}
              onChange={setContent}
              className="h-64 mb-8"
              theme="snow"
              placeholder="Write your article content here..."
            />
          </div>
          <div className="mt-16">
            <RecipeFormFields value={recipe} onChange={setRecipe} />
          </div>
        </div>
        <div className="md:col-span-1 space-y-6">
          <div>
            <label
              htmlFor="category"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <Select
              id="category"
              value={category}
              onChange={(selectedOption: any) => setCategory(selectedOption)}
              options={categoryOptions}
              className="basic-single-select"
              classNamePrefix="select"
              isClearable={true}
              placeholder="Select a category..."
            />
          </div>
        </div>
        <div className="text-center mt-8 md:col-span-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;

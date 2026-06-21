import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addArticle } from "../features/article/articleSlice";
import { uploadImage } from "../api/cloudinary";
import { v4 as uuidv4 } from "uuid"; // to generate unique id
import RecipeFormFields from "../components/RecipeFormFields";
import { CATEGORY_OPTIONS } from "../utils/recipe";

// Coerce a possibly-blank value to a Number, or null when empty/invalid.
const toNumberOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const emptyRecipe = {
  ingredients: [{ quantity: "", unit: "", name: "" }],
  instructions: [""],
  prepTime: "",
  cookTime: "",
  servings: "",
  cuisine: "",
  diet: [],
  nutrition: { calories: "", protein: "", carbs: "", fat: "" },
};

const AddArticle = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null); // Changed to single category state
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [recipe, setRecipe] = useState(emptyRecipe);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tagOptions = [
    { value: "Tech", label: "Tech" },
    { value: "Health", label: "Health" },
    { value: "Food", label: "Food" },
  ];

  const categoryOptions = CATEGORY_OPTIONS.map((c) => ({
    value: c,
    label: c,
  }));

  const handleTagChange = (selectedOptions) => {
    setTags(selectedOptions);
  };

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    try {
      setFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!category) {
      alert("Please select a category.");
      return;
    }
    if (!file) {
      alert("Please select an image.");
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

    const articleData = {
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

    dispatch(addArticle(articleData));
    navigate(`/`);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Create and Publish an Article
      </h1>
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
              onClick={() => document.getElementById("image").click()}
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
              htmlFor="tags"
              className="block text-lg font-medium text-gray-700 mb-2"
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
            />
            <div className="mt-4">
              {tags.map((tag) => (
                <span
                  key={tag.value}
                  className="inline-block bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
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
              onChange={handleCategoryChange}
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
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArticle;

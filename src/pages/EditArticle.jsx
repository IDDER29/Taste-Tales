// src/pages/EditArticle.js
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getArticleById,
  updateAnArticle,
  selectArticleById,
  selectArticlesStatus,
} from "../features/article/articleSlice";
import { uploadImage } from "../api/cloudinary";

const EditArticle = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const article = useSelector(selectArticleById(id));
  const status = useSelector(selectArticlesStatus);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(null);

  const categoryOptions = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Main Course", label: "Main Course" },
    { value: "Appetizer", label: "Appetizer" },
    { value: "Dessert", label: "Dessert" },
  ];

  useEffect(() => {
    if (!article) {
      dispatch(getArticleById(id));
    } else {
      setTitle(article.title);
      setSubtitle(article.subtitle);
      setContent(article.content);
      setImageUrl(article.imageUrl);
      setCategory(
        categoryOptions.find((cat) => cat.value === article.category)
      );
    }
  }, [dispatch, id, article]);

  const handleImageUpload = async (e) => {
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

    let uploadedImageUrl = imageUrl || article.imageUrl;
    if (file) {
      uploadedImageUrl = await uploadImage(file);
    }

    const updatedArticleData = {
      id,
      title,
      subtitle,
      content,
      imageUrl: uploadedImageUrl,
      category: category ? category.value : article.category,
      views: article.views,
      likes: article.likes,
      publishedDate: article.publishedDate,
      publisher: article.publisher,
    };

    await dispatch(updateAnArticle({ id, data: updatedArticleData }));
    navigate(`/articles/${id}`);
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
          <Link to="/" className="text-red-500 font-medium hover:underline">
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
            <ReactQuill
              value={content}
              onChange={setContent}
              className="h-64 mb-8"
              theme="snow"
              placeholder="Write your article content here..."
            />
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
              onChange={setCategory}
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

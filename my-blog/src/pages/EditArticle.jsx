import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getArticleById,
  updateAnArticle,
} from "../features/article/articleSlice";

const EditArticle = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const article = useSelector((state) =>
    state.article.articles.find((article) => article.id === id)
  );

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!article) {
      dispatch(getArticleById(id));
    } else {
      setTitle(article.title);
      setSubtitle(article.subtitle);
      setContent(article.content);
      setTags(article.tags.map((tag) => ({ value: tag, label: tag })));
      setCategories(
        article.categories.map((category) => ({
          value: category,
          label: category,
        }))
      );
      setImageUrl(article.imageUrl);
    }
  }, [dispatch, id, article]);

  const tagOptions = [
    { value: "Tech", label: "Tech" },
    { value: "Health", label: "Health" },
    { value: "Food", label: "Food" },
  ];

  const categoryOptions = [
    { value: "Lifestyle", label: "Lifestyle" },
    { value: "Education", label: "Education" },
    { value: "Business", label: "Business" },
  ];

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    axios
      .post(process.env.REACT_APP_CLOUDINARY_URL, formData)
      .then((response) => {
        setImageUrl(response.data.secure_url);
      })
      .catch((error) => {
        console.error(
          "Error uploading the image:",
          error.response ? error.response.data : error.message
        );
      });
  };

  const handleTagChange = (selectedOptions) => {
    setTags(selectedOptions);
  };

  const handleCategoryChange = (selectedOptions) => {
    setCategories(selectedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedArticleData = {
      id,
      title,
      subtitle,
      content,
      tags: tags.map((tag) => tag.value),
      categories: categories.map((category) => category.value),
      imageUrl,
    };
    await dispatch(updateAnArticle({ id, data: updatedArticleData }));
    navigate(`/`);
  };

  if (!article) return <p>Loading...</p>;

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
              htmlFor="categories"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Categories
            </label>
            <Select
              id="categories"
              isMulti
              value={categories}
              onChange={handleCategoryChange}
              options={categoryOptions}
              className="basic-multi-select"
              classNamePrefix="select"
            />
            <div className="mt-4">
              {categories.map((category) => (
                <span
                  key={category.value}
                  className="inline-block bg-green-500 text-white px-2 py-1 rounded-full mr-2 mb-2"
                >
                  {category.label}
                </span>
              ))}
            </div>
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

import React, { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ArticleHeader from "../components/ArticleHeader";
import Sidebar from "../components/Sidebar";
import RecipeJsonLd from "../components/RecipeJsonLd";
import Reviews from "../components/Reviews";
import {
  getArticleById,
  deleteAnArticle,
  selectArticleById,
  selectArticlesStatus,
} from "../features/article/articleSlice";
import {
  getReviews,
  selectReviewsForBlog,
} from "../features/review/reviewSlice";
import { averageRating } from "../utils/recipe";

const ArticlePage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const article = useAppSelector(selectArticleById(id));
  const status = useAppSelector(selectArticlesStatus);
  const reviews = useAppSelector(selectReviewsForBlog(id));
  const rating = averageRating(reviews);

  useEffect(() => {
    if (!article) {
      dispatch(getArticleById(id));
    }
  }, [dispatch, id, article]);

  useEffect(() => {
    dispatch(getReviews(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    await dispatch(deleteAnArticle(id));
    navigate("/");
  };

  if (!article) {
    if (status === "loading" || status === "idle") {
      return <p>Loading...</p>;
    }
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Article not found
        </h1>
        <p className="text-gray-600 mb-6">
          The article you're looking for doesn't exist or could not be loaded.
        </p>
        <Link to="/" className="text-red-500 font-medium hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="App max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <RecipeJsonLd article={article} rating={rating} />

      {/* Main Article Section */}
      <div className="lg:col-span-2 space-y-8">
        <ArticleHeader articleData={article} onDelete={handleDelete} />
        <Reviews blogId={id} />
      </div>

      {/* Sidebar Section */}
      <div>
        <Sidebar />
      </div>
    </div>
  );
};

export default ArticlePage;

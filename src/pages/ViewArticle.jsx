import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArticleHeader from "../components/ArticleHeader";
import Sidebar from "../components/Sidebar";
import {
  getArticleById,
  deleteAnArticle,
} from "../features/article/articleSlice";

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const article = useSelector((state) =>
    state.article.articles.find((article) => article.id === id)
  );

  useEffect(() => {
    if (!article) {
      dispatch(getArticleById(id));
    }
  }, [dispatch, id, article]);

  const handleDelete = async () => {
    await dispatch(deleteAnArticle(id));
    navigate("/");
  };

  if (!article) return <p>Loading...</p>;

  return (
    <div className="App max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Article Section */}
      <div className="lg:col-span-2">
        <ArticleHeader articleData={article} onDelete={handleDelete} />
      </div>

      {/* Sidebar Section */}
      <div>
        <Sidebar />
      </div>
    </div>
  );
};

export default ArticlePage;

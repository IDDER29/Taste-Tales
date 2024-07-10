import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleHeader from "../components/ArticleHeader";
import Sidebar from "../components/Sidebar";
import api from "../api/posts";

const ArticlePage = ({ onDelete }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setArticle(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
  }, [id]);
  const handleDelete = async () => {
    await onDelete(id);
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

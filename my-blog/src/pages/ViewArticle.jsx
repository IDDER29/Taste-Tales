import React from "react";
import ArticleHeader from "../components/ArticleHeader";
import Sidebar from "../components/Sidebar";

const ArticlePage = () => {
  return (
    <div className="App max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Article Section */}
      <div className="lg:col-span-2">
        <ArticleHeader />
      </div>

      {/* Sidebar Section */}
      <div>
        <Sidebar />
      </div>
    </div>
  );
};

export default ArticlePage;

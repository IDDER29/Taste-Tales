import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleHeader = ({ articleData, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-article/${articleData.id}`);
  };

  const handleDelete = () => {
    onDelete(articleData.id);
  };

  return (
    <article className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {articleData.title}
        </h1>
        <p className="text-xl text-gray-700 mb-4">{articleData.subtitle}</p>
        <div className="flex justify-center items-center space-x-3 text-sm text-gray-600">
          <img
            src={articleData.publisher.image}
            alt={articleData.publisher.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p>{articleData.publisher.name}</p>
            <p className="text-xs text-gray-500">{articleData.publishedDate}</p>
          </div>
        </div>
      </header>

      <figure className="mb-8">
        <img
          src={articleData.imageUrl}
          alt={articleData.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </figure>

      <section className="mb-8">
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <span className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.05 3.636a1 1 0 011.9 0l.341 1.027a1 1 00.95.688h1.084a1 1 01.588 1.81l-.886.646a1 1 00-.364 1.118l.341 1.027a1 1 01-1.537 1.118l-.886-.646a1 1 00-1.176 0l-.886.646a1 1 01-1.537-1.118l.341-1.027a1 1 00-.364-1.118l-.886-.646a1 1 01.588-1.81h1.084a1 1 00.95-.688l.341-1.027z" />
            </svg>
            <span>{articleData.views} Views</span>
          </span>
          <span className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.05 3.636a1 1 0 011.9 0l.341 1.027a1 1 00.95.688h1.084a1 1 01.588 1.81l-.886.646a1 1 00-.364 1.118l.341 1.027a1 1 01-1.537 1.118l-.886-.646a1 1 00-1.176 0l-.886.646a1 1 01-1.537-1.118l.341-1.027a1 1 00-.364-1.118l-.886-.646a1 1 01.588-1.81h1.084a1 1 00.95-.688l.341-1.027z" />
            </svg>
            <span>{articleData.likes} Likes</span>
          </span>
          <span className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.05 3.636a1 1 0 011.9 0l.341 1.027a1 1 00.95.688h1.084a1 1 01.588 1.81l-.886.646a1 1 00-.364 1.118l.341 1.027a1 1 01-1.537 1.118l-.886-.646a1 1 00-1.176 0l-.886.646a1 1 01-1.537-1.118l.341-1.027a1 1 00-.364-1.118l-.886-.646a1 1 01.588-1.81h1.084a1 1 00.95-.688l.341-1.027z" />
            </svg>
            <span>{articleData.category}</span>
          </span>
        </div>
      </section>

      <section className="prose lg:prose-xl prose-blue mb-8 text-left">
        <div
          dangerouslySetInnerHTML={{ __html: articleData.content }}
          className="text-lg leading-relaxed"
        ></div>
      </section>

      <footer className="flex justify-end space-x-4">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          Delete
        </button>
      </footer>
    </article>
  );
};

export default ArticleHeader;

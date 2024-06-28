import React, { useState, useEffect } from "react";

const ArticleHeader = () => {
  const [articleData, setArticleData] = useState(null);
  const [isPanding, setIsPanding] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch article data from API
    console.log("Fetching article data...");
    fetch("http://localhost:8000/blogs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setArticleData(data[0]);
        setIsPanding(false);
        setError(null);
      })
      .catch((error) => {
        setIsPanding(false);
        setError(error);
      });
  }, []); // The empty array ensures this effect runs only once after the initial render

  const handleEdit = () => {
    console.log("Edit button clicked");
    // Add your edit logic here
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
    // Add your delete logic here
  };

  return (
    <React.Fragment>
      {error && <div>{error.message}</div>}
      {articleData && (
        <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              {articleData.title}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {articleData.introduction}
            </p>
            <div className="flex justify-center mt-6 space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.05 3.636a1 1 0 011.9 0l.341 1.027a1 1 0 00.95.688h1.084a1 1 0 01.588 1.81l-.886.646a1 1 0 00-.364 1.118l.341 1.027a1 1 0 01-1.537 1.118l-.886-.646a1 1 0 00-1.176 0l-.886.646a1 1 0 01-1.537-1.118l.341-1.027a1 1 0 00-.364-1.118l-.886-.646a1 1 0 01.588-1.81h1.084a1 1 0 00.95-.688l.341-1.027z" />
                </svg>
                <span>{articleData.time}</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.05 3.636a1 1 0 011.9 0l.341 1.027a1 1 0 00.95.688h1.084a1 1 0 01.588 1.81l-.886.646a1 1 0 00-.364 1.118l.341 1.027a1 1 0 01-1.537 1.118l-.886-.646a1 1 0 00-1.176 0l-.886.646a1 1 0 01-1.537-1.118l.341-1.027a1 1 0 00-.364-1.118l-.886-.646a1 1 0 01.588-1.81h1.084a1 1 0 00.95-.688l.341-1.027z" />
                </svg>
                <span>{articleData.difficulty}</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.05 3.636a1 1 0 011.9 0l.341 1.027a1 1 0 00.95.688h1.084a1 1 0 01.588 1.81l-.886.646a1 1 0 00-.364 1.118l.341 1.027a1 1 0 01-1.537 1.118l-.886-.646a1 1 0 00-1.176 0l-.886.646a1 1 0 01-1.537-1.118l.341-1.027a1 1 0 00-.364-1.118l-.886-.646a1 1 0 01.588-1.81h1.084a1 1 0 00.95-.688l.341-1.027z" />
                </svg>
                <span>{articleData.serves}</span>
              </span>
            </div>
          </div>

          {/* Image Section */}
          <div className="mb-12">
            <img
              src={articleData.imageUrl}
              alt="Lemon Garlic Roasted Chicken"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Description Section */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              {articleData.description}
            </p>
          </div>

          {/* Do's and Don'ts Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Let's go over the basics – the do’s, and the don’ts – for How to
              Cook a Chicken
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Do's</h3>
                <ul className="list-disc list-inside space-y-2">
                  {articleData.dos.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Don'ts</h3>
                <ul className="list-disc list-inside space-y-2">
                  {articleData.donts.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Ingredients, Equipment, Nutritional Value Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Ingredients</h3>
              <ul className="list-disc list-inside space-y-2">
                {articleData.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Equipment Needed */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Equipment Needed</h3>
              <ul className="list-disc list-inside space-y-2">
                {articleData.equipment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Nutritional Value */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Nutritional Value</h3>
              <ul className="list-disc list-inside space-y-2">
                {articleData.nutrition.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {articleData && (
        <div className="mt-6 flex justify-end space-x-4 m-3">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
      {isPanding && <div>Loading...</div>}
    </React.Fragment>
  );
};

export default ArticleHeader;

import React from "react";
import { Link } from "react-router-dom";

const RecipeBlog = ({ articles }) => {
  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto ">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          <span className="text-red-500">Recipe</span> Blogs
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img
              className="w-full h-auto rounded-lg shadow-md"
              src="https://www.upmenu.com/wp-content/uploads/2023/06/restaurant-blog1.jpg"
              alt="Main Blog"
            />
            <div className="mt-4">
              <p className="text-gray-600 text-sm">November 30, 2016</p>
              <h2 className="text-2xl font-semibold text-gray-800">
                Our Recipes Blog
              </h2>
              <p className="text-gray-600 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-8 flex flex-col">
            {articles.map((article) => (
              <Link to={`/view-article/${article.id}`} key={article.id}>
                <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-md overflow-hidden">
                  <div
                    className="h-48 lg:h-auto lg:w-48 flex-none bg-cover"
                    style={{ backgroundImage: `url(${article.imageUrl})` }}
                    title={article.title}
                  ></div>
                  <div className="p-4 flex flex-col justify-between leading-normal">
                    <div>
                      <p className="text-gray-600 text-sm">
                        {article.publishedDate}
                      </p>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mt-2">{article.subtitle}</p>
                    </div>
                    <div className="flex items-center mt-4 lg:mt-0">
                      <span className="inline-block text-xs text-white bg-green-500 px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <button className="text-blue-500 hover:underline">View more</button>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};

export default RecipeBlog;

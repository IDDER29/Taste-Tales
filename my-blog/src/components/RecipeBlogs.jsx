import React from "react";

const RecipeBlog = () => {
  const articles = [
    {
      id: 1,
      title: "Hot Meatloaf",
      date: "Aug 27, 2019",
      category: "Breakfast",
      description: "Lorem ipsum dolor sit amet",
      image:
        "https://khni.kerry.com/wp-content/uploads/2019/02/Restaurant-meal-1024x680.jpg",
    },
    {
      id: 2,
      title: "Instant Pot Pulled",
      date: "May 10, 2005",
      category: "Main Course",
      description: "Lorem ipsum dolor sit amet",
      image:
        "https://media.istockphoto.com/id/1081422898/photo/pan-fried-duck.jpg?s=2048x2048&w=is&k=20&c=KcDScs6hE2epagNeSD5tUuCAomdL1YK0eLLMCd5mtGU=",
    },
    {
      id: 3,
      title: "Best Grill Salmon",
      date: "Nov 22, 2006",
      category: "Appetizer",
      description: "Lorem ipsum dolor sit amet",
      image:
        "https://media.istockphoto.com/id/516329534/photo/last-straw.jpg?s=2048x2048&w=is&k=20&c=1L46K6jtSK0cuy9YTGuR7yf8621sftHxEpTkoWtmmk4=",
    },
  ];
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

      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          <span className="text-red-500">Recipe</span> Blogs
        </h1>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:flex-1">
            <img
              className="w-full h-auto rounded-lg shadow-md"
              src="https://via.placeholder.com/800x400"
              alt="Main Blog"
            />
            <div className="mt-4">
              <p className="text-gray-600 text-sm">November 30, 2016</p>
              <h2 className="text-xl font-semibold text-gray-800">
                Our Recipes Blog
              </h2>
              <p className="text-gray-600 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 lg:flex-1">
            {articles.map((article) => (
              <div key={article.id} className="flex mb-4">
                <img
                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                  src={article.image}
                  alt={article.title}
                />
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{article.date}</p>
                  <h3 className="text-md font-semibold text-gray-800">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600">{article.description}</p>
                  <span className="inline-block mt-2 text-xs text-white bg-green-500 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 text-right">
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

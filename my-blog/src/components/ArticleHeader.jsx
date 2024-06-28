import React, { useState, useEffect } from "react";

const ArticleHeader = () => {
  const [articleData, setArticleData] = useState({
    title: "Lemon Garlic Roasted Chicken",
    introduction:
      "Welcome to Cooks Delight, where culinary dreams come alive! Today, we embark on a journey of flavors with a dish that promises to elevate your dining experience - our Citrus Infusion Delight: Lemon Garlic Roasted Chicken.",
    time: "1 Hour",
    difficulty: "Hard Prep",
    serves: "4 Serves",
    imageUrl:
      "https://media.istockphoto.com/id/134987504/photo/baked-chicken.webp?s=2048x2048&w=is&k=20&c=1GjKpuIeeoyxkNoaMSLjb2KVzyVluVKQ36dnGRSiCgc=",
    description:
      "Picture succulent chicken infused with the bright notes of lemon and the aromatic richness of garlic. It’s a symphony of flavors that will have your taste buds dancing. Join us as we delve into the art of roasting and uncover the culinary secrets that transform this simple dish into not just a meal, but a celebration of taste and tradition.",
    dos: [
      "Thoroughly Clean Hands and Surfaces",
      "Use Separate Cutting Boards",
      "Check Internal Temperature",
    ],
    donts: ["Thaw Chicken at Room Temperature", "Overcrowd the Pan"],
    ingredients: [
      "1 whole chicken (about 3-4 pounds)",
      "2 lemons, sliced",
      "6 cloves garlic, minced",
      "2 tablespoons olive oil",
      "1 teaspoon dried thyme",
      "1 teaspoon dried rosemary",
      "Salt and black pepper to taste",
    ],
    equipment: [
      "Roasting pan",
      "Meat thermometer",
      "Cutting board",
      "Kitchen twine",
    ],
    nutrition: [
      "Calories: 250",
      "Protein: 23g",
      "Fat: 14g",
      "Carbohydrates: 3g",
    ],
  });

  useEffect(() => {
    // Fetch article data from API
    console.log("hi i'm fetching");
  });

  return (
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
          Let's go over the basics – the do’s, and the don’ts – for How to Cook
          a Chicken
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
  );
};

export default ArticleHeader;

import React from "react";
import { FaHeart, FaRegBookmark } from "react-icons/fa";

const recipes = [
  {
    id: 1,
    title: "Hot Meatloaf",
    subtitle: "Delicious and Hearty",
    category: "Breakfast",
    image:
      "https://khni.kerry.com/wp-content/uploads/2019/02/Restaurant-meal-1024x680.jpg",
    views: 1200,
    likes: 300,
    date: "Aug 27, 2019",
    publisher: {
      name: "John Doe",
      image: "https://via.placeholder.com/40x40.png?text=JD",
    },
  },
  {
    id: 2,
    title: "Instant Pot Pulled",
    subtitle: "Quick and Easy",
    category: "Main Course",
    image:
      "https://media.istockphoto.com/id/1081422898/photo/pan-fried-duck.jpg?s=2048x2048&w=is&k=20&c=KcDScs6hE2epagNeSD5tUuCAomdL1YK0eLLMCd5mtGU=",
    views: 2400,
    likes: 500,
    date: "May 10, 2005",
    publisher: {
      name: "Jane Smith",
      image: "https://via.placeholder.com/40x40.png?text=JS",
    },
  },
  {
    id: 3,
    title: "Best Grill Salmon",
    subtitle: "Healthy and Tasty",
    category: "Appetizer",
    image:
      "https://media.istockphoto.com/id/516329534/photo/last-straw.jpg?s=2048x2048&w=is&k=20&c=1L46K6jtSK0cuy9YTGuR7yf8621sftHxEpTkoWtmmk4=",
    views: 3100,
    likes: 800,
    date: "Nov 22, 2006",
    publisher: {
      name: "Alice Johnson",
      image: "https://via.placeholder.com/40x40.png?text=AJ",
    },
  },
  {
    id: 4,
    title: "Hot Meatloaf",
    subtitle: "Delicious and Hearty",
    category: "Breakfast",
    image:
      "https://khni.kerry.com/wp-content/uploads/2019/02/Restaurant-meal-1024x680.jpg",
    views: 1200,
    likes: 300,
    date: "Aug 27, 2019",
    publisher: {
      name: "John Doe",
      image: "https://via.placeholder.com/40x40.png?text=JD",
    },
  },
  {
    id: 5,
    title: "Instant Pot Pulled",
    subtitle: "Quick and Easy",
    category: "Main Course",
    image:
      "https://media.istockphoto.com/id/1081422898/photo/pan-fried-duck.jpg?s=2048x2048&w=is&k=20&c=KcDScs6hE2epagNeSD5tUuCAomdL1YK0eLLMCd5mtGU=",
    views: 2400,
    likes: 500,
    date: "May 10, 2005",
    publisher: {
      name: "Jane Smith",
      image: "https://via.placeholder.com/40x40.png?text=JS",
    },
  },
  {
    id: 6,
    title: "Best Grill Salmon",
    subtitle: "Healthy and Tasty",
    category: "Appetizer",
    image:
      "https://media.istockphoto.com/id/516329534/photo/last-straw.jpg?s=2048x2048&w=is&k=20&c=1L46K6jtSK0cuy9YTGuR7yf8621sftHxEpTkoWtmmk4=",
    views: 3100,
    likes: 800,
    date: "Nov 22, 2006",
    publisher: {
      name: "Alice Johnson",
      image: "https://via.placeholder.com/40x40.png?text=AJ",
    },
  },
  {
    id: 7,
    title: "Instant Pot Pulled",
    subtitle: "Quick and Easy",
    category: "Main Course",
    image:
      "https://media.istockphoto.com/id/1081422898/photo/pan-fried-duck.jpg?s=2048x2048&w=is&k=20&c=KcDScs6hE2epagNeSD5tUuCAomdL1YK0eLLMCd5mtGU=",
    views: 2400,
    likes: 500,
    date: "May 10, 2005",
    publisher: {
      name: "Jane Smith",
      image: "https://via.placeholder.com/40x40.png?text=JS",
    },
  },
  {
    id: 8,
    title: "Best Grill Salmon",
    subtitle: "Healthy and Tasty",
    category: "Appetizer",
    image:
      "https://media.istockphoto.com/id/516329534/photo/last-straw.jpg?s=2048x2048&w=is&k=20&c=1L46K6jtSK0cuy9YTGuR7yf8621sftHxEpTkoWtmmk4=",
    views: 3100,
    likes: 800,
    date: "Nov 22, 2006",
    publisher: {
      name: "Alice Johnson",
      image: "https://via.placeholder.com/40x40.png?text=AJ",
    },
  },
];

const TopCategoryRecipes = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        <span className="text-red-500">Top</span> Category Recipes
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="relative rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700">
                {recipe.subtitle}
              </h3>
              <h2 className="text-xl font-bold text-gray-900">
                {recipe.title}
              </h2>
              <div className="flex items-center mt-2">
                <FaHeart className="text-red-500 mr-2" />
                <span>{recipe.likes}</span>
                <FaRegBookmark className="ml-4 text-gray-600" />
              </div>
              <div className="mt-2 text-gray-600 text-sm">
                Views: {recipe.views}
              </div>
              <div className="mt-2 text-gray-600 text-sm">
                Category: {recipe.category}
              </div>
              <div className="mt-2 text-gray-600 text-sm">
                Published on: {recipe.date}
              </div>
              <div className="flex items-center mt-4">
                <img
                  src={recipe.publisher.image}
                  alt={recipe.publisher.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="text-gray-800 font-semibold">
                  {recipe.publisher.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategoryRecipes;

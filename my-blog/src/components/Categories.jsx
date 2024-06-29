import React from "react";

const categories = [
  {
    id: 1,
    name: "Breakfast",
    image:
      "https://w.forfun.com/fetch/9e/9e97b46c42e0fe04e4aceb533024bff6.jpeg",
  },
  {
    id: 2,
    name: "Main Course",
    image:
      "https://assets.epicurious.com/photos/588a497e15872cb7073f2240/1:1/w_320%2Cc_limit/charred-chicken-with-sweet-potatoes-and-oranges-BA-011917.jpg",
  },
  {
    id: 3,
    name: "Appetizer",
    image:
      "https://www.eatingwell.com/thmb/YdKNHN_HGJakZWFsgV6e44wI4zs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/3-Ingredient-Appetizers-38e65f4cf4d04135b26c591181f854d4.jpg",
  },
  {
    id: 4,
    name: "Dessert",
    image:
      "https://wallpaper.forfun.com/fetch/78/788bb2ea5f0f9c340f17f21f0d38703b.jpeg",
  },
];

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(
      selectedCategory === categoryName ? null : categoryName
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        <span className="text-red-500">Recipe</span> Categories
      </h2>
      <div className="flex justify-around">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex flex-col items-center cursor-pointer rounded-full p-2`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={category.image}
              alt={category.name}
              className={`rounded-full w-24 h-24 object-cover ${
                selectedCategory === category.name
                  ? "border-4 border-orange-500"
                  : ""
              }`}
            />
            <p className="mt-2 text-gray-800 font-semibold">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

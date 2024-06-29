import React from "react";

const categories = [
  {
    id: 1,
    name: "Breakfast",
    image: "https://via.placeholder.com/100x100.png?text=Breakfast",
  },
  {
    id: 2,
    name: "Main Course",
    image: "https://via.placeholder.com/100x100.png?text=Main+Course",
  },
  {
    id: 3,
    name: "Appetizer",
    image: "https://via.placeholder.com/100x100.png?text=Appetizer",
  },
  {
    id: 4,
    name: "Dessert",
    image: "https://via.placeholder.com/100x100.png?text=Dessert",
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

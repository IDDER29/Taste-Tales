import React from "react";

const Sidebar = () => {
  return (
    <div className="space-y-8">
      {/* About Me Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <img
          src="[Chef Image URL]"
          alt="Chef"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <p className="text-center text-lg">
          Hi! I'm Chef [Name], a passionate cook and food blogger. Welcome to my
          kitchen!
        </p>
      </div>

      {/* Top Articles Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Top Articles</h2>
        <ul className="space-y-4">
          <li>
            <a href="#" className="text-lg text-blue-500">
              10 Kitchen Essentials You Definitely Need
            </a>
          </li>
          <li>
            <a href="#" className="text-lg text-blue-500">
              5 Tips to Improve Your Cooking Skills
            </a>
          </li>
          <li>
            <a href="#" className="text-lg text-blue-500">
              The Best Desserts to Try This Summer
            </a>
          </li>
        </ul>
      </div>

      {/* Recently Published Articles Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Recently Published</h2>
        <ul className="space-y-4">
          <li>
            <a href="#" className="text-lg text-blue-500">
              How to Master the Art of French Cooking
            </a>
          </li>
          <li>
            <a href="#" className="text-lg text-blue-500">
              The Secrets to Perfectly Grilled Steak
            </a>
          </li>
          <li>
            <a href="#" className="text-lg text-blue-500">
              Vegetarian Recipes That Will Make You Forget Meat
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

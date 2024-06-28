import React from "react";

const Subscription = () => {
  return (
    <div
      className="relative p-6 rounded-lg shadow-md text-white"
      style={{
        backgroundImage:
          'url("https://via.placeholder.com/1200x600.png?text=Background+Image")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Get a Subscription to Taste Tales Blog
        </h2>
        <p className="mb-6">
          Subscribe to our newsletter and stay updated with the latest recipes
          and culinary trends.
        </p>
        <form>
          <div className="mb-4">
            <input
              type="email"
              className="w-full p-3 rounded-lg text-gray-700"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4 flex items-center justify-center">
            <input type="checkbox" id="additional-options" className="mr-2" />
            <label htmlFor="additional-options">
              Receive exclusive offers and content
            </label>
          </div>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Subscription;

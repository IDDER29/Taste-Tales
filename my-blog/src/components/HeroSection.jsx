import React from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div className="relative flex items-center justify-center py-24 text-white bg-cover bg-center  bg-[url('https://wallpapercave.com/wp/wp9754130.jpg')]">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full max-w-3xl text-center">
        <p className="text-xl mb-4">Discover the Best Recipes</p>
        <h1 className="text-5xl font-bold mb-4">
          Where Every Flavor Tells a Story
        </h1>
        <p className="mb-6">
          Explore a world of culinary delights, where each recipe brings a new
          adventure. Join us on a journey through the finest flavors.
        </p>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search for articles..."
            className="w-full max-w-md p-3 rounded-l-lg text-gray-700"
          />
          <button className="p-3 bg-red-500 rounded-r-lg">Search</button>
        </div>
      </div>
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
        <div className="flex flex-col space-y-4">
          <a href="#facebook" className="text-gray-400 hover:text-white">
            <FaFacebook size={24} />
          </a>
          <a href="#linkedin" className="text-gray-400 hover:text-white">
            <FaLinkedin size={24} />
          </a>
          <a href="#twitter" className="text-gray-400 hover:text-white">
            <FaTwitter size={24} />
          </a>
          <a href="#instagram" className="text-gray-400 hover:text-white">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

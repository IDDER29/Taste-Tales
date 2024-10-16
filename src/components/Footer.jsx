import React from "react";
import { FaTiktok, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-red-400 text-white">
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6">
          <div className="flex justify-start items-center">
            <img src="./blogLogo.png" alt="Blog Logo" className="h-16" />
          </div>
          <div className="flex justify-center items-center space-x-4 my-4 sm:my-0">
            <a href="#home" className="hover:underline">
              Home
            </a>
            <a href="#create-blog" className="hover:underline">
              Create a Blog
            </a>
            <a href="#about-us" className="hover:underline">
              About Us
            </a>
          </div>
          <div className="flex justify-end items-center space-x-4">
            <a href="#tiktok" className="text-white hover:text-gray-500">
              <FaTiktok size={24} />
            </a>
            <a href="#facebook" className="text-white hover:text-blue-500">
              <FaFacebook size={24} />
            </a>
            <a href="#instagram" className="text-white hover:text-pink-500">
              <FaInstagram size={24} />
            </a>
            <a href="#youtube" className="text-whit hover:text-red-600">
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
        <hr className="border-gray-700 my-4" />
        <div className="text-center">
          <p>&copy; 2024 Taste Tales Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import React, { useState } from "react";

const Subscription: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // No backend newsletter service — acknowledge locally.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div
      className="relative p-6  shadow-md text-white"
      style={{
        backgroundImage:
          'url("https://villacdn.villagroupresorts.com/uploads/article/cover_en/36/gastronomica-2018-01.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Get a Subscription to Taste Tales Blog
        </h2>
        <p className="mb-6">
          Subscribe to our newsletter and stay updated with the latest recipes
          and culinary trends.
        </p>
        {subscribed ? (
          <p className="bg-white/15 border border-white/30 rounded-lg p-4 font-semibold">
            🎉 Thanks for subscribing! Look out for fresh recipes in your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
        )}
      </div>
    </div>
  );
};

export default Subscription;

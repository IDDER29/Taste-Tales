import React from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Structured recipes",
    body: "Every recipe has real ingredients with quantities, numbered steps, prep & cook times, servings, and nutrition — not just a wall of text.",
  },
  {
    title: "Smart search & filters",
    body: "Find recipes by name or ingredient, and filter by cuisine, diet, and total time.",
  },
  {
    title: "Serving scaler & cook mode",
    body: "Scale ingredients to any number of servings, tick off items as you go, and keep your screen awake while you cook.",
  },
  {
    title: "Ratings & reviews",
    body: "Rate recipes and read what other cooks thought before you start.",
  },
  {
    title: "Your recipe box",
    body: "Save the recipes you love and keep them in one place for later.",
  },
  {
    title: "Cook from your pantry",
    body: "Enter the ingredients you have on hand to find matching recipes — or generate a brand-new one with AI.",
  },
];

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">
          About <span className="text-red-500">Taste-Tales</span>
        </h1>
        <p className="text-xl mt-4 text-gray-600">
          Where every flavor tells a story.
        </p>
      </section>

      <section className="prose lg:prose-lg max-w-none mb-12 text-gray-700">
        <p>
          Taste-Tales is a community recipe blog for home cooks. Browse and
          discover recipes, then create and share your own — each one captured as
          structured data so it's easy to read, search, scale, and cook from.
        </p>
        <p>
          The goal is simple: make great recipes effortless to find and follow,
          whether you're planning a weekend project or just trying to use up
          what's already in your kitchen.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">
          What you can do
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Ready to start cooking?
        </h2>
        <p className="text-gray-600 mb-6">
          Browse the latest recipes or share one of your own.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
          >
            Browse recipes
          </Link>
          <Link
            to="/articles"
            className="px-6 py-3 border border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50"
          >
            Create a recipe
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

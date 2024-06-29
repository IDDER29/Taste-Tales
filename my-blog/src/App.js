import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddArticle from './pages/AddArticle';
import ViewArticle from './pages/ViewArticle';
import About from './pages/About';
import NavBar from './components/NavBar';
import NoPage from './pages/NoPage';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import './App.css';
import api from "./api/posts";
import { v4 as uuid } from "uuid";

function App() {
  const [articleData, setArticleData] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/blogs");
        setArticleData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  const handleArticleSubmit = async (data) => {
    const request = {
      id: uuid(),
      ...data,
      views: 0, // Initialize views to 0
      likes: 0, // Initialize likes to 0
      publishedDate: data.publishedDate || new Date().toISOString(), // Default to current date
      publisher: data.author || {
        name: "Anonymous",
        image: "https://via.placeholder.com/40x40.png?text=JD",
      } // Default to 'Anonymous' if not provided
    };
    const response = await api.post("/blogs", request);
    setArticleData([...articleData, response.data]);
  };

  const handleDeleteArticle = async (id) => {
    await api.delete(`/blogs/${id}`);
  };

  return (
    <Router>
      <div>
        <NavBar />
        <HeroSection />
        <Routes>
          <Route path="/" element={<Home articles={articleData} />} />
          <Route path="create-article" element={<AddArticle onSubmit={handleArticleSubmit} />} />
          <Route path="view-article/:id" element={<ViewArticle onDelete={handleDeleteArticle} />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

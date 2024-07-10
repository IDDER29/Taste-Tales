import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Home from './pages/Home';
import AddArticle from './pages/AddArticle';
import ViewArticle from './pages/ViewArticle';
import EditArticle from './pages/EditArticle';
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
  const [notifications, setNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/blogs");
        console.log(response.data);
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
    setNotifications([...notifications, { type: 'new', message: 'New article created!' }]);
  };

  const handleDeleteArticle = async (id) => {
    await api.delete(`/blogs/${id}`);
    setArticleData(articleData.filter(article => article.id !== id));
    setNotifications([...notifications, { type: 'delete', message: 'Article deleted!' }]);
  };

  const handleUpdateArticle = async (updatedArticle) => {
    await api.put(`/blogs/${updatedArticle.id}`, updatedArticle);
    setArticleData(articleData.map(article => article.id === updatedArticle.id ? updatedArticle : article));
    setNotifications([...notifications, { type: 'edit', message: 'Article updated!' }]);
  };

  return (
    <Router basename='/Taste-Tales'>
      <div>
        <NavBar notifications={notifications} />
        <HeroSection />
        <Routes>
          <Route path="/" element={<Home articles={articleData} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />} />
          <Route path="create-article" element={<AddArticle onSubmit={handleArticleSubmit} />} />
          <Route path="view-article/:id" element={<ViewArticle onDelete={handleDeleteArticle} />} />
          <Route path="edit-article/:id" element={<EditArticleWrapper onUpdate={handleUpdateArticle} />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

const EditArticleWrapper = ({ onUpdate }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setArticle(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticle();
  }, [id]);

  return article ? <EditArticle articleData={article} onUpdate={onUpdate} /> : <div>Loading...</div>;
};

export default App;

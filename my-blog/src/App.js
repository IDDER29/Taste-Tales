// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Home from './pages/Home';
import AddArticle from './pages/AddArticle';
import ViewArticle from './pages/ViewArticle';
import EditArticle from './pages/EditArticle';
import About from './pages/About';
import NavBar from './components/NavBar';
import NoPage from './pages/NoPage';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import { getAllArticles, addArticle, deleteAnArticle, updateAnArticle } from './features/article/articleSlice';
import api from "./api/posts";

function App() {
  const articleData = useSelector(state => state.article.articles);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(getAllArticles());
  }, [dispatch]);

  const handleArticleSubmit = async (data) => {
    dispatch(addArticle(data));
    setNotifications([...notifications, { type: 'new', message: 'New article created!' }]);
  };

  const handleDeleteArticle = async (id) => {
    dispatch(deleteAnArticle(id));
    setNotifications([...notifications, { type: 'delete', message: 'Article deleted!' }]);
  };

  const handleUpdateArticle = async (updatedArticle) => {
    dispatch(updateAnArticle(updatedArticle));
    setNotifications([...notifications, { type: 'edit', message: 'Article updated!' }]);
  };

  return (
    <Router>
      <div>
        <NavBar notifications={notifications} />
        <HeroSection />
        <Routes>
          <Route path="/" element={<Home articles={articleData} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />} />
          <Route path="articles" element={<AddArticle onSubmit={handleArticleSubmit} />} />
          <Route path="articles/:id" element={<ViewArticle onDelete={handleDeleteArticle} />} />
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

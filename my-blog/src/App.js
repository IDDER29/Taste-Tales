import React, { useState } from 'react';
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

function App() {
  const [articleData, setArticleData] = useState(null);

  const handleArticleSubmit = (data) => {
    setArticleData(data);
  };

  return (
    <Router>
      <div>
        <NavBar />
        <HeroSection />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="creat-article" onSubmit={handleArticleSubmit} element={<AddArticle />} />
          <Route path="view-article/:id" element={<ViewArticle />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

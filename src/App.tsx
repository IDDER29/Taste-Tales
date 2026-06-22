// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import Home from './pages/Home';
import AddArticle from './pages/AddArticle';
import ViewArticle from './pages/ViewArticle';
import EditArticle from './pages/EditArticle';
import About from './pages/About';
import SavedRecipes from './pages/SavedRecipes';
import CookFromPantry from './pages/CookFromPantry';
import NavBar from './components/NavBar';
import NoPage from './pages/NoPage';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import { getAllArticles } from './features/article/articleSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllArticles());
  }, [dispatch]);

  return (
    <Router>
      <div>
        <NavBar />
        <HeroSection />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="articles" element={<AddArticle />} />
          <Route path="articles/:id" element={<ViewArticle />} />
          <Route path="edit-article/:id" element={<EditArticle />} />
          <Route path="about" element={<About />} />
          <Route path="saved" element={<SavedRecipes />} />
          <Route path="cook" element={<CookFromPantry />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

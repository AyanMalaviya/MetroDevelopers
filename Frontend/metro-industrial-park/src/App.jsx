// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/homepage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-dark">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

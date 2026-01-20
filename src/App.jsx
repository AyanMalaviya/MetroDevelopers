// Add to src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import Calculator from './pages/CalculatorPage';
import SiteMapPage from './pages/SiteMapPage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ThemeToggle from './components/ThemeToggle';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen theme-bg-primary">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/site-map" element={<SiteMapPage />} />
            </Routes>
          </main>
          <Footer />
          <PWAInstallPrompt />
          <ThemeToggle />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import MetroIndustrialPark from './components/Projects/MetroIndustrialPark';
import ContactPage from './pages/ContactPage';
import Calculator from './pages/CalculatorPage';
import SiteMapPage from './pages/SiteMapPage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import FloatingActionMenu from './components/FloatingActionMenu'; // Updated import
import ScrollToTop from './components/ScrollToTop';
import MetroArcade from './components/Projects/MetroArcade';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen theme-bg-primary">
          <PWAInstallPrompt />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/metro-industrial-park" element={<MetroIndustrialPark />} />
              <Route path="/metro-arcade" element={<MetroArcade />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/site-map" element={<SiteMapPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <FloatingActionMenu /> {/* Replaced ThemeToggle */}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

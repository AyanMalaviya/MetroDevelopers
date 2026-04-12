import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import MetroIndustrialPark from './components/Projects/MetroIndustrialPark';
import ContactPage from './pages/ContactPage';
import Calculator from './pages/CalculatorPage';
import SiteMapPage from './pages/SiteMapPage';
import LocalMarketPage from './pages/LocalMarketPage';
import InsightGuidePage from './pages/InsightGuidePage';
import RecordsPage from './pages/RecordsPage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import FloatingActionMenu from './components/FloatingActionMenu'; // Updated import
import ScrollToTop from './components/ScrollToTop';
import MetroArcade from './components/Projects/MetroArcade';
import NotFound from './pages/NotFound';
import ReviewPrompt from './components/Review';
import RecordsAccessGate from './components/RecordsAccessGate';

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
              <Route path="/industrial-sheds-in-moraiya" element={<Navigate to="/metro-industrial-park" replace />} />
              <Route path="/warehouses-in-changodar" element={<LocalMarketPage />} />
              <Route path="/industrial-sheds-near-sarkhej-bavla-highway" element={<LocalMarketPage />} />
              <Route path="/industrial-sheds-in-ahmedabad" element={<LocalMarketPage />} />
              <Route path="/guides/gst-input-credit-industrial-tenants-gujarat" element={<InsightGuidePage />} />
              <Route path="/guides/warehousing-yield-cagr-gujarat" element={<InsightGuidePage />} />
              <Route path="/records" element={<Navigate to="/calculator" replace />} />
              <Route
                path="/records/:slug"
                element={(
                  <RecordsAccessGate>
                    <RecordsPage />
                  </RecordsAccessGate>
                )}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ReviewPrompt />
          <FloatingActionMenu /> {/* Replaced ThemeToggle */}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

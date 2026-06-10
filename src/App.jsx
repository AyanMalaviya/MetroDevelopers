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
import SheetChangelogPage from './pages/SheetChangelogPage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import FloatingActionMenu from './components/FloatingActionMenu';
import ScrollToTop from './components/ScrollToTop';
import MetroArcade from './components/Projects/MetroArcade';
import NotFound from './pages/NotFound';
import ReviewPrompt from './components/Review';
import RecordsAccessGate from './components/RecordsAccessGate';
import ChatBot from './components/Chatbot/ChatBot';

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
              {/* ── Core pages ── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/metro-industrial-park" element={<MetroIndustrialPark />} />
              <Route path="/metro-arcade" element={<MetroArcade />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/site-map" element={<SiteMapPage />} />
              <Route path="/sheet-changelog" element={<SheetChangelogPage />} />

              {/* ── Local Market / SEO pages ── */}
              {/* Fixed: was incorrectly redirecting to /metro-industrial-park */}
              <Route path="/industrial-sheds-in-moraiya" element={<LocalMarketPage />} />
              <Route path="/industrial-sheds-in-changodar" element={<LocalMarketPage />} />
              <Route path="/warehouses-in-changodar" element={<LocalMarketPage />} />
              <Route path="/industrial-sheds-near-sarkhej-bavla-highway" element={<LocalMarketPage />} />
              <Route path="/industrial-sheds-in-ahmedabad" element={<LocalMarketPage />} />
              <Route path="/investment-in-real-estate-in-ahmedabad" element={<LocalMarketPage />} />
              <Route path="/industrial-shed-for-rent-changodar" element={<LocalMarketPage />} />
              <Route path="/industrial-shed-for-sale-changodar" element={<LocalMarketPage />} />
              <Route path="/godown-for-rent-changodar" element={<LocalMarketPage />} />
              <Route path="/industrial-park-near-sanand" element={<LocalMarketPage />} />

              {/* ── New SEO routes: Warehouse / Rent / Sale / Godown ── */}
              <Route path="/warehouse-for-rent-ahmedabad" element={<LocalMarketPage />} />
              <Route path="/warehouse-for-sale-ahmedabad" element={<LocalMarketPage />} />
              <Route path="/industrial-shed-for-rent-moraiya" element={<LocalMarketPage />} />
              <Route path="/industrial-shed-for-sale-moraiya" element={<LocalMarketPage />} />
              <Route path="/godown-for-rent-ahmedabad" element={<LocalMarketPage />} />
              <Route path="/factory-shed-for-rent-changodar" element={<LocalMarketPage />} />
              <Route path="/industrial-shed-for-rent-gujarat" element={<LocalMarketPage />} />
              <Route path="/gidc-shed-for-rent-ahmedabad" element={<LocalMarketPage />} />

              {/* ── New SEO routes: Investment ── */}
              <Route path="/industrial-property-investment-ahmedabad" element={<LocalMarketPage />} />
              <Route path="/industrial-land-for-sale-moraiya-changodar" element={<LocalMarketPage />} />
              <Route path="/high-return-investment-gujarat" element={<LocalMarketPage />} />

              {/* ── Insight / Guide pages ── */}
              <Route path="/guides/gst-input-credit-industrial-tenants-gujarat" element={<InsightGuidePage />} />
              <Route path="/guides/warehousing-yield-cagr-gujarat" element={<InsightGuidePage />} />
              <Route path="/guides/industrial-property-due-diligence-ahmedabad" element={<InsightGuidePage />} />
              <Route path="/guides/how-to-choose-industrial-shed-gujarat" element={<InsightGuidePage />} />

              {/* ── New Guide pages: Investment & Comparison ── */}
              <Route path="/guides/industrial-investment-returns-gujarat-2026" element={<InsightGuidePage />} />
              <Route path="/guides/rent-vs-buy-industrial-shed-ahmedabad" element={<InsightGuidePage />} />
              <Route path="/guides/gidc-vs-private-industrial-park-gujarat" element={<InsightGuidePage />} />

              {/* ── Protected Records ── */}
              <Route path="/records" element={<Navigate to="/calculator" replace />} />
              <Route
                path="/records/:slug"
                element={(
                  <RecordsAccessGate>
                    <RecordsPage />
                  </RecordsAccessGate>
                )}
              />

              {/* ── 404 catch-all ── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ReviewPrompt />
          <FloatingActionMenu />
          <ChatBot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NavbarProvider } from './context/NavbarContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';

const MetroIndustrialPark = lazy(() => import('./components/Projects/MetroIndustrialPark'));
const MetroIndustrialEstate = lazy(() => import('./pages/MetroIndustrialEstate'));
const MetroIndustrialPark3 = lazy(() => import('./pages/MetroIndustrialPark3'));
const MetroArcade = lazy(() => import('./components/Projects/MetroArcade'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Calculator = lazy(() => import('./pages/CalculatorPage'));
const SiteMapPage = lazy(() => import('./pages/SiteMapPage'));
const LocalMarketPage = lazy(() => import('./pages/LocalMarketPage'));
const InsightGuidePage = lazy(() => import('./pages/InsightGuidePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt'));
const ChatBot = lazy(() => import('./components/Chatbot/ChatBot'));
import MobileTabBar from './components/Layout/MobileTabBar';

const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center theme-bg-primary">
    <div className="w-8 h-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
  </div>
);

function AppShell() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{ paddingTop: 'var(--app-top-padding, env(safe-area-inset-top, 0px))' }}
      className="flex flex-col min-h-screen theme-bg-primary overflow-x-clip"
    >
      <div
        aria-hidden="true"
        style={{ height: 'var(--app-top-padding, env(safe-area-inset-top, 0px))' }}
        className={`fixed top-0 inset-x-0 z-50 pointer-events-none ${
          isDark ? 'bg-[#0B0B0D]' : 'bg-[#FFFFFF]'
        }`}
      />
      <Suspense fallback={null}>
        <PWAInstallPrompt />
      </Suspense>
      <Navbar />
      <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── Core pages ── */}
                <Route path="/" element={<HomePage />} />
                <Route path="/metro-industrial-park" element={<MetroIndustrialPark />} />
                <Route path="/metro-industrial-park-1" element={<MetroIndustrialPark />} />
                <Route path="/metro-industrial-estate" element={<MetroIndustrialEstate />} />
                <Route path="/metro-industrial-park-2" element={<MetroIndustrialEstate />} />
                <Route path="/metro-industrial-park-3" element={<MetroIndustrialPark3 />} />
                <Route path="/metro-arcade" element={<MetroArcade />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/site-map" element={<SiteMapPage />} />

                {/* ── Dedicated Leasing Landing Page ── */}
                <Route path="/industrial-shed-for-lease-ahmedabad" element={<LocalMarketPage />} />

                {/* ── Programmatic Directory Hierarchies (Google AI Recommendation) ── */}
                <Route path="/commercial/changodar/industrial-shed-for-lease" element={<LocalMarketPage />} />
                <Route path="/commercial/changodar/industrial-shed-for-sale" element={<LocalMarketPage />} />
                <Route path="/commercial/changodar/industrial-plots-for-sale" element={<LocalMarketPage />} />
                <Route path="/commercial/bavla/industrial-plots-for-sale" element={<LocalMarketPage />} />
                <Route path="/commercial/ahmedabad/warehouse-for-lease" element={<LocalMarketPage />} />
                <Route path="/commercial/ahmedabad/factory-space-for-rent" element={<LocalMarketPage />} />
                <Route path="/commercial/ahmedabad/industrial-plots-for-sale" element={<LocalMarketPage />} />

                {/* ── Local Market / SEO pages ── */}
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
                <Route path="/factory-shed-for-rent-changodar" element={<LocalMarketPage />} />

                {/* ── New SEO routes: Investment & Plotted Land ── */}
                <Route path="/industrial-property-investment-ahmedabad" element={<LocalMarketPage />} />
                <Route path="/industrial-plots-in-bavla" element={<LocalMarketPage />} />
                <Route path="/industrial-land-for-sale-bavla" element={<LocalMarketPage />} />

                {/* ── Consolidated 301 Permanent Redirects ── */}
                <Route path="/gidc-shed-for-rent-ahmedabad" element={<Navigate to="/industrial-shed-for-lease-ahmedabad" replace />} />
                <Route path="/industrial-shed-for-rent-gujarat" element={<Navigate to="/industrial-shed-for-lease-ahmedabad" replace />} />
                <Route path="/high-return-investment-gujarat" element={<Navigate to="/investment-in-real-estate-in-ahmedabad" replace />} />
                <Route path="/godown-for-rent-ahmedabad" element={<Navigate to="/warehouse-for-rent-ahmedabad" replace />} />
                <Route path="/industrial-land-for-sale-moraiya-changodar" element={<Navigate to="/metro-industrial-estate" replace />} />

                {/* ── Insight / Guide pages ── */}
                <Route path="/guides/gst-input-credit-industrial-tenants-gujarat" element={<InsightGuidePage />} />
                <Route path="/guides/warehousing-yield-cagr-gujarat" element={<InsightGuidePage />} />
                <Route path="/guides/industrial-property-due-diligence-ahmedabad" element={<InsightGuidePage />} />
                <Route path="/guides/how-to-choose-industrial-shed-gujarat" element={<InsightGuidePage />} />

                {/* ── New Guide pages: Investment & Comparison ── */}
                <Route path="/guides/industrial-investment-returns-gujarat-2026" element={<InsightGuidePage />} />
                <Route path="/guides/rent-vs-buy-industrial-shed-ahmedabad" element={<InsightGuidePage />} />
                <Route path="/guides/gidc-vs-private-industrial-park-gujarat" element={<InsightGuidePage />} />

                {/* ── 404 catch-all ── */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
      <MobileTabBar />
      <Footer />

      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NavbarProvider>
        <Router>
          <ScrollToTop />
          <AppShell />
        </Router>
      </NavbarProvider>
    </ThemeProvider>
  );
}

export default App;

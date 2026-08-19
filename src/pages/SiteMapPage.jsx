// src/pages/SiteMapPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, History, Map } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import InteractiveSiteMap from '../components/InteractiveSiteMap/InteractiveSiteMap';
import MetroEstateInteractiveMap from '../components/InteractiveSiteMap/MetroEstateInteractiveMap';
import SEO from '../components/SEO/SEO';

const SiteMapPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const location = useLocation();

  // State to manage the active map tab
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'park');
  
  // Tab configurations
  const tabs = [
    { id: 'park', label: 'Industrial Park' },
    { id: 'estate', label: 'Industrial Estate' }
  ];

  return (
    <>
      <SEO
        title="Industrial Shed Site Map & Availability | Moraiya, Changodar"
        description="Check live industrial shed and warehouse unit availability in Metro Industrial Park and Estate with our interactive site map."
        canonical="/site-map"
        ogImage="/images/metro-industrial-map.jpg"
        ogImageAlt="Industrial shed availability map in Moraiya Changodar Ahmedabad"
      />
      <h1 className="sr-only">Metro Industrial Projects Site Map — Check Unit Availability</h1>

      <div className={`relative overflow-hidden min-h-screen pt-24 pb-16 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* ── Top Action Bar ── */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                isDark
                  ? 'text-gray-400 bg-gray-800/50 hover:text-white hover:bg-gray-800 ring-1 ring-white/5'
                  : 'text-gray-600 bg-white hover:text-gray-900 hover:bg-gray-50 ring-1 ring-black/5 shadow-sm'
              }`}
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              type="button"
              onClick={() => navigate('/sheet-changelog')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                isDark
                  ? 'text-gray-300 bg-gray-800/50 hover:text-white hover:bg-gray-800 ring-1 ring-white/5'
                  : 'text-gray-600 bg-white hover:text-gray-900 hover:bg-gray-50 ring-1 ring-black/5 shadow-sm'
              }`}
            >
              <History size={16} />
              Change Log
            </button>
          </motion.div>

          {/* ── Title & Tab Navigation ── */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span className={`text-[10px] font-black tracking-widest uppercase ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Live Availability · Auto-updates
                </span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Shed <span className="text-brand-red">Availability</span>
              </h2>
              <p className={`text-sm mt-2 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Moraiya & Changodar, Ahmedabad
              </p>
            </motion.div>

            {/* High-Visibility Responsive Tab Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`flex p-1.5 rounded-2xl w-full lg:w-fit shrink-0 ${
                isDark ? 'bg-gray-800/80 ring-1 ring-white/10' : 'bg-gray-200/80 ring-1 ring-black/5'
              }`}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-sm font-bold transition-colors duration-300 z-10 overflow-hidden ${
                      isActive
                        ? 'text-white' 
                        : isDark
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-brand-red rounded-xl shadow-lg shadow-red-500/40"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    
                    <span className="relative z-20 flex items-center gap-2 whitespace-nowrap">
                      <Map size={16} className={isActive ? 'text-white' : 'opacity-70'} />
                      {tab.label}
                    </span>

                    {/* Subtle pulsing dot to encourage clicking */}
                    {!isActive && (
                      <span className="absolute top-3 right-3 flex h-1.5 w-1.5 z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* ── Map Container ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`relative rounded-3xl overflow-hidden shadow-2xl border transition-colors duration-300 min-h-[600px] ${
              isDark
                ? 'border-gray-800 shadow-black/60 bg-gray-800'
                : 'border-gray-200 shadow-gray-300/50 bg-white'
            }`}
          >
            {/* AnimatePresence manages smooth mounting/unmounting between maps */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-full w-full"
              >
                {activeTab === 'park' ? (
                  <InteractiveSiteMap />
                ) : (
                  <MetroEstateInteractiveMap />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <p className={`text-center text-xs mt-4 transition-colors duration-300 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <span className="opacity-80">Use zoom buttons inside the map · Scroll to navigate when zoomed · Click any shed for details</span>
          </p>

        </div>
      </div>
    </>
  );
};

export default SiteMapPage;
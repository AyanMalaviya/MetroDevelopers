// src/pages/SiteMapPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Map } from 'lucide-react';
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
    { id: 'park', label: 'Industrial Sheds' },
    { id: 'estate', label: 'Industrial Plots' }
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

      <div className={`relative overflow-hidden min-h-screen pt-16 sm:pt-24 pb-8 sm:pb-16 ${
        isDark
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black'
          : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'
      }`}>

        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          
          {/* ── Top Navigation & Live Status Pill ── */}
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-between gap-3 mb-3 sm:mb-6"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                isDark
                  ? 'text-gray-300 bg-gray-800/80 hover:text-white hover:bg-gray-700 ring-1 ring-white/10'
                  : 'text-gray-700 bg-white hover:text-gray-900 hover:bg-gray-50 ring-1 ring-black/5 shadow-sm'
              }`}
            >
              <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
              <span>Back</span>
            </button>

            <div className={`inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full text-[11px] font-semibold border ${
              isDark
                ? 'bg-gray-800/70 border-gray-700 text-gray-300'
                : 'bg-white border-gray-200 text-gray-700 shadow-sm'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="tracking-wide">Live Availability</span>
            </div>
          </motion.div>

          {/* ── Title & Segmented Tab Navigation ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Shed & Plot <span className="text-brand-red">Availability</span>
              </h2>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Moraiya & Changodar, Ahmedabad · Live Interactive Map
              </p>
            </motion.div>

            {/* High-Visibility Responsive Tab Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`flex p-1 sm:p-1.5 rounded-2xl w-full md:w-auto shrink-0 shadow-sm ${
                isDark ? 'bg-gray-800/90 ring-1 ring-white/10' : 'bg-gray-200/90 ring-1 ring-black/5'
              }`}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 z-10 overflow-hidden ${
                      isActive
                        ? 'text-white' 
                        : isDark
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-brand-red rounded-xl shadow-md shadow-red-500/40"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    
                    <span className="relative z-20 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                      <Map size={14} className={isActive ? 'text-white' : 'opacity-70'} />
                      {tab.label}
                    </span>

                    {!isActive && (
                      <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex h-1.5 w-1.5 z-20">
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
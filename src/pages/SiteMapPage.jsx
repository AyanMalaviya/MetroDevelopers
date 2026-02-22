// src/pages/SiteMapPage.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveSiteMap from '../components/InteractiveSiteMap/InteractiveSiteMap';
import SEO from '../components/SEO/SEO';

const SiteMapPage = () => {
  const { theme }  = useTheme();
  const navigate   = useNavigate();
  const isDark     = theme === 'dark';

  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);

  /* ── Fullscreen on the map wrapper div ── */
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) mapRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  /* ── F key shortcut ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleFullscreen]);

  return (
    <>
      <SEO
        title="Shed Availability – Metro Industrial Park Site Map"
        description="Interactive site map showing real-time shed availability at Metro Industrial Park, Moraiya, Changodar."
        canonical="/site-map"
      />

      <div className={`min-h-screen pt-20 pb-12 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>

        {/* ── Header ── */}
        <motion.section
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="px-4 pb-5"
        >
          <div className="max-w-7xl mx-auto">

            {/* Back */}
            <motion.button
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              type="button"
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 mb-5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-black hover:bg-gray-200'
              }`}
            >
              <ArrowLeft size={15} /> Back
            </motion.button>

            {/* Title row */}
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Live Availability · Auto-updates every 30s
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className={`text-3xl md:text-4xl lg:text-5xl font-extrabold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Shed <span className="text-brand-red">Availability</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  Metro Industrial Park · Moraiya, Changodar
                </motion.p>
              </div>

              {/* Fullscreen button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-brand-red hover:border-brand-red hover:text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-brand-red hover:border-brand-red hover:text-white'
                }`}
              >
                {isFullscreen
                  ? <><Minimize2 size={15} /> Exit Fullscreen</>
                  : <><Maximize2 size={15} /> Fullscreen</>
                }
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* ── Map ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="px-4"
        >
          <div className="max-w-7xl mx-auto">
            {/*
              mapRef goes HERE — fullscreen captures the entire
              InteractiveSiteMap including its stats header.
              No TransformWrapper, no nested scroll conflict.
              InteractiveSiteMap manages its own zoom + overflow-auto.
            */}
            <div
              ref={mapRef}
              className={`rounded-2xl overflow-hidden shadow-2xl border ${
                isDark
                  ? 'border-gray-800 shadow-black/50'
                  : 'border-gray-200 shadow-gray-300/40'
              } ${isFullscreen ? '!rounded-none !border-none' : ''}`}
            >
              <InteractiveSiteMap />
            </div>

            {/* Helper tip */}
            <p className={`text-center text-xs mt-3 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
              Use zoom buttons inside the map · Scroll to navigate when zoomed · Click any shed for details
            </p>
          </div>
        </motion.section>

      </div>
    </>
  );
};

export default SiteMapPage;

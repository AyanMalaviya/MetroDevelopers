// src/components/FloatingActionMenu.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, ArrowRight, X, ChevronLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FloatingActionMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  // Hide when already viewing Park 3
  const isPark3Page = location.pathname === '/metro-industrial-park-3';
  if (isPark3Page) return null;

  const navigateToPark3 = () => {
    navigate('/metro-industrial-park-3');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="New Launch Announcement: Metro Industrial Park 3"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-end pointer-events-auto select-none"
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          /* ─── Compact Collapsed Tag: NEW LAUNCH Tag instead of Industry Icon ─── */
          <motion.button
            key="collapsed-tag"
            onClick={() => setIsCollapsed(false)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`group rounded-l-xl border-y border-l py-2.5 px-2 flex flex-col items-center gap-1.5 shadow-xl transition-all cursor-pointer ${
              isDark
                ? 'bg-[#0f0f18]/95 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-black'
                : 'bg-white/95 border-amber-500/50 text-amber-800 hover:border-amber-600 hover:bg-amber-50 shadow-amber-500/10'
            }`}
            aria-label="Expand Metro Industrial Park 3 new launch details"
          >
            {/* Pulsing indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>

            {/* Vertical NEW LAUNCH Tag replacing old industry icon */}
            <span
              className="text-[9px] font-black tracking-widest uppercase"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
              }}
            >
              NEW LAUNCH
            </span>

            <ChevronLeft size={11} className="text-amber-500 group-hover:-translate-x-0.5 transition-transform" />
          </motion.button>
        ) : (
          /* ─── Expanded Compact Card: Redesigned smaller & compact ─── */
          <motion.div
            key="expanded-card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className={`rounded-l-2xl border-y border-l shadow-2xl backdrop-blur-md p-3 sm:p-3.5 max-w-[210px] sm:max-w-[230px] transition-all relative overflow-hidden ${
              isDark
                ? 'bg-[#0a0a14]/95 border-amber-500/35 text-white shadow-black/80'
                : 'bg-white/95 border-amber-500/40 text-gray-900 shadow-amber-500/10'
            }`}
          >
            {/* Top Bar with NEW LAUNCH tag & Dismiss Button */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xs">
                <Sparkles size={9} />
                NEW LAUNCH
              </span>

              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className={`p-1 rounded-full transition-colors ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="Minimize new launch prompt"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* Clickable Card Body */}
            <div
              onClick={navigateToPark3}
              className="cursor-pointer group"
            >
              <h4 className="text-xs sm:text-sm font-black font-display leading-tight mb-0.5 group-hover:text-amber-500 transition-colors">
                Metro Industrial Park 3
              </h4>

              <p className={`text-[10px] leading-tight flex items-center gap-1 mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <MapPin size={10} className="text-amber-500 shrink-0" />
                <span>Bavla – Rajoda Rd • 77 Plots</span>
              </p>

              <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-amber-500/15">
                <span className={`text-[9px] font-bold ${
                  isDark ? 'text-amber-400' : 'text-amber-700'
                }`}>
                  Bookings Open • Possession Soon
                </span>

                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-500 group-hover:translate-x-0.5 transition-transform">
                  Explore <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default FloatingActionMenu;

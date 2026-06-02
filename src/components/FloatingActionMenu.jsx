// FloatingActionMenu.jsx
// The sparkle FAB is replaced by the chatbot toggle button.
// The 5 quick-action items moved to the Navbar settings dropdown.
// This component is kept for the side "Explore More" pill only.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FloatingActionMenu = () => {
  const [isExploreCollapsed, setIsExploreCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const navigateToMetroPark = () => {
    navigate('/metro-industrial-park');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    /* ─── Explore Side Button ─── */
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-end gap-1">

      {/* X dismiss — only when expanded */}
      <AnimatePresence>
        {!isExploreCollapsed && (
          <motion.button
            key="dismiss"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExploreCollapsed(true)}
            className={`mr-1 w-4 h-4 rounded-full flex items-center justify-center shadow
              ${isDark
                ? 'bg-red-950/70 text-white/50 hover:text-white/90 hover:bg-red-900/80'
                : 'bg-red-100/90 text-red-400 hover:text-red-600 hover:bg-red-200/90'
              }`}
            aria-label="Minimize explore button"
          >
            <X size={9} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isExploreCollapsed ? (
          <motion.button
            key="collapsed"
            onClick={() => setIsExploreCollapsed(false)}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 0.4, x: 0 }}
            exit={{ opacity: 0, x: 14 }}
            whileHover={{ opacity: 0.8, x: -3 }}
            whileTap={{ scale: 0.93 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`rounded-l-xl border-y border-l py-2.5 px-1.5 flex items-center justify-center shadow-md
              ${isDark
                ? 'bg-brand-red/70 text-white/80 border-red-200/15'
                : 'bg-brand-red/75 text-white border-red-100/70'
              }`}
            aria-label="Expand explore button"
          >
            <Factory size={13} strokeWidth={2} />
          </motion.button>
        ) : (
          <motion.button
            key="expanded"
            onClick={navigateToMetroPark}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: [0.55, 0.3, 0.55],
              x: [0, -2, 0],
              boxShadow: [
                '0 0 0px rgba(220,38,38,0.15)',
                '0 0 14px rgba(220,38,38,0.35)',
                '0 0 0px rgba(220,38,38,0.15)',
              ],
            }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            whileHover={{ x: -4, opacity: 1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className={`rounded-l-xl border-y border-l px-2 py-2 flex items-center gap-1.5 shadow-lg
              ${isDark
                ? 'bg-brand-red text-white border-red-200/25'
                : 'bg-brand-red text-white border-red-100/90'
              }`}
            aria-label="Explore more industrial shed options"
          >
            <span className="text-[8px] font-black tracking-[0.15em] uppercase whitespace-nowrap font-display">
              Explore More
            </span>
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;

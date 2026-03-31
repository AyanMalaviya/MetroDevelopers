import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowUp,
  Sun,
  Moon,
  Type,
  Map,
  X,
  Factory
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FONT_SIZE_STORAGE_KEY = 'metro-font-size';
const FONT_SIZE_VALUES = {
  normal: '16px',
  large: '18px',
  xlarge: '20px',
};

const FloatingActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [isExploreCollapsed, setIsExploreCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (!savedFontSize || !FONT_SIZE_VALUES[savedFontSize]) return;
      document.documentElement.style.fontSize = FONT_SIZE_VALUES[savedFontSize];
      setFontSize(savedFontSize);
    } catch {
      // Ignore storage access failures.
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isOpen]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const toggleFontSize = () => {
    const root = document.documentElement;
    const nextFontSize =
      fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal';
    root.style.fontSize = FONT_SIZE_VALUES[nextFontSize];
    setFontSize(nextFontSize);
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, nextFontSize);
    } catch {
      // Ignore storage access failures.
    }
  };

  const navigateToMetroPark = () => {
    navigate('/metro-industrial-park');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSiteMap = () => {
    navigate('/site-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const themeActionColor =
    theme === 'light' ? 'bg-gray-900 hover:bg-black' : 'bg-amber-500 hover:bg-amber-600';

  const menuItems = [
    { icon: ArrowUp, label: 'Back to Top', action: scrollToTop, color: 'bg-blue-500 hover:bg-blue-600' },
    {
      icon: theme === 'light' ? Moon : Sun,
      label: theme === 'light' ? 'Dark Mode' : 'Light Mode',
      action: toggleTheme,
      color: themeActionColor,
    },
    {
      icon: Type,
      label: `Font Size: ${fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Large' : 'X-Large'}`,
      action: toggleFontSize,
      color: 'bg-green-500 hover:bg-green-600',
    },
    { icon: Factory, label: 'Explore Project', action: navigateToMetroPark, color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: Map, label: 'Plan & Availability', action: navigateToSiteMap, color: 'bg-teal-500 hover:bg-teal-600' },
  ];

  const radius = 100;
  const angleStep = -120 / menuItems.length;

  return (
    <>
      {/* ─── Explore Side Button ─── */}
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
            /* ── Collapsed: slim factory icon ── */
            <motion.button
              key="collapsed"
              onClick={() => setIsExploreCollapsed(false)}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 0.4, x: 0 }}       // ← no width animation, no repeat
              exit={{ opacity: 0, x: 14 }}
              whileHover={{ opacity: 0.8, x: -3 }}
              whileTap={{ scale: 0.93 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}   // ← explicit, no Infinity
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
            /* ── Expanded: Explore More ── */
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
              <span className="text-[8px] font-black tracking-[0.15em] uppercase whitespace-nowrap">
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

      {/* ─── FAB Menu ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.button
              type="button"
              aria-label="Close quick actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <AnimatePresence>
          {isOpen &&
            menuItems.map((item, index) => {
              const angle = (index * angleStep - 90) * (Math.PI / 180);
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    x,
                    y,
                    opacity: 1,
                    transition: { type: 'spring', stiffness: 260, damping: 20, delay: index * 0.05 },
                  }}
                  exit={{ scale: 0, x: 0, y: 0, opacity: 0, transition: { duration: 0.2 } }}
                  className="absolute bottom-0 right-0 z-50"
                >
                  <motion.button
                    onClick={() => { item.action(); setIsOpen(false); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`${item.color} w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center relative group`}
                    aria-label={item.label}
                  >
                    <item.icon size={20} />
                    <span
                      className={`absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap pointer-events-none shadow-md border transition-all duration-200 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 ${
                        isDark
                          ? 'bg-gray-900 border-gray-700 text-gray-100'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isOpen ? 135 : 0, backgroundColor: isOpen ? '#ef4444' : '#dc2626' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative w-12 h-12 rounded-full bg-brand-red shadow-2xl border border-white/20 flex items-center justify-center text-white overflow-hidden"
          aria-label="Quick actions menu"
        >
          <motion.div
            animate={{ scale: isOpen ? 20 : 0, opacity: isOpen ? 0.2 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white rounded-full"
          />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles size={20} />
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
              className="absolute inset-0 border-2 border-white rounded-full"
            />
          )}
        </motion.button>
      </div>
    </>
  );
};

export default FloatingActionMenu;
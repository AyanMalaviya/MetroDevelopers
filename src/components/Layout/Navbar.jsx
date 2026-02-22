// src/components/Layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Calculator, MapPin, Home, Factory, Store, Mail, Sun, Moon } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isVisible, setIsVisible]     = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled]       = useState(false);

  /* ── Scroll progress bar ── */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  /* ── Hide/show on scroll ── */
  useEffect(() => {
    const control = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y < 10)                           setIsVisible(true);
      else if (y > lastScrollY && y > 100) { setIsVisible(false); setIsMenuOpen(false); }
      else if (y < lastScrollY)             setIsVisible(true);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', control);
    return () => window.removeEventListener('scroll', control);
  }, [lastScrollY]);

  /* ── Body scroll lock when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const closeMenu  = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(v => !v);

  const navItems = [
    { path: '/',                      label: 'Home',           icon: Home       },
    { path: '/metro-industrial-park', label: 'Industrial Park',icon: Factory    },
    { path: '/metro-arcade',          label: 'Arcade',         icon: Store      },
    { path: '/contact',               label: 'Contact',        icon: Mail       },
    { path: '/calculator',            label: 'Calculator',     icon: Calculator },
    { path: '/site-map',              label: 'Site Map',       icon: MapPin     },
  ];

  /* ── Shared class for scrolled/unscrolled bg ── */
  const headerBg = scrolled
    ? isDark
      ? 'bg-black/90 backdrop-blur-xl shadow-2xl border-b border-gray-800/80'
      : 'bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-200/80'
    : isDark
      ? 'bg-black/40 backdrop-blur-md'
      : 'bg-white/40 backdrop-blur-md';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${headerBg}`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-3.5">

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="relative flex-shrink-0">
              <img
                src="/MDLogo.png"
                alt="Metro Industrial Park"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-xl transition-transform duration-300 group-hover:scale-110"
              />
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-brand-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
            </div>

            <div className="leading-tight">
              <span className={`block text-sm sm:text-base font-extrabold transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Metro Enterprise
              </span>
              <span className={`block text-[10px] font-medium transition-colors ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Industrial Sheds · Lease &amp; Sale
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wide rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                      : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800/70'
                        : 'text-gray-600 hover:text-brand-red hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                    <span className="hidden lg:inline">{item.label}</span>
                    {/* Tablet: show first word only */}
                    <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                  </>
                )}
              </NavLink>
            ))}

            {/* ── Theme toggle ── */}
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                title="Toggle theme"
                className={`ml-1 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-800/70 text-gray-400 hover:bg-gray-700 hover:text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
          </div>

          {/* ── Mobile right side: theme toggle + hamburger ── */}
          <div className="md:hidden flex items-center gap-2">
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                title="Toggle theme"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isDark
                    ? 'bg-gray-800/70 text-gray-400 hover:text-white'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isMenuOpen
                  ? 'bg-brand-red text-white'
                  : isDark
                    ? 'bg-gray-800/70 text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-700 hover:text-brand-red hover:bg-gray-200'
              }`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.25 }}
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.div>
            </button>
          </div>
        </nav>

        {/* ── Scroll progress bar ── */}
        <motion.div
          className="h-[2px] bg-gradient-to-r from-brand-red via-red-400 to-brand-red"
          style={{ scaleX, transformOrigin: '0%' }}
        />
      </header>

      {/* ══════════════════════════════════
          MOBILE MENU
          ══════════════════════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className={`fixed top-[61px] sm:top-[65px] right-0 bottom-0 w-[272px] sm:w-[300px] z-40 md:hidden overflow-y-auto ${
                isDark
                  ? 'bg-gray-950/98 backdrop-blur-xl border-l border-gray-800'
                  : 'bg-white/98 backdrop-blur-xl border-l border-gray-200'
              }`}
            >
              <div className="flex flex-col p-4 gap-1">

                {/* Panel header */}
                <div className={`px-2 pb-4 mb-2 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Navigation
                  </p>
                </div>

                {/* Nav items */}
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-brand-red text-white shadow-md shadow-brand-red/25'
                            : isDark
                              ? 'text-gray-300 hover:text-white hover:bg-gray-800/70'
                              : 'text-gray-700 hover:text-brand-red hover:bg-gray-100'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isActive
                              ? 'bg-white/20'
                              : isDark ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <span>{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Panel footer */}
                <div className={`mt-4 pt-4 border-t text-center ${
                  isDark ? 'border-gray-800' : 'border-gray-100'
                }`}>
                  <p className={`text-[10px] font-semibold ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
                    Metro Industrial Park · Moraiya, Ahmedabad
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

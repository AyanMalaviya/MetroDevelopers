// src/components/Layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Calculator, MapPin, Home, Building2, Mail } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // UPDATED: Direct link to Metro Industrial Park instead of Projects
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/metro-industrial-park', label: 'Industrial Park', icon: Building2 },
    { path: '/contact', label: 'Contact', icon: Mail },
    { path: '/calculator', label: 'Calculator', icon: Calculator },
    { path: '/site-map', label: 'Site Map', icon: MapPin }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled 
            ? theme === 'dark'
              ? 'bg-black/90 backdrop-blur-xl shadow-2xl border-b border-gray-800'
              : 'bg-white/90 backdrop-blur-xl shadow-2xl border-b border-gray-200'
            : theme === 'dark'
              ? 'bg-black/40 backdrop-blur-md'
              : 'bg-white/40 backdrop-blur-md'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4">
          {/* Logo Section - Enhanced for all devices */}
          <Link 
            to="/" 
            onClick={closeMenu}
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group"
          >
            <div className="relative">
              <img 
                src="/MDLogo.png" 
                alt="Metro Industrial Park Logo" 
                className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-lg bg-brand-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"></div>
            </div>

            <div className="flex flex-col leading-tight">
              <span className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Metro Industrial Park
              </span>
              <span className={`text-[10px] sm:text-xs md:text-sm font-medium transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Industrial Sheds · Lease & Sale
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Enhanced for tablets */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold transition-all duration-300 rounded-lg ${
                    isActive
                      ? 'text-white bg-brand-red shadow-lg shadow-brand-red/30 scale-105'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                        : 'text-gray-700 hover:text-brand-red hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden">{item.label.split(' ')[0]}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2.5 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                : 'text-gray-700 hover:text-brand-red hover:bg-gray-100'
            } ${isMenuOpen ? 'bg-brand-red text-white' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </nav>

        {/* Animated Progress Bar */}
        <motion.div
          className="h-1 bg-gradient-to-r from-brand-red via-red-500 to-brand-red shadow-lg shadow-brand-red/30"
          style={{ scaleX, transformOrigin: '0%' }}
        />
      </header>

      {/* Mobile Menu Overlay - Enhanced with backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-[73px] sm:top-[77px] right-0 bottom-0 w-[280px] sm:w-[320px] z-40 md:hidden overflow-y-auto ${
                theme === 'dark'
                  ? 'bg-gray-900/95 backdrop-blur-xl border-l border-gray-800'
                  : 'bg-white/95 backdrop-blur-xl border-l border-gray-200'
              }`}
            >
              <div className="flex flex-col p-4 sm:p-6 space-y-2">
                {/* Menu Header */}
                <div className={`pb-4 mb-4 border-b ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <h3 className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Navigation
                  </h3>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Explore our services
                  </p>
                </div>

                {/* Navigation Items */}
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all duration-200 rounded-xl ${
                          isActive
                            ? 'text-white bg-brand-red shadow-lg shadow-brand-red/30'
                            : theme === 'dark'
                              ? 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                              : 'text-gray-700 hover:text-brand-red hover:bg-gray-100'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </motion.div>
                ))}

                {/* Decorative Element */}
                <div className="pt-6 mt-6 border-t border-gray-800/50">
                  <div className={`text-center text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Metro Industrial Park
                  </div>
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

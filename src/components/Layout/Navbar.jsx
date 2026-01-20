// src/components/Layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Calculator, MapPin } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
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


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled 
          ? theme === 'dark'
            ? 'bg-black/80 backdrop-blur-xl shadow-lg'
            : 'bg-white/80 backdrop-blur-xl shadow-lg'
          : theme === 'dark'
            ? 'bg-black/20 backdrop-blur-md'
            : 'bg-white/20 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" onClick={closeMenu}>
          <img 
            src="/MDLogo.png" 
            alt="Metro Industrial Park Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded"
          />
          </Link>

          <div className="flex flex-col leading-tight">
            <span className={`text-sm sm:text-base md:text-lg font-bold transition-colors ${
              theme === 'dark' ? 'text-white drop-shadow-lg' : 'text-black'
            }`}>
              Metro Industrial Park
            </span>
            <span className={`text-xs hidden sm:block transition-colors ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Industrial Sheds · Lease & Sale
            </span>
          </div>
        </div>


        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            Home
          </NavLink>


          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            Projects
          </NavLink>


          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            Contact
          </NavLink>

          {/* NEW: Calculator Link with Icon */}
          <NavLink
            to="/calculator"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            <Calculator className="w-4 h-4" />
            <span>Calculator</span>
          </NavLink>
          
          <NavLink
            to="/site-map"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            <MapPin className="w-4 h-4" />
            <span>Site Map</span>
          </NavLink>
        </div>


        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
            theme === 'dark'
              ? 'text-gray-300 hover:text-white hover:bg-gray-800'
              : 'text-black hover:text-brand-red hover:bg-gray-100'
          }`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>


      {/* Animated Decorative Line - Theme-Aware with Scroll Progress */}
      <motion.div
        className={`h-1 transition-all duration-300 origin-left ${
          scrolled
            ? 'bg-gradient-to-r from-brand-red via-red-500 to-brand-red'
            : theme === 'dark'
              ? 'bg-gradient-to-r from-transparent via-white to-transparent opacity-60'
              : 'bg-gradient-to-r from-transparent via-black to-transparent opacity-40'
        }`}
        style={{ scaleX }}
      />


      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden overflow-hidden"
      >
        <div className={`px-4 py-4 backdrop-blur-xl space-y-2 ${
          theme === 'dark'
            ? 'bg-gray-900/90 border-t border-gray-800'
            : 'bg-white/90 border-t border-gray-200'
        }`}>
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            Home
          </NavLink>


          <NavLink
            to="/projects"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            Projects
          </NavLink>


          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            Contact
          </NavLink>

          {/* NEW: Calculator Link in Mobile Menu */}
          <NavLink
            to="/calculator"
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            <Calculator className="w-4 h-4" />
            <span>Calculator</span>
          </NavLink>

          <NavLink
            to="/site-map"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-black hover:text-brand-red hover:bg-gray-100'
              }`
            }
          >
            <MapPin className="w-4 h-4" />
            <span>Site Map</span>
          </NavLink>
        </div>
      </motion.div>
    </header>
  );
};


export default Navbar;
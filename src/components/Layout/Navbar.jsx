// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past threshold
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
            ? 'bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-lg'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/MDLogo.png" 
            alt="Metro Industrial Park Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded"
          />
          
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

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-4 py-4 backdrop-blur-lg border-t space-y-2 ${
          theme === 'dark'
            ? 'bg-gray-900/95 border-gray-800'
            : 'bg-white/95 border-gray-200'
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show navbar at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false);
        setIsMenuOpen(false); // Close mobile menu when hiding
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
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
      className={`fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-sm border-b border-brand-grey shadow-lg transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/Logo.jpeg" 
            alt="Metro Industrial Park Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded"
          />
          
          <div className="flex flex-col leading-tight">
            <span className="text-sm sm:text-base md:text-lg font-bold text-white">
              Metro Industrial Park
            </span>
            <span className="text-xs text-gray-400 hidden sm:block">
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
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
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
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
              }`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-brand-grey rounded-lg transition-all duration-200"
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
        <div className="px-4 py-4 bg-brand-grey/50 backdrop-blur-lg border-t border-gray-700 space-y-2">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
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
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
              }`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
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

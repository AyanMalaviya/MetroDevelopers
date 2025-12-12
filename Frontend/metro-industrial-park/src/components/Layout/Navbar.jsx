// src/components/Layout/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-sm border-b border-brand-grey shadow-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img 
            src="/Logo.jped" 
            alt="Metro Industrial Park Logo" 
            className="h-14 w-14 object-contain rounded"
          />
          
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-white">
              Metro Industrial Park
            </span>
            <span className="text-xs text-gray-400">
              Industrial Sheds · Lease & Sale
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${
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
              `px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${
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
              `px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${
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
              `px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive
                  ? 'text-white bg-brand-red shadow-lg shadow-brand-red/50'
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
              }`
            }
          >
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

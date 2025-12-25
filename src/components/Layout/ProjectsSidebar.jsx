// src/components/Layout/ProjectsSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const ProjectsSidebar = () => {
  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-30">
      <nav
        className="rounded-xl p-[2px]"
        style={{
          background: 'linear-gradient(135deg, #b3261e 0%, #2b2b2b 50%, #050509 100%)',
        }}
      >
        <div className="bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#050509] rounded-xl p-2 space-y-2">
          {/* Ongoing Projects Link */}
          <NavLink
            to="/projects/ongoing"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-red text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
              }`
            }
          >
            <div className="flex flex-col items-center gap-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-xs whitespace-nowrap">Ongoing</span>
            </div>
          </NavLink>

          {/* Past Projects Link */}
          <NavLink
            to="/projects/past"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-red text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-brand-grey'
              }`
            }
          >
            <div className="flex flex-col items-center gap-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs whitespace-nowrap">Past</span>
            </div>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default ProjectsSidebar;

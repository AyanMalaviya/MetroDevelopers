// src/pages/projects/PastProjectsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { pastProjects } from '../../data/pastProjects';
import ProjectsSidebar from '../../components/Layout/ProjectsSidebar';
import { getMapLink } from '../../utils/mapUtils';

const PastProjectsPage = () => {
  const handleProjectClick = (location) => {
    const mapUrl = getMapLink(location);
    window.open(mapUrl, '_blank');
  };

  return (
    <>
      {/* Fixed sidebar on right */}
      <ProjectsSidebar />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="max-w-6xl mx-auto px-6 py-12"
      >
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Past Projects</h1>
          <p className="text-gray-300">
            Delivered industrial and warehousing projects at Metro Industrial Park.
          </p>
        </header>

        <div className="space-y-6">
          {pastProjects.map((project, index) => (
            <div
              key={index}
              onClick={() => handleProjectClick(project.location)}
              className="relative group overflow-hidden rounded-2xl p-[2px] hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
              style={{
                background:
                  'linear-gradient(135deg, #b3261e 0%, #2b2b2b 50%, #050509 100%)',
              }}
            >
              {/* Card with background image */}
              <div
                className="relative rounded-2xl overflow-hidden h-80 bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                {/* Semi-transparent overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

                {/* Location icon indicator */}
                <div className="absolute top-4 right-4 z-20 bg-brand-red/90 rounded-full p-2 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>

                {/* Text content ON the image */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                    {project.name}
                  </h2>
                  <p className="text-gray-100 text-base md:text-lg drop-shadow-md mb-2">
                    {project.description}
                  </p>
                  <p className="text-gray-200 text-sm drop-shadow-md flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    {project.location.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default PastProjectsPage;

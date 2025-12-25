// src/pages/projects/PastProjectsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { pastProjects } from '../../data/pastProjects';
import ProjectsSidebar from '../../components/Layout/ProjectsSidebar';

const PastProjectsPage = () => {
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
              className="relative group overflow-hidden rounded-2xl p-[2px] hover:scale-[1.01] transition-transform duration-300"
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

                {/* Text content ON the image */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                    {project.name}
                  </h2>
                  <p className="text-gray-100 text-base md:text-lg drop-shadow-md">
                    {project.description}
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

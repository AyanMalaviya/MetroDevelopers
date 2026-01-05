import React, { useState, useEffect } from 'react';
import { Building2, Store } from 'lucide-react';
import MetroIndustrialPark from '../components/Projects/MetroIndustrialPark';
import PastProjects from '../components/Projects/PastProjects';
import MetroArcade from '../components/Projects/MetroArcade';

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark">

      {/* Tabs Navigation */}
      <section className={`z-40 bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-lg transition-all duration-300 ${
        isScrolled ? 'top-16 sm:top-[68px]' : 'top-16 sm:top-[68px]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 py-3 sm:py-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 font-bold rounded-lg transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'current'
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/50 scale-105'
                  : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Building2 size={18} />
              <span>Metro Industrial Park</span>
            </button>
            
            <button
              onClick={() => setActiveTab('arcade')}
              className={`flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 font-bold rounded-lg transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'arcade'
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/50 scale-105'
                  : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Store size={18} />
              <span>Metro Arcade</span>
            </button>
            
            <button
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 font-bold rounded-lg transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'past'
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/50 scale-105'
                  : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Building2 size={18} />
              <span>Past Projects</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content with Fade Animation */}
      <div className="relative">
        <div className={`transition-opacity duration-300 ${activeTab === 'current' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
          {activeTab === 'current' && <MetroIndustrialPark />}
        </div>
        <div className={`transition-opacity duration-300 ${activeTab === 'arcade' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
          {activeTab === 'arcade' && <MetroArcade />}
        </div>
        <div className={`transition-opacity duration-300 ${activeTab === 'past' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
          {activeTab === 'past' && <PastProjects />}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
// src/pages/ProjectsPage.jsx
import React, { useState, useEffect } from 'react';
import { Building2, Store } from 'lucide-react';
import MetroIndustrialPark from '../components/Projects/MetroIndustrialPark';
import MetroArcade from '../components/Projects/MetroArcade';
import PastProjects from '../components/Projects/PastProjects';

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className={`relative bg-gradient-to-b from-gray-950 via-black to-black overflow-hidden transition-all duration-500 ${isScrolled ? 'py-8 sm:py-12' : 'py-12 sm:py-20'}`}>
        <div className={`relative z-10 max-w-7xl mx-auto px-4 text-center transition-all duration-500 ${isScrolled ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs sm:text-sm text-gray-400">
            <Building2 size={16} />
            <span>Our Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4">
            Explore Our <span className="text-brand-red">Projects</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-400 max-w-3xl mx-auto">
            World-class infrastructure designed for modern businesses
          </p>
        </div>
      </section>

      {/*Tabs */}
      <section className="top-16 sm:top-[68px] z-40 bg-black/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 sm:gap-3 py-3 overflow-x-auto">
            <button onClick={() => setActiveTab('current')} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-lg transition-all whitespace-nowrap text-xs sm:text-base ${activeTab === 'current' ? 'bg-brand-red text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}>
              <Building2 size={16} />
              <span>Metro Industrial Park</span>
            </button>
            <button onClick={() => setActiveTab('arcade')} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-lg transition-all whitespace-nowrap text-xs sm:text-base ${activeTab === 'arcade' ? 'bg-brand-red text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}>
              <Store size={16} />
              <span>Metro Arcade</span>
            </button>
            <button onClick={() => setActiveTab('past')} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-lg transition-all whitespace-nowrap text-xs sm:text-base ${activeTab === 'past' ? 'bg-brand-red text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}>
              <Building2 size={16} />
              <span>Past Projects</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="relative">
        {activeTab === 'current' && <MetroIndustrialPark />}
        {activeTab === 'arcade' && <MetroArcade />}
        {activeTab === 'past' && <PastProjects />}
      </div>
    </div>
  );
};

export default ProjectsPage;
import React, { useState } from 'react';
import { Building2, Store } from 'lucide-react';
import MetroIndustrialPark from '../components/Projects/MetroIndustrialPark';
import MetroArcade from '../components/Projects/MetroArcade';
import SEO from '../components/SEO/SEO'; // ✅ Your path is correct

const ProjectsPage = () => {
  const [activeProject, setActiveProject] = useState('industrial');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Our Projects - Metro Enterprise",
    "description": "Browse Metro Industrial Park and Metro Arcade projects",
    "url": "https://www.metrodevelopers.co.in/projects",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.metrodevelopers.co.in/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Projects",
          "item": "https://www.metrodevelopers.co.in/projects"
        }
      ]
    }
  };

  const projects = [
    {
      id: 'industrial',
      name: 'Metro Industrial Park',
      icon: <Building2 size={20} />,
      shortName: 'Industrial'
    },
    {
      id: 'arcade',
      name: 'Metro Arcade',
      icon: <Store size={20} />,
      shortName: 'Arcade'
    }
  ];

  return (
    <>      
      <SEO 
        title="Projects - Metro Industrial Park & Metro Arcade | Ahmedabad"
        description="Explore Metro Industrial Park (54,000 sq.yard, 63 sheds, 4K-50K sq.ft, 30-35ft height, 60ft roads, weigh bridge, 6-8% ROI, 90 days possession) and Metro Arcade (80,000 sq.ft, 60+ shops) in Moraiya, Ahmedabad."
        keywords="Metro Industrial Park, Metro Arcade, 54000 sq yard industrial park, 63 industrial sheds, 4000 sqft shed, 50000 sqft warehouse, weigh bridge, 60ft roads, 6% ROI, 8% ROI, possession 90 days"
        canonical="/projects"
        ogImage="/images/2shed.jpg"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-black">
        {/* Mobile-Optimized Project Navbar */}
        <nav className="top-16 z-40 bg-black border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            {/* Mobile: Full Width Grid (2 Columns) */}
            <div className="grid grid-cols-2 gap-2 py-3 sm:hidden">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    activeProject === project.id
                      ? 'bg-brand-red text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {project.icon}
                  <span>{project.shortName}</span>
                </button>
              ))}
            </div>

            {/* Desktop: Center Aligned */}
            <div className="hidden sm:flex gap-3 py-4 justify-center">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeProject === project.id
                      ? 'bg-brand-red text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {project.icon}
                  <span>{project.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Project Content */}
        <div>
          {activeProject === 'industrial' && <MetroIndustrialPark />}
          {activeProject === 'arcade' && <MetroArcade />}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;

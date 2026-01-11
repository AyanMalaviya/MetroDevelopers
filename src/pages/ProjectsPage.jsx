import { useState } from 'react';
import { Building2, Store } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import MetroIndustrialPark from '../components/Projects/MetroIndustrialPark';


const ProjectsPage = () => {
  const { theme } = useTheme();
  const [activeProject, setActiveProject] = useState('industrial');


  const projects = [
    {
      id: 'industrial',
      name: 'Metro Industrial Park',
      icon: <Building2 size={20} />,
      shortName: 'Industrial'
    }
  ];


  return (
    <div className="min-h-screen theme-bg-primary">
      <nav className={`relative z-10 theme-bg-primary border-b theme-border theme-shadow-md mt-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-2 py-3 sm:hidden">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  activeProject === project.id
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                    : `${theme === 'dark' ? 'bg-gray-900 text-gray-400 hover:bg-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} hover:text-brand-red`
                }`}
              >
                {project.icon}
                <span>{project.shortName}</span>
              </button>
            ))}
          </div>

          <div className="hidden sm:flex gap-3 py-4 justify-center">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeProject === project.id
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                    : `${theme === 'dark' ? 'bg-gray-900 text-gray-400 hover:bg-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} hover:text-brand-red`
                }`}
              >
                {project.icon}
                <span>{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div>
        {activeProject === 'industrial' && <MetroIndustrialPark />}
      </div>
    </div>
  );
};


export default ProjectsPage;

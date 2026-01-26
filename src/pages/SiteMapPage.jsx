// src/pages/SiteMapPage.jsx
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveSiteMap from '../components/InteractiveSiteMap/InteractiveSiteMap';

const SiteMapPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen pt-24 pb-20 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-6 px-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-black hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          {/* Title */}
          <div className="text-center mb-2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Shed <span className="text-brand-red">Availability</span>
            </motion.h1>
          </div>
        </div>
      </motion.section>

      {/* Map */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="px-4"
      >
        <div className="max-w-7xl mx-auto">
          <InteractiveSiteMap />
        </div>
      </motion.section>
    </div>
  );
};

export default SiteMapPage;
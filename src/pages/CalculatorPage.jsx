// src/pages/Calculator.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FileText, MapPin, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CalculatorComponent from '../components/Calculator/CalculatorComponent';
import SimpleCalculator from '../components/Calculator/SimpleCalculator';

const Calculator = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showAreaSheet, setShowAreaSheet] = useState(false);
  const [showSiteLayout, setShowSiteLayout] = useState(false);
  const [currentTable, setCurrentTable] = useState(0);

  const tables = [
    { src: '/images/table1.jpg', alt: 'Area Sheet - Table 1' },
    { src: '/images/table2.jpg', alt: 'Area Sheet - Table 2' }
  ];

  const nextTable = () => {
    setCurrentTable((prev) => (prev + 1) % tables.length);
  };

  const prevTable = () => {
    setCurrentTable((prev) => (prev - 1 + tables.length) % tables.length);
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Area Sheet Modal */}
      <AnimatePresence>
        {showAreaSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setShowAreaSheet(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAreaSheet(false)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-brand-red transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={tables[currentTable].src}
                  alt={tables[currentTable].alt}
                  className="w-full h-auto"
                />

                {tables.length > 1 && (
                  <>
                    <button
                      onClick={prevTable}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-brand-red text-white rounded-full shadow-lg hover:bg-red-700 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextTable}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-brand-red text-white rounded-full shadow-lg hover:bg-red-700 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {tables.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTable(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentTable
                              ? 'bg-brand-red w-8'
                              : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="text-center mt-4">
                <p className="text-white text-sm">
                  Table {currentTable + 1} of {tables.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Site Layout Modal */}
      <AnimatePresence>
        {showSiteLayout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setShowSiteLayout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSiteLayout(false)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-brand-red transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/metro-industrial-map.jpg"
                  alt="Metro Industrial Park - Site Layout"
                  className="w-full h-auto"
                />
              </div>

              <div className="text-center mt-4">
                <p className="text-white text-sm">Site Layout Map</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-4"
      >
        <div className="max-w-7xl mx-auto">
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

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Property <span className="text-brand-red">Calculator</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-sm md:text-base ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Calculate ROI, rent & property values instantly
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => setShowAreaSheet(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } shadow-lg hover:shadow-xl`}
              >
                <FileText className="w-4 h-4" />
                <span>Area Sheet</span>
              </button>

              <button
                onClick={() => setShowSiteLayout(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-green-500 text-white hover:bg-green-600'
                } shadow-lg hover:shadow-xl`}
              >
                <MapPin className="w-4 h-4" />
                <span>Site Layout</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Calculator Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="px-4"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Main Calculator - Takes 2 columns */}
          <div className="lg:col-span-2">
            <CalculatorComponent />
          </div>

          {/* Simple Calculator - Takes 1 column */}
          <div className="lg:col-span-1">
            <SimpleCalculator />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Calculator;
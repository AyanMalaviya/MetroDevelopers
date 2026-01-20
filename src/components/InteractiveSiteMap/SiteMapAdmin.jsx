// src/components/InteractiveSiteMap/SiteMapAdmin.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Save, RotateCcw, Lock, Unlock } from 'lucide-react';

export default function SiteMapAdmin() {
  const { theme } = useTheme();
  const [plotStatuses, setPlotStatuses] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin password (in production, use proper authentication)
  const ADMIN_PASSWORD = 'metro2026';

  useEffect(() => {
    const saved = localStorage.getItem('metroIndustrialPlotStatuses');
    if (saved) {
      try {
        setPlotStatuses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load plot statuses');
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const updatePlotStatus = (plotNumber, status) => {
    const updated = { ...plotStatuses, [plotNumber]: status };
    setPlotStatuses(updated);
  };

  const handleSave = () => {
    localStorage.setItem('metroIndustrialPlotStatuses', JSON.stringify(plotStatuses));
    alert('Plot statuses saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all plot statuses?')) {
      setPlotStatuses({});
      localStorage.removeItem('metroIndustrialPlotStatuses');
      alert('All plot statuses have been reset!');
    }
  };

  // All plot numbers (1-63 based on the map)
  const allPlots = Array.from({ length: 63 }, (_, i) => (i + 1).toString());

  const filteredPlots = allPlots.filter(plot => 
    plot.includes(searchQuery) || 
    plotStatuses[plot]?.includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md mx-auto rounded-2xl shadow-xl p-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-center mb-6">
          <Lock className={`w-12 h-12 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
        </div>

        <h2 className={`text-2xl font-bold text-center mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Admin Access Required
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-brand-red'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-brand-red'
              } focus:outline-none focus:ring-4 focus:ring-brand-red/20`}
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg font-semibold bg-brand-red text-white hover:bg-red-700 transition-all duration-300 shadow-lg"
          >
            Login
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-xl p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Site Map Admin Panel
        </h2>
        <button
          onClick={() => setIsAuthenticated(false)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            theme === 'dark'
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Logout
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search plot number or status..."
          className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white focus:border-brand-red'
              : 'bg-white border-gray-300 text-gray-900 focus:border-brand-red'
          } focus:outline-none focus:ring-4 focus:ring-brand-red/20`}
        />
      </div>

      {/* Plot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredPlots.map((plotNumber) => {
          const status = plotStatuses[plotNumber] || 'available';

          return (
            <div
              key={plotNumber}
              className={`rounded-lg border-2 p-4 transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <p className={`text-center font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Plot {plotNumber}
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => updatePlotStatus(plotNumber, 'available')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    status === 'available'
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Available
                </button>

                <button
                  onClick={() => updatePlotStatus(plotNumber, 'rented')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    status === 'rented'
                      ? 'bg-green-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Rented
                </button>

                <button
                  onClick={() => updatePlotStatus(plotNumber, 'sold')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    status === 'sold'
                      ? 'bg-gray-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sold
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className={`mt-6 p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <h3 className={`font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Summary
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-500">
              {allPlots.filter(p => !plotStatuses[p] || plotStatuses[p] === 'available').length}
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Available
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">
              {allPlots.filter(p => plotStatuses[p] === 'rented').length}
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Rented
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-500">
              {allPlots.filter(p => plotStatuses[p] === 'sold').length}
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sold
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
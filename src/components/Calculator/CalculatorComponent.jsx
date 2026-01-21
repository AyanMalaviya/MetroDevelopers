// src/components/Calculator/CalculatorComponent.jsx
import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Calculator } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { calculateMultiplePlotArea } from '../../services/dataService';

const InputField = memo(({ label, field, value, onChange, suffix = '', highlighted = false, lockable = false, isLocked = false, onToggleLock }) => {
  const { theme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="input-group mb-4"
    >
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={field} className={`block text-sm font-semibold ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
        {lockable && (
          <button
            onClick={onToggleLock}
            className={`p-1 rounded transition-all duration-200 ${
              isLocked
                ? theme === 'dark'
                  ? 'text-amber-400 bg-amber-900/30 hover:bg-amber-900/50'
                  : 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                : theme === 'dark'
                  ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title={isLocked ? 'Unlock (allow auto-calculation)' : 'Lock (prevent auto-calculation)'}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          id={field}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 ${
            isLocked
              ? theme === 'dark'
                ? 'bg-amber-900/10 border-amber-500/50 text-white focus:border-amber-400 ring-2 ring-amber-500/20'
                : 'bg-amber-50 border-amber-400 text-gray-900 focus:border-amber-500 ring-2 ring-amber-400/20'
              : highlighted
                ? theme === 'dark'
                  ? 'bg-green-900/20 border-green-500/50 text-white focus:border-green-400'
                  : 'bg-green-50 border-green-400 text-gray-900 focus:border-green-500'
                : theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 text-white focus:border-brand-red'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-brand-red'
          } focus:outline-none focus:ring-4 ${
            isLocked
              ? 'focus:ring-amber-500/20'
              : highlighted
                ? 'focus:ring-green-500/20'
                : 'focus:ring-brand-red/20'
          }`}
          placeholder="0.00"
          autoComplete="off"
        />
        {suffix && (
          <span className={`text-sm font-semibold min-w-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {suffix}
          </span>
        )}
      </div>
    </motion.div>
  );
});

InputField.displayName = 'InputField';

export default function CalculatorComponent() {
  const { theme } = useTheme();
  const [data, setData] = useState({
    sqYard: '',
    sqFt: '',
    carpetArea: '',
    carpetAreaSqFt: '',
    rate: '',
    value: '',
    roi: '',
    yearlyRent: '',
    monthlyRent: ''
  });

  const [locks, setLocks] = useState({
    value: false,
    roi: false,
    yearlyRent: false,
    monthlyRent: false
  });

  // Multi-plot state
  const [plotInput, setPlotInput] = useState('');
  const [plotLoading, setPlotLoading] = useState(false);
  const [plotResult, setPlotResult] = useState(null);
  const [plotError, setPlotError] = useState('');

  const [showFormulas, setShowFormulas] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const LOADING_FACTOR = 0.25;

  useEffect(() => {
    const savedData = localStorage.getItem('calculatorData');
    const savedLocks = localStorage.getItem('calculatorLocks');

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        setHistory([parsed]);
        setHistoryIndex(0);
      } catch (e) {
        console.error('Failed to load data');
      }
    }

    if (savedLocks) {
      try {
        const parsedLocks = JSON.parse(savedLocks);
        setLocks(parsedLocks);
      } catch (e) {
        console.error('Failed to load locks');
      }
    }
  }, []);

  useEffect(() => {
    if (Object.values(data).some(v => v !== '')) {
      localStorage.setItem('calculatorData', JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('calculatorLocks', JSON.stringify(locks));
  }, [locks]);

  const toggleLock = useCallback((field) => {
    setLocks(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  const saveToHistory = useCallback((newData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newData);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setData(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setData(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  // NEW: Multi-plot calculation
  const handlePlotCalculation = async () => {
    if (!plotInput.trim()) {
      setPlotError('Please enter plot numbers');
      return;
    }

    setPlotLoading(true);
    setPlotError('');
    setPlotResult(null);

    try {
      const result = await calculateMultiplePlotArea(plotInput);

      if (result.plotCount === 0) {
        setPlotError('No valid plots found. Check your input format.');
        return;
      }

      setPlotResult(result);

      // Auto-fill the square yards input
      setData(currentData => {
        const updatedData = { 
          ...currentData, 
          sqYard: result.totalSqYd.toString() 
        };
        // Trigger dependent calculations
        return calculateDependentFields('sqYard', result.totalSqYd.toString(), updatedData);
      });

      // Show warning if some plots couldn't be calculated
      if (result.invalidPlots.length > 0) {
        const invalidIds = result.invalidPlots.map(p => p.id).join(', ');
        setPlotError(`⚠️ Warning: Plots ${invalidIds} could not be calculated`);
      }

    } catch (err) {
      setPlotError('Error calculating area. Make sure Google Sheets is set up correctly.');
      console.error('Plot calculation error:', err);
    } finally {
      setPlotLoading(false);
    }
  };

  // Clear multi-plot results
  const clearPlotCalculation = () => {
    setPlotInput('');
    setPlotResult(null);
    setPlotError('');
  };

  const calculateDependentFields = useCallback((field, value, currentData) => {
    const newData = { ...currentData };

    const sqYard = parseFloat(newData.sqYard) || 0;
    const sqFt = parseFloat(newData.sqFt) || 0;
    const carpetArea = parseFloat(newData.carpetArea) || 0;
    const rate = parseFloat(newData.rate) || 0;
    const propValue = parseFloat(newData.value) || 0;
    const roi = parseFloat(newData.roi) || 0;
    const yearlyRent = parseFloat(newData.yearlyRent) || 0;
    const monthlyRent = parseFloat(newData.monthlyRent) || 0;

    switch(field) {
      case 'sqYard':
        if (sqYard > 0) {
          newData.sqFt = (sqYard * 9).toFixed(2);
          newData.carpetArea = (sqYard * (1 - LOADING_FACTOR)).toFixed(2);
          newData.carpetAreaSqFt = (parseFloat(newData.carpetArea) * 9).toFixed(2);
          if (rate > 0 && !locks.value) {
            newData.value = (sqYard * rate).toFixed(2);
          }
        }
        break;

      case 'sqFt':
        if (sqFt > 0) {
          newData.sqYard = (sqFt / 9).toFixed(2);
          newData.carpetArea = (parseFloat(newData.sqYard) * (1 - LOADING_FACTOR)).toFixed(2);
          newData.carpetAreaSqFt = (parseFloat(newData.carpetArea) * 9).toFixed(2);
          if (rate > 0 && !locks.value) {
            newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
          }
        }
        break;

      case 'carpetArea':
        if (carpetArea > 0) {
          newData.sqYard = (carpetArea / (1 - LOADING_FACTOR)).toFixed(2);
          newData.sqFt = (parseFloat(newData.sqYard) * 9).toFixed(2);
          newData.carpetAreaSqFt = (carpetArea * 9).toFixed(2);
          if (rate > 0 && !locks.value) {
            newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
          }
        }
        break;

      case 'rate':
        if (rate > 0 && parseFloat(newData.sqYard) > 0 && !locks.value) {
          newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
        }
        if (!locks.value && parseFloat(newData.value) > 0) {
          if (yearlyRent > 0 && !locks.roi) {
            newData.roi = ((yearlyRent / parseFloat(newData.value)) * 100).toFixed(2);
          } else if (roi > 0 && !locks.yearlyRent && !locks.monthlyRent) {
            newData.yearlyRent = ((roi * parseFloat(newData.value)) / 100).toFixed(2);
            newData.monthlyRent = (parseFloat(newData.yearlyRent) / 12).toFixed(2);
          }
        }
        break;

      case 'value':
        if (propValue > 0 && parseFloat(newData.sqYard) > 0) {
          newData.rate = (propValue / parseFloat(newData.sqYard)).toFixed(2);
        }
        if (propValue > 0) {
          if (yearlyRent > 0 && !locks.roi) {
            newData.roi = ((yearlyRent / propValue) * 100).toFixed(2);
          } else if (roi > 0 && !locks.yearlyRent && !locks.monthlyRent) {
            newData.yearlyRent = ((roi * propValue) / 100).toFixed(2);
            newData.monthlyRent = (parseFloat(newData.yearlyRent) / 12).toFixed(2);
          }
        }
        break;

      case 'roi':
        if (roi > 0) {
          if (propValue > 0 && !locks.yearlyRent && !locks.monthlyRent) {
            newData.yearlyRent = ((roi * propValue) / 100).toFixed(2);
            newData.monthlyRent = (parseFloat(newData.yearlyRent) / 12).toFixed(2);
          } else if (yearlyRent > 0 && !locks.value) {
            newData.value = ((yearlyRent / roi) * 100).toFixed(2);
            if (parseFloat(newData.sqYard) > 0) {
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
            }
          }
        }
        break;

      case 'yearlyRent':
        if (yearlyRent > 0 && !locks.monthlyRent) {
          newData.monthlyRent = (yearlyRent / 12).toFixed(2);
        }
        if (yearlyRent > 0) {
          if (propValue > 0 && !locks.roi) {
            newData.roi = ((yearlyRent / propValue) * 100).toFixed(2);
          } else if (roi > 0 && !locks.value) {
            newData.value = ((yearlyRent / roi) * 100).toFixed(2);
            if (parseFloat(newData.sqYard) > 0) {
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
            }
          }
        }
        break;

      case 'monthlyRent':
        if (monthlyRent > 0 && !locks.yearlyRent) {
          newData.yearlyRent = (monthlyRent * 12).toFixed(2);
        }
        if (monthlyRent > 0) {
          const calculatedYearlyRent = parseFloat(newData.yearlyRent) || 0;
          if (propValue > 0 && !locks.roi) {
            newData.roi = ((calculatedYearlyRent / propValue) * 100).toFixed(2);
          } else if (roi > 0 && !locks.value) {
            newData.value = ((calculatedYearlyRent / roi) * 100).toFixed(2);
            if (parseFloat(newData.sqYard) > 0) {
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
            }
          }
        }
        break;
    }

    return newData;
  }, [LOADING_FACTOR, locks]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;

    if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) {
      return;
    }

    setData(currentData => {
      const updatedData = { ...currentData, [field]: value };
      const finalData = calculateDependentFields(field, value, updatedData);
      return finalData;
    });

    setTimeout(() => {
      setData(currentData => {
        saveToHistory(currentData);
        return currentData;
      });
    }, 500);
  }, [calculateDependentFields, saveToHistory]);

  const clearAll = useCallback(() => {
    const emptyData = {
      sqYard: '', sqFt: '', carpetArea: '', carpetAreaSqFt: '',
      rate: '', value: '', roi: '', yearlyRent: '', monthlyRent: ''
    };
    setData(emptyData);
    saveToHistory(emptyData);
    clearPlotCalculation();
  }, [saveToHistory]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-2xl shadow-2xl p-6 mb-6 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-brand-red via-red-700 to-gray-900'
            : 'bg-gradient-to-r from-brand-red via-red-600 to-red-700'
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              ROI & Valuation Calculator
            </h2>
            <p className="text-white/80 text-xs mt-1">
              🔒 Lock fields to prevent auto-calculation • 📍 Calculate multiple plots
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={undo} 
              disabled={historyIndex <= 0}
              className="px-3 py-2 text-sm rounded-lg font-semibold transition-all duration-300 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↶ Undo
            </button>
            <button 
              onClick={redo} 
              disabled={historyIndex >= history.length - 1}
              className="px-3 py-2 text-sm rounded-lg font-semibold transition-all duration-300 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↷ Redo
            </button>
            <button 
              onClick={() => setShowFormulas(!showFormulas)}
              className="px-3 py-2 text-sm rounded-lg font-semibold bg-white text-brand-red hover:bg-gray-100 transition-all duration-300"
            >
              {showFormulas ? 'Hide' : 'Show'} Formulas
            </button>
          </div>
        </div>
      </motion.div>

      {/* Multi-Plot Calculator Card */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-purple-500 ${
          theme === 'dark' 
            ? 'bg-gray-800/90 backdrop-blur-sm' 
            : 'bg-gradient-to-br from-purple-50 to-blue-50'
        }`}
      >
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
        }`}>
          <Calculator className="w-5 h-5" />
          Calculate Multiple Plots (Optional)
        </h3>

        <div className="mb-3">
          <label className={`block text-sm font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Enter Plot Numbers
          </label>
          <input
            type="text"
            value={plotInput}
            onChange={(e) => setPlotInput(e.target.value)}
            placeholder="e.g., p1p3p13p29 or 1,3,13,29 or 1 3 13 29"
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20`}
            disabled={plotLoading}
          />
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Formats: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">p1p3p5</code> • <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">1,3,5</code> • <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">1 3 5</code>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePlotCalculation}
            disabled={plotLoading || !plotInput.trim()}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              plotLoading || !plotInput.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-purple-500 hover:bg-purple-600'
            } text-white shadow-lg hover:shadow-xl`}
          >
            {plotLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                Calculate Total Area
              </>
            )}
          </button>

          {plotResult && (
            <button
              onClick={clearPlotCalculation}
              className={`px-4 py-3 rounded-lg font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Clear
            </button>
          )}
        </div>

        {/* Error Message */}
        {plotError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 p-3 rounded-lg border-l-4 ${
              plotError.includes('Warning')
                ? 'bg-orange-100 border-orange-500'
                : 'bg-red-100 border-red-500'
            }`}
          >
            <p className={`text-sm font-semibold ${
              plotError.includes('Warning') ? 'text-orange-800' : 'text-red-800'
            }`}>
              {plotError}
            </p>
          </motion.div>
        )}

        {/* Success Result */}
        {plotResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-green-100 border-2 border-green-500 rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-green-800 font-bold text-lg flex items-center gap-2">
                ✅ Calculation Complete
              </h4>
              <span className="text-xs text-green-700 font-semibold bg-green-200 px-2 py-1 rounded">
                {plotResult.plotCount} plots
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white p-3 rounded-lg border border-green-300">
                <p className="text-xs text-gray-600 mb-1">Total Area</p>
                <p className="text-2xl font-bold text-green-700">
                  {plotResult.totalSqYd} <span className="text-sm">SQ YD</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">✓ Auto-filled above</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-300">
                <p className="text-xs text-gray-600 mb-1">Square Feet</p>
                <p className="text-2xl font-bold text-green-700">
                  {plotResult.totalSqFt} <span className="text-sm">SQ FT</span>
                </p>
              </div>
            </div>

            {/* Plot Breakdown Table */}
            {plotResult.validPlots.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-green-800 hover:text-green-900 hover:underline">
                  📋 View Plot Breakdown ({plotResult.validPlots.length} plots)
                </summary>
                <div className="mt-2 bg-white rounded-lg overflow-hidden border border-green-300">
                  <table className="w-full text-sm">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-left py-2 px-3 font-semibold text-green-900">Plot</th>
                        <th className="text-right py-2 px-3 font-semibold text-green-900">Area</th>
                        <th className="text-right py-2 px-3 font-semibold text-green-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plotResult.validPlots.map((plot, idx) => (
                        <tr key={plot.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-2 px-3 font-medium">Plot {plot.id}</td>
                          <td className="text-right py-2 px-3">{plot.area}</td>
                          <td className="text-right py-2 px-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              plot.status === 'available' ? 'bg-green-100 text-green-800' :
                              plot.status === 'pre-leased' ? 'bg-blue-100 text-blue-800' :
                              plot.status === 'leased' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {plot.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Formula Card */}
      {showFormulas && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-amber-500 ${
            theme === 'dark'
              ? 'bg-gray-800/90 backdrop-blur-sm'
              : 'bg-gradient-to-br from-amber-50 to-yellow-50'
          }`}
        >
          <h3 className={`text-lg font-bold mb-3 ${
            theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
          }`}>
            Formula Reference
          </h3>
          <div className={`space-y-1.5 text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p><strong>Sq. Ft:</strong> Sq. Yard × 9</p>
            <p><strong>Carpet Area:</strong> Sq. Yard × 0.75</p>
            <p><strong>Value:</strong> Sq. Yard × Rate</p>
            <p><strong>Yearly Rent:</strong> Monthly Rent × 12</p>
            <p><strong>ROI:</strong> (Yearly Rent ÷ Value) × 100</p>
            <p><strong>Value from ROI:</strong> (Yearly Rent ÷ ROI) × 100</p>
          </div>
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Area Card */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 ${
            theme === 'dark' 
              ? 'bg-gray-800/90 backdrop-blur-sm' 
              : 'bg-white'
          }`}
        >
          <h3 className={`text-lg font-bold mb-5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            Area Measurements
          </h3>

          <InputField 
            label="Sq. Yard (Super Built-Up)" 
            field="sqYard"
            value={data.sqYard}
            onChange={handleInputChange('sqYard')}
            suffix="yd²"
            highlighted={plotResult !== null}
          />
          <InputField 
            label="Sq. Ft" 
            field="sqFt"
            value={data.sqFt}
            onChange={handleInputChange('sqFt')}
            suffix="ft²"
          />
          <InputField 
            label="Carpet Area (Sq. Yard)" 
            field="carpetArea"
            value={data.carpetArea}
            onChange={handleInputChange('carpetArea')}
            suffix="yd²"
            highlighted={true}
          />
          <InputField 
            label="Carpet Area (Sq. Ft)" 
            field="carpetAreaSqFt"
            value={data.carpetAreaSqFt}
            onChange={handleInputChange('carpetAreaSqFt')}
            suffix="ft²"
            highlighted={true}
          />
        </motion.div>

        {/* Financial Card */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`rounded-2xl shadow-xl p-6 border-l-4 border-green-500 ${
            theme === 'dark' 
              ? 'bg-gray-800/90 backdrop-blur-sm' 
              : 'bg-white'
          }`}
        >
          <h3 className={`text-lg font-bold mb-5 ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`}>
            Financial Details
          </h3>

          <InputField 
            label="Rate per Sq. Yard" 
            field="rate"
            value={data.rate}
            onChange={handleInputChange('rate')}
            suffix="₹"
          />
          <InputField 
            label="Property Value" 
            field="value"
            value={data.value}
            onChange={handleInputChange('value')}
            suffix="₹"
            lockable={true}
            isLocked={locks.value}
            onToggleLock={() => toggleLock('value')}
          />
          <InputField 
            label="Monthly Rent" 
            field="monthlyRent"
            value={data.monthlyRent}
            onChange={handleInputChange('monthlyRent')}
            suffix="₹"
            lockable={true}
            isLocked={locks.monthlyRent}
            onToggleLock={() => toggleLock('monthlyRent')}
          />
          <InputField 
            label="Yearly Rent" 
            field="yearlyRent"
            value={data.yearlyRent}
            onChange={handleInputChange('yearlyRent')}
            suffix="₹"
            lockable={true}
            isLocked={locks.yearlyRent}
            onToggleLock={() => toggleLock('yearlyRent')}
          />
          <InputField 
            label="ROI (%)" 
            field="roi"
            value={data.roi}
            onChange={handleInputChange('roi')}
            suffix="%"
            lockable={true}
            isLocked={locks.roi}
            onToggleLock={() => toggleLock('roi')}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={`rounded-2xl shadow-xl p-5 mt-6 ${
          theme === 'dark' 
            ? 'bg-gray-800/90 backdrop-blur-sm' 
            : 'bg-white'
        }`}
      >
        <div className="flex gap-4 flex-wrap items-center justify-between">
          <button 
            onClick={clearAll}
            className="px-5 py-2.5 rounded-lg font-semibold bg-brand-red text-white hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Clear All
          </button>
          <span className={`text-sm flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Auto-saved
          </span>
        </div>
      </motion.div>
    </div>
  );
}
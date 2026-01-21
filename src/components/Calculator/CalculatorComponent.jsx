// src/components/Calculator/CalculatorComponent.jsx
import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Calculator as CalcIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { calculateMultiplePlotArea } from '../../services/dataService';

const InputField = memo(({ 
  label, 
  field, 
  value, 
  onChange, 
  onKeyDown,
  suffix = '', 
  highlighted = false, 
  lockable = false, 
  isLocked = false, 
  onToggleLock,
  helperText = null,
  isProcessing = false,
  allowSpecialChars = false,
  showButton = false,
  onButtonClick = null,
  buttonDisabled = false
}) => {
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
        <div className="relative flex-1">
          <input
            id={field}
            type="text"
            inputMode={allowSpecialChars ? "text" : "decimal"}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
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
            } ${isProcessing ? 'pr-10' : ''}`}
            placeholder="0.00"
            autoComplete="off"
          />
          {isProcessing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-purple-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>
        {showButton && onButtonClick && (
          <button
            onClick={onButtonClick}
            disabled={buttonDisabled || isProcessing}
            className={`px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              buttonDisabled || isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-purple-500 hover:bg-purple-600'
            } text-white shadow-lg hover:shadow-xl`}
            title="Calculate total area (or press Enter)"
          >
            <CalcIcon className="w-4 h-4" />
          </button>
        )}
        {suffix && !showButton && (
          <span className={`text-sm font-semibold min-w-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {suffix}
          </span>
        )}
      </div>
      {helperText && (
        <p className={`text-xs mt-1 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {helperText}
        </p>
      )}
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

  const [plotResult, setPlotResult] = useState(null);
  const [isCalculatingPlots, setIsCalculatingPlots] = useState(false);
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
      setPlotResult(null);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setData(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  // Check if input looks like plot numbers
  const looksLikePlotNumbers = (value) => {
    if (!value) return false;
    // Check for comma-separated numbers: "1,2,3" or "1, 2, 3"
    if (/^\d+(\s*,\s*\d+)+$/.test(value)) return true;
    // Check for space-separated numbers with more than 2 numbers: "1 2 3"
    const spaceSeparated = value.trim().split(/\s+/);
    if (spaceSeparated.length >= 2 && spaceSeparated.every(n => /^\d+$/.test(n))) return true;
    return false;
  };

  // Calculate plots - triggered by button or Enter key
  const handlePlotCalculation = useCallback(async () => {
    const value = data.sqYard;

    if (!value || !looksLikePlotNumbers(value)) {
      return;
    }

    setIsCalculatingPlots(true);

    try {
      const result = await calculateMultiplePlotArea(value);

      if (result.plotCount > 0) {
        setPlotResult(result);

        // Auto-fill with calculated total
        setData(currentData => {
          const updatedData = { 
            ...currentData, 
            sqYard: result.totalSqYd.toString() 
          };
          return calculateDependentFields('sqYard', result.totalSqYd.toString(), updatedData);
        });

        setTimeout(() => {
          setData(currentData => {
            saveToHistory(currentData);
            return currentData;
          });
        }, 500);
      } else {
        setPlotResult(null);
      }
    } catch (error) {
      console.error('Plot calculation error:', error);
      setPlotResult(null);
    } finally {
      setIsCalculatingPlots(false);
    }
  }, [data.sqYard, saveToHistory]);

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

    // Special handling for sqYard field - allow commas and spaces for plot numbers
    if (field === 'sqYard') {
      // Allow numbers, commas, spaces, and decimals
      if (value !== '' && !/^[\d,\s.]+$/.test(value)) {
        return;
      }

      setData(currentData => ({ ...currentData, sqYard: value }));

      // Clear plot result when user edits
      if (plotResult) {
        setPlotResult(null);
      }

      // If it's just a normal number (no commas/spaces), calculate immediately
      if (!looksLikePlotNumbers(value)) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && value !== '') {
          setData(currentData => {
            const updatedData = { ...currentData, sqYard: value };
            return calculateDependentFields('sqYard', value, updatedData);
          });
        }
      }

      return;
    }

    // Normal number input handling for other fields
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
  }, [calculateDependentFields, saveToHistory, plotResult]);

  // Handle Enter key press
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && looksLikePlotNumbers(data.sqYard)) {
      e.preventDefault();
      handlePlotCalculation();
    }
  }, [data.sqYard, handlePlotCalculation]);

  const clearAll = useCallback(() => {
    const emptyData = {
      sqYard: '', sqFt: '', carpetArea: '', carpetAreaSqFt: '',
      rate: '', value: '', roi: '', yearlyRent: '', monthlyRent: ''
    };
    setData(emptyData);
    setPlotResult(null);
    saveToHistory(emptyData);
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
              🔒 Lock fields • 📍 Enter plot numbers: 1,3,5 then press Enter ⏎
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

      {/* Plot Result Banner */}
      <AnimatePresence>
        {plotResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className={`rounded-xl shadow-lg p-4 mb-6 border-l-4 border-green-500 ${
              theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className={`text-sm font-bold mb-2 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-700'
                }`}>
                  ✅ {plotResult.plotCount} Plot{plotResult.plotCount > 1 ? 's' : ''} Calculated
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Total: 
                    </span>
                    <span className={`font-bold ml-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plotResult.totalSqYd} sq yd
                    </span>
                  </div>
                  <div>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      ({plotResult.totalSqFt} sq ft)
                    </span>
                  </div>
                </div>

                {/* Plot breakdown */}
                <details className="mt-2">
                  <summary className={`text-xs cursor-pointer ${
                    theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-700 hover:text-green-800'
                  }`}>
                    View breakdown
                  </summary>
                  <div className="mt-2 text-xs space-y-1">
                    {plotResult.validPlots.map(plot => (
                      <div key={plot.id} className={`flex justify-between ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span>Plot {plot.id}</span>
                        <span>{plot.area}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
              <button
                onClick={() => setPlotResult(null)}
                className={`text-xs px-2 py-1 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            onKeyDown={handleKeyDown}
            highlighted={plotResult !== null}
            helperText="💡 Type plot numbers (e.g., 1,3,5) then press Enter ⏎ or click button"
            isProcessing={isCalculatingPlots}
            allowSpecialChars={true}
            showButton={looksLikePlotNumbers(data.sqYard)}
            onButtonClick={handlePlotCalculation}
            buttonDisabled={!looksLikePlotNumbers(data.sqYard)}
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
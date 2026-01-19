// src/components/Calculator/CalculatorComponent.jsx
import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const InputField = memo(({ label, field, value, onChange, suffix = '', highlighted = false }) => {
  const { theme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="input-group mb-4"
    >
      <label htmlFor={field} className={`block text-sm font-semibold mb-2 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={field}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 ${
            highlighted
              ? theme === 'dark'
                ? 'bg-green-900/20 border-green-500/50 text-white focus:border-green-400'
                : 'bg-green-50 border-green-400 text-gray-900 focus:border-green-500'
              : theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700 text-white focus:border-brand-red'
                : 'bg-white border-gray-300 text-gray-900 focus:border-brand-red'
          } focus:outline-none focus:ring-4 ${
            highlighted
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

  const [showFormulas, setShowFormulas] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const LOADING_FACTOR = 0.25;

  useEffect(() => {
    const savedData = localStorage.getItem('calculatorData');
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
  }, []);

  useEffect(() => {
    if (Object.values(data).some(v => v !== '')) {
      localStorage.setItem('calculatorData', JSON.stringify(data));
    }
  }, [data]);

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
          if (rate > 0) {
            newData.value = (sqYard * rate).toFixed(2);
          }
        }
        break;

      case 'sqFt':
        if (sqFt > 0) {
          newData.sqYard = (sqFt / 9).toFixed(2);
          newData.carpetArea = (parseFloat(newData.sqYard) * (1 - LOADING_FACTOR)).toFixed(2);
          newData.carpetAreaSqFt = (parseFloat(newData.carpetArea) * 9).toFixed(2);
          if (rate > 0) {
            newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
          }
        }
        break;

      case 'carpetArea':
        if (carpetArea > 0) {
          newData.sqYard = (carpetArea / (1 - LOADING_FACTOR)).toFixed(2);
          newData.sqFt = (parseFloat(newData.sqYard) * 9).toFixed(2);
          newData.carpetAreaSqFt = (carpetArea * 9).toFixed(2);
          if (rate > 0) {
            newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
          }
        }
        break;

      case 'rate':
        if (rate > 0 && parseFloat(newData.sqYard) > 0) {
          newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
        }
        break;

      case 'value':
        if (propValue > 0 && parseFloat(newData.sqYard) > 0) {
          newData.rate = (propValue / parseFloat(newData.sqYard)).toFixed(2);
        }
        if (propValue > 0 && yearlyRent > 0) {
          newData.roi = ((yearlyRent / propValue) * 100).toFixed(2);
        }
        break;

      case 'roi':
        if (roi > 0 && propValue > 0) {
          newData.yearlyRent = ((roi * propValue) / 100).toFixed(2);
          newData.monthlyRent = (parseFloat(newData.yearlyRent) / 12).toFixed(2);
        }
        break;

      case 'yearlyRent':
        if (yearlyRent > 0) {
          newData.monthlyRent = (yearlyRent / 12).toFixed(2);
          if (propValue > 0) {
            newData.roi = ((yearlyRent / propValue) * 100).toFixed(2);
          }
        }
        break;

      case 'monthlyRent':
        if (monthlyRent > 0) {
          newData.yearlyRent = (monthlyRent * 12).toFixed(2);
          if (propValue > 0) {
            newData.roi = ((parseFloat(newData.yearlyRent) / propValue) * 100).toFixed(2);
          }
        }
        break;
    }

    return newData;
  }, [LOADING_FACTOR]);

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
          />
          <InputField 
            label="Monthly Rent" 
            field="monthlyRent"
            value={data.monthlyRent}
            onChange={handleInputChange('monthlyRent')}
            suffix="₹"
          />
          <InputField 
            label="Yearly Rent" 
            field="yearlyRent"
            value={data.yearlyRent}
            onChange={handleInputChange('yearlyRent')}
            suffix="₹"
          />
          <InputField 
            label="ROI (%)" 
            field="roi"
            value={data.roi}
            onChange={handleInputChange('roi')}
            suffix="%"
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
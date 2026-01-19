// src/components/Calculator/SimpleCalculator.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Delete, RotateCcw } from 'lucide-react';

export default function SimpleCalculator() {
  const { theme } = useTheme();
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const handleNumber = (num) => {
    if (display === '0' || lastResult !== null) {
      setDisplay(num);
      setExpression(num);
      setLastResult(null);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op) => {
    setLastResult(null);
    const lastChar = expression.slice(-1);

    // Don't add operator if expression is empty or last char is already an operator
    if (expression === '' && op !== '-') return;

    // Replace last operator if user clicks another operator
    if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
      setExpression(expression.slice(0, -1) + op);
      setDisplay(op);
    } else {
      setExpression(expression + op);
      setDisplay(op);
    }
  };

  const handleDecimal = () => {
    setLastResult(null);
    // Get the current number being typed
    const parts = expression.split(/[+\-×÷%()]/);
    const currentNumber = parts[parts.length - 1];

    // Only add decimal if current number doesn't have one
    if (!currentNumber.includes('.')) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  const handleBracket = (bracket) => {
    setLastResult(null);
    setExpression(expression + bracket);
    setDisplay(bracket);
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
  };

  const handleBackspace = () => {
    if (expression.length === 0) return;

    const newExpression = expression.slice(0, -1);
    setExpression(newExpression);
    setDisplay(newExpression.slice(-1) || '0');
    setLastResult(null);
  };

  const evaluateExpression = (expr) => {
    try {
      // Replace symbols for calculation
      let calcExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100');

      // Use Function constructor for safe evaluation (better than eval)
      const result = Function('"use strict"; return (' + calcExpr + ')')();

      return result;
    } catch (error) {
      return 'Error';
    }
  };

  const handleEquals = () => {
    if (expression === '') return;

    try {
      const result = evaluateExpression(expression);

      if (result === 'Error' || isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
        setLastResult(null);
      } else {
        const formatted = parseFloat(result.toFixed(10)).toString();
        setDisplay(formatted);
        setLastResult(formatted);
        setExpression(formatted);
      }
    } catch (error) {
      setDisplay('Error');
      setLastResult(null);
    }
  };

  const Button = ({ children, onClick, className = '', variant = 'default' }) => {
    const baseClasses = "px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-lg";

    const variants = {
      default: theme === 'dark'
        ? 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500'
        : 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
      operator: theme === 'dark'
        ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
      equals: theme === 'dark'
        ? 'bg-brand-red text-white hover:bg-red-700 active:bg-red-800'
        : 'bg-brand-red text-white hover:bg-red-700 active:bg-red-800',
      clear: theme === 'dark'
        ? 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800'
        : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700',
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl shadow-xl p-6 border-l-4 border-purple-500 ${
        theme === 'dark'
          ? 'bg-gray-800/90 backdrop-blur-sm'
          : 'bg-white'
      }`}
    >
      <h3 className={`text-lg font-bold mb-4 ${
        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
      }`}>
        Quick Calculator
      </h3>

      {/* Display */}
      <div className={`mb-4 p-4 rounded-lg ${
        theme === 'dark'
          ? 'bg-gray-900/50 border border-gray-700'
          : 'bg-gray-50 border border-gray-300'
      }`}>
        {/* Expression */}
        <div className={`text-sm mb-1 h-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {expression || ' '}
        </div>

        {/* Result Display */}
        <div className={`text-3xl font-bold text-right ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {display}
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <Button variant="clear" onClick={handleClear}>AC</Button>
        <Button variant="clear" onClick={handleBackspace}>
          <Delete className="w-5 h-5 mx-auto" />
        </Button>
        <Button variant="operator" onClick={() => handleBracket('(')}>(</Button>
        <Button variant="operator" onClick={() => handleBracket(')')}>)</Button>

        {/* Row 2 */}
        <Button onClick={() => handleNumber('7')}>7</Button>
        <Button onClick={() => handleNumber('8')}>8</Button>
        <Button onClick={() => handleNumber('9')}>9</Button>
        <Button variant="operator" onClick={() => handleOperator('÷')}>÷</Button>

        {/* Row 3 */}
        <Button onClick={() => handleNumber('4')}>4</Button>
        <Button onClick={() => handleNumber('5')}>5</Button>
        <Button onClick={() => handleNumber('6')}>6</Button>
        <Button variant="operator" onClick={() => handleOperator('×')}>×</Button>

        {/* Row 4 */}
        <Button onClick={() => handleNumber('1')}>1</Button>
        <Button onClick={() => handleNumber('2')}>2</Button>
        <Button onClick={() => handleNumber('3')}>3</Button>
        <Button variant="operator" onClick={() => handleOperator('-')}>−</Button>

        {/* Row 5 */}
        <Button onClick={() => handleNumber('0')}>0</Button>
        <Button onClick={handleDecimal}>.</Button>
        <Button variant="operator" onClick={() => handleOperator('%')}>%</Button>
        <Button variant="operator" onClick={() => handleOperator('+')}>+</Button>

        {/* Row 6 - Equals button spanning 4 columns */}
        <Button variant="equals" onClick={handleEquals} className="col-span-4">
          = Calculate
        </Button>
      </div>

      {/* Help Text */}
      <div className={`mt-4 text-xs ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      }`}>
        <p>Supports BODMAS: Brackets, Orders, Division, Multiplication, Addition, Subtraction</p>
        <p className="mt-1">Example: (100+50)×2÷3 = 100</p>
      </div>
    </motion.div>
  );
}
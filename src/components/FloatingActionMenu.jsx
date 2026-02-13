import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowUp, 
  Sun, 
  Moon, 
  Type, 
  Map,
  Compass,
  X,
  Factory
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FloatingActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFontSize = () => {
    const root = document.documentElement;
    if (fontSize === 'normal') {
      root.style.fontSize = '18px';
      setFontSize('large');
    } else if (fontSize === 'large') {
      root.style.fontSize = '20px';
      setFontSize('xlarge');
    } else {
      root.style.fontSize = '16px';
      setFontSize('normal');
    }
  };

  const navigateToMetroPark = () => {
    navigate('/metro-industrial-park');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSiteMap = () => {
    navigate('/site-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItems = [
    {
      icon: ArrowUp,
      label: 'Back to Top',
      action: scrollToTop,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: theme === 'light' ? Moon : Sun,
      label: theme === 'light' ? 'Dark Mode' : 'Light Mode',
      action: toggleTheme,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Type,
      label: `Font Size: ${fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Large' : 'X-Large'}`,
      action: toggleFontSize,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: Factory,
      label: 'Explore Project',
      action: navigateToMetroPark,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      icon: Map,
      label: 'Plan & Availability',
      action: navigateToSiteMap,
      color: 'bg-teal-500 hover:bg-teal-600',
    }
  ];

  // Calculate positions in a circular pattern
  const radius = 100;
  const angleStep = -120 / menuItems.length;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && menuItems.map((item, index) => {
          const angle = (index * angleStep - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={index}
              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                x, 
                y, 
                opacity: 1,
                transition: {
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.05
                }
              }}
              exit={{ 
                scale: 0, 
                x: 0, 
                y: 0, 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
              className="absolute bottom-0 right-0"
            >
              <motion.button
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${item.color} w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center relative group`}
                aria-label={item.label}
              >
                <item.icon size={20} />
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          rotate: isOpen ? 135 : 0,
          backgroundColor: isOpen ? '#ef4444' : '#dc2626'
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-12 h-12 rounded-full bg-brand-red shadow-2xl flex items-center justify-center text-white overflow-hidden"
        aria-label="Quick actions menu"
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: isOpen ? 20 : 0,
            opacity: isOpen ? 0.2 : 0
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white rounded-full"
        />
        
        {/* Icon */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles size={20} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple Effect */}
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="absolute inset-0 border-2 border-white rounded-full"
          />
        )}
      </motion.button>

      {/* Particle Effects */}
      <AnimatePresence>
        {isOpen && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 45) * (Math.PI / 180)) * 120,
                  y: Math.sin((i * 45) * (Math.PI / 180)) * 120,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
                className="absolute bottom-8 right-8 w-1 h-1 bg-brand-red rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;

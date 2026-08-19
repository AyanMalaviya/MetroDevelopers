// src/components/PWAInstallPrompt.jsx
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    let installPromptTimeout;

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);

      const dismissed = localStorage.getItem('pwaInstallDismissed');
      const dismissedAt = Number(dismissed);
      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      if (!dismissed || Number.isNaN(dismissedAt) || (now - dismissedAt) > oneDayInMs) {
        installPromptTimeout = window.setTimeout(() => setShowPrompt(true), 2500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      if (installPromptTimeout) {
        window.clearTimeout(installPromptTimeout);
      }
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-[999] flex justify-center px-4 pointer-events-none">
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="pointer-events-auto max-w-sm w-full rounded-2xl shadow-2xl p-4 sm:p-5 relative border backdrop-blur-xl transition-colors duration-300"
            style={{
              backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className={`pointer-events-none absolute inset-0 rounded-2xl ${
                isDark
                  ? 'bg-gradient-to-br from-brand-red/16 via-white/5 to-transparent'
                  : 'bg-gradient-to-br from-brand-red/10 via-white/40 to-transparent'
              }`}
              aria-hidden="true"
            />
            
            <button
              onClick={handleDismiss}
              className={`absolute top-3 right-3 transition-colors z-20 p-1 rounded-full ${
                isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Close"
            >
              <X size={16} />
            </button>
            
            <div className="relative z-10 flex items-center gap-3 mb-3 pr-6">
              <div className="w-10 h-10 bg-brand-red/15 border border-brand-red/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Download size={20} className="text-brand-red" />
              </div>
              <div className="text-left flex-1">
                <h4 className={`font-black text-sm font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Install Metro App
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Faster access and offline support.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleInstall}
              className="relative z-10 w-full px-4 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <Download size={14} />
              <span>Install Now</span>
            </button>
            
            <p className={`relative z-10 text-[10px] text-center mt-2 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Works offline after install
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PWAInstallPrompt;
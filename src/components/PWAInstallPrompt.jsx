import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      console.log('PWA: beforeinstallprompt event fired');
      
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      const dismissed = localStorage.getItem('pwaInstallDismissed');
      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      // If not dismissed, or dismissed over a day ago, show after 2.5 seconds
      if (!dismissed || (now - parseInt(dismissed)) > oneDayInMs) {
        setTimeout(() => setShowPrompt(true), 2500); // ✅ Changed to 2.5 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA: App is already installed');
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: User response: ${outcome}`);
    
    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-50 animate-slide-up w-[280px] sm:w-[300px]">
      <div className={`rounded-lg shadow-xl p-3.5 sm:p-4 relative border backdrop-blur-lg transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 to-black border-gray-700/80' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/90'
      }`}>
        
        <button
          onClick={handleDismiss}
          className={`absolute top-2 right-2 transition-colors ${
            isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label="Close"
        >
          <X size={16} />
        </button>
        
        <div className="flex items-center gap-2.5 mb-2.5 pr-4">
          <div className="w-10 h-10 bg-brand-red/10 border border-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download size={20} className="text-brand-red" />
          </div>
          <div className="text-left flex-1">
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Install Metro App
            </h4>
            <p className={`text-[11px] leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Faster access and offline support.
            </p>
          </div>
        </div>
        
        <button
          onClick={handleInstall}
          className="w-full px-3 py-2 bg-brand-red hover:bg-red-700 text-white font-semibold rounded-md transition-all text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
        >
          <Download size={14} />
          <span>Install Now</span>
        </button>
        
        <p className={`text-[10px] text-center mt-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Works offline after install
        </p>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
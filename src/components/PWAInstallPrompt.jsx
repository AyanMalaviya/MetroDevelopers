import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      console.log('PWA: beforeinstallprompt event fired');
      setDeferredPrompt(e);
      
      const dismissed = localStorage.getItem('pwaInstallDismissed');
      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      if (!dismissed || (now - parseInt(dismissed)) > oneDayInMs) {
        setTimeout(() => setShowPrompt(true), 5000);
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
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: User response: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slide-up max-w-xs sm:max-w-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl p-4 sm:p-5 relative border-2 border-brand-red/30 backdrop-blur-lg">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download size={24} className="text-brand-red" />
          </div>
          <div className="text-left flex-1">
            <h4 className="font-bold text-white text-sm sm:text-base">Install Metro App</h4>
            <p className="text-xs text-gray-400">Quick access anytime!</p>
          </div>
        </div>
        
        <button
          onClick={handleInstall}
          className="w-full px-4 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Download size={16} />
          <span>Install Now</span>
        </button>
        
        <p className="text-[10px] text-gray-500 text-center mt-2">
          Fast, offline access to our properties
        </p>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

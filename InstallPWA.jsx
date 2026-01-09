import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault(); // Prevent the default browser prompt
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      setIsInstalled(true);
      setShowInstallButton(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstallButton(false);
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Hide for this session but show again on next visit
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || !showInstallButton) {
    return null;
  }

  return (
    <>
      {/* Floating Install Button - Bottom Right */}
      <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40 animate-slide-up">
        <div className="bg-brand-red rounded-xl shadow-2xl p-4 max-w-xs border-2 border-brand-red/30">
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-all"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Install Our App</h4>
              <p className="text-white/90 text-xs">
                Quick access from your home screen
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full bg-white hover:bg-gray-100 text-brand-red font-bold py-2 px-4 rounded-lg transition-all text-sm"
          >
            Install Now
          </button>
        </div>
      </div>

      {/* Alternative: Top Banner Style (Optional - remove if you prefer floating button) */}
      {/* <div className="fixed top-16 left-0 right-0 z-40 bg-brand-red shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Download size={20} className="text-white flex-shrink-0" />
              <p className="text-white text-sm font-semibold">
                Install our app for quick access!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-white hover:bg-gray-100 text-brand-red font-bold py-2 px-4 rounded-lg transition-all text-sm"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="text-white hover:text-gray-200 p-2"
                aria-label="Dismiss"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default InstallPWA;

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DISMISS_KEY = 'metro-review-prompt-dismissed';

const ReviewPrompt = () => {
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const alreadyDismissed = localStorage.getItem(DISMISS_KEY) === 'true';
    if (alreadyDismissed) {
      setPromptDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowReviewPrompt(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const dismissPrompt = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setPromptDismissed(true);
    setShowReviewPrompt(false);
  };

  if (promptDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {showReviewPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 max-w-xs sm:max-w-sm"
        >
          <div
            className={`rounded-2xl shadow-2xl p-4 sm:p-6 relative border backdrop-blur-xl ${
              isDark
                ? 'bg-black border-white/15 shadow-black/60'
                : 'bg-white/90 border-gray-200/85 shadow-gray-300/70'
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-0 rounded-2xl ${
                isDark
                  ? 'bg-gradient-to-br from-brand-red/18 via-white/5 to-transparent'
                  : 'bg-gradient-to-br from-brand-red/12 via-white/35 to-transparent'
              }`}
              aria-hidden="true"
            />

            <button
              onClick={dismissPrompt}
              aria-label="Close review prompt"
              className={`absolute top-2 right-2 transition-colors z-20 ${
                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <X size={18} />
            </button>

            <div className="relative z-10 flex items-center gap-3 mb-3 pr-4">
              <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                <Star size={20} className="text-white fill-white" />
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Liked Metro Industrial Park?
                </p>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Leave us a quick review.
                </p>
              </div>
            </div>

            <a
              href="https://g.page/r/CfbFhZSjMaH1EBI/review"
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismissPrompt}
              className="relative z-10 block w-full text-center px-4 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm"
            >
              Write a Review
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewPrompt;

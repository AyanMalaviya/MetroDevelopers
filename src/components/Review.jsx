// src/components/Review.jsx
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
    <div className="fixed inset-x-0 bottom-6 z-[999] flex justify-center px-4 pointer-events-none">
      <AnimatePresence>
        {showReviewPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="pointer-events-auto max-w-sm w-full"
          >
            <div
              className={`rounded-2xl shadow-2xl p-4 sm:p-5 relative border backdrop-blur-xl ${
                isDark
                  ? 'bg-black border-white/15 shadow-black/60'
                  : 'bg-white/95 border-gray-200/85 shadow-gray-300/70'
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
                className={`absolute top-3 right-3 transition-colors z-20 p-1 rounded-full ${
                  isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <X size={16} />
              </button>

              <div className="relative z-10 flex items-center gap-3 mb-3 pr-6">
                <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Star size={20} className="text-white fill-white" />
                </div>
                <div>
                  <p className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Liked Metro Industrial Park?
                  </p>
                  <p className={`text-sm font-black font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Leave us a quick review.
                  </p>
                </div>
              </div>

              <a
                href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismissPrompt}
                className="relative z-10 block w-full text-center px-4 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all text-xs shadow-md hover:scale-[1.02]"
              >
                Write a Review
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewPrompt;
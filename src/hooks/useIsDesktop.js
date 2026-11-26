// src/hooks/useIsDesktop.js
import { useState, useEffect } from 'react';

/**
 * Tracks lg (>= 1024px) desktop breakpoint so vertical parallax transforms stay off on touch viewports.
 */
export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
};

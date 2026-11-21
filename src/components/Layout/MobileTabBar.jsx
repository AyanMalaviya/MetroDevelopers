// src/components/Layout/MobileTabBar.jsx
import { NavLink } from 'react-router-dom';
import { Factory, LandPlot, MapPin, Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CfbFhZSjMaH1EBI/review';

const MobileTabBar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgBar     = isDark ? 'bg-[#0B0B0D]/95' : 'bg-[#F5F3EE]/95';
  const bgHover   = isDark ? 'active:bg-[#17171B]' : 'active:bg-[#E7E4DC]';
  const border    = isDark ? 'border-white/[0.12]' : 'border-black/[0.12]';
  const divide    = isDark ? 'divide-white/[0.1]' : 'divide-black/[0.1]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textMuted = isDark ? 'text-[#8E8E98]' : 'text-[#5C5B56]';

  const sideTabClass = ({ isActive }) =>
    `relative flex flex-col items-center justify-center gap-1 py-2.5 px-1 transition-colors select-none ${bgHover} ${
      isActive ? textMain : textMuted
    }`;

  return (
    <nav
      aria-label="Mobile quick navigation"
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden border-t ${border} ${bgBar} backdrop-blur-md pb-[env(safe-area-inset-bottom)]`}
    >
      <div className={`grid grid-cols-[1fr_1fr_1.35fr_1fr_1fr] divide-x ${divide}`}>
        {/* 1. Industrial Park 1 */}
        <NavLink to="/metro-industrial-park" className={sideTabClass}>
          {({ isActive }) => (
            <>
              {isActive && (
                <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[2px] bg-brand-red" />
              )}
              <Factory
                size={15}
                className={isActive ? 'text-brand-red' : 'opacity-80'}
                aria-hidden="true"
              />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] leading-none whitespace-nowrap">
                Park 1
              </span>
            </>
          )}
        </NavLink>

        {/* 2. Industrial Park 2 */}
        <NavLink to="/metro-industrial-estate" className={sideTabClass}>
          {({ isActive }) => (
            <>
              {isActive && (
                <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[2px] bg-brand-red" />
              )}
              <LandPlot
                size={15}
                className={isActive ? 'text-brand-red' : 'opacity-80'}
                aria-hidden="true"
              />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] leading-none whitespace-nowrap">
                Park 2
              </span>
            </>
          )}
        </NavLink>

        {/* 3. CENTER — Availability (Solid Signal Red) */}
        <NavLink
          to="/site-map"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-1 py-2.5 px-1.5 text-white transition-colors select-none ${
              isActive ? 'bg-red-700' : 'bg-brand-red active:bg-red-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[2px] bg-white" />
              )}
              <MapPin size={16} className="text-white" aria-hidden="true" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] leading-none whitespace-nowrap">
                Availability
              </span>
            </>
          )}
        </NavLink>

        {/* 4. Industrial Park 3 */}
        <NavLink to="/metro-industrial-park-3" className={sideTabClass}>
          {({ isActive }) => (
            <>
              {isActive && (
                <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[2px] bg-brand-red" />
              )}
              <LandPlot
                size={15}
                className={isActive ? 'text-brand-red' : 'opacity-80'}
                aria-hidden="true"
              />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] leading-none whitespace-nowrap">
                Park 3
              </span>
            </>
          )}
        </NavLink>

        {/* 5. Google Reviews */}
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read or write a Google Review for Metro Industrial Park"
          className={`relative flex flex-col items-center justify-center gap-1 py-2.5 px-1 transition-colors select-none ${bgHover} ${textMuted} active:text-brand-red`}
        >
          <Star
            size={15}
            className="text-amber-500 fill-amber-500"
            aria-hidden="true"
          />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] leading-none whitespace-nowrap">
            Reviews
          </span>
        </a>
      </div>
    </nav>
  );
};

export default MobileTabBar;
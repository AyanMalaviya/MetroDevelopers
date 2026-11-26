// src/components/Layout/ParkDirectionsDropdown.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, ChevronDown, ArrowUpRight } from 'lucide-react';
import { PARK_DIRECTIONS } from '../../data/parkDirections';

/**
 * Reusable Google Maps park directions dropdown shared between Navbar and SiteMapPage.
 * Supports both controlled (`open`/`onOpenChange`) and uncontrolled usage.
 */
const ParkDirectionsDropdown = ({
  isDark,
  open,
  onOpenChange,
  activeParkId = null,
  compact = false,
  align = 'right',
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback(
    (next) => {
      const value = typeof next === 'function' ? next(isOpen) : next;
      if (onOpenChange) onOpenChange(value);
      if (!isControlled) setInternalOpen(value);
    },
    [isControlled, isOpen, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const onMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, setOpen]);

  const border    = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const divide    = isDark ? 'divide-white/[0.12]' : 'divide-gray-200';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const bgHeader  = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]';
  const textMain  = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const rowHover  = isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]';

  const triggerClasses = compact
    ? 'h-7 sm:h-8 px-2 sm:px-2.5 font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider gap-1'
    : 'h-9 px-2 xl:px-3 text-[11px] xl:text-xs font-bold uppercase tracking-[0.04em] xl:tracking-[0.08em] gap-1 xl:gap-1.5';

  const inactiveTriggerBg = compact ? bgHeader : bgSurface;
  const alignClasses = align === 'left-sm-right-md' ? 'left-0 md:left-auto md:right-0' : 'right-0';

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label="Park directions"
        className={`border inline-flex items-center whitespace-nowrap transition-colors ${triggerClasses} ${
          isOpen
            ? 'bg-brand-red border-brand-red text-white'
            : `${border} ${inactiveTriggerBg} ${textMain} hover:border-brand-red hover:text-brand-red`
        }`}
      >
        <MapPin
          size={compact ? 11 : 13}
          className={isOpen ? 'text-white' : 'text-brand-red'}
          aria-hidden="true"
        />
        <span>Directions</span>
        <ChevronDown
          size={compact ? 11 : 12}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${alignClasses} top-full mt-2 w-60 sm:w-64 border ${border} ${bgSurface} shadow-2xl z-50`}
        >
          <div className={`px-3.5 py-2 border-b ${border} ${bgHeader} font-mono text-[10px] uppercase tracking-[0.16em] ${textMuted}`}>
            Park Directions
          </div>
          <div className={`divide-y ${divide}`}>
            {PARK_DIRECTIONS.map((park) => {
              const isCurrent = activeParkId === park.id;
              return (
                <a
                  key={park.id}
                  href={park.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 transition-colors ${rowHover}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin size={13} className="text-brand-red shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${textMain} flex items-center gap-1.5`}>
                        <span>{park.name}</span>
                        <span className="font-mono text-[10px] text-brand-red">{park.code}</span>
                        {isCurrent && (
                          <span className="font-mono text-[8.5px] uppercase px-1 py-0.5 bg-brand-red/10 text-brand-red border border-brand-red/30">
                            Active
                          </span>
                        )}
                      </p>
                      <p className={`text-[11px] ${textMuted} truncate`}>{park.location}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={13} className={`${textMuted} shrink-0`} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkDirectionsDropdown;

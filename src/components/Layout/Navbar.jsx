// src/components/Layout/Navbar.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu, X, Calculator, MapPin, Home, Factory,
  Store, Mail, Sun, Moon, Phone, MessageCircle, ChevronDown,
  Settings2, Type, ArrowUpRight,
  LucideLandPlot, Star,
} from 'lucide-react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useNavbar } from '../../context/useNavbar';
import { PARK_DIRECTIONS } from '../../data/parkDirections';
import ParkDirectionsDropdown from './ParkDirectionsDropdown';

const EASE = [0.16, 1, 0.3, 1];
const FONT_SIZE_STORAGE_KEY = 'metro-font-size';
const FONT_SIZE_VALUES = { normal: '16px', large: '18px', xlarge: '20px' };

const NAV_ITEMS = [
  { path: '/',                        label: 'Home',       icon: Home           },
  { path: '/metro-industrial-park',   label: 'Park 1',     icon: Factory        },
  { path: '/metro-industrial-estate', label: 'Park 2',     icon: LucideLandPlot },
  { path: '/metro-industrial-park-3', label: 'Park 3',     icon: LucideLandPlot },
  { path: '/metro-arcade',            label: 'Arcade',     icon: Store          },
  { path: '/contact',                 label: 'Contact',    icon: Mail           },
  { path: '/calculator',              label: 'Calculator', icon: Calculator     },
  { path: '/site-map',                label: 'Site Map',   icon: MapPin         },
];

const DRAWER_NAV_PATHS = new Set(['/', '/contact', '/calculator']);
const DRAWER_NAV_ITEMS = NAV_ITEMS.filter((item) => DRAWER_NAV_PATHS.has(item.path));

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isNavbarVisible: isVisible, setIsNavbarVisible: setIsVisible } = useNavbar();
  const isDark = theme === 'dark';
  const { pathname } = useLocation();

  const [isMenuOpen,     setIsMenuOpen]     = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [contactOpen,    setContactOpen]    = useState(false);
  const [settingsOpen,   setSettingsOpen]   = useState(false);
  const [fontSize,       setFontSize]       = useState(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (saved && FONT_SIZE_VALUES[saved]) return saved;
    } catch { /* ignore */ }
    return 'normal';
  });

  const lastScrollYRef = useRef(0);
  const headerRef      = useRef(null);
  const directionsRef  = useRef(null);
  const contactRef     = useRef(null);
  const settingsRef    = useRef(null);

  const { scrollYProgress } = useScroll();
  const scaleX = scrollYProgress;

  /* ── Shared theme tokens ── */
  const bgHeader  = isDark
    ? scrolled ? 'bg-[#0B0B0D]/95 backdrop-blur-md' : 'bg-[#0B0B0D]'
    : scrolled ? 'bg-[#FFFFFF]/95 backdrop-blur-md' : 'bg-[#FFFFFF]';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]';
  const border    = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const divide    = isDark ? 'divide-white/[0.12]' : 'divide-gray-200';
  const textMain  = isDark ? 'text-white' : 'text-gray-900';
  const textBody  = isDark ? 'text-gray-200' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  // Sync root document font size
  useEffect(() => {
    if (FONT_SIZE_VALUES[fontSize]) {
      document.documentElement.style.fontSize = FONT_SIZE_VALUES[fontSize];
    }
  }, [fontSize]);

  // Measure exact rendered header height so sticky toolbars stay flush with zero gap
  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof document === 'undefined') return undefined;

    const updateHeight = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) {
        document.documentElement.style.setProperty('--navbar-height', `${h}px`);
      }
    };

    updateHeight();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateHeight);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', updateHeight, { passive: true });
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Ensure navbar resets visible whenever route changes
  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      lastScrollYRef.current = window.scrollY;
      setIsVisible(true);
      setScrolled(window.scrollY > 40);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [pathname, setIsVisible]);

  // Scroll hide/reveal with rAF throttling
  useEffect(() => {
    let ticking = false;
    const control = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          const isPastTop = y > 40;
          setScrolled((prev) => (prev !== isPastTop ? isPastTop : prev));

          const lastY = lastScrollYRef.current;
          const headerH = headerRef.current?.getBoundingClientRect().height || 67;
          if (y <= headerH) {
            setIsVisible(true);
          } else if (y > lastY && y > 100) {
            setIsVisible((prev) => (prev ? false : prev));
            setIsMenuOpen(false);
            setDirectionsOpen(false);
            setContactOpen(false);
            setSettingsOpen(false);
          } else if (y < lastY) {
            setIsVisible((prev) => (!prev ? true : prev));
          }

          lastScrollYRef.current = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', control, { passive: true });
    return () => window.removeEventListener('scroll', control);
  }, [setIsVisible]);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const onMouseDown = (e) => {
      if (directionsRef.current && !directionsRef.current.contains(e.target)) setDirectionsOpen(false);
      if (contactRef.current && !contactRef.current.contains(e.target))       setContactOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target))     setSettingsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDirectionsOpen(false);
        setContactOpen(false);
        setSettingsOpen(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const closeMenu  = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((v) => !v), []);

  const toggleFontSize = useCallback(() => {
    setFontSize((prev) => {
      const next = prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal';
      document.documentElement.style.fontSize = FONT_SIZE_VALUES[next];
      try { localStorage.setItem(FONT_SIZE_STORAGE_KEY, next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const settingsItems = [
    {
      icon: Type,
      label: 'Text Size',
      meta: fontSize === 'normal' ? '16px' : fontSize === 'large' ? '18px' : '20px',
      action: () => { toggleFontSize(); },
    },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 border-b ${border} ${bgHeader} transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 xl:px-6 h-16">

          {/* ── Brand Mark ── */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 xl:gap-3 min-w-0 flex-shrink-0 group">
            <div className={`w-9 h-9 border ${isDark ? 'border-white/20' : border} ${bgSurface} flex items-center justify-center p-1.5 flex-shrink-0 transition-colors group-hover:border-brand-red`}>
              <img
                src={isDark ? '/MDLogo-dark.png' : '/MDLogo.png'}
                alt="Metro Developers Logo"
                width={32}
                height={32}
                onError={(e) => { e.currentTarget.src = isDark ? '/MDLogo.png' : '/icons/icon-192x192.png'; }}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="leading-tight min-w-0">
              <span className={`block text-sm font-bold tracking-tight truncate ${textMain}`}>
                Metro Developers
              </span>
              <span className={`block lg:hidden xl:block font-mono text-[9px] uppercase tracking-[0.1em] xl:tracking-[0.14em] truncate ${textMuted}`}>
                Industrial Sheds · Lease &amp; Sale
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          <div className="hidden lg:flex items-center h-full">
            <div className="flex items-center h-full">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `relative h-full px-2 xl:px-3 flex items-center text-[11px] xl:text-xs font-semibold tracking-wide transition-colors whitespace-nowrap ${
                      isActive
                        ? textMain
                        : `${textBody} hover:${isDark ? 'text-white' : 'text-black'}`
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 inset-x-1.5 xl:inset-x-2 h-[2px] bg-brand-red"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* ── Utility Controls Cluster ── */}
            <div className={`ml-1.5 xl:ml-3 pl-1.5 xl:pl-3 border-l ${border} flex items-center gap-1 xl:gap-1.5 shrink-0`}>
              {/* Park Directions Dropdown */}
              <div ref={directionsRef}>
                <ParkDirectionsDropdown
                  isDark={isDark}
                  open={directionsOpen}
                  onOpenChange={(next) => {
                    setDirectionsOpen(next);
                    if (next) {
                      setContactOpen(false);
                      setSettingsOpen(false);
                    }
                  }}
                />
              </div>

              {/* Reach Us Dropdown */}
              <div className="relative" ref={contactRef}>
                <button
                  type="button"
                  onClick={() => { setContactOpen((v) => !v); setDirectionsOpen(false); setSettingsOpen(false); }}
                  aria-expanded={contactOpen}
                  className={`h-9 px-2 xl:px-3 border text-[11px] xl:text-xs font-bold uppercase tracking-[0.04em] xl:tracking-[0.08em] inline-flex items-center gap-1 xl:gap-1.5 transition-colors whitespace-nowrap ${
                    contactOpen
                      ? 'bg-brand-red border-brand-red text-white'
                      : `${border} ${bgSurface} ${textMain} hover:border-brand-red hover:text-brand-red`
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${contactOpen ? 'bg-white' : 'bg-emerald-500'}`}
                    aria-hidden="true"
                  />
                  <span>Reach Us</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${contactOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {contactOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className={`absolute right-0 top-full mt-2 w-72 border ${border} ${bgSurface} shadow-2xl z-50`}
                    >
                      <div className={`px-4 py-3 border-b ${border} ${bgPage}`}>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                          <p className={`text-xs font-bold ${textMain}`}>Available for site visits</p>
                        </div>
                        <p className={`font-mono text-[10px] uppercase tracking-wider mt-0.5 ml-3.5 ${textMuted}`}>
                          Mon–Sun · 9 AM to 7 PM
                        </p>
                      </div>

                      <div className={`divide-y ${divide}`}>
                        <a
                          href="tel:+919824235642"
                          onClick={() => setContactOpen(false)}
                          className="flex items-center justify-between px-4 py-3 bg-brand-red hover:bg-red-700 text-white transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Phone size={14} aria-hidden="true" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider">Call Now</p>
                              <p className="font-mono text-[11px] text-white/85 tabular-nums">+91 98242 35642</p>
                            </div>
                          </div>
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>

                        <a
                          href="https://wa.me/919824235642?text=Hi%2C%20I%27m%20interested%20in%20Metro%20Industrial%20Park%20sheds."
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setContactOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 transition-colors ${
                            isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <MessageCircle size={14} className="text-emerald-600" aria-hidden="true" />
                            <div>
                              <p className={`text-xs font-bold ${textMain}`}>WhatsApp</p>
                              <p className={`text-[11px] ${textMuted}`}>Chat instantly</p>
                            </div>
                          </div>
                          <ArrowUpRight size={13} className={textMuted} aria-hidden="true" />
                        </a>

                        <div className="px-4 py-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin size={13} className="text-brand-red" aria-hidden="true" />
                            <p className={`text-xs font-bold ${textMain}`}>Park Directions</p>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {PARK_DIRECTIONS.map((park) => (
                              <a
                                key={park.id}
                                href={park.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setContactOpen(false)}
                                className={`px-2 py-1.5 border ${border} ${bgPage} text-center transition-colors hover:border-brand-red group`}
                              >
                                <span className={`block text-[11px] font-bold ${textMain} group-hover:text-brand-red`}>
                                  {park.name}
                                </span>
                                <span className={`block font-mono text-[9px] uppercase ${textMuted}`}>
                                  {park.shortLocation}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>

                        <a
                          href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setContactOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 transition-colors ${
                            isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Star size={14} className="text-amber-500 fill-amber-500" aria-hidden="true" />
                            <div>
                              <p className={`text-xs font-bold flex items-center gap-2 ${textMain}`}>
                                <span>Google Reviews</span>
                                <span className="font-mono text-[10px] text-brand-red">5.0 ★</span>
                              </p>
                              <p className={`text-[11px] ${textMuted}`}>Read &amp; write verified reviews</p>
                            </div>
                          </div>
                          <ArrowUpRight size={13} className={textMuted} aria-hidden="true" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              {toggleTheme && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  title="Toggle theme"
                  aria-label="Toggle color theme"
                  className={`w-9 h-9 border ${border} ${bgSurface} ${textMain} hover:border-brand-red hover:text-brand-red flex items-center justify-center transition-colors`}
                >
                  {isDark ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              )}

              {/* Settings / Quick Actions Dropdown */}
              <div className="relative" ref={settingsRef}>
                <button
                  type="button"
                  onClick={() => { setSettingsOpen((v) => !v); setDirectionsOpen(false); setContactOpen(false); }}
                  title="Quick settings"
                  aria-label="Quick settings"
                  aria-expanded={settingsOpen}
                  className={`w-9 h-9 border flex items-center justify-center transition-colors ${
                    settingsOpen
                      ? 'bg-brand-red border-brand-red text-white'
                      : `${border} ${bgSurface} ${textMain} hover:border-brand-red hover:text-brand-red`
                  }`}
                >
                  <Settings2
                    size={14}
                    className={`transition-transform duration-300 ${settingsOpen ? 'rotate-45' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {settingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.16, ease: EASE }}
                      className={`absolute right-0 top-full mt-2 w-60 border ${border} ${bgSurface} shadow-2xl z-50`}
                    >
                      <div className={`px-4 py-2.5 border-b ${border} ${bgPage} font-mono text-[10px] uppercase tracking-[0.16em] ${textMuted}`}>
                        Quick Actions
                      </div>
                      <div className={`divide-y ${divide}`}>
                        {settingsItems.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={item.action}
                            className={`flex items-center justify-between w-full px-4 py-3 text-left text-xs font-semibold transition-colors ${textMain} ${
                              isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                            }`}
                          >
                            <span className="inline-flex items-center gap-2.5">
                              <item.icon size={13} className="text-brand-red" aria-hidden="true" />
                              <span>{item.label}</span>
                            </span>
                            <span className={`font-mono text-[10px] uppercase ${textMuted}`}>
                              {item.meta}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Mobile / Tablet Right Controls ── */}
          <div className="lg:hidden flex items-center gap-2">
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                title="Toggle theme"
                aria-label="Toggle color theme"
                className={`w-9 h-9 border ${border} ${bgSurface} ${textMain} flex items-center justify-center transition-colors`}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className={`w-9 h-9 border flex items-center justify-center transition-colors ${
                isMenuOpen
                  ? 'bg-brand-red border-brand-red text-white'
                  : `${border} ${bgSurface} ${textMain} hover:border-brand-red`
              }`}
            >
              {isMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>

        {/* ── 2px Signal Red Reading Progress Line ── */}
        <motion.div
          className="h-[2px] bg-brand-red"
          style={{ scaleX, transformOrigin: '0%' }}
        />
      </header>

      {/* ══════════════════════════════════
          MOBILE / TABLET DRAWER
      ══════════════════════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              onClick={closeMenu}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: EASE }}
              style={{ top: 'var(--navbar-height, 67px)' }}
              className={`fixed right-0 bottom-0 w-[290px] sm:w-[320px] z-40 lg:hidden overflow-y-auto border-l ${border} ${bgPage}`}
            >
              {/* Navigation Index */}
              <div className={`px-5 py-3 border-b ${border} font-mono text-[10px] uppercase tracking-[0.18em] ${textMuted}`}>
                Navigation
              </div>

              <div className={`divide-y ${divide} border-b ${border}`}>
                {DRAWER_NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-5 py-3.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-brand-red text-white'
                          : `${bgSurface} ${textMain} ${isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'}`
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{item.label}</span>
                        <item.icon size={15} className={isActive ? 'text-white' : textMuted} aria-hidden="true" />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Quick Actions */}
              <div className={`px-5 py-3 border-b ${border} font-mono text-[10px] uppercase tracking-[0.18em] ${textMuted}`}>
                Quick Actions
              </div>

              <div className={`divide-y ${divide} border-b ${border}`}>
                {settingsItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.action();
                      if (item.label !== 'Text Size') closeMenu();
                    }}
                    className={`w-full flex items-center justify-between px-5 py-3 text-left text-xs font-semibold ${bgSurface} ${textMain} transition-colors ${
                      isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <item.icon size={14} className="text-brand-red" aria-hidden="true" />
                      <span>{item.label}</span>
                    </span>
                    <span className={`font-mono text-[10px] uppercase ${textMuted}`}>{item.meta}</span>
                  </button>
                ))}
              </div>

              {/* Direct Site Office */}
              <div className={`px-5 py-3 border-b ${border} font-mono text-[10px] uppercase tracking-[0.18em] ${textMuted}`}>
                Reach Us
              </div>

              <div className="p-4 space-y-2.5">
                <a
                  href="tel:+919824235642"
                  onClick={closeMenu}
                  className="w-full py-3 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Phone size={14} aria-hidden="true" />
                    <span className="tabular-nums">+91 98242 35642</span>
                  </span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>

                <a
                  href="https://wa.me/919824235642?text=Hi%2C%20I%27m%20interested%20in%20Metro%20Industrial%20Park%20sheds."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className={`w-full py-3 px-4 border ${border} ${bgSurface} ${textMain} text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <MessageCircle size={14} className="text-emerald-600" aria-hidden="true" />
                    <span>WhatsApp Chat</span>
                  </span>
                  <ArrowUpRight size={14} className={textMuted} aria-hidden="true" />
                </a>

                <div className={`border ${border} ${bgSurface}`}>
                  <div className={`px-4 py-2 border-b ${border} ${bgPage} font-mono text-[10px] uppercase tracking-[0.14em] ${textMuted} flex items-center gap-2`}>
                    <MapPin size={12} className="text-brand-red" aria-hidden="true" />
                    <span>Park Directions</span>
                  </div>
                  <div className={`divide-y ${divide}`}>
                    {PARK_DIRECTIONS.map((park) => (
                      <a
                        key={park.id}
                        href={park.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                        className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                          isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className={`text-xs font-bold ${textMain}`}>{park.name}</span>
                          <span className={`ml-1.5 font-mono text-[10px] ${textMuted}`}>
                            · {park.shortLocation}
                          </span>
                        </div>
                        <ArrowUpRight size={13} className={textMuted} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>

                <a
                  href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className={`w-full py-3 px-4 border ${border} ${bgSurface} ${textMain} text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Star size={14} className="text-amber-500 fill-amber-500" aria-hidden="true" />
                    <span>Google Reviews · 5.0</span>
                  </span>
                  <ArrowUpRight size={14} className={textMuted} aria-hidden="true" />
                </a>
              </div>

              <div className={`px-5 py-4 border-t ${border} font-mono text-[10px] uppercase tracking-wider text-center ${textMuted}`}>
                Metro Industrial Park · Moraiya, Ahmedabad
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
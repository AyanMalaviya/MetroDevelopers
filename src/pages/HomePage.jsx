// src/pages/HomePage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Phone, ArrowRight, ChevronDown, Star,
  Clock, Sparkles, TrendingUp, X, MapPin,
  LucideFactory, LucideLandPlot, Factory, LucideCctv, Droplets, Truck,
} from 'lucide-react';
import { FaRoad, FaTrash, FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO/SEO.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import CountUp from 'react-countup';

/* ─── Framer variants ─── */
const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── Slideshow images ─── */
const heroSlides = [
  '/images/map.jpg',
  '/images/entrance.jpg',
  '/images/mainroad.jpg',
  '/images/2shed.jpg',
  '/images/4shed.jpg',
  '/images/office.jpg',
];

/* ─── Features & Stats data ─── */
const features = [
  { icon: <Factory size={28} />,    title: 'Modern Infrastructure', description: 'World-class facilities designed for manufacturing excellence'   },
  { icon: <Truck size={28} />,      title: 'Strategic Location',    description: 'Prime connectivity to national highways & logistics hubs'      },
  { icon: <LucideCctv size={28} />, title: '24/7 Security',         description: 'Advanced CCTV surveillance with trained security personnel'    },
  { icon: <FaRoad size={28} />,     title: 'Wide Roads',            description: '60 ft RCC roads engineered for heavy-duty vehicles'            },
  { icon: <Droplets size={28} />,   title: 'Water Supply',          description: 'Reliable 24/7 water availability across all units'             },
  { icon: <FaTrash size={28} />,    title: 'Hygienic Drainage',     description: 'Well-planned drainage for efficient waste management'          },
];

const stats = [
  { countEnd: 30,  suffix: 'k+', label: 'Sq.yards of Area',      icon: <LucideLandPlot size={24} /> },
  { countEnd: 43,  suffix: '+',  label: 'Industrial Units Made', icon: <LucideFactory  size={24} /> },
  { countEnd: 100, suffix: '%',  label: 'Client Satisfaction',   icon: <Star           size={24} /> },
  { countEnd: 6,   suffix: '+',  label: 'Years of Experience',   icon: <Clock          size={24} /> },
];

/* ─── Per-card asymmetric corner patterns ─── */
const cornerPatterns = [
  'rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-2xl rounded-bl-2xl',
  'rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-2xl rounded-br-2xl',
  'rounded-[2rem]',
  'rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-2xl rounded-br-2xl',
  'rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-2xl rounded-bl-2xl',
  'rounded-[2rem]',
];

/* ════════════════════════════════════════════════
   SLIDESHOW POSTER COMPONENT
   ════════════════════════════════════════════════ */
const SlideshowPoster = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ backgroundImage: `url(${src})`, opacity: i === current ? 1 : 0 }}
          aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════ */
const HomePage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const rafRef                                  = useRef(null);
  const [showScrollCue,    setShowScrollCue]    = useState(true);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [promptDismissed,  setPromptDismissed]  = useState(false);

  const featuresRef = useRef(null);
  const statsRef    = useRef(null);
  const ctaRef      = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });
  const statsInView    = useInView(statsRef,    { once: true, margin: '-80px' });
  const ctaInView      = useInView(ctaRef,      { once: true, margin: '-80px' });

  const whatsappMessage = encodeURIComponent('Hello, I would like to inquire about the industrial sheds.');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (localStorage.getItem('reviewPromptDismissed') === 'true')
      setPromptDismissed(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y   = window.scrollY;
        const pct = (y / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (y > 80) setShowScrollCue(false);
        if (pct > 40 && !promptDismissed) setShowReviewPrompt(true);
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = setTimeout(() => {
      if (!promptDismissed) setShowReviewPrompt(true);
    }, 15000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [promptDismissed]);

  const dismissPrompt = () => {
    setShowReviewPrompt(false);
    setPromptDismissed(true);
    localStorage.setItem('reviewPromptDismissed', 'true');
  };

  return (
    <>
      <SEO
        title="Metro Industrial Park Ahmedabad, Buy or Lease Industrial Sheds & Warehouses in Moraiya, Changodar, Ahmedabad"
        description="Industrial sheds & warehouses for sale/lease in Moraiya, Changodar, Ahmedabad. CCTV, Water Supply and more. 6–8% ROI, 90-day possession. Call 9824235642 or 9624965017 for pricing."
        keywords="industrial shed for sale in Moraiya, Changodar, Sanand, Ahmedabad, warehouse for rent in Changodar, industrial shed with waste management and water supply for lease Gujarat, 5000 sqft factory shed price, ready possession industrial shed Ahmedabad, GIDC approved warehouse Moraiya, affordable industrial shed manufacturer Gujarat, industrial plot near Sarkhej Bavla Highway, 6-8% ROI commercial property Ahmedabad, heavy industrial storage space rent, warehousing logistics park Ahmedabad, pharmaceutical industrial shed Moraiya, engineering unit space Changodar, 4000 to 50000 sqft industrial shed, buy industrial property, weigh bridge facility industrial park"
        canonical="/"
        ogImage="/images/map.jpg"
        alt="Metro Industrial Park Ahmedabad, Industrial Sheds & Warehouses in Moraiya, Changodar, Ahmedabad"
      />

      <style>{`@keyframes kenBurns{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}`}</style>

      <div className="min-h-screen theme-bg-primary overflow-hidden">
        <h1 className="sr-only">
          Industrial Sheds & Warehouses for Sale & Lease in Moraiya, Changodar, Ahmedabad
        </h1>

        {/* ── Review Prompt ── */}
        {showReviewPrompt && !promptDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-xs sm:max-w-sm"
          >
            <div className={`rounded-xl shadow-2xl p-4 sm:p-6 relative border-2 ${
              isDark ? 'bg-gray-900 border-brand-red/30' : 'bg-white border-brand-red/20'
            }`}>
              <button onClick={dismissPrompt} aria-label="Close"
                className={`absolute top-2 right-2 transition-colors ${
                  isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                }`}>
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                  <Star size={20} className="text-white fill-white" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Enjoying our service?
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Leave us a review!
                  </p>
                </div>
              </div>
              <a
                href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                target="_blank" rel="noopener noreferrer"
                onClick={dismissPrompt}
                className="block w-full text-center px-4 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm"
              >
                Write a Review
              </a>
            </div>
          </motion.div>
        )}

        {/* ════════ HERO ════════ */}
        <section className="relative h-screen flex flex-col overflow-hidden">
          <div className="relative overflow-hidden" style={{ height: '90vh' }}>

            <SlideshowPoster slides={heroSlides} />

            {/* ── Logo: absolute dead-centre of the 90vh area ── */}
            <motion.img
              src="/MDLogoBG.png"
              alt="Metro Enterprise - Industrial Shed Developer Ahmedabad"
              width={288} height={288}
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 0, scale: 0.8, y: 0 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-36 sm:w-52 md:w-64 lg:w-72 z-10 pointer-events-none
                         drop-shadow-[0_6px_30px_rgba(0,0,0,0.75)] select-none"
            />

            {/* ── Badge + stat cards pinned to bottom ── */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 sm:pb-10 pointer-events-none px-4">
              <div className="flex flex-col items-center gap-3 w-full pointer-events-auto">

                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-brand-red/60 bg-black/35 backdrop-blur-lg"
                >
                  <Sparkles className="text-brand-red w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.14em] text-white uppercase">
                    #1 Industrial Park in Ahmedabad
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.6 }}
                  className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-lg"
                >
                  {[
                    { icon: <TrendingUp size={16} />,     value: '6-8%', label: 'Annual ROI',       color: 'text-green-400', border: 'border-green-500/30 hover:border-green-400' },
                    { icon: <LucideFactory size={16} />,  value: '63',   label: 'Industrial Units', color: 'text-white',     border: 'border-white/20 hover:border-brand-red/60'  },
                    { icon: <LucideLandPlot size={16} />, value: '54K+', label: 'Sq.yards Area',    color: 'text-white',     border: 'border-white/20 hover:border-brand-red/60'  },
                  ].map(({ icon, value, label, color, border }) => (
                    <motion.div key={label} whileHover={{ scale: 1.06, y: -5 }}
                      className={`p-3 sm:p-4 rounded-xl bg-black/50 backdrop-blur-md border ${border} transition-all duration-300 text-center shadow-lg cursor-default`}>
                      <span className={`${color} flex justify-center mb-1`}>{icon}</span>
                      <div
                        className={`text-lg sm:text-2xl font-black ${color}`}
                        style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}
                      >{value}</div>
                      <div className="text-[9px] sm:text-[11px] text-white/70 font-semibold">{label}</div>
                    </motion.div>
                  ))}
                </motion.div>

              </div>
            </div>
          </div>

          {/* ── Button strip ── */}
          <div className={`flex-1 flex flex-col items-center justify-center gap-3 px-4 py-4 ${
            isDark ? 'bg-gray-950 border-t border-gray-800' : 'bg-white border-t border-gray-200'
          }`}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xs sm:max-w-sm"
            >
              <Link to="/metro-industrial-park" className="w-full block">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden w-full px-8 py-3.5
                    bg-gradient-to-r from-red-600 via-brand-red to-rose-600
                    text-white font-extrabold rounded-2xl text-sm tracking-wide"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Factory size={16} />
                    <span>Explore More</span>
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.0, ease: 'easeInOut' }}
                      className="flex items-center"
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-2.5 items-center justify-center w-full max-w-xs sm:max-w-sm"
            >
              <Link to="/site-map" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group w-full sm:w-auto px-6 py-2.5 font-semibold rounded-xl border-2 text-xs sm:text-sm transition-all duration-300 ${
                    isDark
                      ? 'border-brand-red/60 text-red-400 hover:border-brand-red hover:bg-brand-red/10'
                      : 'border-brand-red/50 text-brand-red hover:border-brand-red hover:bg-red-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <MapPin size={14} />
                    Check Availability
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </motion.button>
              </Link>

              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group w-full sm:w-auto px-6 py-2.5 font-semibold rounded-xl border text-xs sm:text-sm transition-all duration-300 ${
                    isDark
                      ? 'border-white/15 text-gray-400 hover:border-green-400/50 hover:text-green-400'
                      : 'border-gray-300 text-gray-500 hover:border-green-500/50 hover:text-green-600 hover:bg-green-50/60'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaWhatsapp size={14} className="text-green-500" />
                    WhatsApp
                  </span>
                </motion.button>
              </a>
            </motion.div>

            {showScrollCue && (
              <button
                className={`flex flex-col items-center gap-0.5 cursor-pointer border-0 bg-transparent mt-1 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                aria-label="Scroll down"
              >
                <span className="text-[8px] font-bold tracking-widest uppercase">scroll</span>
                <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>
            )}
          </div>
        </section>

        {/* ════════ FEATURES ════════ */}
        <section ref={featuresRef} className="py-20 sm:py-28 relative overflow-hidden">

          {/* Layer 1 — background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: "url('/images/4shed.jpg')" }}
            aria-hidden="true"
          />

          {/* Layer 2 — single unified theme-aware overlay (no stacking) */}
          <div
            className={`absolute inset-0 ${
              isDark
                ? 'bg-gradient-to-b from-black/85 via-black/70 to-black/88'
                : 'bg-gradient-to-b from-white/88 via-white/75 to-white/90'
            }`}
            aria-hidden="true"
          />

          {/* Layer 3 — red accent glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.12),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(220,38,38,0.07),transparent_60%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-14"
            >
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                text-[11px] font-bold tracking-widest uppercase border mb-4 ${
                isDark
                  ? 'bg-white/10 text-red-300 border-red-400/40'
                  : 'bg-brand-red/10 text-brand-red border-brand-red/30'
              }`}>
                <Sparkles size={11} className="animate-pulse" /> Why Choose Us
              </span>
              <h2 className={`text-3xl sm:text-5xl font-bold mt-3 mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Everything Your Business{' '}
                <span className={isDark ? 'text-red-400' : 'text-brand-red'}>Needs</span>
              </h2>
              <div className={`w-20 h-0.5 bg-gradient-to-r from-transparent to-transparent mx-auto ${
                isDark ? 'via-red-400' : 'via-brand-red'
              }`} />
            </motion.div>

            {/* Asymmetric card grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5 sm:gap-6"
            >
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className={[
                    'group relative overflow-hidden cursor-default transition-all duration-300',
                    cornerPatterns[i],
                    // mobile zigzag offset — resets on sm+
                    i % 2 === 0 ? '-translate-x-3 sm:translate-x-0' : 'translate-x-3 sm:translate-x-0',
                    // odd cards drop slightly on mobile for stagger depth
                    i % 2 !== 0 ? 'mt-2 sm:mt-0' : '',
                    'border backdrop-blur-md',
                    isDark
                      ? 'bg-black/50 border-white/10 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-900/20'
                      : 'bg-white/80 border-gray-200/70 hover:border-brand-red/40 hover:shadow-xl hover:shadow-brand-red/10',
                  ].join(' ')}
                >
                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/0 to-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Animated bottom bar */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-brand-red via-red-400 to-rose-500 transition-all duration-500" />

                  {/* Top-right accent dot */}
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full transition-colors duration-300 ${
                    isDark
                      ? 'bg-red-400/30 group-hover:bg-red-400/80'
                      : 'bg-brand-red/20 group-hover:bg-brand-red/60'
                  }`} />

                  <div className="relative p-6 sm:p-7">
                    {/* Icon */}
                    <div className={[
                      'w-[52px] h-[52px] rounded-xl mb-5 flex items-center justify-center',
                      'transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                      'group-hover:bg-brand-red group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-red/30',
                      isDark ? 'bg-white/10 text-gray-200' : 'bg-gray-100 text-gray-600',
                    ].join(' ')}>
                      {feat.icon}
                    </div>

                    {/* Title */}
                    <h3 className={`text-base sm:text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-brand-red ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feat.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════ STATS ════════ */}
        <section ref={statsRef} className={`py-20 sm:py-28 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06),transparent_70%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }} className="text-center mb-14"
            >
              <h2 className="text-3xl sm:text-5xl font-bold theme-text-primary mb-4">
                Experience by <span className="text-brand-red">Numbers</span>
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto" />
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 32 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`group relative text-center p-8 sm:p-10 rounded-2xl border transition-all duration-300 cursor-default overflow-hidden ${
                    isDark
                      ? 'bg-gray-900 border-gray-800 hover:border-brand-red/50 hover:shadow-lg hover:shadow-brand-red/20'
                      : 'bg-gray-50 border-gray-200 hover:border-brand-red/40 hover:shadow-xl hover:shadow-brand-red/10'
                  }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  <div className={`w-12 h-12 mx-auto mb-5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-brand-red/20 group-hover:text-brand-red group-hover:scale-110 group-hover:rotate-6 ${
                    isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'
                  }`}>{stat.icon}</div>
                  <div
                    className={`text-3xl sm:text-5xl font-extrabold mb-2 group-hover:text-brand-red transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}
                  >
                    <CountUp end={stat.countEnd} suffix={stat.suffix} duration={2.5} enableScrollSpy scrollSpyOnce />
                  </div>
                  <div className={`text-xs sm:text-sm font-semibold uppercase tracking-wider group-hover:text-brand-red/80 transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ CTA ════════ */}
        <section ref={ctaRef} className={`py-20 sm:py-32 relative overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.07),transparent_70%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className={`p-10 sm:p-16 rounded-3xl border shadow-2xl transition-colors duration-500 ${
                isDark ? 'bg-gray-900/80 border-gray-800 hover:border-brand-red/30' : 'bg-white/90 border-gray-200 hover:border-brand-red/30'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/10 border border-brand-red/30 rounded-full mb-8"
              >
                <Sparkles className="text-brand-red" size={14} />
                <span className="text-xs font-bold text-brand-red tracking-wide">Get Started Today</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-5xl font-bold theme-text-primary mb-5"
              >
                Ready to Find Your <br className="hidden sm:block" />
                <span className="text-brand-red">Perfect Industrial Space?</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="theme-text-tertiary text-base sm:text-lg mb-10 max-w-xl mx-auto"
              >
                Contact us today to discuss your requirements and schedule a site visit.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <a
                  href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-brand-red/40 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <FaWhatsapp size={20} className="relative z-10" />
                  <span className="relative z-10">WhatsApp Us</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="tel:+919824235642"
                  className="group inline-flex items-center justify-center gap-3 px-9 py-4 border-2 theme-border hover:border-brand-red/50 theme-bg-card theme-text-primary font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Phone size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Call: +91 98242 35642</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;

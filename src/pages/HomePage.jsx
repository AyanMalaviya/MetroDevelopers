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

/* ─── Slideshow images ─── */
const heroSlides = [
  '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
  '/images/metro-industrial-park-entrance-security-moraiya.jpg',
  '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
  '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
  '/images/warehouse-unit-lease-changodar-ahmedabad.jpg',
  '/images/metro-industrial-park-office-changodar.jpg',
];

/* ─── Per-feature color palette ─── */
const featureColors = [
  { gradient: 'from-red-500 to-orange-500',    bg: 'from-red-950 to-orange-950',    text: 'text-red-400',    shadow: 'shadow-red-500/30'    },
  { gradient: 'from-blue-500 to-cyan-400',      bg: 'from-blue-950 to-cyan-950',      text: 'text-blue-400',   shadow: 'shadow-blue-500/30'   },
  { gradient: 'from-purple-500 to-violet-500',  bg: 'from-purple-950 to-violet-950',  text: 'text-purple-400', shadow: 'shadow-purple-500/30' },
  { gradient: 'from-amber-500 to-yellow-400',   bg: 'from-amber-950 to-yellow-950',   text: 'text-amber-400',  shadow: 'shadow-amber-500/30'  },
  { gradient: 'from-cyan-500 to-teal-400',      bg: 'from-cyan-950 to-teal-950',      text: 'text-cyan-400',   shadow: 'shadow-cyan-500/30'   },
  { gradient: 'from-green-500 to-emerald-400',  bg: 'from-green-950 to-emerald-950',  text: 'text-green-400',  shadow: 'shadow-green-500/30'  },
];

/* ─── Features data with image + detail bullets ─── */
const features = [
  {
    icon: <Factory size={26} />,
    title: 'Modern Infrastructure',
    description: 'World-class facilities designed for manufacturing and warehousing excellence with premium construction standards.',
    details: ['30–35 ft high ceiling clearance', 'Reinforced flooring for heavy loads', 'RCC construction available on request'],
    image: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    alt: 'Modern industrial shed infrastructure at Metro Industrial Park Moraiya Ahmedabad',
  },
  {
    icon: <Truck size={26} />,
    title: 'Strategic Location',
    description: 'Prime connectivity to national highways, logistics hubs, and major ports for seamless supply chain operations.',
    details: ['Near Sarkhej Bavla National Highway', 'Easy access to GIDC industrial areas', 'Close to Ahmedabad city & airport'],
    image: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    alt: 'Strategic location map of Metro Industrial Park near Sarkhej Bavla Highway Moraiya',
  },
  {
    icon: <LucideCctv size={26} />,
    title: '24/7 Security',
    description: 'Advanced CCTV surveillance system combined with trained security personnel ensuring round-the-clock safety.',
    details: ['HD CCTV cameras throughout the park', 'Security guards at main gate', 'Controlled access entry system'],
    image: '/images/metro-industrial-park-entrance-security-moraiya.jpg',
    alt: 'CCTV security surveillance at Metro Industrial Park entrance Moraiya Ahmedabad',
  },
  {
    icon: <FaRoad size={26} />,
    title: 'Wide Roads',
    description: '60 ft RCC roads engineered specifically for heavy-duty vehicles ensuring smooth logistics and truck movement.',
    details: ['60 ft wide internal road network', 'Durable RCC construction', 'Designed for heavy trucks & trailers'],
    image: '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
    alt: '60 ft wide RCC road inside Metro Industrial Park designed for heavy vehicles Ahmedabad',
  },
  {
    icon: <Droplets size={26} />,
    title: 'Water Supply',
    description: 'Reliable 24/7 water availability across all industrial units to support uninterrupted manufacturing operations.',
    details: ['Round-the-clock water availability', 'Dedicated supply per industrial unit', 'Emergency water reserve system'],
    image: '/images/feature-water-supply.jpg',
    alt: '24x7 water supply facility at Metro Industrial Park Moraiya Changodar Ahmedabad',
  },
  {
    icon: <FaTrash size={26} />,
    title: 'Hygienic Drainage',
    description: 'Well-planned drainage infrastructure for efficient waste management keeping the park clean and fully operational.',
    details: ['Underground drainage network', 'Industrial waste management system', 'Eco-friendly disposal processes'],
    image: '/images/feature-drainage-system.jpg',
    alt: 'Hygienic drainage and waste management system at Metro Industrial Park Ahmedabad',
  },
];

/* ─── Stats data ─── */
const stats = [
  { countEnd: 30,  suffix: 'k+', label: 'Sq.yards of Area',      icon: <LucideLandPlot size={24} /> },
  { countEnd: 43,  suffix: '+',  label: 'Industrial Units Made', icon: <LucideFactory  size={24} /> },
  { countEnd: 100, suffix: '%',  label: 'Client Satisfaction',   icon: <Star           size={24} /> },
  { countEnd: 6,   suffix: '+',  label: 'Years of Experience',   icon: <Clock          size={24} /> },
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
   FEATURE ROW COMPONENT
   Alternates image-left / image-right per row
   ════════════════════════════════════════════════ */
const FeatureRow = ({ feat, index, isDark }) => {
  const rowRef = useRef(null);
  const inView = useInView(rowRef, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0; // even → image left, odd → image right
  const color  = featureColors[index];

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, x: isEven ? -56 : 56 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center`}
    >

      {/* ── Image side ── */}
      <div className="w-full lg:w-[46%] flex-shrink-0">
        <div className="relative">

          {/* Colorful gradient border */}
          <div className={`p-[3px] rounded-3xl bg-gradient-to-br ${color.gradient} shadow-2xl ${color.shadow}`}>
            <div className={`rounded-[calc(1.5rem-3px)] overflow-hidden aspect-[4/3] relative ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>

              {/* Gradient placeholder — visible until real image loads */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} flex items-center justify-center`}>
                <div className="opacity-[0.12] scale-[4] text-white pointer-events-none select-none">
                  {feat.icon}
                </div>
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest uppercase ${color.text} opacity-50`}>
                  Image coming soon
                </div>
              </div>

              {/* Actual image — covers placeholder on load */}
              <img
                src={feat.image}
                alt={feat.alt}
                width={800} height={600}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.style.opacity = '0'; }}
              />
            </div>
          </div>

          {/* Feature number badge */}
          <div className={`absolute -bottom-4 ${isEven ? 'right-5' : 'left-5'} z-10`}>
            <div
              className={`px-5 py-2 rounded-2xl bg-gradient-to-r ${color.gradient} text-white font-extrabold text-xl shadow-xl ${color.shadow}`}
              style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}
            >
              0{index + 1} / 06
            </div>
          </div>

          {/* Blurred glow — top corner */}
          <div className={`absolute ${isEven ? '-top-5 -left-5' : '-top-5 -right-5'} w-20 h-20 rounded-full bg-gradient-to-br ${color.gradient} opacity-25 blur-2xl pointer-events-none`} />
          {/* Blurred glow — bottom corner */}
          <div className={`absolute ${isEven ? '-bottom-8 right-10' : '-bottom-8 left-10'} w-14 h-14 rounded-full bg-gradient-to-br ${color.gradient} opacity-15 blur-2xl pointer-events-none`} />
        </div>
      </div>

      {/* ── Content side ── */}
      <div className="w-full lg:w-[54%] pt-6 lg:pt-0">

        {/* Icon + feature label row */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-lg ${color.shadow}`}>
            {feat.icon}
          </div>
          <span className={`text-[10px] font-black tracking-[0.22em] uppercase ${color.text}`}>
            Feature {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-2xl sm:text-3xl font-extrabold mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {feat.title}
        </h3>

        {/* Description */}
        <p className={`text-sm sm:text-base leading-relaxed mb-7 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {feat.description}
        </p>

        {/* Detail bullets */}
        <ul className="space-y-3 mb-7">
          {feat.details.map((detail, di) => (
            <li key={di} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex-shrink-0 bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-sm`}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1.5 4L3.5 6.5L8.5 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {detail}
              </span>
            </li>
          ))}
        </ul>

        {/* Color accent underline */}
        <div className={`h-[3px] w-16 rounded-full bg-gradient-to-r ${color.gradient}`} />
      </div>
    </motion.div>
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

            {/* Logo — absolute dead-centre */}
            <motion.img
              src="/MDLogoBG.png"
              alt="Metro Enterprise - Industrial Shed Developer Ahmedabad"
              width={288} height={288}
              initial={{ opacity: 1, scale: 1.6 }}
              animate={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{ x: '-50%', y: '-50%' }}
              className="absolute top-1/2 left-1/2 w-36 sm:w-52 md:w-64 lg:w-72 z-10 pointer-events-none drop-shadow-[0_6px_30px_rgba(0,0,0,0.75)] select-none"
            />

            {/* Badge + stat cards pinned to bottom */}
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
                      <div className={`text-lg sm:text-2xl font-black ${color}`}
                        style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}>{value}</div>
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

        {/* ════════ FEATURES — Alternating Image + Content ════════ */}
        <section ref={featuresRef} className={`py-20 sm:py-28 relative overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>

          {/* Subtle red accent glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.06),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(220,38,38,0.04),transparent_60%)] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-20"
            >
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-4 ${
                isDark
                  ? 'bg-white/10 text-red-300 border-red-400/40'
                  : 'bg-brand-red/10 text-brand-red border-brand-red/30'
              }`}>
                <Sparkles size={11} className="animate-pulse" /> Why Choose Us
              </span>
              <h2 className={`text-3xl sm:text-5xl font-bold mt-3 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Everything Your Business{' '}
                <span className={isDark ? 'text-red-400' : 'text-brand-red'}>Needs</span>
              </h2>
              <div className={`w-20 h-0.5 bg-gradient-to-r from-transparent to-transparent mx-auto ${
                isDark ? 'via-red-400' : 'via-brand-red'
              }`} />
            </motion.div>

            {/* Alternating feature rows */}
            <div className="space-y-24 sm:space-y-32">
              {features.map((feat, i) => (
                <FeatureRow key={i} feat={feat} index={i} isDark={isDark} />
              ))}
            </div>
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
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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


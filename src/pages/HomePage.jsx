import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion'; // useInView replaces manual scroll tracking
import {
  Building2, Phone, Shield, ArrowRight, ChevronDown, Star,
  Clock, Camera, Droplets, Route, Truck, Sparkles,
  TrendingUp, X, MapPin, LucideFactory, LucideLandPlot,
  Factory,
  CctvIcon,
  LucideCctv,
  TrainFrontTunnel,
  Pipette,
  Trash,
  Trash2Icon,
} from 'lucide-react';
import { FaRoad, FaTrash, FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO/SEO.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import CountUp from 'react-countup';

/* ─── Framer-motion stagger helpers ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const HomePage = () => {
  const { theme } = useTheme();
  const [scrollY, setScrollY]                   = useState(0);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [promptDismissed, setPromptDismissed]   = useState(false);

  /* ─── Section refs — useInView from framer-motion ─── */
  const featuresRef = useRef(null);
  const statsRef    = useRef(null);
  const ctaRef      = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });
  const statsInView    = useInView(statsRef,    { once: true, margin: '-80px' });
  const ctaInView      = useInView(ctaRef,      { once: true, margin: '-80px' });

  const whatsappMessage = encodeURIComponent('Hello, I would like to inquire about the industrial sheds.');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (pct > 40 && !showReviewPrompt && !promptDismissed) setShowReviewPrompt(true);
    };
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => {
      if (!promptDismissed) setShowReviewPrompt(true);
    }, 15000);
    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(timer); };
  }, [showReviewPrompt, promptDismissed]);

  useEffect(() => {
    if (localStorage.getItem('reviewPromptDismissed') === 'true') setPromptDismissed(true);
  }, []);

  const dismissPrompt = () => {
    setShowReviewPrompt(false);
    setPromptDismissed(true);
    localStorage.setItem('reviewPromptDismissed', 'true');
  };

  const features = [
    { icon: <Factory size={28} />, title: 'Modern Infrastructure', description: 'World-class facilities designed for manufacturing excellence'      },
    { icon: <Truck size={28} />,     title: 'Strategic Location',    description: 'Prime connectivity to national highways & logistics hubs'        },
    { icon: <LucideCctv size={28} />,    title: '24/7 Security',         description: 'Advanced CCTV surveillance with trained security personnel'      },
    { icon: <FaRoad size={28} />,     title: 'Wide Roads',            description: '60 ft RCC roads engineered for heavy-duty vehicles'              },
    { icon: <Droplets size={28} />,  title: 'Water Supply',          description: 'Reliable 24/7 water availability across all units'               },
    { icon: <FaTrash size={28} />,    title: 'Hygienic Drainage',     description: 'Well-planned drainage systems for efficient waste management'    },
  ];

  const stats = [
    { countEnd: 30,  suffix: 'k+', label: 'Sq.yards of Area',      icon: <LucideLandPlot size={24} /> },
    { countEnd: 43,  suffix: '+',  label: 'Industrial Units Made', icon: <LucideFactory  size={24} /> },
    { countEnd: 100, suffix: '%',  label: 'Client Satisfaction',   icon: <Star           size={24} /> },
    { countEnd: 6,   suffix: '+',  label: 'Years of Experience',   icon: <Clock          size={24} /> },
  ];


  return (
    <>
      <SEO
        title="Buy or Lease Industrial Sheds & Warehouses in Moraiya, Ahmedabad"
        description="Call 9624965017 OR 9824235642 to buy or lease industrial shed / Godown at affordable prices! 6-8% ROI & possession in 90 days customised industrial shed/warehouse for lease & sale in Moraiya near Ahmedabad in changodar."
        keywords="industrial shed for sale in Moraiya Ahmedabad, warehouse for rent in Changodar, industrial shed with waste management and water supply for lease Gujarat, 5000 sqft factory shed price, ready possession industrial shed Ahmedabad, GIDC approved warehouse Moraiya, affordable industrial shed manufacturer Gujarat, industrial plot near Sarkhej Bavla Highway, 6-8% ROI commercial property Ahmedabad, heavy industrial storage space rent, warehousing logistics park Ahmedabad, pharmaceutical industrial shed Moraiya, engineering unit space Changodar, 4000 to 50000 sqft industrial shed, buy industrial property, weigh bridge facility industrial park"
        canonical="/"
        ogImage="/images/map.jpg"
      />

      <div className="min-h-screen theme-bg-primary overflow-hidden">

        {/* ══════════════════════════════════
            Floating Review Prompt
            ══════════════════════════════════ */}
        {showReviewPrompt && !promptDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-xs sm:max-w-sm"
          >
            <div className={`rounded-xl shadow-2xl p-4 sm:p-6 relative border-2 ${
              theme === 'dark' ? 'bg-gray-900 border-brand-red/30' : 'bg-white border-brand-red/20'
            }`}>
              <button
                onClick={dismissPrompt}
                className={`absolute top-2 right-2 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                  <Star size={20} className="text-white fill-white" />
                </div>
                <div className="text-left">
                  <h4 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Enjoying our service?
                  </h4>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Leave us a review!
                  </p>
                </div>
              </div>
              <a
                href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2.5 sm:py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 text-sm"
                onClick={dismissPrompt}
              >
                Write a Review
              </a>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════
            HERO — 80vh clean video + 20vh button strip
            ══════════════════════════════════════════════════════ */}
        <section className="relative h-screen flex flex-col overflow-hidden">

          {/* ── VIDEO ZONE (80vh) — NO overlays ── */}
          <div className="relative overflow-hidden" style={{ height: '90vh' }}>

            {/* Video — no gradient / orb overlays */}
            <motion.video
              autoPlay
              muted
              playsInline
              // loop intentionally omitted; pauses on last frame
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            >
              <source src="/videos/intro.mp4" type="video/mp4" />
            </motion.video>

          {/* ── On-video overlay: Logo top, Badge + Cards bottom ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-between py-6 sm:py-10 pointer-events-none px-4">

            {/* MDLogo — TOP */}
            <motion.img
              src="/MDLogoBG.png"
              alt="Metro Developers Logo"
              initial={{ opacity: 0, scale: 2, y: 60 }}
              animate={{ opacity: 1, scale: 1.6, y: 40 }}
              transition={{ duration: 4, ease: 'easeOut' }}
              className="w-36 sm:w-52 md:w-64 lg:w-72 drop-shadow-[0_6px_30px_rgba(0,0,0,0.75)] select-none"
            />

            {/* Badge + Cards — BOTTOM */}
            <div className="flex flex-col items-center gap-3 w-full pointer-events-auto">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-brand-red/60 bg-black/35 backdrop-blur-lg"
              >
                <Sparkles className="text-brand-red w-3.5 h-3.5 animate-pulse" />
                <span
                  className="text-[10px] sm:text-xs font-bold tracking-[0.14em] text-white uppercase"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  #1 Industrial Park in Ahmedabad
                </span>
              </motion.div>

              {/* Floating Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-lg"
              >
                {/* ROI */}
                <motion.div
                  whileHover={{ scale: 1.06, y: -5 }}
                  className="p-3 sm:p-4 rounded-xl bg-black/50 backdrop-blur-md border border-green-500/30 hover:border-green-400 transition-all duration-300 text-center shadow-lg cursor-default"
                >
                  <TrendingUp className="text-green-400 mx-auto mb-1" size={16} />
                  <div className="text-lg sm:text-2xl font-black text-green-400" style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}>
                    6-8%
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-white/70 font-semibold">Annual ROI</div>
                </motion.div>

                {/* Units */}
                <motion.div
                  whileHover={{ scale: 1.06, y: -5 }}
                  className="p-3 sm:p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 hover:border-brand-red/60 transition-all duration-300 text-center shadow-lg cursor-default"
                >
                  <LucideFactory className="text-brand-red mx-auto mb-1" size={16} />
                  <div className="text-lg sm:text-2xl font-black text-white" style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}>
                    63
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-white/70 font-semibold">Industrial Units</div>
                </motion.div>

                {/* Area */}
                <motion.div
                  whileHover={{ scale: 1.06, y: -5 }}
                  className="p-3 sm:p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 hover:border-brand-red/60 transition-all duration-300 text-center shadow-lg cursor-default"
                >
                  <LucideLandPlot className="text-brand-red mx-auto mb-1" size={16} />
                  <div className="text-lg sm:text-2xl font-black text-white" style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}>
                    54K+
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-white/70 font-semibold">Sq.yards Area</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          </div>


          {/* ── BUTTON STRIP (20vh) ── */}
          <div
            className={`flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 ${
              theme === 'dark'
                ? 'bg-gray-950 border-t border-gray-800'
                : 'bg-white border-t border-gray-200'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-2xl"
            >
              {/* Explore More — with running edge glow */}
              <Link to="/metro-industrial-park" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative w-full sm:w-auto px-7 py-3 bg-brand-red text-white font-bold rounded-2xl shadow-lg shadow-brand-red/40 overflow-hidden"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  <div className="absolute inset-[-2px] z-0 overflow-hidden rounded-2xl">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 60%, rgba(255,255,255,0.15) 80%, white 100%)',
                        width: '300%', height: '300%',
                        position: 'absolute', top: '-100%', left: '-100%',
                      }}
                    />
                  </div>
                  <div className="absolute inset-[1.5px] bg-brand-red group-hover:bg-red-600 rounded-[calc(1rem-1.5px)] z-0 transition-colors duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-sm">
                    <Building2 size={15} />
                    Explore More
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              {/* Check Availability */}
              <Link to="/site-map" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative w-full sm:w-auto px-7 py-3 bg-brand-red text-white font-bold rounded-2xl shadow-lg shadow-brand-red/40 overflow-hidden"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-700 to-brand-red"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-sm">
                    <MapPin size={15} />
                    Check Availability
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              {/* WhatsApp — hover turns green border */}
              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`group w-full sm:w-auto px-7 py-3 font-bold rounded-2xl border-2 backdrop-blur-xl transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-white/30 text-white hover:border-green-400 hover:bg-green-400/10'
                      : 'border-gray-900/30 text-gray-900 hover:border-green-600 hover:bg-green-50'
                  }`}
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  <span className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                    <FaWhatsapp size={15} className="text-green-500" />
                    WhatsApp
                  </span>
                </motion.button>
              </a>
            </motion.div>

            {/* Subtle scroll cue */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: scrollY < 80 ? 0.45 : 0 }}
              transition={{ duration: 0.4 }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer border-0 bg-transparent mt-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              aria-label="Scroll down"
            >
              <span className="text-[8px] font-bold tracking-widest uppercase">scroll</span>
              <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
                <ChevronDown size={14} />
              </motion.div>
            </motion.button>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURES (was defined but never rendered!)
            ══════════════════════════════════════════ */}
        <section
          ref={featuresRef}
          className={`py-20 sm:py-28 relative overflow-hidden ${
            theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.06),transparent_60%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-14"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-brand-red/10 text-brand-red border border-brand-red/30 mb-4">
                <Sparkles size={11} className="animate-pulse" /> Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold theme-text-primary mt-3 mb-4">
                Everything Your Business <span className="text-brand-red">Needs</span>
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto" />
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`group relative p-7 rounded-2xl border transition-all duration-300 cursor-default overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-800 hover:border-brand-red/50 hover:shadow-lg hover:shadow-brand-red/10'
                      : 'bg-white border-gray-200 hover:border-brand-red/40 hover:shadow-xl hover:shadow-brand-red/10'
                  }`}
                >
                  {/* Background fill on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  {/* Bottom sweep line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-brand-red to-red-400 rounded-b-2xl transition-all duration-500 pointer-events-none" />

                  <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white ${
                    theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {feat.icon}
                  </div>

                  <h3 className={`text-base sm:text-lg font-bold mb-2 group-hover:text-brand-red transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feat.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feat.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════
            STATS
            ══════════════ */}
        <section
          ref={statsRef}
          className={`py-20 sm:py-28 relative overflow-hidden ${
            theme === 'dark' ? 'bg-black' : 'bg-white'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06),transparent_70%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl sm:text-5xl font-bold theme-text-primary mb-4">
                Experience by <span className="text-brand-red">Numbers</span>
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto" />
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`group relative text-center p-8 sm:p-10 rounded-2xl border transition-all duration-300 cursor-default overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-800 hover:border-brand-red/50 hover:shadow-lg hover:shadow-brand-red/20'
                      : 'bg-gray-50 border-gray-200 hover:border-brand-red/40 hover:shadow-xl hover:shadow-brand-red/10'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                  <div className={`w-12 h-12 mx-auto mb-5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-brand-red/20 group-hover:text-brand-red group-hover:scale-110 group-hover:rotate-6 ${
                    theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {stat.icon}
                  </div>

                  <div
                    className={`text-3xl sm:text-5xl font-extrabold mb-2 group-hover:text-brand-red transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}
                  >
                    <CountUp
                      end={stat.countEnd}
                      suffix={stat.suffix}
                      duration={2.5}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </div>


                  <div className={`text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors group-hover:text-brand-red/80 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════
            CTA
            ══════════════ */}
        <section
          ref={ctaRef}
          className={`py-20 sm:py-32 relative overflow-hidden ${
            theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.08),transparent_70%)] animate-pulse pointer-events-none" />
          <div className="absolute top-0 left-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl animate-float pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className={`p-10 sm:p-16 rounded-3xl border backdrop-blur-xl transition-all duration-500 shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gray-900/80 border-gray-800 hover:border-brand-red/30'
                  : 'bg-white/90 border-gray-200 hover:border-brand-red/30'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/10 border border-brand-red/30 rounded-full mb-8"
              >
                <Sparkles className="text-brand-red" size={14} />
                <span className="text-xs font-bold text-brand-red tracking-wide">Get Started Today</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-5xl font-bold theme-text-primary mb-5"
              >
                Ready to Find Your <br className="hidden sm:block" />
                <span className="text-brand-red">Perfect Industrial Space?</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="theme-text-tertiary text-base sm:text-lg mb-10 max-w-xl mx-auto"
              >
                Contact us today to discuss your requirements and schedule a site visit.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <a
                  href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
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

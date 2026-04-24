// src/pages/MetroIndustrialPark/MetroIndustrialPark.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Ruler, Shield, Truck, Phone,
  CheckCircle, Maximize2, Factory, Camera, Droplets,
  TrendingUp, Clock, MapPin, ListCheckIcon, LandPlot,
  CctvIcon, FactoryIcon, Trash, WeightIcon,
} from 'lucide-react';
import { FaRoad, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Download from 'yet-another-react-lightbox/plugins/download';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO/SEO';

// ✅ Import your schemas from the new utils file
import { propertySchema, faqSchema, imageObjectSchema, realEstateListingSchema } from '../../utils/schemas';

/* ── Motion variants ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ── Sub-components ── */
const SectionHeader = ({ icon, title }) => (
  <h2 className="text-xl sm:text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3">
    <span className="text-brand-red">{icon}</span>{title}
  </h2>
);

/* ── ImageCard: added loading="lazy", decoding="async", width/height, keyword alt ── */
const ImageCard = ({ src, alt, title, onOpen, theme, tall = false }) => (
  <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden">
    <div className={`${tall ? 'min-h-[500px]' : 'min-h-[380px]'} w-full ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'
    } flex flex-col items-center justify-center p-4`}>
      <img
        src={src}
        alt={alt}
        width={1200}
        height={800}
        loading="lazy"
        decoding="async"
        className="max-w-full h-auto cursor-zoom-in hover:scale-[1.02] transition-transform duration-300 rounded-lg shadow"
        onClick={onOpen}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<div class="text-gray-500 text-center p-8"><p class="text-lg mb-2">${title}</p><p class="text-sm">Image coming soon</p></div>`;
        }}
      />
      <button
        onClick={onOpen}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl transition-all text-sm font-semibold hover:scale-105 shadow-lg shadow-brand-red/30"
      >
        <Maximize2 size={15} /> View Full Size
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const MetroIndustrialPark = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentSlide,  setCurrentSlide]  = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeTab,     setActiveTab]     = useState('areaTables');
  const [galleryOpen,   setGalleryOpen]   = useState(false);
  const [galleryIndex,  setGalleryIndex]  = useState(0);
  const [viewerOpen,    setViewerOpen]    = useState(false);
  const [viewerSlides,  setViewerSlides]  = useState([]);

  /* ── Section refs ── */
  const overviewRef  = useRef(null);
  const featuresRef  = useRef(null);
  const amenitiesRef = useRef(null);
  const layoutRef    = useRef(null);
  const overviewInView  = useInView(overviewRef,  { once: true, margin: '-60px' });
  const featuresInView  = useInView(featuresRef,  { once: true, margin: '-60px' });
  const amenitiesInView = useInView(amenitiesRef, { once: true, margin: '-60px' });
  const layoutInView    = useInView(layoutRef,    { once: true, margin: '-60px' });

  const whatsappMessage = encodeURIComponent('Hello, I would like to inquire about the industrial sheds.');

  /* ── images array — renamed files + stronger alt text ── */
  const images = [
    {
      src:         '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
      alt:         'Metro Industrial Park - Industrial shed for sale in Moraiya, Changodar, Ahmedabad',
      title:       'Industrial Shed for Sale in Moraiya, Changodar, Ahmedabad',
      description: 'State-of-the-art industrial sheds with high ceilings',
    },
    {
      src:         '/images/warehouse-unit-lease-changodar-ahmedabad.jpg',
      alt:         'Metro Industrial Park - Warehouse unit available for lease near Changodar Ahmedabad',
      title:       'Warehouse Unit Available for Lease near Changodar',
      description: 'Spacious warehouse units with optimal storage',
    },
    {
      src:         '/images/metro-industrial-park-entrance-security-moraiya.jpg',
      alt:         'Metro Industrial Park entrance with 24x7 CCTV security — Moraiya',
      title:       'Metro Industrial Park Entrance — 24x7 Security',
      description: 'Professional entrance with 24/7 security',
    },
    {
      src:         '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
      alt:         '60 ft wide internal road inside Metro Industrial Park Ahmedabad',
      title:       '60ft RCC Road Inside Metro Industrial Park',
      description: 'Wide internal roads engineered for heavy vehicles',
    },
    {
      src:         '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
      alt:         'Aerial drone view site map of Metro Industrial Park Moraiya Gujarat',
      title:       'Metro Industrial Park — Aerial Site Map Moraiya Gujarat',
      description: 'Comprehensive site layout overview',
    },
    {
      src:         '/images/metro-industrial-park-office-changodar.jpg',
      alt:         'Office building at Metro Industrial Park Changodar Ahmedabad',
      title:       'Metro Industrial Park Office',
      description: 'Modern office facilities within the park',
    },
  ];

  const layoutImages = {
    areaTable1: {
      src: '/images/metro-industrial-park-area-details-table-1.jpg',
      alt: 'Metro Industrial Park unit area details table 1 — Moraiya Ahmedabad',
    },
    areaTable2: {
      src: '/images/metro-industrial-park-area-details-table-2.jpg',
      alt: 'Metro Industrial Park unit area details table 2 — Moraiya Ahmedabad',
    },
    siteMap: {
      src: '/images/metro-industrial-park-site-plan-moraiya.jpg',
      alt: 'Metro Industrial Park high-resolution site plan layout — Moraiya Changodar',
    },
  };

  const features = [
    { icon: <Ruler size={22} />,       title: 'Flexible Sizes',   description: '4,000–50,000 sq.ft units available' },
    { icon: <Shield size={22} />,      title: 'Security',         description: 'CCTV surveillance & guards at main gate' },
    { icon: <Truck size={22} />,       title: 'Logistics',        description: 'Easy highway and port access' },
    { icon: <CctvIcon size={22} />,    title: 'CCTV Coverage',    description: 'Complete 24x7 surveillance system' },
    { icon: <Droplets size={22} />,    title: '24x7 Water',       description: 'Continuous water availability across all units' },
    { icon: <WeightIcon size={22} />,  title: 'Weigh Bridge',     description: 'Separate dedicated weigh bridge facility' },
    { icon: <Trash size={22} />,       title: 'Waste Mgmt.',      description: 'Professional waste disposal system' },
    { icon: <FactoryIcon size={22} />, title: 'Infrastructure',   description: 'Modern facilities — RCC available on request' },
  ];

  const specifications = [
    { label: 'Location',     value: 'Moraiya, Changodar' },
    { label: 'Total Area',   value: '54,000 sq.yards' },
    { label: 'Units',        value: '63 Industrial Sheds' },
    { label: 'Unit Sizes',   value: '4,000–50,000 sq.ft' },
    { label: 'Height',       value: '30–35 feet' },
    { label: 'Road Width',   value: '60 feet' },
    { label: 'Possession',   value: '90 days' },
    { label: 'Rental Yield', value: '6–8%' },
    { label: 'Yearly Appreciation', value: 'Up to 10-12%' },
    { label: 'Combined Potential', value: '16-20%' },
    { label: 'RCC Option',   value: 'On request with additional charges' },
    { label: 'Status',       value: 'Available Now' },
  ];

  const amenities = [
    '24x7 Water Supply', 'CCTV Surveillance', 'Security Guards at Main Gate',
    'Separate Weigh Bridge', 'Wide 60 feet Roads', 'Waste Management System',
    'High Ceiling (30–35 ft)', 'Modern Infrastructure — RCC on request',
    'Easy Highway Access', 'Ample Parking Space',
  ];

  const quickStats = [
    { end: 54000, suffix: '',   separator: ',', label: 'Sq.yards Total',  icon: <LandPlot size={26} /> },
    { end: 63,    suffix: '',   separator: '',  label: 'Units Available', icon: <Factory size={26} />  },
    { end: 60,    suffix: 'ft', separator: '',  label: 'Road Width',      icon: <FaRoad size={26} />   },
    { end: 90,    suffix: 'D',  separator: '',  label: 'Possession',      icon: <Clock size={26} />    },
  ];

  /* ── Slide nav ── */
  const nextSlide = useCallback(() => { setCurrentSlide(p => (p + 1) % images.length); setIsAutoPlaying(false); }, [images.length]);
  const prevSlide = useCallback(() => { setCurrentSlide(p => (p - 1 + images.length) % images.length); setIsAutoPlaying(false); }, [images.length]);

  /* ── Lightbox openers ── */
  const openGallery = useCallback((index) => { setGalleryIndex(index); setGalleryOpen(true); setIsAutoPlaying(false); }, []);
  const openViewer  = useCallback((src, alt) => {
    setViewerSlides([{ src, title: alt, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' }]);
    setViewerOpen(true);
  }, []);

  /* ── Auto-play ── */
  useEffect(() => {
    if (!isAutoPlaying || galleryOpen || viewerOpen) return;
    const id = setInterval(() => setCurrentSlide(p => (p + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [isAutoPlaying, galleryOpen, viewerOpen, images.length]);

  /* ── Keyboard nav ── */
  useEffect(() => {
    const onKey = (e) => {
      if (galleryOpen || viewerOpen) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft')  prevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [galleryOpen, viewerOpen, nextSlide, prevSlide]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <>
      <SEO
        title="Industrial Sheds in Moraiya, Changodar, Ahmedabad for Sale and Lease"
        description="Find industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad with 4,000 to 50,000 sq.ft units, 60 ft internal roads, CCTV security, and quick possession timelines."
        keywords="industrial shed in moraiya, industrial shed in changodar, warehouse in ahmedabad, factory shed near changodar, industrial property near sarkhej bavla highway"
        canonical="/metro-industrial-park"
        ogImage="/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg"
        ogImageAlt="Industrial park project in Moraiya Changodar Ahmedabad"
        structuredData={[propertySchema, realEstateListingSchema, faqSchema, imageObjectSchema]}
      />

      <h1 className="sr-only">Industrial Sheds for Sale/Lease in Moraiya, Changodar, Ahmedabad</h1>

      <div className="min-h-screen theme-bg-primary">

        {/* ════════ HERO ════════ */}
        <section className="flex flex-col pt-16">
          <div className="relative flex-shrink-0 overflow-hidden h-[50svh] sm:h-[55svh] lg:h-[70svh]">

            {images.map((img, i) => (
              <div
                key={i}
                aria-hidden={i !== currentSlide}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover object-center"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding={i === 0 ? 'sync' : 'async'}
                  fetchpriority={i === 0 ? 'high' : undefined}
                />
              </div>
            ))}

            {/* Prev */}
            <button
              type="button" onClick={prevSlide} aria-label="Previous image"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-brand-red backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Next */}
            <button
              type="button" onClick={nextSlide} aria-label="Next image"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-brand-red backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <ChevronRight size={18} />
            </button>

            {/* Image counter */}
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-semibold tabular-nums">
              {currentSlide + 1} / {images.length}
            </div>

            {/* Gallery button */}
            <button
              type="button"
              onClick={() => openGallery(currentSlide)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-20 h-10 flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/20 text-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg gap-2"
              aria-label="View all photos"
            >
              <Maximize2 size={16} /> View
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i} type="button"
                  onClick={() => { setCurrentSlide(i); setIsAutoPlaying(false); }}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'bg-brand-red w-6' : 'bg-white/60 hover:bg-white w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CONTENT ZONE */}
          <div className={`flex-1 flex items-center px-4 sm:px-6 py-5 ${
            isDark
              ? 'bg-gradient-to-b from-zinc-950 via-slate-950 to-black border-t border-slate-800/70'
              : 'bg-gradient-to-b from-white via-rose-50/40 to-amber-50/30 border-t border-rose-100/70'
          }`}>
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2 mb-2.5 px-3 py-1.5 bg-brand-red rounded-full shadow-lg shadow-brand-red/30">
                    <Factory size={12} className="text-white" />
                    <span className="text-xs text-white font-bold tracking-wide">Available Now</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold theme-text-primary mb-1.5">
                    Metro Industrial Park
                  </h1>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentSlide}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm sm:text-base theme-text-secondary mb-1"
                    >
                      {images[currentSlide].description}
                    </motion.p>
                  </AnimatePresence>

                  <p className="text-[0.65rem] sm:text-xs text-gray-400 mb-4 italic">
                    RCC construction available on request with additional charges
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all text-xs sm:text-sm shadow-lg shadow-brand-red/30 hover:scale-105 hover:shadow-xl hover:shadow-brand-red/40"
                    >
                      <FaWhatsapp size={16} /> Inquire Now
                    </a>
                    <a
                      href="/site-map"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm hover:scale-105 border-2 ${
                        isDark
                          ? 'border-gray-700 hover:border-brand-red text-white hover:bg-brand-red/10'
                          : 'border-gray-200 hover:border-brand-red text-gray-800 hover:bg-brand-red/5 hover:text-brand-red'
                      }`}
                    >
                      <MapPin size={15} /> Check Availability
                    </a>
                  </div>
                </div>

                {/* Right — quick specs (desktop) */}
                <div className="hidden sm:grid grid-cols-2 gap-2.5 flex-shrink-0">
                  {[
                    { label: '54,000', sub: 'Sq.yards',   icon: <LandPlot size={20} /> },
                    { label: '63',     sub: 'Units',      icon: <Factory size={20} />  },
                    { label: '60 ft',  sub: 'Road Width', icon: <FaRoad size={20} />   },
                    { label: '90 D',   sub: 'Possession', icon: <Clock size={20} />    },
                  ].map((q, i) => (
                    <div
                      key={i}
                      className={`text-center px-5 py-3 rounded-xl border transition-all duration-200 hover:border-brand-red/50 hover:scale-105 ${
                        isDark
                          ? 'bg-black border-gray-800 hover:bg-gray-800'
                          : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="text-brand-red flex justify-center mb-1">{q.icon}</div>
                      <div className="font-extrabold theme-text-primary text-sm" style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif" }}>{q.label}</div>
                      <div className="text-[10px] theme-text-tertiary font-medium">{q.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ QUICK STATS BAR ════════ */}
        <section className={`border-y ${
          isDark
            ? 'bg-gradient-to-r from-slate-950 via-zinc-900 to-black border-slate-800/80'
            : 'bg-gradient-to-r from-slate-50 via-white to-rose-50 border-slate-200/80'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-dashed divide-gray-500/20">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-center group px-2"
                >
                  <div className="flex justify-center mb-1 text-brand-red/50 group-hover:text-brand-red transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-red mb-0.5" style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif" }}>
                    <CountUp end={stat.end} suffix={stat.suffix} separator={stat.separator} duration={2.2} enableScrollSpy scrollSpyOnce />
                  </div>
                  <div className="text-xs sm:text-sm theme-text-tertiary font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ MAIN CONTENT ════════ */}
        <section className={`py-12 sm:py-16 lg:py-20 ${
          isDark
            ? 'bg-gradient-to-b from-black via-slate-950/90 to-black'
            : 'bg-gradient-to-b from-white via-slate-50/40 to-rose-50/40'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

              {/* ── LEFT 2/3 ── */}
              <div className="lg:col-span-2 space-y-14">

                {/* Project Overview */}
                <motion.div ref={overviewRef} variants={containerVariants} initial="hidden" animate={overviewInView ? 'visible' : 'hidden'}>
                  <motion.div variants={fadeUp}><SectionHeader icon={<Factory size={26} />} title="Project Overview" /></motion.div>
                  <motion.div variants={fadeUp} className="theme-bg-card rounded-2xl p-6 sm:p-8 border theme-border hover:border-brand-red/30 transition-colors duration-300">
                    {[
                      'Metro Industrial Park is a premier industrial development strategically located in Moraiya, Changodar. Spread across 54,000 sq.yards, this modern facility offers 63 industrial units ranging from 4,000 to 50,000 sq.ft.',
                      'The park features wide 60 feet roads, 24x7 water supply, comprehensive CCTV surveillance, and a dedicated weigh bridge facility. With possession available in just 90 days, it is ideal for businesses seeking quick occupancy.',
                      'Designed for manufacturing and warehousing operations, the park offers high ceilings (30–35 feet), modern waste management systems, and seamless connectivity to major highways and ports.',
                    ].map((para, i) => (
                      <p key={i} className="text-sm sm:text-base theme-text-secondary leading-relaxed mb-4 last:mb-0">{para}</p>
                    ))}
                    <p className="text-xs mt-4 pt-4 border-t italic theme-text-tertiary" style={{ borderColor: isDark ? '#1f2937' : '#e5e7eb' }}>
                      RCC construction is not standard — available only on request with additional charges.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Key Features */}
                <motion.div ref={featuresRef} variants={containerVariants} initial="hidden" animate={featuresInView ? 'visible' : 'hidden'}>
                  <motion.div variants={fadeUp}><SectionHeader icon={<ListCheckIcon size={26} />} title="Key Features" /></motion.div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5">
                    {features.map((feat, i) => (
                      <motion.div
                        key={i} variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -3 }}
                        className="group relative theme-bg-card p-4 sm:p-6 rounded-2xl border theme-border hover:border-brand-red/50 transition-all duration-300 overflow-hidden cursor-default"
                      >
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-brand-red to-red-400 transition-all duration-500 pointer-events-none" />
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-all duration-300 text-brand-red bg-brand-red/10 group-hover:bg-brand-red group-hover:text-white">
                          {feat.icon}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold theme-text-primary mb-1.5 text-center group-hover:text-brand-red transition-colors duration-300">{feat.title}</h3>
                        <p className="theme-text-secondary text-xs sm:text-sm text-center leading-relaxed">{feat.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Amenities */}
                <motion.div ref={amenitiesRef} variants={containerVariants} initial="hidden" animate={amenitiesInView ? 'visible' : 'hidden'}>
                  <motion.div variants={fadeUp}><SectionHeader icon={<CheckCircle size={26} />} title="Amenities &amp; Facilities" /></motion.div>
                  <motion.div variants={fadeUp} className="theme-bg-card rounded-2xl p-6 sm:p-8 border theme-border">
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {amenities.map((item, i) => (
                        <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 group">
                          <CheckCircle size={17} className="text-brand-red flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-sm sm:text-base theme-text-secondary">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Layout & Site Plan */}
                <motion.div ref={layoutRef} variants={containerVariants} initial="hidden" animate={layoutInView ? 'visible' : 'hidden'}>
                  <motion.div variants={fadeUp}><SectionHeader icon={<MapPin size={26} />} title="Layout &amp; Site Plan" /></motion.div>
                  <motion.div variants={fadeUp} className="flex gap-2 sm:gap-3 mb-6 flex-wrap">
                    {[{ key: 'areaTables', label: 'Area Details' }, { key: 'siteMap', label: 'Site Map' }].map(tab => (
                      <button
                        key={tab.key} type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 sm:px-7 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          activeTab === tab.key
                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                            : isDark
                              ? 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </motion.div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28 }}
                      className="space-y-6"
                    >
                      {activeTab === 'areaTables' ? (
                        <>
                          <ImageCard
                            src={layoutImages.areaTable1.src}
                            alt={layoutImages.areaTable1.alt}
                            title="Area Details Table 1"
                            onOpen={() => openViewer(layoutImages.areaTable1.src, layoutImages.areaTable1.alt)}
                            theme={theme}
                          />
                          <ImageCard
                            src={layoutImages.areaTable2.src}
                            alt={layoutImages.areaTable2.alt}
                            title="Area Details Table 2"
                            onOpen={() => openViewer(layoutImages.areaTable2.src, layoutImages.areaTable2.alt)}
                            theme={theme}
                          />
                        </>
                      ) : (
                        <ImageCard
                          src={layoutImages.siteMap.src}
                          alt={layoutImages.siteMap.alt}
                          title="Site Map — High Resolution"
                          onOpen={() => openViewer(layoutImages.siteMap.src, layoutImages.siteMap.alt)}
                          theme={theme}
                          tall
                        />
                      )}
                      <p className={`text-xs text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        Click image or button to zoom · Pinch on mobile
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* ── RIGHT SIDEBAR ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-5">

                  {/* Specifications */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border">
                    <h3 className="text-lg font-bold theme-text-primary mb-5 pb-3 border-b theme-border">Specifications</h3>
                    <div className="space-y-3">
                      {specifications.map((spec, i) => (
                        <div key={i} className={`flex justify-between items-start gap-3 pb-3 border-b last:border-0 last:pb-0 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                          <span className="theme-text-tertiary text-xs sm:text-sm shrink-0">{spec.label}</span>
                          <span className={`font-semibold text-xs sm:text-sm text-right ${spec.label === 'Status' ? 'text-green-500' : 'theme-text-primary'}`}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ROI */}
                  <div className={`rounded-2xl p-6 border ${
                    isDark
                      ? 'bg-gradient-to-br from-emerald-900/35 via-emerald-700/10 to-transparent border-emerald-500/30'
                      : 'bg-gradient-to-br from-emerald-50 via-lime-50 to-white border-emerald-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-green-500" size={22} />
                      <h3 className="text-base font-bold theme-text-primary">Rental Yield + Appreciation Potential</h3>
                    </div>
                    <p className="text-3xl font-extrabold text-green-500 mb-1" style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif" }}>16-20%</p>
                    <p className="theme-text-tertiary text-xs">6–8% rental yield + up to 10-12% yearly appreciation</p>
                  </div>

                  {/* Contact */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border">
                    <h3 className="text-base font-bold theme-text-primary mb-1">Interested?</h3>
                    <p className="theme-text-tertiary text-xs mb-5 leading-relaxed">
                      Contact us for pricing, site visits, and customised unit options.
                    </p>
                    <div className="space-y-3">
                      <a
                        href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-red/30 text-sm"
                      >
                        <FaWhatsapp size={18} /> WhatsApp Us
                      </a>
                      <a
                        href="tel:+919824235642"
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 border-2 font-bold rounded-xl transition-all hover:scale-105 text-sm ${
                          isDark
                            ? 'border-gray-700 hover:border-brand-red text-white'
                            : 'border-gray-300 hover:border-brand-red text-gray-900'
                        }`}
                      >
                        <Phone size={18} /> Call Now
                      </a>
                    </div>
                  </div>

                  {/* Possession */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="text-brand-red" size={22} />
                      <h3 className="text-base font-bold theme-text-primary">Quick Possession</h3>
                    </div>
                    <p className="text-2xl font-extrabold theme-text-primary mb-1" style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif" }}>90 Days</p>
                    <p className="theme-text-tertiary text-xs">Ready for immediate occupancy</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ GALLERY LIGHTBOX ════════ */}
        <Lightbox
          open={galleryOpen}
          close={() => setGalleryOpen(false)}
          index={galleryIndex}
          slides={images}
          plugins={[Zoom, Captions, Fullscreen, Counter, Download, Slideshow]}
          zoom={{ maxZoomPixelRatio: 5, zoomInMultiplier: 2, doubleTapDelay: 300, doubleClickDelay: 300, scrollToZoom: true }}
          thumbnails={{ position: 'bottom', width: 64, height: 44, border: 1, borderRadius: 6, padding: 2, gap: 6, vignette: true }}
          captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 2, showToggle: true }}
          slideshow={{ autoplay: false, delay: 4000 }}
          carousel={{ finite: false, preload: 2 }}
          styles={{
            container: { backgroundColor: 'rgba(0,0,0,0.97)' },
            root: {
              '--yarl__thumbnails_thumbnail_width':   '64px',
              '--yarl__thumbnails_thumbnail_height':  '44px',
              '--yarl__thumbnails_container_padding': '4px 8px',
              '--yarl__thumbnails_container_gap':     '6px',
            },
          }}
        />

        {/* SINGLE-IMAGE VIEWER */}
        <Lightbox
          open={viewerOpen}
          close={() => setViewerOpen(false)}
          index={0}
          slides={viewerSlides}
          plugins={[Zoom, Fullscreen, Download, Captions]}
          zoom={{ maxZoomPixelRatio: 8, scrollToZoom: true, doubleTapDelay: 300, doubleClickDelay: 300 }}
          captions={{ showToggle: false, descriptionTextAlign: 'center' }}
          carousel={{ finite: true }}
          styles={{
            container: { backgroundColor: 'rgba(0,0,0,0.98)' },
            slide: { padding: '16px' },
          }}
        />

      </div>
    </>
  );
};

export default MetroIndustrialPark;

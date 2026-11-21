// src/pages/MetroIndustrialPark/MetroIndustrialPark.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Ruler, Shield, Truck, Phone,
  Maximize2, Factory, Droplets, TrendingUp, MapPin,
  CctvIcon, FactoryIcon, Trash, WeightIcon, Check, ArrowRight, ArrowUpRight,
  Globe, ExternalLink,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
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
import TenantSpecTable from './TenantSpecTable';
import DriveTimeMatrix from './DriveTimeMatrix';
import {
  metroPark1Schema,
  propertySchema,
  faqSchema,
  imageObjectSchema,
  realEstateListingSchema,
  metroPark1IndividualUnitsSchema,
} from '../../utils/schemas';

const EASE = [0.16, 1, 0.3, 1];

const getTokens = (isDark) => ({
  bgPage:    isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]',
  bgSurface: isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]',
  bgTint:    isDark ? 'bg-[#18181C]' : 'bg-[#F1F3F5]',
  border:    isDark ? 'border-white/[0.12]' : 'border-gray-200',
  divide:    isDark ? 'divide-white/[0.12]' : 'divide-gray-200',
  textMain:  isDark ? 'text-white' : 'text-gray-900',
  textBody:  isDark ? 'text-gray-200' : 'text-gray-700',
  textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
});

/* ── Editorial Section Heading ── */
const SectionHeader = ({ index, kicker, title, isDark }) => {
  const t = getTokens(isDark);
  return (
    <div className={`pb-5 mb-6 border-b ${t.border}`}>
      <div className="flex items-center gap-3 mb-2 font-mono text-[11px] tracking-[0.18em] uppercase">
        <span className="text-brand-red font-semibold">{index}</span>
        <span className={`w-5 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
        <span className={t.textMuted}>{kicker}</span>
      </div>
      <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.textMain}`}>
        {title}
      </h2>
    </div>
  );
};

/* ── Technical Blueprint / Schedule Frame ── */
const ImageCard = ({ src, alt, title, onOpen, isDark, tall = false }) => {
  const t = getTokens(isDark);
  return (
    <div className={`border ${t.border} ${t.bgSurface}`}>
      <div className={`flex items-center justify-between px-4 sm:px-5 py-3 border-b ${t.border} font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em]`}>
        <span className={t.textMuted}>{title}</span>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 text-brand-red font-semibold hover:underline"
        >
          <Maximize2 size={12} aria-hidden="true" />
          <span>Expand</span>
        </button>
      </div>
      <div
        className={`${tall ? 'min-h-[440px]' : 'min-h-[340px]'} w-full ${
          isDark ? 'bg-[#09090B]' : 'bg-[#EFECE6]'
        } flex flex-col items-center justify-center p-4 sm:p-6`}
      >
        <img
          src={src}
          alt={alt}
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className={`max-w-full h-auto cursor-zoom-in border ${t.border}`}
          onClick={onOpen}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div class="text-gray-500 text-center p-8"><p class="text-base font-semibold mb-1">${title}</p><p class="text-xs font-mono uppercase">Drawing coming soon</p></div>`;
          }}
        />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const MetroIndustrialPark = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const t = getTokens(isDark);

  const [currentSlide,  setCurrentSlide]  = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeTab,     setActiveTab]     = useState('areaTables');
  const [galleryOpen,   setGalleryOpen]   = useState(false);
  const [galleryIndex,  setGalleryIndex]  = useState(0);
  const [viewerOpen,    setViewerOpen]    = useState(false);
  const [viewerSlides,  setViewerSlides]  = useState([]);

  const overviewRef = useRef(null);
  const overviewInView = useInView(overviewRef, { once: true, margin: '-60px' });

  const whatsappMessage = encodeURIComponent('Hello, I would like to inquire about the industrial sheds.');

  const images = [
    {
      src:         '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
      alt:         'Metro Industrial Park - Industrial shed for sale in Moraiya, Changodar, Ahmedabad',
      title:       'Industrial Shed for Sale in Moraiya, Changodar, Ahmedabad',
      description: 'State-of-the-art industrial sheds with 30–35 ft clear ceiling height',
    },
    {
      src:         '/images/warehouse-unit-lease-changodar-ahmedabad.jpg',
      alt:         'Metro Industrial Park - Warehouse unit available for lease near Changodar Ahmedabad',
      title:       'Warehouse Unit Available for Lease near Changodar',
      description: 'Spacious warehouse bays built for high-density pallet racking',
    },
    {
      src:         '/images/metro-industrial-park-entrance-security-moraiya.jpg',
      alt:         'Metro Industrial Park entrance with 24x7 CCTV security — Moraiya',
      title:       'Metro Industrial Park Entrance — 24x7 Security',
      description: 'Gated main entrance with round-the-clock CCTV and security personnel',
    },
    {
      src:         '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
      alt:         '60 ft wide internal road inside Metro Industrial Park Ahmedabad',
      title:       '60ft RCC Road Inside Metro Industrial Park',
      description: '60 ft wide heavy-duty RCC internal roads engineered for multi-axle trailers',
    },
    {
      src:         '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
      alt:         'Aerial drone view site map of Metro Industrial Park Moraiya Gujarat',
      title:       'Metro Industrial Park — Aerial Site Map Moraiya Gujarat',
      description: 'Master-planned 54,000 sq.yard industrial layout in Moraiya',
    },
    {
      src:         '/images/metro-industrial-park-office-changodar.jpg',
      alt:         'Office building at Metro Industrial Park Changodar Ahmedabad',
      title:       'Metro Industrial Park Office',
      description: 'Dedicated administrative office block within the industrial campus',
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
    { code: '01', icon: <Ruler size={18} aria-hidden="true" />,       title: 'Flexible Sizes', description: '4,000–50,000 sq.ft modular units' },
    { code: '02', icon: <Shield size={18} aria-hidden="true" />,      title: 'Gate Security',  description: '24/7 guards & CCTV at main gate' },
    { code: '03', icon: <Truck size={18} aria-hidden="true" />,       title: 'Logistics',      description: 'Direct NH 47 highway access' },
    { code: '04', icon: <CctvIcon size={18} aria-hidden="true" />,    title: 'CCTV Coverage',  description: '24×7 HD internal cameras' },
    { code: '05', icon: <Droplets size={18} aria-hidden="true" />,    title: '24×7 Water',     description: 'Continuous water supply per unit' },
    { code: '06', icon: <WeightIcon size={18} aria-hidden="true" />,  title: 'Weigh Bridge',   description: 'On-site commercial weighbridge' },
    { code: '07', icon: <Trash size={18} aria-hidden="true" />,       title: 'Waste Mgmt.',    description: 'Underground drainage system' },
    { code: '08', icon: <FactoryIcon size={18} aria-hidden="true" />, title: 'Infrastructure', description: 'Heavy PEB sheds with RCC options' },
  ];

  const specifications = [
    { label: 'Location',            value: 'Moraiya, Changodar, Ahmedabad' },
    { label: 'Total Area',          value: '54,000 sq.yards' },
    { label: 'Units',               value: '63 Industrial Sheds' },
    { label: 'Unit Sizes',          value: '4,000–50,000 sq.ft' },
    { label: 'Height',              value: '30–35 feet' },
    { label: 'Road Width',          value: '60 feet Heavy RCC' },
    { label: 'Availability',        value: 'For Lease & Outright Sale' },
    { label: 'Lease Terms',         value: '5–10 Year Corporate Lease' },
    { label: 'Possession',          value: 'Immediate / 90 Days' },
    { label: 'Rental Yield',        value: '6–8%' },
    { label: 'Yearly Appreciation', value: 'Up to 10–12%' },
    { label: 'Status',              value: 'Available Now' },
  ];

  const amenities = [
    '24×7 Water Supply', 'CCTV Surveillance', 'Security Guards at Main Gate',
    'Separate Weigh Bridge', 'Wide 60 feet RCC Roads', 'Waste Management System',
    'High Ceiling (30–35 ft)', 'Modern Infrastructure — RCC on request',
    'Easy NH 47 Highway Access', 'Ample Commercial Parking',
  ];

  const quickStats = [
    { code: '01', end: 54000, suffix: '',   separator: ',', label: 'Sq. Yards Total', accent: false },
    { code: '02', end: 63,    suffix: '',   separator: '',  label: 'Ready Units',     accent: false },
    { code: '03', end: 60,    suffix: 'ft', separator: '',  label: 'RCC Road Width',  accent: false },
    { code: '04', end: 90,    suffix: 'D',  separator: '',  label: 'Possession',      accent: true  },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((p) => (p + 1) % images.length);
    setIsAutoPlaying(false);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((p) => (p - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  }, [images.length]);

  const openGallery = useCallback((index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
    setIsAutoPlaying(false);
  }, []);

  const openViewer = useCallback((src, alt) => {
    setViewerSlides([{ src, title: alt, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' }]);
    setViewerOpen(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || galleryOpen || viewerOpen) return;
    const id = setInterval(() => setCurrentSlide((p) => (p + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [isAutoPlaying, galleryOpen, viewerOpen, images.length]);

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

  return (
    <>
      <SEO
        title="Industrial Sheds for Lease & Sale in Changodar, Ahmedabad | Metro Industrial Park 1"
        description="Ready industrial sheds & warehouses for lease and outright sale in Changodar (Moraiya), Ahmedabad on NH 47. 4,000 to 50,000 sq.ft, 30–35ft clear height, 60ft RCC roads, 24/7 security. Contact for per sq.ft lease rates & purchase pricing."
        keywords="industrial shed for rent changodar, industrial shed for lease changodar ahmedabad, warehouse for rent changodar, warehouse on lease ahmedabad, industrial shed for sale changodar, industrial shed in changodar, industrial shed in moraiya, industrial shed ahmedabad, factory shed for rent changodar, warehouse for sale ahmedabad, metro industrial park 1, MIP 1"
        canonical="/metro-industrial-park"
        ogImage="/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg"
        ogImageAlt="Industrial sheds for lease and sale in Changodar Ahmedabad — Metro Industrial Park 1"
        structuredData={[
          metroPark1Schema,
          propertySchema,
          realEstateListingSchema,
          metroPark1IndividualUnitsSchema,
          faqSchema,
          imageObjectSchema,
        ]}
      />

      <div
        className={`min-h-screen ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
      >
        {/* ════════ ARCHITECTURAL HERO SLIDESHOW ════════ */}
        <section className="flex flex-col pt-16">
          <div className="relative flex-shrink-0 overflow-hidden h-[50svh] sm:h-[60svh] lg:h-[72svh] bg-black">
            {images.map((img, i) => (
              <div
                key={img.src}
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
                  fetchPriority={i === 0 ? 'high' : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30" aria-hidden="true" />
              </div>
            ))}

            {/* Top Coordinate Bar */}
            <div className="absolute top-0 inset-x-0 z-10 border-b border-white/15">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/85">
                <span className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span>MIP — 01 · Ready Possession · Moraiya, Changodar</span>
                </span>
                <span className="tabular-nums text-white/75">
                  0{currentSlide + 1} / 0{images.length}
                </span>
              </div>
            </div>

            {/* Sharp Prev / Next */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/65 hover:bg-brand-red border border-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/65 hover:bg-brand-red border border-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} />
            </button>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-4 inset-x-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => openGallery(currentSlide)}
                  className="py-2 px-4 bg-black/70 hover:bg-brand-red border border-white/25 text-white font-mono text-[11px] uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-colors"
                  aria-label="View all photos"
                >
                  <Maximize2 size={13} aria-hidden="true" />
                  <span>Gallery</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setCurrentSlide(i); setIsAutoPlaying(false); }}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-[3px] transition-all duration-300 ${
                        i === currentSlide ? 'bg-brand-red w-8' : 'bg-white/45 hover:bg-white/80 w-3.5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Architect's Title Block ── */}
          <div className={`border-y ${t.border} ${t.bgSurface}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-8">
                  <div className="flex items-center gap-2.5 mb-3 font-mono text-[11px] uppercase tracking-[0.18em]">
                    <span className="text-brand-red font-semibold">MIP — 01</span>
                    <span className={t.textMuted}>/</span>
                    <span className={t.textMuted}>For Lease &amp; Outright Sale · NH 47</span>
                  </div>

                  <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] mb-3 ${t.textMain}`}>
                    Metro{' '}
                    <span className="font-calligraphy font-normal text-[1.25em] text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-500 to-amber-400 inline-block">
                      Industrial
                    </span>{' '}
                    Park 1<span className="text-brand-red">.</span>
                  </h1>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentSlide}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className={`text-sm sm:text-base mb-2 ${t.textBody}`}
                    >
                      {images[currentSlide].description}
                    </motion.p>
                  </AnimatePresence>

                  <p className={`font-mono text-[11px] ${t.textMuted}`}>
                    Note: Custom RCC construction available on request with additional charges.
                  </p>
                </div>

                {/* Action Stack */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FaWhatsapp size={15} aria-hidden="true" />
                      <span>Inquire Now</span>
                    </span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>

                  <Link
                    to="/site-map"
                    className={`w-full py-3.5 px-5 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={14} className="text-brand-red" aria-hidden="true" />
                      <span>Check Live Availability</span>
                    </span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4-Column CountUp Metrics Band ── */}
          <div className={`border-b ${t.border} ${t.bgPage}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className={`grid grid-cols-2 lg:grid-cols-4 border-t border-l ${t.border}`}>
                {quickStats.map((stat) => (
                  <div key={stat.code} className={`p-5 sm:p-6 border-r border-b ${t.border} ${t.bgSurface}`}>
                    <div className={`font-mono text-[10px] mb-3 ${t.textMuted}`}>{stat.code}</div>
                    <div className={`text-2xl sm:text-4xl font-bold tracking-tight tabular-nums ${stat.accent ? 'text-brand-red' : t.textMain}`}>
                      <CountUp
                        end={stat.end}
                        suffix={stat.suffix}
                        separator={stat.separator}
                        duration={2.0}
                        enableScrollSpy
                        scrollSpyOnce
                      />
                    </div>
                    <div className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] mt-1 ${t.textMuted}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════ MAIN 12-COL ARCHITECTURAL SPLIT ════════ */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

              {/* ── LEFT 8 COLS ── */}
              <div className="lg:col-span-8 space-y-16">

                {/* 01. Project Overview */}
                <motion.div
                  ref={overviewRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={overviewInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, ease: EASE }}
                >
                  <SectionHeader
                    index="01"
                    kicker="Park Dossier"
                    title={
                      <>
                        Project{' '}
                        <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                          Overview
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className={`border ${t.border} ${t.bgSurface} p-6 sm:p-8 space-y-4 text-sm sm:text-base leading-relaxed ${t.textBody}`}>
                    <p>
                      Metro Industrial Park is an industrial development strategically located in Moraiya, Changodar. Spread across <strong className={t.textMain}>54,000 sq.yards</strong>, the park offers 63 industrial units ranging from 4,000 to 50,000 sq.ft.
                    </p>
                    <p>
                      The campus features wide 60-foot heavy RCC roads, 24×7 water supply, comprehensive CCTV surveillance, and a dedicated weighbridge facility. With possession available in 90 days, it supports businesses requiring rapid operational handover.
                    </p>
                    <p>
                      Engineered for manufacturing and warehousing operations, the park delivers 30–35 ft clear ceiling heights, planned waste management, and direct access to national highways and Gujarat port corridors.
                    </p>
                    <p className={`pt-4 border-t ${t.border} font-mono text-xs ${t.textMuted}`}>
                      RCC construction is not standard — available on request with additional charges.
                    </p>
                  </div>
                </motion.div>

                {/* 02. Dual Intent: For Lease vs. For Outright Sale */}
                <div>
                  <SectionHeader
                    index="02"
                    kicker="Transaction Modes"
                    title={
                      <>
                        Flexible Options: For Lease &amp;{' '}
                        <span className="font-serif-editorial italic text-brand-red inline-block">
                          For Sale
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className={`border ${t.border} grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x ${t.divide}`}>
                    {/* Option 1: Lease */}
                    <div className={`p-6 sm:p-8 flex flex-col justify-between relative ${t.bgTint}`}>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
                      <div className="pl-1">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red mb-2">
                          For Tenants &amp; 3PL
                        </div>
                        <h3 className={`text-xl font-bold tracking-tight mb-2 flex items-center gap-2 ${t.textMain}`}>
                          <Factory className="text-brand-red" size={18} aria-hidden="true" />
                          <span>Corporate Lease / Rent</span>
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${t.textBody}`}>
                          Ready factory &amp; warehouse spaces from 4,000 to 50,000 sq.ft with rapid handover in Changodar.
                        </p>
                        <ul className="space-y-2.5 text-xs sm:text-sm mb-6">
                          {[
                            'Structured 5–10 year institutional leases',
                            '30–35 ft ceiling height for pallet racking',
                            '60 ft heavy RCC roads for 40ft freight trailers',
                            'Full 18% GST input tax credit eligible',
                          ].map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                              <Check size={14} className="text-brand-red shrink-0 mt-0.5" aria-hidden="true" />
                              <span className={t.textMain}>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a
                        href={`https://wa.me/919824235642?text=${encodeURIComponent('Hello, I am interested in leasing an industrial shed/warehouse at Metro Industrial Park 1 in Changodar. Please share available units and lease rates.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FaWhatsapp size={15} aria-hidden="true" />
                          <span>Inquire Lease Rates</span>
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>
                    </div>

                    {/* Option 2: Outright Sale */}
                    <div className={`p-6 sm:p-8 flex flex-col justify-between ${t.bgSurface}`}>
                      <div>
                        <div className={`font-mono text-[10px] font-bold uppercase tracking-[0.16em] mb-2 ${t.textMuted}`}>
                          For Buyers &amp; Investors
                        </div>
                        <h3 className={`text-xl font-bold tracking-tight mb-2 flex items-center gap-2 ${t.textMain}`}>
                          <TrendingUp className="text-brand-red" size={18} aria-hidden="true" />
                          <span>Outright Freehold Sale</span>
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${t.textBody}`}>
                          Freehold NA industrial sheds for owner-occupiers and investors targeting strong rental yields.
                        </p>
                        <ul className="space-y-2.5 text-xs sm:text-sm mb-6">
                          {[
                            '100% Clear Title NA Industrial Land',
                            'Immediate sale deed registration & bank finance',
                            '6–8% net rental yields from day one',
                            'Up to 10–12% annual capital appreciation',
                          ].map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                              <Check size={14} className="text-brand-red shrink-0 mt-0.5" aria-hidden="true" />
                              <span className={t.textMain}>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a
                        href={`https://wa.me/919824235642?text=${encodeURIComponent('Hello, I am interested in purchasing an industrial shed for sale at Metro Industrial Park 1 in Changodar. Please share pricing and title details.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3.5 px-4 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <FaWhatsapp size={15} className="text-emerald-600" aria-hidden="true" />
                          <span>Inquire Sale Pricing</span>
                        </span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Technical Engineering Matrix */}
                <TenantSpecTable />

                {/* 03. Key Features */}
                <div>
                  <SectionHeader
                    index="03"
                    kicker="Park Capabilities"
                    title={
                      <>
                        Key{' '}
                        <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-amber-500 inline-block">
                          Features
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className="flex flex-col gap-5 sm:gap-6 w-full scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {features.map((feat, i) => {
                      const isEven = i % 2 === 0;
                      return (
                        <motion.article
                          key={feat.code}
                          initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-50px' }}
                          transition={{ duration: 0.65, ease: EASE }}
                          className={`w-[82%] sm:w-[70%] lg:w-[58%] max-w-lg p-5 sm:p-6 border ${t.border} ${t.bgSurface} ${
                            isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'
                          } transition-colors ${
                            isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-red">
                              FEAT {feat.code}
                            </span>
                            <span className={`w-8 h-8 border ${t.border} ${t.bgPage} flex items-center justify-center ${t.textMain}`}>
                              {feat.icon}
                            </span>
                          </div>
                          <h3 className={`text-base font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                            {feat.title}
                          </h3>
                          <p className={`text-xs sm:text-sm leading-relaxed ${t.textBody}`}>
                            {feat.description}
                          </p>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>

                {/* 04. Amenities & Facilities */}
                <div>
                  <SectionHeader
                    index="04"
                    kicker="Campus Utilities"
                    title={
                      <>
                        Amenities &amp;{' '}
                        <span className="font-calligraphy font-normal text-[1.18em] tracking-normal text-emerald-500 inline-block">
                          Facilities
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className={`grid grid-cols-1 sm:grid-cols-2 border-t border-l ${t.border}`}>
                    {amenities.map((item) => (
                      <div
                        key={item}
                        className={`px-5 py-4 border-r border-b ${t.border} ${t.bgSurface} flex items-center gap-3`}
                      >
                        <Check size={14} className="text-brand-red shrink-0" aria-hidden="true" />
                        <span className={`text-sm font-medium ${t.textMain}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 05. Layout & Site Plan */}
                <div>
                  <SectionHeader
                    index="05"
                    kicker="Technical Drawings"
                    title={
                      <>
                        Layout &amp;{' '}
                        <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                          Site Plan
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />

                  <div className={`inline-grid grid-cols-2 border ${t.border} divide-x ${t.divide} mb-6`}>
                    {[
                      { key: 'areaTables', label: 'Area Details' },
                      { key: 'siteMap',    label: 'Site Map' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                          activeTab === tab.key
                            ? 'bg-brand-red text-white'
                            : `${t.bgSurface} ${t.textBody} hover:text-brand-red`
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="space-y-6"
                    >
                      {activeTab === 'areaTables' ? (
                        <>
                          <ImageCard
                            src={layoutImages.areaTable1.src}
                            alt={layoutImages.areaTable1.alt}
                            title="Area Details — Table 1"
                            onOpen={() => openViewer(layoutImages.areaTable1.src, layoutImages.areaTable1.alt)}
                            isDark={isDark}
                          />
                          <ImageCard
                            src={layoutImages.areaTable2.src}
                            alt={layoutImages.areaTable2.alt}
                            title="Area Details — Table 2"
                            onOpen={() => openViewer(layoutImages.areaTable2.src, layoutImages.areaTable2.alt)}
                            isDark={isDark}
                          />
                        </>
                      ) : (
                        <div className={`border ${t.border} ${t.bgSurface}`}>
                          <div className={`flex flex-wrap items-center justify-between px-4 sm:px-5 py-3 border-b ${t.border} font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] gap-2`}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className={t.textMain}>Google Maps Satellite · Metro Industrial Park</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => openViewer(layoutImages.siteMap.src, layoutImages.siteMap.alt)}
                                className="inline-flex items-center gap-1.5 text-brand-red font-semibold hover:underline"
                              >
                                <Maximize2 size={12} aria-hidden="true" />
                                <span>Inspect Blueprint</span>
                              </button>
                              <a
                                href="https://maps.app.goo.gl/6fBawQdYxcmUw3WE6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-brand-red font-semibold hover:underline"
                              >
                                <ExternalLink size={12} aria-hidden="true" />
                                <span>Google Maps</span>
                              </a>
                            </div>
                          </div>
                          <div className="w-full h-[450px] sm:h-[540px] relative bg-black">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1837.49!2d72.4206651!3d22.9140377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9729d95d01c7%3A0xf5a131a39485c5f6!2sMetro%20Industrial%20Park!5e1!3m2!1sen!2sin!4v1782834808336!5m2!1sen!2sin"
                              title="Metro Industrial Park Google Maps Satellite"
                              className="w-full h-full border-0 absolute inset-0"
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                        </div>
                      )}
                      <p className={`font-mono text-[11px] uppercase tracking-wider text-center ${t.textMuted}`}>
                        Click drawing to inspect full resolution · Pinch to zoom on mobile
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Drive-Time Matrix */}
                <DriveTimeMatrix locationName="Moraiya, Changodar" />
              </div>

              {/* ── RIGHT 4 COLS STICKY SIDEBAR ── */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">

                  {/* Specifications Ledger */}
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    <div className={`px-6 py-4 border-b ${t.border} flex items-center justify-between`}>
                      <h3 className={`font-mono text-xs font-bold uppercase tracking-[0.16em] ${t.textMain}`}>
                        Specifications
                      </h3>
                      <span className="font-mono text-[10px] text-brand-red font-semibold">MIP 01</span>
                    </div>
                    <dl className={`divide-y ${t.divide} px-6`}>
                      {specifications.map((spec) => (
                        <div key={spec.label} className="flex justify-between items-start gap-4 py-3 text-xs">
                          <dt className={`font-mono uppercase tracking-wider shrink-0 ${t.textMuted}`}>
                            {spec.label}
                          </dt>
                          <dd className={`font-semibold text-right tabular-nums ${
                            spec.label === 'Status' ? 'text-emerald-500' : t.textMain
                          }`}>
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* ROI Card */}
                  <div className={`relative border ${t.border} ${t.bgSurface} p-6`}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
                    <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-2 ${t.textMuted}`}>
                      Total Return Potential
                    </div>
                    <div className="text-4xl font-bold tracking-tight tabular-nums text-brand-red mb-1">
                      16–20%
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${t.textMain}`}>
                      Yield + Yearly Appreciation
                    </div>
                    <p className={`text-xs leading-relaxed ${t.textBody}`}>
                      6–8% annual rental yield plus up to 10–12% corridor land appreciation.
                    </p>
                  </div>

                  {/* Direct Contact */}
                  <div className={`border ${t.border} ${t.bgSurface} p-6`}>
                    <h3 className={`text-base font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                      Interested in MIP 1?
                    </h3>
                    <p className={`text-xs leading-relaxed mb-5 ${t.textBody}`}>
                      Contact us for current availability, lease rates, outright pricing, and guided site visits.
                    </p>
                    <div className="space-y-2.5">
                      <a
                        href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FaWhatsapp size={15} aria-hidden="true" />
                          <span>WhatsApp Us</span>
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>
                      <a
                        href="tel:+919824235642"
                        className={`w-full py-3.5 px-4 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Phone size={14} className="text-brand-red" aria-hidden="true" />
                          <span className="tabular-nums">+91 98242 35642</span>
                        </span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  {/* Quick Possession */}
                  <div className={`border ${t.border} ${t.bgSurface} p-6`}>
                    <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-2 ${t.textMuted}`}>
                      Quick Possession
                    </div>
                    <div className={`text-2xl font-bold tracking-tight tabular-nums mb-1 ${t.textMain}`}>
                      90 Days
                    </div>
                    <p className={`text-xs ${t.textBody}`}>
                      Ready for rapid fit-out and operational occupancy.
                    </p>
                  </div>

                </div>
              </aside>
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
          captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 2, showToggle: true }}
          slideshow={{ autoplay: false, delay: 4000 }}
          carousel={{ finite: false, preload: 2 }}
          styles={{
            container: { backgroundColor: 'rgba(0,0,0,0.97)' },
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
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Ruler, Shield, Truck, Phone,
  CheckCircle, Maximize2, Building2, Factory, Camera, Droplets,
  Scale, TrendingUp, Clock, MapPin, ListCheckIcon,
  FileDiffIcon,
  LandPlot,
  CctvIcon,
  FactoryIcon,
  Trash,
  WeightTilde,
  Scale3d,
  Scale3DIcon,
  WeightIcon,
} from 'lucide-react';
import { FaRoad, FaWeight, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import Lightbox    from 'yet-another-react-lightbox';
import Zoom        from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails  from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions    from 'yet-another-react-lightbox/plugins/captions';
import Fullscreen  from 'yet-another-react-lightbox/plugins/fullscreen';
import Counter     from 'yet-another-react-lightbox/plugins/counter';
import Download    from 'yet-another-react-lightbox/plugins/download';
import Slideshow   from 'yet-another-react-lightbox/plugins/slideshow';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO/SEO';

/* ─── Motion variants ─── */
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

/* ─── Sub-components ─── */
const SectionHeader = ({ icon, title }) => (
  <h2 className="text-xl sm:text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3">
    <span className="text-brand-red">{icon}</span>
    {title}
  </h2>
);

const ImageCard = ({ src, title, onOpen, theme, tall = false }) => (
  <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden">
    <div className={`${tall ? 'min-h-[500px]' : 'min-h-[380px]'} w-full ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'
    } flex flex-col items-center justify-center p-4`}>
      <img
        src={src}
        alt={title}
        className="max-w-full h-auto cursor-zoom-in hover:scale-[1.02] transition-transform duration-300 rounded-lg shadow"
        onClick={onOpen}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `
            <div class="text-gray-500 text-center p-8">
              <p class="text-lg mb-2">${title}</p>
              <p class="text-sm">Image coming soon</p>
            </div>`;
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

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
const MetroIndustrialPark = () => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide]   = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeTab, setActiveTab]         = useState('areaTables');

  /* ── Lightbox states — completely independent from currentSlide ── */
  const [galleryOpen, setGalleryOpen]   = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);   // ← never tied to currentSlide after open
  const [viewerOpen, setViewerOpen]     = useState(false);
  const [viewerSlides, setViewerSlides] = useState([]);

  /* ─── Section refs + useInView ─── */
  const overviewRef  = useRef(null);
  const featuresRef  = useRef(null);
  const amenitiesRef = useRef(null);
  const layoutRef    = useRef(null);

  const overviewInView  = useInView(overviewRef,  { once: true, margin: '-60px' });
  const featuresInView  = useInView(featuresRef,  { once: true, margin: '-60px' });
  const amenitiesInView = useInView(amenitiesRef, { once: true, margin: '-60px' });
  const layoutInView    = useInView(layoutRef,    { once: true, margin: '-60px' });

  const whatsappMessage = encodeURIComponent('Hello, I would like to inquire about the industrial sheds.');

  /* ─── Data ─── */
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "Metro Industrial Park",
    "description": "54,000 sq.yard industrial park with 63 sheds, 30-35ft height, 60ft roads, 6-8% ROI.",
    "url": "https://www.metrodevelopers.co.in/metro-industrial-park",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Moraiya, Changodar",
      "addressLocality": "Moraiya",
      "addressRegion": "Gujarat",
      "postalCode": "382213",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "22.914141879249897",
      "longitude": "72.41748307531053"
    }
  };

  /* NOTE: uses `src` key — required by yet-another-react-lightbox */
  const images = [
    { src: '/images/2shed.jpg',    title: 'Modern Industrial Shed', description: 'State-of-the-art industrial sheds with high ceilings'  },
    { src: '/images/4shed.jpg',    title: 'Warehouse Facility',     description: 'Spacious warehouse units with optimal storage'        },
    { src: '/images/entrance.jpg', title: 'Park Entrance',          description: 'Professional entrance with 24/7 security'            },
    { src: '/images/mainroad.jpg', title: 'Main Road & Access',     description: 'Wide internal roads engineered for heavy vehicles'    },
    { src: '/images/map.jpg',      title: '3D Map View',            description: 'Comprehensive site layout overview'                  },
    { src: '/images/office.jpg',   title: 'Office Space',           description: 'Modern office facilities within the park'            },
  ];

  const features = [
    { icon: <Ruler size={22} />,     title: 'Flexible Sizes',  description: '4,000 – 50,000 sq.ft units available'                          },
    { icon: <Shield size={22} />,    title: 'Security',        description: 'CCTV surveillance & guards at main gate'                       },
    { icon: <Truck size={22} />,     title: 'Logistics',       description: 'Easy highway and port access'                                  },
    { icon: <CctvIcon size={22} />,    title: 'CCTV Coverage',   description: 'Complete 24x7 surveillance system'                             },
    { icon: <Droplets size={22} />,  title: '24x7 Water',      description: 'Continuous water availability across all units'                },
    { icon: <WeightIcon size={22} />,     title: 'Weigh Bridge',    description: 'Separate dedicated weigh bridge facility'                      },
    { icon: <Trash size={22} />,   title: 'Waste Mgmt.',     description: 'Professional waste disposal system'                            },
    { icon: <FactoryIcon size={22} />, title: 'Infrastructure',  description: 'Modern facilities; RCC available on request with extra charges' },
  ];

  const specifications = [
    { label: 'Location',     value: 'Moraiya, Changodar'                  },
    { label: 'Total Area',   value: '54,000 sq.yards'                     },
    { label: 'Units',        value: '63 Industrial Sheds'                 },
    { label: 'Unit Sizes',   value: '4,000 – 50,000 sq.ft'               },
    { label: 'Height',       value: '30–35 feet'                          },
    { label: 'Road Width',   value: '60 feet'                             },
    { label: 'Possession',   value: '90 days'                             },
    { label: 'Expected ROI', value: '6–8%'                                },
    { label: 'RCC Option',   value: 'On request with additional charges'  },
    { label: 'Status',       value: 'Available Now'                       },
  ];

  const amenities = [
    '24x7 Water Supply',
    'CCTV Surveillance',
    'Security Guards at Main Gate',
    'Separate Weigh Bridge',
    'Wide 60 feet Roads',
    'Waste Management System',
    'High Ceiling (30–35 ft)',
    'Modern Infrastructure (RCC on request)',
    'Easy Highway Access',
    'Ample Parking Space',
  ];

  const layoutImages = {
    areaTable1: '/images/table1.jpg',
    areaTable2: '/images/table2.jpg',
    siteMap:    '/images/metro-industrial-map.jpg',
  };

  const quickStats = [
    { end: 54000, suffix: '',    separator: ',', label: 'Sq.yards Total',  icon: <LandPlot size={26} />   },
    { end: 63,    suffix: '',    separator: '',  label: 'Units Available', icon: <Factory size={26} />  },
    { end: 60,    suffix: ' ft', separator: '',  label: 'Road Width',      icon: <FaRoad size={26} />    },
    { end: 90,    suffix: 'D',   separator: '',  label: 'Possession',      icon: <Clock size={26} />    },
  ];

  /* ─── Slide navigation ─── */
  const nextSlide = useCallback(() => {
    setCurrentSlide((p) => (p + 1) % images.length);
    setIsAutoPlaying(false);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((p) => (p - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  }, [images.length]);

  /* ─── Lightbox openers ─── */
  const openGallery = useCallback((index) => {
    setGalleryIndex(index);  // set once on open — yarl takes over after
    setGalleryOpen(true);
    setIsAutoPlaying(false);
  }, []);

  const openViewer = useCallback((src, title) => {
    setViewerSlides([{ src, title, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' }]);
    setViewerOpen(true);
  }, []);

  /* ─── Auto-play ─── */
  useEffect(() => {
    if (!isAutoPlaying || galleryOpen || viewerOpen) return;
    const id = setInterval(() => setCurrentSlide((p) => (p + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [isAutoPlaying, galleryOpen, viewerOpen, images.length]);

  /* ─── Keyboard shortcuts for hero slideshow ─── */
  useEffect(() => {
    const onKey = (e) => {
      if (galleryOpen || viewerOpen) return;   // let yarl handle keys when open
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft')  prevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [galleryOpen, viewerOpen, nextSlide, prevSlide]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* ════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════ */
  return (
    <>
      <SEO
        title="Rent or invest in Industrial shed in Ahmedabad with high ROI - Metro Industrial Park"
        description="Buy Industrial sheds in Metro industrial park with total of 63 sheds (4,000 sq.ft to 50,000 sq.ft) in Moraiya, Ahmedabad. 54,000 sq.yard, 30-35ft Height, 60ft Roads, 24x7 CCTV, Water supply, Weigh Bridge, Waste Management, 90 Days Possession, 6-8% ROI."
        keywords="Metro Industrial Park, 54000 sq yard industrial park, 63 industrial sheds, Moraiya, GIDC approved Changodar"
        canonical="/metro-industrial-park"
        ogImage="/images/2shed.jpg"
        structuredData={propertySchema}
      />

      <div className="min-h-screen theme-bg-primary">

        <section className="flex flex-col" style={{ minHeight: '100svh' }}>

          {/* IMAGE ZONE — 60svh, clean, no text overlay */}
          <div className="relative flex-shrink-0 overflow-hidden" style={{ height: '70svh' }}>

            {/* All slides stacked — inactive ones are pointer-events-none */}
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
                  alt={img.title}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}

            {/* Prev */}
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-brand-red backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-brand-red backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>

            {/* Image counter */}
            <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-semibold tabular-nums">
              {currentSlide + 1} / {images.length}
            </div>

            {/* View Gallery shortcut */}
            <button
              type="button"
              onClick={() => openGallery(currentSlide)}
              className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-brand-red backdrop-blur-sm border border-white/20 text-white text-xs font-semibold rounded-xl transition-all duration-200"
            >
              <Maximize2 size={13} /> View All Photos
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setCurrentSlide(i); setIsAutoPlaying(false); }}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'bg-brand-red w-8' : 'bg-white/60 hover:bg-white w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CONTENT ZONE — completely separate from images */}
          <div className={`flex-1 flex items-center px-4 sm:px-6 py-5 ${
            theme === 'dark'
              ? 'bg-gray-950 border-t border-gray-800'
              : 'bg-white border-t border-gray-200'
          }`}>
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                {/* Left — title + description + CTAs */}
                <div className="flex-1 min-w-0">

                  <div className="inline-flex items-center gap-2 mb-2.5 px-3 py-1.5 bg-brand-red rounded-full shadow-lg shadow-brand-red/30">
                    <Factory size={12} className="text-white" />
                    <span className="text-xs text-white font-bold tracking-wide">Available Now</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold theme-text-primary mb-1.5">
                    Metro Industrial Park
                  </h1>

                  {/* Slide description animates in sync with image */}
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
                    * RCC construction available on request with additional charges
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all text-xs sm:text-sm shadow-lg shadow-brand-red/30 hover:scale-105"
                    >
                      <FaWhatsapp size={16} /> Inquire Now
                    </a>
                    <button
                      type="button"
                      onClick={() => openGallery(currentSlide)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 border-2 font-bold rounded-xl transition-all text-xs sm:text-sm hover:scale-105 ${
                        theme === 'dark'
                          ? 'border-gray-700 hover:border-brand-red text-white hover:text-white'
                          : 'border-gray-300 hover:border-brand-red text-gray-900'
                      }`}
                    >
                      <Maximize2 size={16} /> View Gallery
                    </button>
                  </div>
                </div>

                {/* Right — mini quick-spec grid, desktop only */}
                <div className="hidden sm:grid grid-cols-2 gap-2.5 flex-shrink-0">
                  {[
                    { label: '54,000', sub: 'Sq.yards',   icon: <LandPlot size={20} />   },
                    { label: '63',     sub: 'Units',       icon: <Factory size={20} />  },
                    { label: '60 ft',  sub: 'Road Width',  icon: <FaRoad size={20} />    },
                    { label: '90 D',   sub: 'Possession',  icon: <Clock size={20} />    },
                  ].map((q, i) => (
                    <div
                      key={i}
                      className={`text-center px-5 py-3 rounded-xl border transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-900 border-gray-800 hover:border-brand-red/50'
                          : 'bg-gray-50 border-gray-200 hover:border-brand-red/40'
                      }`}
                    >
                      <div className="text-brand-red flex justify-center mb-1">{q.icon}</div>
                      <div className="font-extrabold theme-text-primary text-sm" style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}>{q.label}</div>
                      <div className="text-[10px] theme-text-tertiary font-medium">{q.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            QUICK STATS BAR — CountUp
            ══════════════════════════════════ */}
        <section className={`border-y ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-gray-900 to-black border-gray-800'
            : 'bg-gradient-to-r from-gray-100 to-white border-gray-200'
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
                  <div
                    className="text-2xl sm:text-3xl font-extrabold text-brand-red mb-0.5"
                    style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}
                  >
                    <CountUp
                      end={stat.end}
                      suffix={stat.suffix}
                      separator={stat.separator}
                      duration={2.2}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </div>
                  <div className="text-xs sm:text-sm theme-text-tertiary font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            MAIN CONTENT
            ══════════════════════════════════ */}
        <section className={`py-12 sm:py-16 lg:py-20 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

              {/* ── LEFT (2/3) ── */}
              <div className="lg:col-span-2 space-y-14">

                {/* Project Overview */}
                <motion.div
                  ref={overviewRef}
                  variants={containerVariants}
                  initial="hidden"
                  animate={overviewInView ? 'visible' : 'hidden'}
                >
                  <motion.div variants={fadeUp}>
                    <SectionHeader icon={<Factory size={26} />} title="Project Overview" />
                  </motion.div>
                  <motion.div
                    variants={fadeUp}
                    className="theme-bg-card rounded-2xl p-6 sm:p-8 border theme-border hover:border-brand-red/30 transition-colors duration-300"
                  >
                    {[
                      'Metro Industrial Park is a premier industrial development strategically located in Moraiya, Changodar. Spread across 54,000 sq.yards, this modern facility offers 63 industrial units ranging from 4,000 to 50,000 sq.ft.',
                      'The park features wide 60 feet roads, 24x7 water supply, comprehensive CCTV surveillance, and a dedicated weigh bridge facility. With possession available in just 90 days, it is ideal for businesses seeking quick occupancy.',
                      'Designed for manufacturing and warehousing operations, the park offers high ceilings (30–35 feet), modern waste management systems, and seamless connectivity to major highways and ports.',
                    ].map((para, i) => (
                      <p key={i} className="text-sm sm:text-base theme-text-secondary leading-relaxed mb-4 last:mb-0">
                        {para}
                      </p>
                    ))}
                    <p className={`text-xs mt-4 pt-4 border-t italic ${
                      theme === 'dark' ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'
                    }`}>
                      * RCC construction is not standard — available only on request with additional charges.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  ref={featuresRef}
                  variants={containerVariants}
                  initial="hidden"
                  animate={featuresInView ? 'visible' : 'hidden'}
                >
                  <motion.div variants={fadeUp}>
                    <SectionHeader icon={<ListCheckIcon size={26} />} title="Key Features" />
                  </motion.div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5">
                    {features.map((feat, i) => (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -3 }}
                        className="group relative theme-bg-card p-4 sm:p-6 rounded-2xl border theme-border hover:border-brand-red/50 transition-all duration-300 overflow-hidden cursor-default"
                      >
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-brand-red to-red-400 transition-all duration-500 pointer-events-none" />
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-all duration-300 
                          text-brand-red bg-brand-red/10 group-hover:bg-brand-red group-hover:text-white`}>
                          {feat.icon}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold theme-text-primary mb-1.5 text-center group-hover:text-brand-red transition-colors duration-300">
                          {feat.title}
                        </h3>
                        <p className="theme-text-secondary text-xs sm:text-sm text-center leading-relaxed">
                          {feat.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Amenities */}
                <motion.div
                  ref={amenitiesRef}
                  variants={containerVariants}
                  initial="hidden"
                  animate={amenitiesInView ? 'visible' : 'hidden'}
                >
                  <motion.div variants={fadeUp}>
                    <SectionHeader icon={<CheckCircle size={26} />} title="Amenities & Facilities" />
                  </motion.div>
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
                <motion.div
                  ref={layoutRef}
                  variants={containerVariants}
                  initial="hidden"
                  animate={layoutInView ? 'visible' : 'hidden'}
                >
                  <motion.div variants={fadeUp}>
                    <SectionHeader icon={<MapPin size={26} />} title="Layout & Site Plan" />
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex gap-2 sm:gap-3 mb-6 flex-wrap">
                    {[
                      { key: 'areaTables', label: 'Area Details' },
                      { key: 'siteMap',    label: 'Site Map'     },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 sm:px-7 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          activeTab === tab.key
                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                            : theme === 'dark'
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
                      {activeTab === 'areaTables' && (
                        <>
                          <ImageCard
                            src={layoutImages.areaTable1}
                            title="Area Details Table 1"
                            onOpen={() => openViewer(layoutImages.areaTable1, 'Area Details — Table 1')}
                            theme={theme}
                          />
                          <ImageCard
                            src={layoutImages.areaTable2}
                            title="Area Details Table 2"
                            onOpen={() => openViewer(layoutImages.areaTable2, 'Area Details — Table 2')}
                            theme={theme}
                          />
                        </>
                      )}
                      {activeTab === 'siteMap' && (
                        <>
                          <ImageCard
                            src={layoutImages.siteMap}
                            title="Site Map — High Resolution"
                            onOpen={() => openViewer(layoutImages.siteMap, 'Site Map — High Resolution')}
                            theme={theme}
                            tall
                          />
                          <p className={`text-xs text-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Click image or button to zoom · Pinch on mobile
                          </p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* ── RIGHT SIDEBAR (sticky) ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-5">

                  {/* Specifications */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border">
                    <h3 className="text-lg font-bold theme-text-primary mb-5 pb-3 border-b theme-border">
                      Specifications
                    </h3>
                    <div className="space-y-3">
                      {specifications.map((spec, i) => (
                        <div
                          key={i}
                          className={`flex justify-between items-start gap-3 pb-3 border-b last:border-0 last:pb-0 ${
                            theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
                          }`}
                        >
                          <span className="theme-text-tertiary text-xs sm:text-sm shrink-0">{spec.label}</span>
                          <span className={`font-semibold text-xs sm:text-sm text-right ${
                            spec.label === 'Status' ? 'text-green-500' : 'theme-text-primary'
                          }`}>
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ROI */}
                  <div className={`rounded-2xl p-6 border ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-green-900/30 to-transparent border-green-700/30'
                      : 'bg-gradient-to-br from-green-50 to-white border-green-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-green-500" size={22} />
                      <h3 className="text-base font-bold theme-text-primary">Expected ROI</h3>
                    </div>
                    <p className="text-3xl font-extrabold text-green-500 mb-1"
                      style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}>
                      6–8%
                    </p>
                    <p className="theme-text-tertiary text-xs">Annual return on investment</p>
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
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-red/30 text-sm"
                      >
                        <FaWhatsapp size={18} /> WhatsApp Us
                      </a>
                      <a
                        href="tel:+919824235642"
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 border-2 font-bold rounded-xl transition-all hover:scale-105 text-sm ${
                          theme === 'dark'
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
                    <p className="text-2xl font-extrabold theme-text-primary mb-1"
                      style={{ fontFamily: '"Bebas Neue","Oswald",sans-serif' }}>
                      90 Days
                    </p>
                    <p className="theme-text-tertiary text-xs">Ready for immediate occupancy</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            GALLERY LIGHTBOX
            FIX: no `on.view` callback — yarl manages index internally
            after open; external state never changes it mid-session
            ══════════════════════════════════════════════════════════ */}
        <Lightbox
          open={galleryOpen}
          close={() => setGalleryOpen(false)}
          index={galleryIndex}
          slides={images}
          plugins={[Zoom, Thumbnails, Captions, Fullscreen, Counter, Download, Slideshow]}
          zoom={{
            maxZoomPixelRatio: 5,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            scrollToZoom: true,
          }}
          thumbnails={{
            position: 'bottom',
            width: 64,       
            height: 44,    
            border: 1,      
            borderRadius: 6,
            padding: 2,      
            gap: 6,  
            vignette: true,
          }}
          captions={{
            descriptionTextAlign: 'center',
            descriptionMaxLines: 2,
            showToggle: true,
          }}
          slideshow={{ autoplay: false, delay: 4000 }}
          carousel={{ finite: false, preload: 2 }}
          styles={{
            container: { backgroundColor: 'rgba(0,0,0,0.97)' },
            /*
              CSS variables are the only reliable way to override
              yarl's internal thumbnail strip sizing at runtime.
              This hard-caps the strip to 56px regardless of screen size.
            */
            root: {
              '--yarl__thumbnails_thumbnail_width':  '64px',
              '--yarl__thumbnails_thumbnail_height': '44px',
              '--yarl__thumbnails_container_padding': '4px 8px',
              '--yarl__thumbnails_container_gap':    '6px',
            },
          }}
        />


        {/* ══════════════════════════════════════
            SINGLE-IMAGE VIEWER (tables / sitemap)
            ══════════════════════════════════════ */}
        <Lightbox
          open={viewerOpen}
          close={() => setViewerOpen(false)}
          index={0}
          slides={viewerSlides}
          plugins={[Zoom, Fullscreen, Download, Captions]}
          zoom={{
            maxZoomPixelRatio: 8,
            scrollToZoom: true,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
          }}
          captions={{
            showToggle: false,
            descriptionTextAlign: 'center',
          }}
          carousel={{ finite: true }}
          styles={{
            container: { backgroundColor: 'rgba(0,0,0,0.98)' },
            /*
              No thumbnails plugin here — but Captions takes space.
              Push the slide area to use maximum height.
            */
            slide: {
              padding: '16px',
            },
          }}
        />


      </div>
    </>
  );
};

export default MetroIndustrialPark;

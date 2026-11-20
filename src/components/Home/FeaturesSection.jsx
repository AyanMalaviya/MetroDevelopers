// src/components/Home/FeaturesSection.jsx
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Factory, Truck, LucideCctv, Droplets } from 'lucide-react';
import { FaRoad, FaTrash } from 'react-icons/fa';

const EASE = [0.16, 1, 0.3, 1];

/* ─── Chamfered 1px Industrial Bevel Clip Paths ─── */
const OUTER_CLIP =
  'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)';
const INNER_CLIP =
  'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)';
const MEDIA_CLIP =
  'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)';

/* ─── Feature Specifications & Asymmetric Grid Config ─── */
const featuresData = [
  {
    code: 'SPEC 01',
    category: 'Structure',
    span: 'lg:col-span-7',
    offsetClass: '',
    layout: 'wide',
    parallaxRange: [-20, 20],
    bgTexture: '/images/bg-factory-interior.jpg',
    icon: <Factory size={17} aria-hidden="true" />,
    title: 'Modern Infrastructure',
    description:
      'World-class facilities engineered for heavy manufacturing and warehousing with clear-span structural standards.',
    details: [
      '30–35 ft high ceiling clearance',
      'Reinforced flooring for heavy industrial loads',
      'RCC construction available on request',
    ],
    image: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    alt: 'Modern industrial shed infrastructure at Metro Industrial Park Moraiya Ahmedabad',
  },
  {
    code: 'SPEC 02',
    category: 'Connectivity',
    span: 'lg:col-span-5',
    offsetClass: 'lg:mt-14',
    layout: 'tall',
    parallaxRange: [30, -30],
    bgTexture: '/images/bg-industrial-park-aerial.jpg',
    icon: <Truck size={17} aria-hidden="true" />,
    title: 'Strategic Location',
    description:
      'Direct connectivity to national highways, logistics hubs, and Gujarat industrial corridors for uninterrupted freight.',
    details: [
      'Near Sarkhej–Bavla National Highway',
      'Direct access to GIDC industrial zones',
      'Close to Ahmedabad city & airport',
    ],
    image: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    alt: 'Strategic location map of Metro Industrial Park near Sarkhej Bavla Highway Moraiya',
  },
  {
    code: 'SPEC 03',
    category: 'Security',
    span: 'lg:col-span-5',
    offsetClass: 'lg:-mt-6',
    layout: 'tall',
    parallaxRange: [-26, 26],
    bgTexture: '/images/bg-manufacturing-floor.jpg',
    icon: <LucideCctv size={17} aria-hidden="true" />,
    title: '24/7 Security',
    description:
      'Full-perimeter CCTV coverage paired with manned gate control ensuring round-the-clock operational safety.',
    details: [
      'HD CCTV cameras throughout the park',
      'Trained security guards at main gate',
      'Controlled commercial vehicle entry',
    ],
    image: '/images/metro-industrial-park-entrance-security-moraiya.jpg',
    alt: 'CCTV security surveillance at Metro Industrial Park entrance Moraiya Ahmedabad',
  },
  {
    code: 'SPEC 04',
    category: 'Logistics',
    span: 'lg:col-span-7',
    offsetClass: 'lg:mt-8',
    layout: 'wide',
    parallaxRange: [24, -24],
    bgTexture: '/images/bg-factory-interior.jpg',
    icon: <FaRoad size={16} aria-hidden="true" />,
    title: 'Wide Heavy RCC Roads',
    description:
      '60 ft concrete internal road network built specifically for multi-axle trailers and heavy commercial movement.',
    details: [
      '60 ft wide internal arterial network',
      'Heavy-duty RCC road construction',
      'Easy turning radius for trailers & containers',
    ],
    image: '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
    alt: '60 ft wide RCC road inside Metro Industrial Park designed for heavy vehicles Ahmedabad',
  },
  {
    code: 'SPEC 05',
    category: 'Utilities',
    span: 'lg:col-span-7',
    offsetClass: 'lg:-mt-4',
    layout: 'wide',
    parallaxRange: [-22, 22],
    bgTexture: '/images/bg-manufacturing-floor.jpg',
    icon: <Droplets size={17} aria-hidden="true" />,
    title: '24/7 Water Supply',
    description:
      'Continuous water availability across every industrial unit to support uninterrupted production shifts.',
    details: [
      'Round-the-clock water availability',
      'Dedicated supply line per unit',
      'Emergency water reserve capacity',
    ],
    image: '/images/feature-water-supply.jpg',
    alt: '24x7 water supply facility at Metro Industrial Park Moraiya Changodar Ahmedabad',
  },
  {
    code: 'SPEC 06',
    category: 'Sanitation',
    span: 'lg:col-span-5',
    offsetClass: 'lg:mt-12',
    layout: 'tall',
    parallaxRange: [28, -28],
    bgTexture: '/images/bg-industrial-park-aerial.jpg',
    icon: <FaTrash size={15} aria-hidden="true" />,
    title: 'Hygienic Drainage',
    description:
      'Planned underground drainage and waste management keeping internal yards clean through monsoon and peak cycles.',
    details: [
      'Underground storm & utility drainage',
      'Structured industrial waste management',
      'Compliant, low-maintenance disposal network',
    ],
    image: '/images/feature-drainage-system.jpg',
    alt: 'Hygienic drainage and waste management system at Metro Industrial Park Ahmedabad',
  },
];

/* ─── Desktop breakpoint check so touch scrolling stays clean on mobile ─── */
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
};

/* ════════════════════════════════════════════════
   ASYMMETRIC ARCHITECTURAL PARALLAX CARD
   ════════════════════════════════════════════════ */
const ArchitecturalFeatureCard = ({ feat, index, isDark, isDesktop }) => {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: '-70px' });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.25,
  });

  const cardY  = useTransform(smooth, [0, 1], feat.parallaxRange);
  const imageY = useTransform(smooth, [0, 1], [-16, 16]);

  const isWide    = feat.layout === 'wide';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textBody  = isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]';
  const textMuted = isDark ? 'text-[#6E6E77]' : 'text-[#73726C]';
  const borderCol = isDark ? 'border-white/[0.1]' : 'border-black/[0.11]';

  return (
    <motion.article
      ref={cardRef}
      style={isDesktop ? { y: cardY } : undefined}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: EASE }}
      className={`${feat.span} ${feat.offsetClass} group relative`}
    >
      {/* Technical Corner Registration Brackets (Monochrome -> Signal Red on hover) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-1.5 -right-1.5 w-4 h-4 border-t border-r transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-brand-red z-20 ${
          isDark ? 'border-white/30' : 'border-black/30'
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b border-l transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-brand-red z-20 ${
          isDark ? 'border-white/30' : 'border-black/30'
        }`}
      />

      {/* Custom 1px Chamfered Border Shell */}
      <div
        className={`relative p-[1px] transition-colors duration-300 ${
          isDark
            ? 'bg-white/[0.12] group-hover:bg-brand-red/70'
            : 'bg-black/[0.14] group-hover:bg-brand-red/75'
        }`}
        style={{ clipPath: OUTER_CLIP }}
      >
        {/* Inner Frosted Surface */}
        <div
          className={`relative h-full overflow-hidden backdrop-blur-md transition-colors duration-300 ${
            isDark ? 'bg-[#121215]/95' : 'bg-white/95'
          }`}
          style={{ clipPath: INNER_CLIP }}
        >
          {/* Low-Opacity Industrial Ambient Texture Inside Card */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-700 group-hover:scale-[1.04] ${
              isDark
                ? 'opacity-[0.09] mix-blend-luminosity'
                : 'opacity-[0.045] grayscale'
            }`}
            style={{ backgroundImage: `url(${feat.bgTexture})` }}
          />

          {/* Readability Wash */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none ${
              isDark
                ? 'bg-gradient-to-br from-[#121215]/90 via-[#121215]/82 to-[#0B0B0D]/95'
                : 'bg-gradient-to-br from-white/95 via-white/88 to-[#F5F3EE]/95'
            }`}
          />

          {/* Top 2px Signal Red Reveal Line */}
          <div
            aria-hidden="true"
            className="relative z-10 h-[2px] w-full bg-brand-red scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"
          />

          {/* Technical Top Spec Strip */}
          <div
            className={`relative z-10 flex items-center justify-between px-5 sm:px-6 py-3 border-b ${borderCol} font-mono text-[10px] tracking-[0.16em] uppercase`}
          >
            <span className="flex items-center gap-2">
              <span className="text-brand-red font-medium sm:font-semibold">{feat.code}</span>
              <span className={textMuted}>/</span>
              <span className={textMuted}>{feat.category}</span>
            </span>
            <span className={`tabular-nums ${textMuted}`}>
              0{index + 1} — 06
            </span>
          </div>

          {/* Card Body — Wide cards split on md+, Tall cards stack */}
          <div
            className={`relative z-10 p-5 sm:p-6 flex flex-col gap-6 ${
              isWide ? 'md:flex-row md:items-stretch' : ''
            }`}
          >
            {/* Clipped Parallax Media Frame */}
            <div
              className={`relative overflow-hidden flex-shrink-0 border ${borderCol} bg-neutral-950 ${
                isWide
                  ? 'w-full md:w-[46%] aspect-[4/3] md:aspect-auto md:min-h-[260px]'
                  : 'w-full aspect-[16/10]'
              }`}
              style={{ clipPath: MEDIA_CLIP }}
            >
              {/* Fallback surface if image is missing */}
              <div className="absolute inset-0 bg-[#17171B] flex items-center justify-center text-white/15">
                <div className="scale-[2.5]">{feat.icon}</div>
              </div>

              {/* Site Photograph with Scroll Glide */}
              <motion.img
                src={feat.image}
                alt={feat.alt}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                style={{ y: imageY, scale: 1.12 }}
                onError={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Subtle Photographic Vignette */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
              />
            </div>

            {/* Content Column */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Crisp Monochrome Icon Box */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-9 h-9 border ${borderCol} flex items-center justify-center transition-colors duration-300 ${
                      isDark
                        ? 'bg-[#0B0B0D] text-[#F5F4F0] group-hover:border-brand-red group-hover:text-brand-red'
                        : 'bg-[#F5F3EE] text-[#121214] group-hover:border-brand-red group-hover:text-brand-red'
                    }`}
                  >
                    {feat.icon}
                  </div>
                  <div className={`h-px flex-1 ${isDark ? 'bg-white/[0.09]' : 'bg-black/[0.09]'}`} />
                </div>

                <h3 className={`text-xl sm:text-2xl font-medium sm:font-semibold tracking-tight leading-snug mb-2.5 font-sans ${textMain}`}>
                  {feat.title}
                </h3>

                <p className={`text-sm leading-relaxed mb-5 ${textBody}`}>
                  {feat.description}
                </p>
              </div>

              {/* Specification Bullets */}
              <div className={`pt-4 border-t ${borderCol}`}>
                <ul className="space-y-2">
                  {feat.details.map((detail, di) => (
                    <li key={di} className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-snug">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 w-1.5 h-1.5 bg-brand-red flex-shrink-0"
                      />
                      <span className={textMain}>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ════════════════════════════════════════════════
   MAIN FEATURES SECTION
   ════════════════════════════════════════════════ */
const FeaturesSection = ({ isDark }) => {
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });
  const isDesktop  = useIsDesktop();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgTopY    = useTransform(scrollYProgress, [0, 1], ['-8%', '10%']);
  const bgBottomY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F5F3EE]';
  const borderCol = isDark ? 'border-white/[0.1]' : 'border-black/[0.11]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textBody  = isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]';
  const textMuted = isDark ? 'text-[#6E6E77]' : 'text-[#73726C]';

  return (
    <section
      ref={sectionRef}
      aria-label="Park Infrastructure and Core Specifications"
      className={`py-16 sm:py-28 relative overflow-hidden ${bgPage}`}
    >
      {/* ── PARALLAX BACKGROUND LAYER 1: Factory Interior ── */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgTopY, backgroundImage: "url('/images/bg-factory-interior.jpg')" }}
        className={`absolute -top-24 inset-x-0 h-[62%] bg-cover bg-center pointer-events-none ${
          isDark
            ? 'opacity-[0.14] mix-blend-lighten'
            : 'opacity-[0.06] grayscale contrast-125'
        }`}
      />

      {/* ── PARALLAX BACKGROUND LAYER 2: Industrial Park Aerial ── */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgBottomY, backgroundImage: "url('/images/bg-industrial-park-aerial.jpg')" }}
        className={`absolute -bottom-24 inset-x-0 h-[58%] bg-cover bg-center pointer-events-none ${
          isDark
            ? 'opacity-[0.12] mix-blend-lighten'
            : 'opacity-[0.055] grayscale contrast-125'
        }`}
      />

      {/* ── Subtle Architectural Drafting Grid ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(18,18,20,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,18,20,0.045) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* ── Soft Edge Fades into Adjacent Sections ── */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-b from-[#0B0B0D] via-transparent to-[#0B0B0D]'
            : 'bg-gradient-to-b from-[#F5F3EE] via-transparent to-[#F5F3EE]'
        }`}
      />

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Asymmetric Editorial Header matching HomePage */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pb-10 sm:pb-12 mb-12 sm:mb-16 border-b ${borderCol}`}
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
              <span className="text-brand-red font-medium sm:font-semibold">SPECS</span>
              <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
              <span className={textMuted}>Park Infrastructure · Moraiya</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl lg:text-[3.25rem] font-medium sm:font-semibold lg:font-bold tracking-[-0.025em] leading-[1.08] font-sans ${textMain}`}>
              Engineered for Heavy <span className="text-brand-red">Operations</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end lg:items-end lg:text-right">
            <p className={`text-sm sm:text-base leading-relaxed max-w-md ${textBody}`}>
              Every utility—from 60 ft concrete haul roads to dedicated water lines and 24/7 gated security—is built into the park master plan from day one.
            </p>
          </div>
        </motion.div>

        {/* Asymmetric 12-Column Staggered Parallax Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-9 lg:gap-10 items-start">
          {featuresData.map((feat, i) => (
            <ArchitecturalFeatureCard
              key={feat.code}
              feat={feat}
              index={i}
              isDark={isDark}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
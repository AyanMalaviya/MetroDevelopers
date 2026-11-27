// src/components/Home/FeaturesSection.jsx
import { useRef, memo } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Factory, Truck, LucideCctv, Droplets, Scale } from 'lucide-react';
import { FaRoad, FaTrash } from 'react-icons/fa';
import SlidingCardShell from './SlidingCardShell';
import { useIsDesktop } from '../../hooks/useIsDesktop';

const EASE = [0.16, 1, 0.3, 1];

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
    title: (
      <>
        Modern <span className="font-serif-editorial italic text-brand-red font-normal">Infrastructure</span>
      </>
    ),
    description:
      'Built for heavy manufacturing and warehousing with 30–35 ft height.',
    details: [
      '30–35 ft ceiling clearance',
      'Heavy industrial load flooring',
      'PEB & RCC options',
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
    title: (
      <>
        Strategic <span className="font-calligraphy font-normal text-[1.18em] text-amber-500 inline-block">Location</span>
      </>
    ),
    description:
      'On Sarkhej–Bavla Highway (NH 47) near Changodar GIDC.',
    details: [
      'Direct NH 47 highway access',
      'Near Changodar GIDC',
      'Quick link to Ahmedabad city',
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
    title: (
      <>
        24/7 <span className="font-serif-display italic font-semibold text-emerald-500">Security</span>
      </>
    ),
    description:
      '24/7 CCTV surveillance with trained security guards at main gate.',
    details: [
      '24/7 HD CCTV monitoring',
      'Manned gate security',
      'Controlled vehicle entry',
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
    title: (
      <>
        Wide Heavy <span className="font-serif-editorial italic text-brand-red font-normal">RCC Roads</span>
      </>
    ),
    description:
      '60 ft concrete internal roads for multi-axle trailers.',
    details: [
      '60 ft wide heavy RCC roads',
      'Easy trailer turning radius',
      'Heavy load capacity',
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
    title: (
      <>
        24/7 Water <span className="font-calligraphy font-normal text-[1.18em] text-cyan-500 inline-block">Supply</span>
      </>
    ),
    description:
      'Continuous water availability dedicated to each unit.',
    details: [
      '24/7 continuous supply',
      'Dedicated unit connection',
      'On-site water storage',
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
    title: (
      <>
        Hygienic <span className="font-serif-display italic font-semibold text-emerald-500">Drainage</span>
      </>
    ),
    description:
      'Underground storm drainage and planned waste management.',
    details: [
      'Underground drainage system',
      'Monsoon flood protection',
      'Clean internal yards',
    ],
    image: '/images/feature-drainage-system.jpg',
    alt: 'Hygienic drainage and waste management system at Metro Industrial Park Ahmedabad',
  },
  {
    code: 'SPEC 07',
    category: 'Weighment',
    span: 'lg:col-span-7',
    offsetClass: 'lg:-mt-4',
    layout: 'wide',
    parallaxRange: [-22, 22],
    bgTexture: '/images/bg-manufacturing-floor.jpg',
    icon: <Scale size={17} aria-hidden="true" />,
    title: (
      <>
        In-House <span className="font-serif-editorial italic text-brand-red font-normal">Weigh Bridge</span>
      </>
    ),
    description:
      'Dedicated on-site heavy-vehicle weighbridge for fast, accurate dispatch and receiving.',
    details: [
      'Heavy-duty multi-axle truck capacity',
      'Instant certified weight slips',
      'Zero off-site detour delays',
    ],
    image: '/images/feature-weighbridge.jpg',
    alt: 'In-house heavy vehicle commercial weighbridge facility at Metro Industrial Park Ahmedabad',
  },
];

/* ════════════════════════════════════════════════
   ASYMMETRIC ARCHITECTURAL PARALLAX CARD
   ════════════════════════════════════════════════ */
const ArchitecturalFeatureCard = memo(({ feat, index, isDark, isDesktop }) => {
  const textMain  = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderCol = isDark ? 'border-white/[0.12]' : 'border-gray-200';

  return (
    <SlidingCardShell
      index={index}
      parallaxRange={feat.parallaxRange}
      bgTexture={feat.bgTexture}
      isDark={isDark}
      isDesktop={isDesktop}
      widthClass="w-[82%] sm:w-[70%] lg:w-[58%] max-w-2xl"
      headerLeft={
        <span className="flex items-center gap-2">
          <span className="text-brand-red font-medium sm:font-semibold">{feat.code}</span>
          <span className={textMuted}>/</span>
          <span className={textMuted}>{feat.category}</span>
        </span>
      }
      headerRight={
        <span className={`tabular-nums ${textMuted}`}>
          {String(index + 1).padStart(2, '0')} — {String(featuresData.length).padStart(2, '0')}
        </span>
      }
      media={{
        src: feat.image,
        alt: feat.alt,
        fallbackIcon: feat.icon,
      }}
    >
      <div>
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

        <h3 className={`text-xl sm:text-2xl font-bold tracking-tight leading-snug mb-1 ${textMain}`}>
          {feat.title}
        </h3>
      </div>

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
    </SlidingCardShell>
  );
});
ArchitecturalFeatureCard.displayName = 'ArchitecturalFeatureCard';

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

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]';
  const borderCol = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const textMain  = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <section
      ref={sectionRef}
      aria-label="Park Infrastructure and Core Specifications"
      className={`py-16 sm:py-28 relative overflow-hidden ${bgPage}`}
    >
      {/* ── PARALLAX BACKGROUND LAYER 1: Factory Interior ── */}
      <motion.div
        aria-hidden="true"
        style={{ y: isDesktop ? bgTopY : undefined, backgroundImage: "url('/images/bg-factory-interior.jpg')" }}
        className={`absolute -top-24 inset-x-0 h-[62%] bg-cover bg-center pointer-events-none ${
          isDark
            ? 'opacity-[0.14] mix-blend-lighten'
            : 'opacity-[0.06] grayscale contrast-125'
        }`}
      />

      {/* ── PARALLAX BACKGROUND LAYER 2: Industrial Park Aerial ── */}
      <motion.div
        aria-hidden="true"
        style={{ y: isDesktop ? bgBottomY : undefined, backgroundImage: "url('/images/bg-industrial-park-aerial.jpg')" }}
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
          <div className="lg:col-span-12">
            <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
              <span className="text-brand-red font-medium sm:font-semibold">SPECS</span>
              <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
              <span className={textMuted}>Park Infrastructure · Moraiya</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] ${textMain}`}>
              Engineered for Heavy{' '}
              <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                Operations
              </span>
            </h2>
          </div>
        </motion.div>

        {/* Alternating Sliding Feature Cards — No inner scrollbar, generous alternate space */}
        <div className="flex flex-col gap-8 sm:gap-12 w-full overflow-x-clip scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
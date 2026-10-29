// src/pages/HomePage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Phone, ArrowRight, Star, Clock, Sparkles, TrendingUp,
  MapPin, LucideLandPlot, Factory, LucideCctv, Droplets,
  Truck, BarChart3, Coins, Home, CheckCircle2, Banknote, Users, Globe,
  TrendingDown, Award, Quote as QuoteIcon, Shield, X
} from 'lucide-react';
import { FaRoad, FaTrash, FaWhatsapp, FaInstagram, FaPlay } from 'react-icons/fa';
import SEO from '../components/SEO/SEO';
import { useTheme } from '../context/ThemeContext.jsx';
import CountUp from 'react-countup';
import {
  propertySchema,
  faqSchema,
  imageObjectSchema,
  websiteSchema,
  realEstateListingSchema,
  socialProfileSchema,
} from '../utils/schemas.js';


/* ─── Hero images — light vs dark ─── */
const heroImageLight = '/images/metro-industrial-park-entrance-security-moraiya.jpg';
const heroImageDark  = '/images/metro-industrial-park-entrance-dawn.jpg';


/* ─── Feature colors ─── */
const featureColors = [
  { gradient: 'from-rose-500 to-orange-500',   bg: 'from-rose-950 to-orange-950',   text: 'text-rose-400',    shadow: 'shadow-rose-500/30'    },
  { gradient: 'from-blue-500 to-cyan-400',      bg: 'from-blue-950 to-cyan-950',      text: 'text-blue-400',    shadow: 'shadow-blue-500/30'    },
  { gradient: 'from-violet-500 to-purple-500',  bg: 'from-violet-950 to-purple-950',  text: 'text-violet-400',  shadow: 'shadow-violet-500/30'  },
  { gradient: 'from-amber-500 to-yellow-400',   bg: 'from-amber-950 to-yellow-950',   text: 'text-amber-400',   shadow: 'shadow-amber-500/30'   },
  { gradient: 'from-cyan-500 to-teal-400',      bg: 'from-cyan-950 to-teal-950',      text: 'text-cyan-400',    shadow: 'shadow-cyan-500/30'    },
  { gradient: 'from-emerald-500 to-green-400',  bg: 'from-emerald-950 to-green-950',  text: 'text-emerald-400', shadow: 'shadow-emerald-500/30' },
];


/* ─── Features ─── */
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
    details: ['Near NH 47 (Sarkhej Bavla National Highway)', 'Easy access to GIDC industrial areas', 'Close to Ahmedabad city & airport'],
    image: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    alt: 'Strategic location map of Metro Industrial Park near NH 47 (Sarkhej Bavla Highway) Moraiya',
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


/* ─── Stats ─── */
const stats = [
  { countEnd: 30,  suffix: 'k+', label: 'Sq.yards of Area',      icon: <LucideLandPlot size={24} /> },
  { countEnd: 43,  suffix: '+',  label: 'Industrial Units Made', icon: <Factory size={24} /> },
  { countEnd: 100, suffix: '%',  label: 'Client Satisfaction',   icon: <Star           size={24} /> },
  { countEnd: 6,   suffix: '+',  label: 'Years of Experience',   icon: <Clock          size={24} /> },
];


/* ─── Investment comparison ─── */
const investments = [
  {
    name: 'Gold',
    icon: Coins,
    yield: '6–7%',
    yieldNote: 'CAGR only, no income',
    gradient: 'from-yellow-600 to-amber-500',
    border: 'border-yellow-500/30',
    textAccent: 'text-yellow-500',
    cons: ['Zero passive income — appreciation only', 'Storage, insurance & theft risk', 'Emotionally driven, bubble-prone pricing'],
    isUs: false,
  },
  {
    name: 'Fixed Deposit',
    icon: Banknote,
    yield: '6.5–7%',
    yieldNote: 'Pre-tax (slab rate applies)',
    gradient: 'from-sky-600 to-blue-500',
    border: 'border-sky-500/30',
    textAccent: 'text-sky-500',
    cons: ['100% taxable at your income slab', 'Zero capital appreciation ever', 'Real return often negative post-inflation'],
    isUs: false,
  },
  {
    name: 'Residential',
    icon: Home,
    yield: '2–4%',
    yieldNote: 'Rental yield, high overhead',
    gradient: 'from-purple-600 to-violet-500',
    border: 'border-purple-500/30',
    textAccent: 'text-purple-500',
    cons: ['Only 2–4% yield in Tier-1 cities', 'Tenant disputes & maintenance cost', 'No GST input credit available'],
    isUs: false,
  },
  {
    name: 'Industrial Shed',
    icon: Factory,
    yield: '16-20%',
    yieldNote: '6–8% rental yield + up to 10–12% appreciation',
    gradient: 'from-red-500 via-orange-500 to-amber-500',
    border: 'border-red-400/60',
    textAccent: 'text-orange-500',
    pros: [
      'Stable 5–10 yr lease agreements',
      '5–10% built-in annual rent escalation',
      'GST input credit benefit for tenants',
      'Capital appreciation in industrial zones',
      'Supports local job creation & economy',
    ],
    isUs: true,
  },
];


/* ─── Investment reasons ─── */
const investReasons = [
  { icon: Users,      title: 'Job Creation',          gradient: 'from-emerald-500 to-teal-400',  glow: 'shadow-emerald-500/15', desc: 'Each shed lease supports 10–50 local jobs. Your capital fuels real economic activity, not just paper wealth.' },
  { icon: Globe,      title: 'Make in India',          gradient: 'from-blue-500 to-indigo-400',   glow: 'shadow-blue-500/15',    desc: "Industrial leasing hit a record 37M sq ft in 2025 — a 28% year-on-year surge across India's top 8 cities." },
  { icon: TrendingUp, title: 'Inflation-Proof Income', gradient: 'from-amber-500 to-orange-400',  glow: 'shadow-amber-500/15',   desc: 'Built-in 5–10% annual rent escalation clauses make industrial leases one of the few assets that beat inflation every year.' },
  { icon: Shield,     title: 'Tangible Asset',         gradient: 'from-green-500 to-emerald-400', glow: 'shadow-green-500/15',   desc: "Unlike FDs or gold ETFs, you own a real, insurable, income-generating structure with enduring land value beneath it." },
  { icon: Award,      title: 'GST Input Credit',       gradient: 'from-violet-500 to-purple-400', glow: 'shadow-violet-500/15',  desc: "Industrial lessees can claim full GST input credit — a unique fiscal advantage completely unavailable with residential leases." },
  { icon: BarChart3,  title: 'Long-Term Stability',    gradient: 'from-rose-500 to-pink-400',     glow: 'shadow-rose-500/15',    desc: 'Industrial tenants sign 5–10 year leases vs 11-month residential agreements — predictable, compounding returns.' },
];


/* ─── Quotes ─── */
const bigQuotes = [
  { text: 'The factory is the machine that builds the machine.', author: 'Elon Musk',      role: 'CEO, Tesla & SpaceX',             gradient: 'from-red-500 via-orange-400 to-amber-400' },
  { text: "Manufacturing is more than just putting parts together. It's coming up with ideas, testing principles and perfecting the engineering.", author: 'James Dyson',    role: 'Founder, Dyson',                  gradient: 'from-blue-500 via-cyan-400 to-teal-400'   },
  { text: 'No country is ever successful in the long term without a really strong and vibrant manufacturing base.', author: 'Alan Mulally', role: 'Former CEO, Ford Motor Company', gradient: 'from-violet-500 via-purple-400 to-pink-400'},
];


/* ════════════════════════════════════════════════
   FEATURE CARD
════════════════════════════════════════════════ */
const FeatureRow = ({ feat, index, isDark }) => {
  const rowRef = useRef(null);
  const inView = useInView(rowRef, { once: true, margin: '-80px' });
  const color  = featureColors[index];

  return (
    <motion.article
      ref={rowRef}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border p-4 sm:p-6 transition-colors ${
        isDark ? 'border-gray-800 bg-black/60 backdrop-blur-sm'
               : 'border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="relative mb-5">
        <div className={`p-[2px] rounded-2xl bg-gradient-to-br ${color.gradient}`}>
          <div className={`rounded-[calc(1rem-2px)] overflow-hidden aspect-[16/9] relative ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} flex items-center justify-center`}>
              <div className="opacity-[0.12] scale-[3.2] text-white pointer-events-none select-none" aria-hidden="true">{feat.icon}</div>
            </div>
            <img
              src={feat.image}
              alt={feat.alt}
              width={800}
              height={600}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.currentTarget.style.opacity = '0'; }}
            />
          </div>
        </div>
        <div className="absolute top-3 right-3 z-10" aria-hidden="true">
          <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${color.gradient} text-white font-extrabold text-xs shadow-md font-display`}>
            Feature {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-md`} aria-hidden="true">
          {feat.icon}
        </div>
        <span className={`text-[10px] font-black tracking-[0.18em] uppercase ${color.text}`}>
          Premium Infrastructure
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold mb-3 leading-tight font-display">
        <span className={`bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent`}>{feat.title}</span>
      </h3>
      <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {feat.description}
      </p>
      <ul className="space-y-2.5" aria-label={`${feat.title} details`}>
        {feat.details.map((detail, di) => (
          <li key={di} className="flex items-center gap-3">
            <div className={`w-[18px] h-[18px] rounded-full flex-shrink-0 bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-sm`} aria-hidden="true">
              <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                <path d="M1.5 4L3.5 6.5L8.5 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{detail}</span>
          </li>
        ))}
      </ul>
      <div className={`h-[3px] w-14 rounded-full bg-gradient-to-r ${color.gradient} mt-5`} aria-hidden="true" />
    </motion.article>
  );
};


/* ════════════════════════════════════════════════
   INVESTMENT SECTION
════════════════════════════════════════════════ */
const InvestmentSection = ({ isDark }) => {
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' });
  const [activeQ, setActiveQ] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveQ((p) => (p + 1) % bigQuotes.length), 5000);
    return () => clearInterval(id);
  }, []);

  const headingColor = isDark ? 'text-white'    : 'text-gray-900';
  const bodyColor    = isDark ? 'text-gray-400' : 'text-gray-600';
  const mutedColor   = isDark ? 'text-gray-500' : 'text-gray-500';
  const tagBg        = isDark ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-orange-50 border-orange-300/70 text-orange-600';
  const quoteWrap    = isDark ? 'border-gray-800 bg-black'              : 'border-gray-200 bg-white shadow-xl shadow-gray-200/60';
  const quoteText    = isDark ? 'text-white/90'  : 'text-gray-800';
  const quoteIconCls = isDark ? 'opacity-[0.08] text-white' : 'opacity-[0.06] text-gray-900';
  const dotInactive  = isDark ? 'bg-white/20 hover:bg-white/40' : 'bg-gray-300 hover:bg-gray-400';
  const cardBase     = isDark ? 'border-gray-800 bg-black' : 'border-gray-200/80 bg-white shadow-sm';
  const cardFeat     = isDark
    ? 'border-red-500/50 bg-gradient-to-b from-red-950/80 to-orange-950/60 shadow-2xl shadow-red-500/20'
    : 'border-red-300 bg-gradient-to-b from-red-50 to-orange-50 shadow-xl shadow-red-200/40';
  const cardName     = isDark ? 'text-white'    : 'text-gray-900';
  const cardYieldN   = isDark ? 'text-gray-500' : 'text-gray-400';
  const cardCons     = isDark ? 'text-gray-500' : 'text-gray-500';
  const cardConsIcon = isDark ? 'text-gray-600' : 'text-gray-400';
  const cardPros     = isDark ? 'text-gray-300' : 'text-gray-700';
  const reasonCard   = isDark
    ? 'border-gray-800 bg-black hover:border-gray-700'
    : 'border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow-md';
  const reasonTitle  = isDark ? 'text-white'    : 'text-gray-900';
  const reasonDesc   = isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-700';
  const subHeading   = isDark ? 'text-white'    : 'text-gray-900';
  const bottomText   = isDark ? 'text-gray-500' : 'text-gray-600';

  return (
    <section
      ref={sectionRef}
      aria-label="Industrial investment comparison"
      className="relative py-16 sm:py-36 overflow-hidden"
      style={{ background: isDark ? '#06060f' : '#faf9f6' }}
    >
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-red-600/10' : 'bg-red-400/8'}`} aria-hidden="true" />
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-orange-500/8' : 'bg-orange-300/10'}`} aria-hidden="true" />
      <div className={`absolute top-1/2 left-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-violet-600/6' : 'bg-violet-300/8'}`} aria-hidden="true" />

      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-gray-300/50'} to-transparent pointer-events-none`} aria-hidden="true" />
      <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-gray-300/50'} to-transparent pointer-events-none`} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-5 ${tagBg}`}>
            <TrendingUp size={11} className="animate-pulse" aria-hidden="true" /> Smarter Investment
          </span>
          <h2 className="text-3xl sm:text-6xl font-black leading-tight mb-5 font-display">
            <span className={headingColor}>Industrial Sheds </span>
            <span className="block sm:inline bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              vs. Everything Else
            </span>
          </h2>
          <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${bodyColor}`}>
            While others watch their FDs lose real value to inflation, smart investors are locking in
            <span className="text-orange-500 font-semibold"> 6–8% rental yields</span> plus
            <span className="text-orange-500 font-semibold"> up to 10-12% yearly appreciation</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`relative mb-12 rounded-3xl border overflow-hidden p-6 sm:p-12 transition-colors duration-300 ${quoteWrap}`}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-white/20' : 'via-gray-300/60'}`} aria-hidden="true" />
          <QuoteIcon className={`absolute top-6 left-6 ${quoteIconCls}`} size={64} aria-hidden="true" />

          <div className="relative min-h-[260px] sm:min-h-[280px]">
            {bigQuotes.map((q, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: i === activeQ ? 1 : 0, y: i === activeQ ? 0 : 10 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center px-4 text-center pointer-events-none"
                aria-hidden={i !== activeQ}
              >
                <div className="max-w-4xl mx-auto">
                  <p className={`text-lg sm:text-3xl font-light italic leading-relaxed mb-6 ${quoteText} font-accent`}>
                    "{q.text}"
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-sm font-bold bg-gradient-to-r ${q.gradient} bg-clip-text text-transparent`}>
                      — {q.author}
                    </span>
                    <span className={`text-xs tracking-wide ${mutedColor}`}>{q.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Quote navigation">
            {bigQuotes.map((q, i) => (
              <button
                key={i}
                onClick={() => setActiveQ(i)}
                role="tab"
                aria-selected={i === activeQ}
                aria-label={`Quote by ${q.author}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeQ ? 'w-6 h-1.5 bg-orange-400' : `w-1.5 h-1.5 ${dotInactive}`
                }`}
              />
            ))}
          </div>
          <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-white/10' : 'via-gray-200'}`} aria-hidden="true" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16" role="list" aria-label="Investment comparison">
          {investments.map((inv, i) => {
            const Icon = inv.icon;
            return (
              <motion.div
                key={inv.name}
                role="listitem"
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-2xl border p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 ${inv.isUs ? cardFeat : cardBase}`}
              >
                {inv.isUs && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-orange-400 to-amber-400" aria-hidden="true" />
                    <div className="absolute -top-3 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                        ✦ Best Choice
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${inv.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-lg`} aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <p className={`font-bold text-sm ${cardName} font-body`}>{inv.name}</p>
                </div>

                <div>
                  <div className={`text-3xl font-black bg-gradient-to-r ${inv.gradient} bg-clip-text text-transparent font-display`} aria-label={`${inv.name} returns: ${inv.yield}`}>
                    {inv.yield}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${cardYieldN}`}>{inv.yieldNote}</div>
                </div>

                <ul className="space-y-2 flex-1">
                  {inv.isUs
                    ? inv.pros.map((p, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-orange-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className={`text-[12px] ${cardPros}`}>{p}</span>
                        </li>
                      ))
                    : inv.cons.map((c, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <TrendingDown size={13} className={`flex-shrink-0 mt-0.5 ${cardConsIcon}`} aria-hidden="true" />
                          <span className={`text-[12px] ${cardCons}`}>{c}</span>
                        </li>
                      ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-center mb-10"
        >
          <h3 className={`text-xl sm:text-4xl font-black mb-3 ${subHeading} font-display`}>
            Beyond Returns:{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">The Bigger Picture</span>
          </h3>
          <p className={`text-sm max-w-xl mx-auto ${bodyColor}`}>
            Industrial investment isn't just financially superior — it builds real communities, real jobs and real India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {investReasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.55 + i * 0.08, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group relative rounded-2xl border p-6 overflow-hidden transition-all duration-300 cursor-default shadow-lg ${reasonCard} ${r.glow}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 rounded-2xl`} aria-hidden="true" />
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white mb-4 shadow-lg`} aria-hidden="true">
                  <Icon size={20} />
                </div>
                <h4 className={`font-bold text-base mb-2 ${reasonTitle} font-body`}>{r.title}</h4>
                <p className={`text-sm leading-relaxed transition-colors ${reasonDesc}`}>{r.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-12 text-center"
        >
          <p className={`text-sm mb-4 ${bottomText}`}>
            Industrial & warehousing leasing hit a{' '}
            <span className="text-orange-500 font-semibold">record 37 million sq ft in 2025</span> — a 28% surge across India's top cities.
          </p>
          <Link to="/metro-industrial-park">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-bold text-sm shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-shadow"
            >
              <Factory size={16} aria-hidden="true" />
              Start Your Investment — Explore Units
              <ArrowRight size={15} aria-hidden="true" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
/* ─── Cloud-Hosted Assets Data (SEO Optimized) ─── */
const cloudUpdates = [
  {
    id: '1',
    type: 'video',
    url: 'https://res.cloudinary.com/iz6nhmsy/video/upload/q_auto,f_auto/v1787560096/METRO_INDUSTRIAL_PARK_04.mp4', 
    thumbnail: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    title: 'Complete Guide to Metro Industrial Park',
    description: 'Watch the full walkthrough of Metro Industrial Park, showcasing its premium infrastructure, wide roads, and strategic location in Moraiya, Gujarat.',
    altText: 'Full video walkthrough of Metro Industrial Park in Moraiya Ahmedabad',
    uploadDate: '2026-08-22',
  },
  {
    id: '2',
    type: 'video',
    url: 'https://res.cloudinary.com/iz6nhmsy/video/upload/q_auto,f_auto/v1787560385/Metro_industrial_park_reel_1.mov', 
    thumbnail: '/images/post2.png',
    title: 'Phase 1 Reaching Completion',
    description: 'On-ground construction update showing structural progress of industrial sheds.',
    altText: 'Construction progress of Phase 1 industrial sheds at Metro Industrial Park',
    uploadDate: '2026-08-20',
  },
  {
    id: '3',
    type: 'video',
    url: 'https://res.cloudinary.com/iz6nhmsy/video/upload/q_auto,f_auto/v1787560339/metro_industrial_park_pixel_art_video.mp4', 
    thumbnail: '/images/post1.png', 
    title: 'Warehouses, Sheds and Plots',
    description: 'Warehouses and Plots in Metro Industrial Park',
    altText: 'Pixel art style digital layout visualization of Industrial Park 2',
    uploadDate: '2026-08-24',
  },
];
/* ════════════════════════════════════════════════
   LATEST UPDATES SECTION (Native Cloud Assets - Max SEO)
════════════════════════════════════════════════ */
const InstagramSection = ({ isDark }) => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const scrollContainerRef = useRef(null);

  // Define the base URL for absolute paths required by Google Schema
  const siteUrl = 'https://metroindustrialpark.com'; 

  return (
    <section
      ref={sectionRef}
      aria-label="Latest Updates and On-Ground Progress"
      className="relative py-12 sm:py-20 overflow-hidden border-b"
      style={{
        background: isDark ? '#08080d' : '#fcfbfa',
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-3 ${
                isDark
                  ? 'bg-pink-500/10 text-pink-400 border-pink-500/30'
                  : 'bg-pink-50 text-pink-600 border-pink-300/60'
              }`}
            >
              <FaInstagram size={13} className="text-pink-500" aria-hidden="true" />
              @metro.industrialpark
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight font-display">
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Catch the </span>
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                Live Action
              </span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}> & </span>
              <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                Latest Updates
              </span>
            </h2>
          </motion.div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/metro.industrialpark/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-transform"
            >
              <FaInstagram size={14} aria-hidden="true" /> Follow on Instagram
            </a>
          </div>
        </div>

        {/* ── Side Scrollable Native Feed ── */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth items-start"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cloudUpdates.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col gap-3 flex-none w-[280px] sm:w-[320px] snap-start group"
              // ── SCHEMA.ORG MICRODATA FOR MAXIMUM SEO ──
              itemScope
              itemType={post.type === 'video' ? "https://schema.org/VideoObject" : "https://schema.org/ImageObject"}
            >
              {/* Invisible Meta Tags specifically for Google Crawlers */}
              <meta itemProp="name" content={post.title} />
              <meta itemProp="description" content={post.description} />
              <meta itemProp="contentUrl" content={post.url} />
              {post.thumbnail && <meta itemProp="thumbnailUrl" content={`${siteUrl}${post.thumbnail}`} />}
              {post.uploadDate && <meta itemProp="uploadDate" content={post.uploadDate} />}

              {/* Media Container (Maintains 4:5 Aspect Ratio) */}
              <div className={`relative rounded-2xl overflow-hidden border shadow-sm aspect-[4/5] bg-gray-900 ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
                
                {post.type === 'video' ? (
                  <>
                    <video
                      className="w-full h-full object-cover [&:fullscreen]:object-contain [&:-webkit-full-screen]:object-contain"
                      controls
                      preload="none"
                      poster={post.thumbnail}
                      playsInline
                      aria-label={post.altText || post.title}
                      title={post.title}
                    >
                      <source src={post.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Visual Play Button Overlay (Disappears on hover/play) */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full pointer-events-none border border-white/10 group-hover:opacity-0 transition-opacity">
                      <FaPlay size={10} className="text-white ml-0.5" aria-hidden="true" />
                    </div>
                  </>
                ) : (
                  <img
                    src={post.url}
                    alt={post.altText || post.title}
                    title={post.title}
                    loading="lazy"
                    itemProp="image"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Text Context */}
              <div className="px-1 mt-1">
                <h3 className={`text-sm font-bold mb-1 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};


/* ════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════ */
const HomePage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const heroImage = isDark ? heroImageDark : heroImageLight;
  const heroAlt   = isDark
    ? 'Metro Industrial Park entrance at dawn — industrial sheds in Moraiya, Ahmedabad'
    : 'Metro Industrial Park entrance security gate — industrial sheds for sale in Moraiya, Ahmedabad';

  

    const featuresRef = useRef(null);
  const statsRef    = useRef(null);
  const ctaRef      = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });
  const statsInView    = useInView(statsRef,    { once: true, margin: '-80px' });
  const ctaInView      = useInView(ctaRef,      { once: true, margin: '-80px' });

  // Pre-written WhatsApp message
  const whatsappMessage = encodeURIComponent(
    'Hello, I am interested in industrial sheds at Metro Industrial Park, Moraiya. Please share availability and pricing.'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const homeSchemas = [
    websiteSchema,
    propertySchema,
    realEstateListingSchema,
    faqSchema,
    imageObjectSchema,
    socialProfileSchema,
  ];

  return (
    <>
      <SEO
        title="Metro Developers | Industrial Parks in Ahmedabad & Gujarat (MIP 1, 2, 3)"
        description="Official website of Metro Developers — leading industrial developers of Metro Industrial Parks (MIP 1, MIP 2, MIP 3) across Moraiya, Changodar, and Bavla, Ahmedabad. Industrial sheds, warehouses, and plots for sale & lease."
        keywords="metro developers, metro industrial park, MIP, MIP ahmedabad, metro developers ahmedabad, MIP 1, MIP 2, MIP 3, metro industrial park 1, metro industrial park 2, metro industrial park 3, industrial sheds moraiya, industrial park changodar, industrial plots gujarat, industrial land bavla"
        canonical="/"
        ogImage="/images/metro-industrial-park-entrance-dawn.jpg"
        ogImageAlt="Metro Developers — Metro Industrial Parks (MIP 1, 2, 3) in Moraiya, Changodar, and Bavla, Ahmedabad"
        structuredData={homeSchemas}
      />

      <h1 className="sr-only">
        Metro Developers — Industrial Parks (MIP 1, 2, 3), Sheds, Warehouses &amp; Plots in Ahmedabad, Gujarat
      </h1>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&family=Instrument+Serif:ital@0;1&display=swap');
        @keyframes kenBurns { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
      `}</style>

      <div className="min-h-screen theme-bg-primary overflow-hidden"
        style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>

        {/* ════════ HERO ════════ */}
        <section aria-label="Hero — Metro Industrial Park, Moraiya, Ahmedabad" className="relative pt-16">
          <div className="relative h-[26svh] sm:h-[60svh] lg:h-[70svh] overflow-hidden">
            <img
              src={heroImage}
              alt={heroAlt}
              width={1600}
              height={900}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/70" aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 w-[55%] sm:w-[48%] lg:w-[42%] bg-gradient-to-r from-black/85 via-black/60 to-transparent pointer-events-none" aria-hidden="true" />

            {/* Compact #1 Badge — repositioned to top-right to prevent overlap with hero text */}
            <div className="absolute top-3 sm:top-5 right-3 sm:right-6 z-10">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full border border-brand-red/50 bg-black/60 backdrop-blur-md shadow-md"
                role="status"
              >
                <Sparkles className="text-brand-red w-3 h-3 animate-pulse shrink-0" aria-hidden="true" />
                <span className="text-[9px] sm:text-xs font-extrabold tracking-wider text-white uppercase whitespace-nowrap">
                  <span className="sm:hidden">#1 Industrial Park</span>
                  <span className="hidden sm:inline">#1 Industrial Park in Ahmedabad</span>
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="absolute bottom-4 sm:bottom-10 lg:bottom-10 left-4 sm:left-6 lg:left-8 max-w-[62%] sm:max-w-[46%] lg:max-w-[360px]"
              aria-hidden="true"
            >
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-brand-red mb-1.5">
                <span className="w-3 sm:w-5 h-[1.5px] bg-brand-red rounded-full" />
                Industrial Opportunity
              </span>
              {/* High-contrast solid typography for effortless scannability (no hollow/blurry stroke text) */}
              <p
                style={{ fontFamily: '"Bebas Neue", sans-serif', lineHeight: 1.04, letterSpacing: '0.02em' }}
                className="text-[1.35rem] sm:text-[2.2rem] lg:text-[3.1rem] drop-shadow-md"
              >
                <span className="block text-white/90">A Space Built for</span>
                <span className="block text-white">Manufacturing</span>
                <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent font-black">
                  Growth
                </span>
              </p>
              <p className="hidden sm:block text-gray-300 text-[10px] sm:text-[11px] lg:text-xs leading-relaxed mt-2 max-w-[240px] lg:max-w-[260px]">
                From small-scale production to expanding industrial operations, the right
                facility creates the environment for efficiency, quality, and long-term
                business growth.
              </p>
            </motion.div>
          </div>

          <div
            className="relative overflow-hidden border-t"
            style={{
              background: isDark ? '#0a0a0f' : '#fdfcfa',
              borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
            }}
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/25 to-transparent pointer-events-none" aria-hidden="true" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 relative z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full max-w-lg mb-2" role="list" aria-label="Key metrics">
                  {[
                    { icon: <TrendingUp size={16} aria-hidden="true" />, value: '6-8%', label: 'Rental Yield', color: 'text-green-400', border: 'border-green-500/30 hover:border-green-400' },
                    { icon: <Factory size={16} aria-hidden="true" />, value: '63', label: 'Industrial Units', color: isDark ? 'text-white' : 'text-gray-900', border: isDark ? 'border-white/20 hover:border-brand-red/60' : 'border-gray-300 hover:border-brand-red/60' },
                    { icon: <LucideLandPlot size={16} aria-hidden="true" />, value: '54K+', label: 'Sq.yards Area', color: isDark ? 'text-white' : 'text-gray-900', border: isDark ? 'border-white/20 hover:border-brand-red/60' : 'border-gray-300 hover:border-brand-red/60' },
                  ].map(({ icon, value, label, color, border }) => (
                    <motion.div
                      key={label}
                      role="listitem"
                      whileHover={{ scale: 1.04, y: -3 }}
                      className={`p-2.5 sm:p-4 rounded-xl border ${border} transition-all duration-300 text-center shadow-sm cursor-default ${
                        isDark ? 'bg-black' : 'bg-white/90'
                      }`}
                    >
                      <span className={`${color} flex justify-center mb-1`}>{icon}</span>
                      <div className={`text-base sm:text-2xl font-black ${color}`} style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                        {value}
                      </div>
                      <div className={`text-[8px] sm:text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ── CTA Buttons with 1 Full / 2 Half layout on mobile ── */}
                <div className="w-full max-w-[360px] sm:max-w-none grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2.5 mx-auto">
                  <Link
                    to="/metro-industrial-park"
                    aria-label="Explore industrial shed units at Metro Industrial Park"
                    className="col-span-2 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 bg-gradient-to-r from-red-600 via-brand-red to-rose-600 text-white font-extrabold rounded-xl text-[13px] sm:text-sm tracking-wide shadow-xl shadow-red-500/30 hover:scale-[1.02] transition-transform whitespace-nowrap"
                  >
                    <Factory size={16} aria-hidden="true" />
                    Explore Now
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  
                  <Link
                    to="/site-map"
                    aria-label="Check industrial shed availability at Metro Industrial Park"
                    className={`col-span-1 sm:w-auto inline-flex items-center justify-center gap-1.5 px-1 sm:px-5 py-3 sm:py-2.5 border font-bold rounded-xl text-[11px] sm:text-sm transition-colors text-center ${
                      isDark
                        ? 'border-brand-red/50 bg-black text-red-300 hover:border-brand-red hover:text-red-200'
                        : 'border-brand-red/50 bg-white text-brand-red hover:border-brand-red hover:text-red-700'
                    }`}
                  >
                    <MapPin size={13} className="shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap">Availability</span>
                  </Link>
                  
                  <a
                    href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp Metro Industrial Park"
                    className={`col-span-1 sm:w-auto inline-flex items-center justify-center gap-1.5 px-1 sm:px-5 py-3 sm:py-2.5 border font-bold rounded-xl text-[11px] sm:text-sm transition-colors text-center ${
                      isDark
                        ? 'border-white/25 bg-black text-white hover:border-green-400/60 hover:text-green-300'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-green-500/60 hover:text-green-700'
                    }`}
                  >
                    <FaWhatsapp size={13} className="text-green-500 shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InstagramSection isDark={isDark} />


        {/* ════════ FLAGSHIP DEVELOPMENTS ════════ */}
        <section
          aria-label="Flagship Industrial Developments by Metro Developers"
          className="relative py-14 sm:py-20 overflow-hidden"
          style={{ background: isDark ? '#08080f' : '#ffffff' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-3 ${
                isDark ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                <Factory size={13} /> Our Developments
              </span>
              <h2 className="text-2xl sm:text-5xl font-black leading-tight"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Ready Sheds or </span>
                <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Build Your Own
                </span>
              </h2>
              <p className={`text-xs sm:text-base max-w-2xl mx-auto mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose between move-in ready high-clearance industrial sheds or clear-title industrial plots with developer-provided 24/7 security & wide heavy RCC roads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Metro Industrial Park */}
              <div className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                isDark ? 'bg-gray-900/40 border-gray-800 hover:border-red-500/40' : 'bg-white border-gray-200 hover:border-red-300 shadow-md'
              }`}>
                <div>
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-950">
                    <img
                      src="/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg"
                      alt="Ready industrial sheds at Metro Industrial Park Moraiya Changodar"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-brand-red text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      Ready Possession
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-red mb-2">
                      <MapPin size={14} /> Moraiya, Changodar (Near NH 47)
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-black mb-2 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Industrial Park 1 <span className="text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-md align-middle">MIP 1</span>
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      63 premium ready-to-move industrial sheds & warehouses across 54,000+ sq.yards. 30–35 ft ceiling clearance, 60 ft heavy RCC internal roads, and proven 6–8% rental yield.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-6">
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-black/40 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        <span className="block text-brand-red font-black text-sm">4K–50K Sq.ft</span> Units
                      </div>
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-black/40 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        <span className="block text-green-500 font-black text-sm">6–8%</span> Rental Yield
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-0 flex items-center gap-3">
                  <Link
                    to="/metro-industrial-park"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:scale-[1.02] transition-transform whitespace-nowrap"
                  >
                    <span>Explore Sheds</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/site-map"
                    className={`inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-colors whitespace-nowrap ${
                      isDark ? 'bg-black border-gray-800 text-gray-300 hover:border-brand-red' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MapPin size={14} className="mr-1" /> View Map
                  </Link>
                </div>
              </div>

              {/* Card 2: Industrial Park 2 */}
              <div className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                isDark ? 'bg-gray-900/40 border-gray-800 hover:border-orange-500/40' : 'bg-white border-gray-200 hover:border-orange-300 shadow-md'
              }`}>
                <div>
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-950">
                    <img
                      src="/images/metro-industrial-park-2-site-plan.jpg"
                      alt="Industrial plots for sale to build your own shed at Industrial Park 2 Moraiya"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      Build Your Own Shed
                    </div>
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      New Launch
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-semibold text-orange-500 mb-2">
                      <MapPin size={14} /> Opp. Metro Industrial Park, Moraiya
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-black mb-2 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Industrial Park 2 <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md align-middle">MIP 2</span>
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      23 clear-title industrial plots to "Build Your Own Shed". Developer infrastructure: Wide Heavy RCC Roads, Street Lights, Puran (Soil Filling), Compound Wall, and 24/7 Gated Security.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-6">
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-black/40 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        <span className="block text-orange-500 font-black text-sm">300–1,930+ Yd</span> Plots
                      </div>
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-black/40 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        <span className="block text-green-500 font-black text-sm">24/7 Security</span> & RCC Roads
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-0 flex items-center gap-3">
                  <Link
                    to="/metro-industrial-estate"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:scale-[1.02] transition-transform whitespace-nowrap"
                  >
                    <span>Explore Plots</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/site-map"
                    state={{ activeTab: 'estate' }}
                    className={`inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-colors whitespace-nowrap ${
                      isDark ? 'bg-black border-gray-800 text-gray-300 hover:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MapPin size={14} className="mr-1" /> View Map
                  </Link>
                </div>
              </div>

              {/* Card 3: Metro Industrial Park 3 */}
              <div className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                isDark ? 'bg-gray-900/40 border-gray-800 hover:border-amber-500/40' : 'bg-white border-gray-200 hover:border-amber-300 shadow-md'
              }`}>
                <div>
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-950">
                    <img
                      src="/images/metro-industrial-park-3-site-plan.jpg"
                      alt="Industrial plots for sale at Metro Industrial Park 3 Bavla Ahmedabad"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      Build Your Own Shed
                    </div>
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md animate-pulse">
                      New Launch
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 mb-2">
                      <MapPin size={14} /> Bavla – Rajoda Road, Ahmedabad
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-black mb-2 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Industrial Park 3 <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md align-middle">MIP 3</span>
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      77 industrial plots across ~60,000 sq.yards in Bavla. Developer infrastructure: Wide Heavy RCC Roads, Street Lights, Puran (Soil Filling), Compound Wall, and 24/7 Gated Security.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-6">
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-black/40 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        <span className="block text-amber-500 font-black text-sm">334–1,643 Yd</span> 77 Plots
                      </div>
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-black/40 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        <span className="block text-green-500 font-black text-sm">Leveling</span> Ongoing
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-0 flex items-center gap-3">
                  <Link
                    to="/metro-industrial-park-3"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:scale-[1.02] transition-transform whitespace-nowrap"
                  >
                    <span>Explore Plots</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/site-map"
                    state={{ activeTab: 'park3' }}
                    className={`inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-colors whitespace-nowrap ${
                      isDark ? 'bg-black border-gray-800 text-gray-300 hover:border-amber-500' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MapPin size={14} className="mr-1" /> View Map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ FEATURES ════════ */}
        <section
          ref={featuresRef}
          aria-label="Metro Industrial Park features and infrastructure"
          className="relative py-14 sm:py-28 overflow-hidden"
          style={{ background: isDark ? '#0d0d18' : '#f4f2ed' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.06),transparent_60%)] pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(220,38,38,0.04),transparent_60%)] pointer-events-none" aria-hidden="true" />
          <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-red-500/20' : 'via-orange-400/30'} to-transparent pointer-events-none`} aria-hidden="true" />
          <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/8' : 'via-gray-400/20'} to-transparent pointer-events-none`} aria-hidden="true" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }} className="text-center mb-14 sm:mb-20">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-4 ${
                isDark ? 'bg-white/10 text-red-300 border-red-400/40' : 'bg-brand-red/10 text-brand-red border-brand-red/30'
              }`}>
                <Sparkles size={11} className="animate-pulse" aria-hidden="true" /> Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-5xl font-black mt-3 mb-4 leading-tight"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Everything Your Business </span>
                <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">Needs</span>
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto" aria-hidden="true" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {features.map((feat, i) => (
                <FeatureRow key={i} feat={feat} index={i} isDark={isDark} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════ STATS ════════ */}
        <section
          ref={statsRef}
          aria-label="Metro Industrial Park by the numbers"
          className="relative py-14 sm:py-28 overflow-hidden"
          style={{ background: isDark ? '#090909' : '#f0f1f5' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06),transparent_70%)] pointer-events-none" aria-hidden="true" />
          <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-gray-400/25'} to-transparent pointer-events-none`} aria-hidden="true" />
          <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-gray-400/25'} to-transparent pointer-events-none`} aria-hidden="true" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }} className="text-center mb-14">
              <h2 className="text-2xl sm:text-5xl font-black mb-4"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Experience by </span>
                <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Numbers</span>
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto" aria-hidden="true" />
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 32 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`group relative text-center p-8 sm:p-10 rounded-2xl border transition-all duration-300 cursor-default overflow-hidden ${
                    isDark
                      ? 'bg-gray-900/80 border-gray-800 hover:border-brand-red/50 hover:shadow-lg hover:shadow-brand-red/20'
                      : 'bg-white/90 border-gray-200 hover:border-brand-red/40 hover:shadow-xl hover:shadow-brand-red/10'
                  }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
                  <div className={`w-12 h-12 mx-auto mb-5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-brand-red/20 group-hover:text-brand-red group-hover:scale-110 group-hover:rotate-6 ${
                    isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'
                  }`} aria-hidden="true">{stat.icon}</div>
                  <div
                    className={`text-3xl sm:text-5xl font-extrabold mb-2 group-hover:text-brand-red transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                    aria-label={`${stat.countEnd}${stat.suffix} ${stat.label}`}
                  >
                    <CountUp end={stat.countEnd} suffix={stat.suffix} duration={2.5} enableScrollSpy scrollSpyOnce />
                  </div>
                  <div className={`text-xs sm:text-sm font-semibold uppercase tracking-wider group-hover:text-brand-red/80 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ INVESTMENT ════════ */}
        <InvestmentSection isDark={isDark} />

        {/* ════════ CTA ════════ */}
        <section
          ref={ctaRef}
          aria-label="Contact Metro Industrial Park — book a site visit"
          className="relative py-14 sm:py-32 overflow-hidden"
          style={{ background: isDark ? '#111118' : '#eef0f4' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.07),transparent_70%)] pointer-events-none" aria-hidden="true" />
          <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-red-600/8' : 'bg-red-300/14'}`} aria-hidden="true" />
          <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[80px] pointer-events-none hidden sm:block ${isDark ? 'bg-orange-600/6' : 'bg-orange-300/10'}`} aria-hidden="true" />
          <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-gray-400/25'} to-transparent pointer-events-none`} aria-hidden="true" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 32 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className={`p-10 sm:p-16 rounded-3xl border shadow-2xl transition-colors duration-500 ${
                isDark
                  ? 'bg-black/80 border-gray-800 hover:border-brand-red/30 backdrop-blur-sm'
                  : 'bg-white/95 border-gray-200 hover:border-brand-red/30 backdrop-blur-sm'
              }`}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/10 border border-brand-red/30 rounded-full mb-8">
                <Sparkles className="text-brand-red" size={14} aria-hidden="true" />
                <span className="text-xs font-bold text-brand-red tracking-wide">Get Started Today</span>
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 12 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-5xl font-black mb-5 leading-tight"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Ready to Find Your </span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Perfect Industrial Space?
                </span>
              </motion.h2>

              <motion.p initial={{ opacity: 0, y: 12 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className={`text-base sm:text-lg mb-10 max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Contact us today to discuss your requirements and schedule a site visit in Moraiya, Ahmedabad.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Metro Industrial Park to enquire about industrial sheds"
                  className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-brand-red/40 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />
                  <FaWhatsapp size={20} className="relative z-10" aria-hidden="true" />
                  <span className="relative z-10">WhatsApp Us</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
                <a
                  href="tel:+919824235642"
                  aria-label="Call Metro Industrial Park at +91 98242 35642"
                  className={`group inline-flex items-center justify-center gap-3 px-9 py-4 border-2 font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                    isDark
                      ? 'border-gray-700 text-gray-200 hover:border-brand-red/50 bg-black'
                      : 'border-gray-200 text-gray-700 hover:border-brand-red/50 bg-white'
                  }`}
                >
                  <Phone size={18} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
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
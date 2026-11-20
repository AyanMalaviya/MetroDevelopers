// src/pages/ContactPage.jsx
import { useState, useRef, useEffect } from 'react';
import {
  Mail, Phone, MapPin, User, Clock,
  ExternalLink, Star, X, ArrowRight, ArrowUpRight,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import SeoHead from '../seo/SeoHead';
import { createBreadcrumbSchema, propertySchema, directorSchemas } from '../utils/schemas.js';

const EASE = [0.16, 1, 0.3, 1];

const getTokens = (isDark) => ({
  bgPage:    isDark ? 'bg-[#0B0B0D]' : 'bg-[#F5F3EE]',
  bgSurface: isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]',
  border:    isDark ? 'border-white/[0.1]' : 'border-black/[0.11]',
  divide:    isDark ? 'divide-white/[0.1]' : 'divide-black/[0.11]',
  textMain:  isDark ? 'text-[#F5F4F0]' : 'text-[#121214]',
  textBody:  isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]',
  textMuted: isDark ? 'text-[#6E6E77]' : 'text-[#73726C]',
});

const EditorialHeading = ({ index, kicker, title, description, isDark }) => {
  const t = getTokens(isDark);
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 pb-8 sm:pb-10 border-b ${t.border}`}>
      <div className="lg:col-span-7">
        <div className="flex items-center gap-3 mb-3 font-mono text-[11px] tracking-[0.18em] uppercase">
          <span className="text-brand-red font-semibold">{index}</span>
          <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
          <span className={t.textMuted}>{kicker}</span>
        </div>
        <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-[1.06] ${t.textMain}`}>
          {title}
        </h2>
      </div>
      {description && (
        <div className="lg:col-span-5 flex items-end lg:justify-end lg:text-right">
          <p className={`text-sm sm:text-base leading-relaxed max-w-md ${t.textBody}`}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

const ContactPage = () => {
  const { theme } = useTheme();
  const isDark    = theme === 'dark';
  const t         = getTokens(isDark);

  const [showPrompt, setShowPrompt]           = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);

  const partnersRef = useRef(null);
  const locationRef = useRef(null);
  const reviewsRef  = useRef(null);

  const partnersInView = useInView(partnersRef, { once: true, margin: '-60px' });
  const locationInView = useInView(locationRef, { once: true, margin: '-60px' });
  const reviewsInView  = useInView(reviewsRef,  { once: true, margin: '-60px' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ─── Schema: ContactPage + LocalBusiness + Directors + Breadcrumb ─── */
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': 'https://www.metrodevelopers.co.in/contact#webpage',
    name: 'Contact Metro Industrial Park — Industrial Sheds in Moraiya, Ahmedabad',
    description:
      'Reach Metro Industrial Park by phone, WhatsApp, or visit our site in Moraiya, Changodar, Ahmedabad. Two directors available Mon–Sun, 11 AM–7 PM.',
    url: 'https://www.metrodevelopers.co.in/contact',
    inLanguage: 'en-IN',
    isPartOf: { '@id': 'https://www.metrodevelopers.co.in/#website' },
    about: { '@id': 'https://www.metrodevelopers.co.in/#metro-enterprise' },
    mainEntity: { '@id': 'https://www.metrodevelopers.co.in/#metro-enterprise' },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2'],
    },
  };

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact Metro Industrial Park', path: '/contact' },
  ]);

  const schemas = [contactPageSchema, propertySchema, ...directorSchemas, breadcrumbSchema];

  /* ─── Partners ─── */
  const partners = [
    {
      code: '01',
      name: 'Amir Malaviya',
      role: 'Director',
      phone: '+91 98242 35642',
      tel: '+919824235642',
      email: 'metrodevelopers26@gmail.com',
      whatsapp: '919824235642',
      image: '/images/amir.png',
    },
    {
      code: '02',
      name: 'Nazim Kazani',
      role: 'Director',
      phone: '+91 63567 66767',
      tel: '+916356766767',
      email: 'metroenterprise1985@gmail.com',
      whatsapp: '916356766767',
      image: '/images/nazim.png',
    },
    {
      code: '03',
      name: 'Kaushar Kalyani',
      role: 'Director',
    },
  ];

  const whatsappMsg = encodeURIComponent(
    'Hello, I am interested in industrial sheds at Metro Industrial Park, Moraiya. Please share availability and pricing.'
  );

  return (
    <>
      <SeoHead
        title="Contact Metro Industrial Park | Industrial Sheds Moraiya, Ahmedabad"
        description="Inquire about industrial sheds for sale or lease in Moraiya, Changodar, Ahmedabad. Call or WhatsApp +91 98242 35642 or +91 63567 66767 — Mon to Sun, 11 AM–7 PM."
        canonical="/contact"
        ogImage="/images/metro-industrial-park-office-changodar.jpg"
        schema={schemas}
      />

      <h1 className="sr-only">
        Contact Metro Industrial Park — Industrial Sheds and Warehouses in Moraiya, Ahmedabad
      </h1>

      <div
        className={`min-h-screen ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
        style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
      >
        {/* ══════════════════════════════════
            HERO — DIRECT DESK BRIEF
            ══════════════════════════════════ */}
        <section aria-label="Contact hero" className={`pt-20 sm:pt-24 border-b ${t.border} ${t.bgSurface}`}>
          {/* Top Coordinate & Response Strip */}
          <div className={`border-y ${t.border} ${t.bgPage}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className={t.textMain}>We Reply Within 1 Hour</span>
              </span>
              <span className={t.textMuted}>
                Mon – Sun · 11:00 AM – 7:00 PM · Moraiya, Ahmedabad
              </span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10 sm:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
            >
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
                  <span className="text-brand-red font-semibold">DESK</span>
                  <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
                  <span className={t.textMuted}>Metro Enterprise · Site Office</span>
                </div>

                {/* Decorative h2 — SEO h1 is sr-only above */}
                <h2 className={`text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-[-0.035em] leading-[1.03] mb-4 ${t.textMain}`}>
                  Get In Touch<span className="text-brand-red">.</span>
                </h2>

                <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${t.textBody}`}>
                  Connect directly with our directors for site visits, current shed or plot availability, lease terms, and industrial investment opportunities in Moraiya, Changodar, Ahmedabad.
                </p>
              </div>

              {/* Action Stack */}
              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/919824235642?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Metro Industrial Park"
                  className="w-full py-3.5 px-5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <FaWhatsapp size={16} aria-hidden="true" />
                    <span>WhatsApp Site Office</span>
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                </a>

                <a
                  href="mailto:metrodevelopers26@gmail.com"
                  aria-label="Email Metro Industrial Park"
                  className={`w-full py-3.5 px-5 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red font-mono text-xs inline-flex items-center justify-between gap-2 transition-colors`}
                >
                  <span className="inline-flex items-center gap-2.5 truncate">
                    <Mail size={14} className="text-brand-red shrink-0" aria-hidden="true" />
                    <span className="truncate">metrodevelopers26@gmail.com</span>
                  </span>
                  <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
                </a>
              </div>
            </motion.div>

            {/* 4-Cell Trust Strip */}
            <div className={`mt-10 grid grid-cols-2 lg:grid-cols-4 border-t border-l ${t.border}`}>
              {[
                { code: '01', value: '100+',    label: 'Industrial Sheds & Plots', accent: false },
                { code: '02', value: '2020',    label: 'Operating Since',          accent: false },
                { code: '03', value: '12–16%',  label: 'Yield + Appreciation',     accent: true  },
                { code: '04', value: '90 Days', label: 'Possession Guarantee',     accent: false },
              ].map((m) => (
                <div key={m.code} className={`p-5 border-r border-b ${t.border} ${t.bgPage}`}>
                  <div className={`font-mono text-[10px] mb-2.5 ${t.textMuted}`}>{m.code}</div>
                  <div className={`text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums ${m.accent ? 'text-brand-red' : t.textMain}`}>
                    {m.value}
                  </div>
                  <div className={`font-mono text-[10px] uppercase tracking-[0.14em] mt-1 ${t.textMuted}`}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            01. DIRECTORS LEDGER
            ══════════════════════════════════ */}
        <section
          ref={partnersRef}
          aria-label="Meet our directors"
          className={`py-16 sm:py-24 border-b ${t.border} ${t.bgPage}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <EditorialHeading
              index="01"
              kicker="Leadership Desk"
              title={
                <>
                  Meet Our <span className="text-brand-red">Directors</span>
                </>
              }
              description="Direct decision-maker access — no middlemen, no brokerage layers."
              isDark={isDark}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={partnersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE }}
              className={`mt-10 border ${t.border} grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x ${t.divide} ${t.bgSurface}`}
            >
              {partners.map((partner) => (
                <article
                  key={partner.code}
                  itemScope
                  itemType="https://schema.org/Person"
                  className="flex flex-col justify-between"
                >
                  <div>
                    {/* Top Index Strip */}
                    <div className={`flex items-center justify-between px-6 py-3.5 border-b ${t.border} font-mono text-[10px] uppercase tracking-[0.16em]`}>
                      <span className="text-brand-red font-semibold">DIR {partner.code}</span>
                      <span itemProp="jobTitle" className={t.textMuted}>
                        {partner.role}
                      </span>
                    </div>

                    {/* Portrait + Identity */}
                    <div className="p-6 sm:p-7">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 border ${t.border} ${t.bgPage} overflow-hidden flex items-center justify-center shrink-0`}>
                          {partner.image ? (
                            <img
                              src={partner.image}
                              alt={`${partner.name}, ${partner.role} at Metro Industrial Park`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              width={64}
                              height={64}
                              itemProp="image"
                            />
                          ) : (
                            <User size={24} className={t.textMuted} aria-hidden="true" />
                          )}
                        </div>
                        <div>
                          <h3
                            itemProp="name"
                            className={`text-xl font-extrabold tracking-tight ${t.textMain}`}
                          >
                            {partner.name}
                          </h3>
                          <p className={`font-mono text-[11px] uppercase tracking-wider mt-0.5 ${t.textMuted}`}>
                            Metro Enterprise
                          </p>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className={`border-t ${t.border} divide-y ${t.divide}`}>
                        {partner.tel ? (
                          <a
                            href={`tel:${partner.tel}`}
                            aria-label={`Call ${partner.name}`}
                            itemProp="telephone"
                            className={`flex items-center justify-between py-3 text-xs font-mono tabular-nums ${t.textMain} hover:text-brand-red transition-colors`}
                          >
                            <span className="inline-flex items-center gap-2.5">
                              <Phone size={13} className="text-brand-red shrink-0" aria-hidden="true" />
                              <span>{partner.phone}</span>
                            </span>
                            <ArrowUpRight size={13} className={t.textMuted} aria-hidden="true" />
                          </a>
                        ) : (
                          <div className={`py-3 font-mono text-xs ${t.textMuted}`}>
                            Available via site office
                          </div>
                        )}

                        {partner.email && (
                          <a
                            href={`mailto:${partner.email}`}
                            aria-label={`Email ${partner.name}`}
                            itemProp="email"
                            className={`flex items-center justify-between gap-2 py-3 text-xs ${t.textBody} hover:text-brand-red transition-colors`}
                          >
                            <span className="inline-flex items-center gap-2.5 min-w-0">
                              <Mail size={13} className="text-brand-red shrink-0" aria-hidden="true" />
                              <span className="truncate">{partner.email}</span>
                            </span>
                            <ArrowUpRight size={13} className={`${t.textMuted} shrink-0`} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Edge-to-Edge Action Bar */}
                  <div className={`border-t ${t.border}`}>
                    {partner.whatsapp ? (
                      <a
                        href={`https://wa.me/${partner.whatsapp}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${partner.name}`}
                        className="w-full py-4 px-6 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FaWhatsapp size={15} aria-hidden="true" />
                          <span>WhatsApp {partner.name.split(' ')[0]}</span>
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>
                    ) : (
                      <div className={`py-4 px-6 ${t.bgPage} font-mono text-[11px] uppercase tracking-[0.14em] text-center ${t.textMuted}`}>
                        Contact via Site Office
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            02. SITE LOCATION & HOURS
            ══════════════════════════════════ */}
        <section
          ref={locationRef}
          aria-label="Office location and map"
          className={`py-16 sm:py-24 border-b ${t.border} ${t.bgSurface}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <EditorialHeading
              index="02"
              kicker="Moraiya · Changodar · NH 47"
              title={
                <>
                  Visit Our <span className="text-brand-red">Site Office</span>
                </>
              }
              description="Inspect ready sheds, internal 60 ft RCC roads, and live plot boundaries in person."
              isDark={isDark}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={locationInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE }}
              className={`mt-10 border ${t.border} ${t.bgPage}`}
            >
              {/* Address Strip with LocalBusiness Microdata */}
              <address
                className={`p-6 sm:p-8 border-b ${t.border} ${t.bgSurface} flex flex-col sm:flex-row sm:items-center justify-between gap-6 not-italic`}
                itemScope
                itemType="https://schema.org/LocalBusiness"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 border ${t.border} ${t.bgPage} flex items-center justify-center flex-shrink-0 p-2.5`}>
                    <img
                      src="/MDLogo.png"
                      alt="Metro Industrial Park Logo"
                      className="w-full h-full object-contain"
                      width={80}
                      height={80}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className={`text-lg sm:text-xl font-extrabold tracking-tight mb-1 ${t.textMain}`} itemProp="name">
                      METRO INDUSTRIAL PARK
                    </p>
                    <p className={`text-sm leading-relaxed ${t.textBody}`} itemProp="address">
                      Opp. Suvas Industrial Estate, Behind Siya Industrial Park,
                      <br className="hidden sm:inline" /> Moraiya, Changodar, Ahmedabad – 382213, Gujarat
                    </p>
                    <p className="font-mono text-xs mt-2 tabular-nums">
                      <a href="tel:+919824235642" itemProp="telephone" className={`${t.textMain} hover:text-brand-red transition-colors`}>
                        +91 98242 35642
                      </a>
                      <span className={`mx-2 ${t.textMuted}`}>/</span>
                      <a href="tel:+916356766767" className={`${t.textMain} hover:text-brand-red transition-colors`}>
                        +91 63567 66767
                      </a>
                    </p>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/6fBawQdYxcmUw3WE6"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get directions to Metro Industrial Park on Google Maps"
                  className="py-3.5 px-6 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
                >
                  <MapPin size={14} aria-hidden="true" />
                  <span>Get Directions</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </address>

              {/* Map Frame */}
              <div className="w-full h-72 sm:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.9819206766047!2d72.41809017647694!3d22.914037679249986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9729d95d01c7%3A0xf5a131a39485c5f6!2sMetro%20Industrial%20Park!5e0!3m2!1sen!2sin!4v1782834808336!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Metro Industrial Park — Behind Siya Industrial Park, Moraiya, Ahmedabad"
                />
              </div>

              {/* Bottom 2-Col Hours & Direct Call Ledger */}
              <div className={`grid grid-cols-1 md:grid-cols-2 border-t ${t.border} divide-y md:divide-y-0 md:divide-x ${t.divide} ${t.bgSurface}`}>
                {/* Hours */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] mb-4">
                      <Clock size={13} className="text-brand-red" aria-hidden="true" />
                      <span className={t.textMuted}>Office Hours</span>
                    </div>
                    <div className={`flex items-center justify-between py-3.5 border-y ${t.border} text-sm`}>
                      <span className={t.textBody}>Monday – Sunday</span>
                      <span className={`font-mono font-bold tabular-nums ${t.textMain}`}>11:00 AM – 7:00 PM</span>
                    </div>
                  </div>
                  <p className={`text-xs mt-4 ${t.textMuted}`}>
                    Private site inspections available by appointment outside regular hours.
                  </p>
                </div>

                {/* Urgent Direct Lines */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] mb-2">
                    <Phone size={13} className="text-brand-red" aria-hidden="true" />
                    <span className={t.textMuted}>Direct Lines</span>
                  </div>
                  <p className={`text-xs mb-4 ${t.textBody}`}>
                    Call our directors directly for urgent shed or plot inquiries.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { label: '+91 98242 35642', href: 'tel:+919824235642' },
                      { label: '+91 63567 66767', href: 'tel:+916356766767' },
                    ].map(({ label, href }) => (
                      <a
                        key={href}
                        href={href}
                        aria-label={`Call ${label}`}
                        className="py-3 px-4 bg-brand-red hover:bg-red-700 text-white font-mono text-xs font-bold tabular-nums inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <Phone size={13} aria-hidden="true" />
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            03. GOOGLE REVIEWS BAND
            ══════════════════════════════════ */}
        <section
          ref={reviewsRef}
          aria-label="Leave a Google review"
          className={`py-16 sm:py-24 ${t.bgPage}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE }}
              className={`border ${t.border} ${t.bgSurface} grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${t.divide}`}
            >
              <div className="lg:col-span-8 p-7 sm:p-12">
                <div className="flex items-center gap-3 mb-4 font-mono text-[11px] uppercase tracking-[0.18em]">
                  <span className="text-brand-red font-semibold">03</span>
                  <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
                  <span className={t.textMuted}>Client Feedback</span>
                </div>

                <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] mb-4 ${t.textMain}`}>
                  Share Your Experience<span className="text-brand-red">.</span>
                </h2>

                <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${t.textBody}`}>
                  Your review helps other businesses evaluate the right industrial space — and strengthens Metro Industrial Park&apos;s verified reputation on Google.
                </p>
              </div>

              <div className={`lg:col-span-4 p-7 sm:p-12 flex flex-col justify-between gap-6 ${t.bgPage}`}>
                <div>
                  <div className="flex items-center gap-1 mb-2" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <div className={`text-3xl font-extrabold tracking-tight tabular-nums ${t.textMain}`}>
                    5.0 <span className={`text-sm font-mono font-normal ${t.textMuted}`}>/ 5.0</span>
                  </div>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.14em] mt-1 ${t.textMuted}`}>
                    Trusted Across Ahmedabad
                  </p>
                </div>

                <a
                  href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Leave a Google review for Metro Industrial Park"
                  onClick={() => { if (!promptDismissed) setPromptDismissed(true); }}
                  className="w-full py-4 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                >
                  <span>Leave a Google Review</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            FLOATING REVIEW PROMPT
            ══════════════════════════════════ */}
        <AnimatePresence>
          {showPrompt && !promptDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="fixed bottom-5 right-4 sm:right-6 z-50 w-72 sm:w-80"
              role="dialog"
              aria-label="Leave a review"
            >
              <div className={`relative border ${t.border} ${t.bgSurface} shadow-2xl`}>
                <div className="h-[2px] bg-brand-red w-full" aria-hidden="true" />
                <div className="p-5">
                  <button
                    type="button"
                    onClick={() => { setShowPrompt(false); setPromptDismissed(true); }}
                    className={`absolute top-3.5 right-3.5 p-1 ${t.textMuted} hover:text-brand-red transition-colors`}
                    aria-label="Close review prompt"
                  >
                    <X size={15} />
                  </button>

                  <div className="flex items-center gap-1 mb-2" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className={`font-extrabold text-sm ${t.textMain}`}>Enjoying our service?</p>
                  <p className={`text-xs mt-1 mb-4 ${t.textBody}`}>
                    A quick Google review helps other businesses find us.
                  </p>

                  <a
                    href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { setShowPrompt(false); setPromptDismissed(true); }}
                    className="w-full py-2.5 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                  >
                    <span>Write a Review</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ContactPage; 
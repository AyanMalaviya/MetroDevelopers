// src/pages/ContactPage.jsx
import { useState } from 'react';
import {
  Mail, Phone, MapPin, User, Building2, Clock,
  ExternalLink, Star, X, MessageSquare, ChevronRight,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO/SEO';

/* ─── Motion variants ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── Reusable section wrapper ─── */
const Section = ({ children, refProp, className = '' }) => {
  const inView = useInView(refProp, { once: true, margin: '-60px' });
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ContactPage = () => {
  const { theme } = useTheme();
  const isDark    = theme === 'dark';

  const [showPrompt, setShowPrompt]         = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);

  /* ─── Refs for sections ─── */
  const heroRef      = useRef(null);
  const partnersRef  = useRef(null);
  const locationRef  = useRef(null);
  const reviewsRef   = useRef(null);

  const heroInView      = useInView(heroRef,     { once: true });
  const partnersInView  = useInView(partnersRef, { once: true, margin: '-60px' });
  const locationInView  = useInView(locationRef, { once: true, margin: '-60px' });
  const reviewsInView   = useInView(reviewsRef,  { once: true, margin: '-60px' });

  /* ─── Data ─── */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Metro Enterprise",
    "description": "Get in touch for industrial sheds and warehouses",
    "url": "https://www.metrodevelopers.co.in/contact",
  };

  const partners = [
    {
      name: 'Amir Malaviya',
      role: 'Director',
      phone: '+91 98242 35642',
      email: 'amirmalaviya786@gmail.com',
      whatsapp: '919824235642',
    },
    {
      name: 'Nazim Kazani',
      role: 'Director',
      phone: '+91 96249 65017',
      whatsapp: '919624965017',
    },
    {
      name: 'Kaushar Kalyani',
      role: 'Director',
    },
  ];

  const whatsappMsg = encodeURIComponent('Hello, I would like to inquire about the industrial sheds.');

  /* ─── Shared card class ─── */
  const card = `theme-bg-card border theme-border rounded-2xl`;

  return (
    <>
      <SEO
        title="Contact Us - Metro Enterprise | Industrial Sheds Ahmedabad"
        description="Contact Metro Enterprise for industrial sheds, warehouses in Moraiya, Ahmedabad. Call +91 98242 35642, +91 96249 65017."
        keywords="contact Metro Enterprise, industrial shed inquiry Ahmedabad, warehouse contact Moraiya"
        canonical="/contact"
        structuredData={structuredData}
      />

      <div className="min-h-screen theme-bg-primary">

        {/* ══════════════════════════════════
            HERO
            ══════════════════════════════════ */}
        <section
          ref={heroRef}
          className={`relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 ${
            isDark
              ? 'bg-gradient-to-b from-gray-950 via-black to-black'
              : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
          }`}
        >
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-brand-red/4 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red text-xs font-bold tracking-widest uppercase mb-6"
            >
              <MessageSquare size={13} />
              We reply within 1 hour
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold theme-text-primary mb-4"
            >
              Get In <span className="text-brand-red">Touch</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto mb-5"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="theme-text-tertiary text-base sm:text-lg max-w-2xl mx-auto mb-8"
            >
              Contact our team for site visits, inquiries, or investment opportunities
            </motion.p>

            {/* Quick contact pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <a
                href="mailto:metrodevelopers26@gmail.com"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:scale-105 hover:border-brand-red/50 ${
                  isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <Mail size={15} className="text-brand-red" />
                metrodevelopers26@gmail.com
              </a>
              <a
                href={`https://wa.me/919824235642?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-brand-red/25"
              >
                <FaWhatsapp size={16} />
                WhatsApp Us
              </a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className={`mt-10 flex flex-wrap justify-center gap-6 text-xs font-semibold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
            >
              {[
                '✓ 63 Industrial Sheds',
                '✓ Since 2020',
                '✓ 6–8% ROI',
                '✓ 90 Day Possession',
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            PARTNERS
            ══════════════════════════════════ */}
        <section
          ref={partnersRef}
          className={`py-14 sm:py-20 ${isDark ? 'bg-black' : 'bg-white'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={partnersInView ? 'visible' : 'hidden'}
              className="text-center mb-10 sm:mb-14"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold theme-text-primary mb-3">
                Meet Our <span className="text-brand-red">Directors</span>
              </h2>
              <p className="theme-text-tertiary text-sm sm:text-base max-w-xl mx-auto">
                Connect directly with our leadership for personalised assistance
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate={partnersInView ? 'visible' : 'hidden'}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto"
            >
              {partners.map((partner, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`group relative ${card} overflow-hidden hover:border-brand-red/40 transition-colors duration-300`}
                >
                  {/* Coloured top accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-brand-red to-red-400" />

                  <div className="p-6 sm:p-7">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-brand-red/20 ${
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <User size={30} className={`transition-colors duration-300 group-hover:text-brand-red ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </div>

                    {/* Name + role */}
                    <div className="text-center mb-5">
                      <h3 className="text-lg sm:text-xl font-extrabold theme-text-primary group-hover:text-brand-red transition-colors duration-300 mb-0.5">
                        {partner.name}
                      </h3>
                      <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {partner.role}
                      </span>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-2 mb-5">
                      {partner.phone && (
                        <a
                          href={`tel:${partner.phone}`}
                          className={`flex items-center justify-center gap-2 text-sm font-medium rounded-xl px-3 py-2 transition-all hover:text-brand-red ${
                            isDark ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Phone size={13} className="text-brand-red flex-shrink-0" />
                          {partner.phone}
                        </a>
                      )}

                      {partner.email && (
                        <a
                          href={`mailto:${partner.email}`}
                          className={`flex items-center justify-center gap-2 text-xs font-medium rounded-xl px-3 py-2 transition-all hover:text-brand-red ${
                            isDark ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Mail size={12} className="text-brand-red flex-shrink-0" />
                          <span className="break-all">{partner.email}</span>
                        </a>
                      )}
                    </div>

                    {/* WhatsApp CTA */}
                    {partner.whatsapp ? (
                      <a
                        href={`https://wa.me/${partner.whatsapp}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-brand-red hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all hover:scale-105 shadow-md shadow-brand-red/20"
                      >
                        <FaWhatsapp size={16} /> WhatsApp
                      </a>
                    ) : (
                      <div className={`text-center text-xs py-2.5 rounded-xl ${isDark ? 'text-gray-600 bg-gray-800/40' : 'text-gray-400 bg-gray-50'}`}>
                        Contact via office
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            QUICK CONTACT BAR
            ══════════════════════════════════ */}
        <div className={`border-y ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4">
              <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Prefer a direct call?
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '+91 98242 35642', href: 'tel:+919824235642' },
                  { label: '+91 63567 66767', href: 'tel:+916356766767' },
                ].map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all hover:scale-105 hover:border-brand-red hover:text-brand-red ${
                      isDark ? 'border-gray-700 text-gray-300 bg-gray-900' : 'border-gray-200 text-gray-800 bg-white shadow-sm'
                    }`}
                  >
                    <Phone size={13} className="text-brand-red" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            LOCATION
            ══════════════════════════════════ */}
        <section
          ref={locationRef}
          className={`py-14 sm:py-20 ${
            isDark
              ? 'bg-gradient-to-b from-black via-gray-950 to-black'
              : 'bg-gradient-to-b from-white via-gray-50 to-white'
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={locationInView ? 'visible' : 'hidden'}
              className="text-center mb-10 sm:mb-14"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold theme-text-primary mb-3">
                Visit Us <span className="text-brand-red">Today</span>
              </h2>
              <p className="theme-text-tertiary text-sm sm:text-base max-w-xl mx-auto">
                Click the map below to get directions straight to our site
              </p>
            </motion.div>

            {/* Map card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={locationInView ? 'visible' : 'hidden'}
              className={`${card} overflow-hidden shadow-xl mb-5`}
            >
              {/* Address strip */}
              <div className="p-5 sm:p-6 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Building2 className="text-brand-red" size={22} />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold theme-text-primary mb-1">
                    METRO INDUSTRIAL PARK
                  </h4>
                  <p className="theme-text-secondary text-sm leading-relaxed">
                    Opp. Suvas Ind Estate, b/h Siya Logistics Park,<br />
                    Moraiya, Ahmedabad, Gujarat — 382213
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px w-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />

              {/* Map */}
              <div className="w-full h-64 sm:h-80 lg:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.97909554353!2d72.41748307531053!3d22.914141879249897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9729d95d01c7%3A0xf5a131a39485c5f6!2sMetro%20industrial%20park%20moraiya!5e0!3m2!1sen!2sin!4v1767639082192!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Metro Industrial Park Location"
                />
              </div>

              {/* Directions CTA */}
              <div className={`p-4 flex justify-center ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <a
                  href="https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105 text-sm shadow-md shadow-brand-red/20"
                >
                  <MapPin size={15} /> Get Directions <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>

            {/* Office hours + urgent contact */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={locationInView ? 'visible' : 'hidden'}
              className="grid sm:grid-cols-2 gap-4 sm:gap-5"
            >
              {/* Hours */}
              <motion.div variants={fadeUp} className={`${card} p-5 sm:p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Clock className="text-brand-red" size={18} />
                  </div>
                  <h4 className="text-base font-extrabold theme-text-primary">Office Hours</h4>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-xl text-sm ${isDark ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
                  <span className="theme-text-secondary">Mon – Sun</span>
                  <span className="font-bold theme-text-primary">11:00 AM – 7:00 PM</span>
                </div>
                <p className={`text-xs mt-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  Site visits available by appointment outside hours
                </p>
              </motion.div>

              {/* Urgent contact */}
              <motion.div variants={fadeUp} className={`${card} p-5 sm:p-6`}>
                <h4 className="text-base font-extrabold theme-text-primary mb-1">Need Immediate Help?</h4>
                <p className="theme-text-tertiary text-xs mb-4">
                  Call our directors directly for urgent inquiries
                </p>
                <div className="space-y-2">
                  {[
                    { label: '+91 9824235642', href: 'tel:+919824235642' },
                    { label: '+91 63567 66767', href: 'tel:+916356766767' },
                  ].map(({ label, href }) => (
                    <a
                      key={href}
                      href={href}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-brand-red hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all hover:scale-105 shadow-md shadow-brand-red/20"
                    >
                      <Phone size={15} /> {label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            REVIEWS
            ══════════════════════════════════ */}
        <section
          ref={reviewsRef}
          className={`py-14 sm:py-20 ${
            isDark
              ? 'bg-gradient-to-b from-black to-gray-950'
              : 'bg-gradient-to-b from-gray-50 to-white'
          }`}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">

            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate={reviewsInView ? 'visible' : 'hidden'}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-red/10 rounded-full flex items-center justify-center border-2 border-brand-red/20">
                  <Star size={38} className="text-brand-red fill-brand-red" />
                </div>
                {/* Orbiting dots */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-2 h-2 rounded-full bg-brand-red/30"
                    style={{
                      top: '50%', left: '50%',
                      transform: `rotate(${deg}deg) translateX(44px) translateY(-50%)`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.h3
              variants={fadeUp}
              initial="hidden"
              animate={reviewsInView ? 'visible' : 'hidden'}
              className="text-2xl sm:text-4xl font-extrabold theme-text-primary mb-3"
            >
              Share Your <span className="text-brand-red">Experience</span>
            </motion.h3>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={reviewsInView ? 'visible' : 'hidden'}
              className="theme-text-tertiary text-sm sm:text-base mb-8 max-w-lg mx-auto"
            >
              Your feedback helps us improve and helps other businesses find the perfect industrial space.
            </motion.p>

            <motion.a
              variants={scaleIn}
              initial="hidden"
              animate={reviewsInView ? 'visible' : 'hidden'}
              href="https://g.page/r/CfbFhZSjMaH1EBI/review"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-2xl transition-colors shadow-xl shadow-brand-red/25 text-sm sm:text-base"
              onClick={() => { if (!promptDismissed) setPromptDismissed(true); }}
            >
              <Star size={18} className="fill-white" />
              Leave a Google Review
              <ChevronRight size={16} />
            </motion.a>

            {/* Star rating display */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={reviewsInView ? 'visible' : 'hidden'}
              className={`mt-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold ${
                isDark ? 'border-gray-800 bg-gray-900 text-gray-400' : 'border-gray-200 bg-white text-gray-500 shadow-sm'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span>·</span>
              <span>Trusted by businesses across Ahmedabad</span>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════
            FLOATING REVIEW PROMPT
            ══════════════════════════════════ */}
        <AnimatePresence>
          {showPrompt && !promptDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed bottom-5 right-4 sm:right-6 z-50 w-72 sm:w-80"
            >
              <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
                isDark
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-brand-red/20'
              }`}>
                {/* Red top bar */}
                <div className="h-1.5 bg-gradient-to-r from-brand-red to-red-400 w-full" />

                <div className="p-4 sm:p-5">
                  <button
                    onClick={() => { setShowPrompt(false); setPromptDismissed(true); }}
                    className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${isDark ? 'text-gray-500 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star size={18} className="text-white fill-white" />
                    </div>
                    <div>
                      <p className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Enjoying our service?
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        A quick review means the world to us!
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { setShowPrompt(false); setPromptDismissed(true); }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-red hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all"
                  >
                    <Star size={14} className="fill-white" /> Write a Review
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

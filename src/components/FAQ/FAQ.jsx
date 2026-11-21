// FAQ.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const EASE = [0.16, 1, 0.3, 1];

const faqs = [
  {
    question: 'What is the price of industrial sheds in Moraiya, Ahmedabad?',
    answer: 'Industrial sheds at Metro Industrial Park are available for both sale and lease. Contact us at +91 98242 35642 or +91 96249 65017 for current pricing and customised unit options.',
  },
  {
    question: 'What sizes are available at Metro Industrial Park?',
    answer: 'Units range from 4,000 sq.ft to 50,000 sq.ft across 63 sheds in a 54,000 sq.yard park in Moraiya, Changodar, Ahmedabad.',
  },
  {
    question: 'How long does possession take?',
    answer: 'Possession is available within 90 days of booking.',
  },
  {
    question: 'What is the expected ROI?',
    answer: 'Rental yield is 6–8%, yearly appreciation can add up to 6–8%, and the combined potential is 12–16% for industrial sheds and warehouses at Metro Industrial Park, Moraiya.',
  },
  {
    question: 'Is RCC construction available?',
    answer: 'RCC construction is not standard but is available on request with additional charges.',
  },
  {
    question: 'Where is Metro Industrial Park located?',
    answer: 'Metro Industrial Park is located in Moraiya, Changodar, Ahmedabad — opposite Suvas Industrial Estate, behind Siya Logistics Park, near NH 47 (Sarkhej Bavla Highway).',
  },
  {
    question: 'What amenities are available?',
    answer: 'The park offers 24x7 water supply, CCTV surveillance, security guards, a dedicated weigh bridge, 60ft internal roads, waste management system, and high ceilings of 30–35 feet.',
  },
  {
    question: 'Do you sell plots of land at Metro Industrial Park?',
    answer: 'No — Metro Industrial Park does not sell bare plots of land. All units are pre-built industrial sheds (PEB/steel or RCC structure) ready for immediate occupation. You purchase or lease a complete, usable shed — not an empty plot.',
  },
  {
    question: 'Can I build my own custom structure on the shed premises?',
    answer: "Generally, no. All sheds are delivered as standard, move-in-ready industrial units. Custom structures are not offered for leasees because a bespoke structure can increase costs significantly and reduce the shed's usability for future tenants or buyers — which is not in anyone's long-term interest. However, early investors purchasing a shed may discuss custom Build-to-Suit (BTS) options with our team on a case-by-case basis.",
  },
  {
    question: "Why doesn't Metro Industrial Park allow custom structures for lease?",
    answer: 'Custom or highly specialised structures are tailored to one specific use case and can make it very difficult to re-lease or resell the unit in the future. To protect asset value for all stakeholders — investors, future occupants, and the park — we only allow standard, versatile shed configurations that suit a wide range of industrial businesses.',
  },
  {
    question: 'I am an early investor. Can I get a customised shed built?',
    answer: 'Early investors who purchase a shed (not lease) may be able to discuss Build-to-Suit customisation with the Metro Developers team. This is evaluated on a case-by-case basis, subject to structural feasibility and park guidelines. Contact us at +91 98242 35642 to know more.',
  },
  {
    question: 'What types of businesses can operate in the sheds?',
    answer: 'Our sheds are designed for a wide range of industries: manufacturing, warehousing, logistics, pharma, food processing, FMCG, auto-ancillary, textiles, light engineering, and e-commerce fulfilment. The standardised design ensures suitability for most common industrial use cases.',
  },
];

const FAQItem = ({ faq, index, isOpen, onToggle, isDark }) => {
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const border    = isDark ? 'border-white/[0.1]' : 'border-black/[0.11]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textBody  = isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]';
  const textMuted = isDark ? 'text-[#6E6E77]' : 'text-[#73726C]';

  return (
    <div className={bgSurface}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left transition-colors ${
          isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
        }`}
      >
        <div className="flex items-start gap-4">
          <span className="font-mono text-xs font-semibold text-brand-red pt-0.5 tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${isOpen ? 'text-brand-red' : textMain}`}>
            {faq.question}
          </span>
        </div>

        <span
          aria-hidden="true"
          className={`w-7 h-7 border ${border} flex items-center justify-center shrink-0 transition-colors ${
            isOpen ? 'border-brand-red text-brand-red' : textMuted
          }`}
        >
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <p className={`px-5 sm:px-6 pb-5 pl-12 sm:pl-14 text-sm leading-relaxed ${textBody}`}>
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState(0);

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const border    = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const divide    = isDark ? 'divide-white/[0.12]' : 'divide-gray-200';
  const textMain  = isDark ? 'text-white' : 'text-gray-900';
  const textBody  = isDark ? 'text-gray-200' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      aria-label="Frequently Asked Questions"
      className={`py-16 sm:py-24 border-t ${border} ${bgPage}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Asymmetric Editorial Header */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 border-b ${border}`}>
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3 font-mono text-[11px] tracking-[0.18em] uppercase">
              <span className="text-brand-red font-semibold">FAQ</span>
              <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
              <span className={textMuted}>Investor &amp; Tenant Clarifications</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight leading-[1.18] ${textMain}`}>
              Frequently Asked <span className="text-brand-red">Questions</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex items-end lg:justify-end lg:text-right">
            <p className={`text-sm sm:text-base leading-relaxed max-w-md ${textBody}`}>
              Direct answers on shed pricing, possession timelines, Build-to-Suit eligibility, and utilities at Metro Industrial Park.
            </p>
          </div>
        </div>

        {/* Border-Collapsed Accordion Ledger */}
        <div className={`mt-10 border ${border} divide-y ${divide}`}>
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Bottom Direct Contact Strip */}
        <div className={`mt-8 border ${border} ${bgSurface} px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <p className={`text-sm ${textBody}`}>
            Still have questions about unit sizing, lease terms, or site visits?
          </p>
          <Link
            to="/contact"
            className="py-3 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <span>Contact Site Office</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
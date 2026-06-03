import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
    answer: 'Generally, no. All sheds are delivered as standard, move-in-ready industrial units. Custom structures are not offered for leasees because a bespoke structure can increase costs significantly and reduce the shed\'s usability for future tenants or buyers — which is not in anyone\'s long-term interest. However, early investors purchasing a shed may discuss custom Build-to-Suit (BTS) options with our team on a case-by-case basis.',
  },
  {
    question: 'Why doesn\'t Metro Industrial Park allow custom structures for lease?',
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

const FAQItem = ({ faq, isOpen, onToggle, isDark }) => (
  <div className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
    isDark
      ? isOpen
        ? 'border-brand-red/40 bg-gray-900'
        : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
      : isOpen
        ? 'border-brand-red/30 bg-white'
        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
  }`}>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      aria-expanded={isOpen}
    >
      <span className={`text-sm sm:text-base font-semibold leading-snug ${
        isOpen ? 'text-brand-red' : isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {faq.question}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.25 }}
        className="flex-shrink-0"
      >
        <ChevronDown size={18} className={isOpen ? 'text-brand-red' : isDark ? 'text-gray-400' : 'text-gray-500'} />
      </motion.div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className={`px-5 pb-4 text-sm leading-relaxed ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={`py-14 sm:py-20 border-t ${
      isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-brand-red/10 text-brand-red border border-brand-red/30 mb-4">
            <MessageCircleQuestion size={11} /> Frequently Asked Questions
          </div>
          <h2 className={`text-2xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Got <span className="text-brand-red">Questions?</span>
          </h2>
          <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Everything you need to know about Metro Industrial Park.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              isDark={isDark}
            />
          ))}
        </div>

        {/* CTA below */}
        <p className={`text-center text-sm mt-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Still have questions?{' '}
          <a href="/contact" className="text-brand-red hover:underline font-semibold">Contact our team →</a>
        </p>
      </div>
    </section>
  );
};

export default FAQ;

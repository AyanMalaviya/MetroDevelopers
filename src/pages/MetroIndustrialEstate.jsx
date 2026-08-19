// src/pages/MetroIndustrialEstate.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Sparkles, Phone, ShieldCheck, LucideLandPlot, CheckCircle2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO/SEO';

const MetroIndustrialEstate = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const whatsappMessage = encodeURIComponent(
    'Hello, I am interested in industrial plots at Metro Industrial Estate, Changodar. Please share the layout, availability, and pricing.'
  );

  return (
    <>
      <SEO
        title="Premium Industrial Plots in Changodar | Metro Industrial Estate"
        description="Book your premium industrial plot at Metro Industrial Estate, located opposite Metro Industrial Park in Moraiya, Changodar. Bookings are now open!"
        canonical="/metro-industrial-estate"
      />

      <div className={`relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden ${
        isDark ? 'bg-[#06060f]' : 'bg-[#faf9f6]'
      }`}>
        {/* Background Gradients */}
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-red-600/10' : 'bg-red-400/10'}`} aria-hidden="true" />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-orange-500/10' : 'bg-orange-300/15'}`} aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-8 shadow-sm ${
              isDark ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-green-50 border-green-300/70 text-green-600'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Bookings Now Open
            </div>

            {/* Title */}
            <h1 className={`text-5xl sm:text-7xl font-black tracking-tight mb-6 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Metro <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Industrial Estate
              </span>
            </h1>

            {/* Location Pill */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl mb-8 border ${
              isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700 shadow-sm'
            }`}>
              <MapPin size={16} className="text-brand-red shrink-0" />
              <span className="text-sm font-semibold">
                Opp. Metro Industrial Park, Moraiya, Changodar
              </span>
            </div>

            {/* Description */}
            <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Secure your business's future with our newly launched premium industrial plots. Strategically located with clear titles and modern infrastructure, perfectly tailored for high-yield investment and rapid industrial development.
            </p>

            {/* Feature Mini-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mx-auto mb-12">
              {[
                { icon: <LucideLandPlot size={18} />, text: 'Premium Plots' },
                { icon: <ShieldCheck size={18} />, text: 'Clear Titles' },
                { icon: <CheckCircle2 size={18} />, text: 'Ready Infrastructure' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border ${
                    isDark ? 'bg-gray-900/50 border-gray-800 text-gray-300' : 'bg-white border-gray-100 shadow-sm text-gray-700'
                  }`}
                >
                  <span className="text-brand-red">{item.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Call to Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto"
            >
              <Link
                to="/site-map"
                state={{ activeTab: 'estate' }} // <-- Add this line
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 via-brand-red to-rose-600 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-red-500/30 hover:scale-[1.02] transition-transform"
              >
                <MapPin size={16} />
                View Availability Map
              </Link>
              
              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full sm:flex-1 group relative inline-flex items-center justify-center gap-2 px-6 py-4 border-2 font-bold rounded-xl text-sm transition-all overflow-hidden ${
                  isDark
                    ? 'border-gray-700 text-white hover:border-green-500/50 bg-black'
                    : 'border-gray-200 text-gray-800 hover:border-green-500/50 bg-white shadow-sm'
                }`}
              >
                <div className="absolute inset-0 bg-green-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" aria-hidden="true" />
                <FaWhatsapp size={18} className="text-green-500 relative z-10" />
                <span className="relative z-10">Enquire on WhatsApp</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center justify-center gap-2 text-xs font-medium"
            >
              <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Prefer to call?</span>
              <a href="tel:+919824235642" className={`flex items-center gap-1.5 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>
                <Phone size={12} />
                +91 98242 35642
              </a>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MetroIndustrialEstate;
// src/pages/NotFound.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, MapPin, Calculator, Factory } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO/SEO';

const QUICK_LINKS = [
  { to: '/',                      label: 'Home',             icon: Home       },
  { to: '/metro-industrial-park', label: 'Industrial Park',  icon: Factory    },
  { to: '/calculator',            label: 'ROI Calculator',   icon: Calculator },
  { to: '/site-map',              label: 'Site Map',         icon: MapPin     },
];

export default function NotFound() {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const isDark = theme === 'dark';

  return (
    <>
      <SEO
        title="Page Not Found (404) – Metro Enterprise"
        description="The page you're looking for doesn't exist. Browse Metro Industrial Park's available sheds, ROI calculator, and contact information."
        canonical="/404"
        />

      <div className={`min-h-screen flex items-center justify-center pt-24 pb-20 px-4 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full text-center"
        >
          {/* 404 number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 select-none"
          >
            <span className="text-[96px] font-extrabold leading-none bg-gradient-to-br from-brand-red to-red-900 bg-clip-text text-transparent">
              404
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-2xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Page Not Found
          </motion.h1>

          {/* Subtext with attempted path */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            The page{' '}
            <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
              isDark ? 'bg-gray-800 text-brand-red' : 'bg-gray-100 text-brand-red'
            }`}>
              {pathname}
            </code>{' '}
            doesn't exist or has been moved.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className={`text-xs mb-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
          >
            Try navigating to one of these pages instead:
          </motion.p>

          {/* Quick links grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-3 mb-8"
          >
            {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.02] hover:border-brand-red hover:text-brand-red ${
                  isDark
                    ? 'bg-gray-900 border-gray-800 text-gray-300'
                    : 'bg-white border-gray-200 text-gray-700'
                } shadow-sm`}
              >
                <Icon className="w-4 h-4 text-brand-red flex-shrink-0" />
                {label}
              </Link>
            ))}
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-red/25 hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

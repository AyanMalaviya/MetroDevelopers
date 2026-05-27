// src/pages/SiteMapPage.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Maximize2, Minimize2, History, ChevronDown, ChevronUp, Calendar, User, Tag, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveSiteMap from '../components/InteractiveSiteMap/InteractiveSiteMap';
import SEO from '../components/SEO/SEO';
import { getChangelog, CHANGELOG_SHEET_URL } from '../services/changelogService';

// ── Action badge colours ──────────────────────────────────────────────────────
const ACTION_STYLES = {
  sold:        { bg: 'bg-red-500/15',    text: 'text-red-500',    label: 'Sold'        },
  leased:      { bg: 'bg-blue-500/15',   text: 'text-blue-500',   label: 'Leased'      },
  available:   { bg: 'bg-green-500/15',  text: 'text-green-500',  label: 'Available'   },
  'for-lease': { bg: 'bg-yellow-500/15', text: 'text-yellow-500', label: 'For Lease'   },
  'pre-leased':{ bg: 'bg-purple-500/15', text: 'text-purple-500', label: 'Pre-Leased'  },
  updated:     { bg: 'bg-gray-500/15',   text: 'text-gray-400',   label: 'Updated'     },
  added:       { bg: 'bg-emerald-500/15',text: 'text-emerald-500',label: 'Added'       },
  removed:     { bg: 'bg-rose-500/15',   text: 'text-rose-500',   label: 'Removed'     },
};

const ActionBadge = ({ action }) => {
  const key = (action || '').toLowerCase();
  const s   = ACTION_STYLES[key] || { bg: 'bg-gray-500/10', text: 'text-gray-400', label: action };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
};

// ── Format date nicely ────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(dateStr));
  } catch { return dateStr; }
};

// ── Changelog Panel ───────────────────────────────────────────────────────────
const ChangelogPanel = ({ isDark }) => {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [open,    setOpen]    = useState(true);
  const [filter,  setFilter]  = useState('all');
  const notConfigured = !CHANGELOG_SHEET_URL || CHANGELOG_SHEET_URL.startsWith('PASTE');

  useEffect(() => {
    if (notConfigured) { setLoading(false); return; }
    getChangelog()
      .then((data) => { setLogs(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  // Unique action types for filter tabs
  const actionTypes = ['all', ...new Set(logs.map((l) => l.action.toLowerCase()).filter(Boolean))];

  const filtered = filter === 'all'
    ? logs
    : logs.filter((l) => l.action.toLowerCase() === filter);

  const surface  = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const headText = isDark ? 'text-white' : 'text-gray-900';
  const subText  = isDark ? 'text-gray-400' : 'text-gray-500';
  const rowBg    = isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-50';
  const divider  = isDark ? 'divide-gray-800' : 'divide-gray-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35 }}
      className={`rounded-2xl border shadow-xl overflow-hidden ${surface}`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
          isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${ isDark ? 'bg-gray-800' : 'bg-gray-100' }`}>
            <History size={15} className="text-brand-red" />
          </div>
          <div className="text-left">
            <p className={`text-sm font-bold ${headText}`}>Data Change Log</p>
            <p className={`text-[11px] ${subText}`}>
              {loading ? 'Loading…' : notConfigured ? 'Sheet not connected yet' : `${logs.length} entr${logs.length === 1 ? 'y' : 'ies'} · latest first`}
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp   size={16} className={subText} />
          : <ChevronDown size={16} className={subText} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="log-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Not configured notice */}
            {notConfigured && (
              <div className={`px-5 py-6 text-center ${ isDark ? 'text-gray-500' : 'text-gray-400' }`}>
                <FileText size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">Changelog sheet not connected</p>
                <p className="text-xs mt-1 max-w-xs mx-auto">
                  Follow the setup instructions below, then paste your published CSV URL in
                  <code className="mx-1 px-1 rounded bg-gray-500/10">changelogService.js</code>.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="px-5 py-4 text-center text-sm text-red-500">
                Failed to load changelog. Check your sheet URL.
              </div>
            )}

            {/* Loading skeleton */}
            {loading && !notConfigured && (
              <div className="px-5 py-4 space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className={`w-20 h-4 rounded ${ isDark ? 'bg-gray-800' : 'bg-gray-100' }`} />
                    <div className={`w-12 h-4 rounded ${ isDark ? 'bg-gray-800' : 'bg-gray-100' }`} />
                    <div className={`flex-1 h-4 rounded ${ isDark ? 'bg-gray-800' : 'bg-gray-100' }`} />
                  </div>
                ))}
              </div>
            )}

            {/* Filter tabs */}
            {!loading && !notConfigured && logs.length > 0 && (
              <div className={`px-5 pb-2 pt-1 flex gap-2 flex-wrap border-b ${ isDark ? 'border-gray-800' : 'border-gray-100' }`}>
                {actionTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilter(type)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all capitalize ${
                      filter === type
                        ? 'bg-brand-red text-white'
                        : isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            {/* Log rows */}
            {!loading && !notConfigured && filtered.length > 0 && (
              <div className={`divide-y ${divider} max-h-80 overflow-y-auto`}>
                {filtered.map((log, i) => (
                  <div key={i} className={`flex items-start gap-3 px-5 py-3 text-xs transition-colors ${rowBg}`}>
                    {/* Date */}
                    <div className={`flex items-center gap-1 min-w-[90px] ${subText} shrink-0 pt-0.5`}>
                      <Calendar size={11} />
                      <span>{formatDate(log.date)}</span>
                    </div>
                    {/* Plot ID */}
                    {log.plotId && (
                      <div className={`flex items-center gap-1 min-w-[52px] font-mono font-bold ${ isDark ? 'text-gray-300' : 'text-gray-700' } shrink-0 pt-0.5`}>
                        <Tag size={11} />
                        <span>#{log.plotId}</span>
                      </div>
                    )}
                    {/* Action badge */}
                    <div className="shrink-0 pt-0.5">
                      <ActionBadge action={log.action} />
                    </div>
                    {/* Note */}
                    <p className={`flex-1 leading-snug ${ isDark ? 'text-gray-300' : 'text-gray-600' }`}>
                      {log.note || '—'}
                    </p>
                    {/* Changed by */}
                    {log.changedBy && (
                      <div className={`flex items-center gap-1 shrink-0 pt-0.5 ${subText}`}>
                        <User size={11} />
                        <span>{log.changedBy}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && !notConfigured && filtered.length === 0 && !error && (
              <p className={`px-5 py-5 text-sm text-center ${subText}`}>No entries yet.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const SiteMapPage = () => {
  const { theme }  = useTheme();
  const navigate   = useNavigate();
  const isDark     = theme === 'dark';

  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) mapRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'f' || e.key === 'F') toggleFullscreen(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleFullscreen]);

  return (
    <>
      <SEO
        title="Industrial Shed Site Map and Availability in Moraiya, Changodar, Ahmedabad"
        description="Check industrial shed and warehouse unit availability in Moraiya, Changodar, and Ahmedabad with the live interactive site map."
        canonical="/site-map"
        ogImage="/images/metro-industrial-map.jpg"
        ogImageAlt="Industrial shed availability map in Moraiya Changodar Ahmedabad"
      />
      <h1 className="sr-only">Metro Industrial Park Site Map — Check Unit Availability</h1>

      <div className={`relative overflow-hidden min-h-screen pt-20 pb-12 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>

        {/* ── Header ── */}
        <motion.section
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="px-4 pb-5"
        >
          <div className="max-w-7xl mx-auto">
            <motion.button
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              type="button"
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 mb-5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-black hover:bg-gray-200'
              }`}
            >
              <ArrowLeft size={15} /> Back
            </motion.button>

            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Live Availability · Auto-updates every 30s
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className={`text-3xl md:text-4xl lg:text-5xl font-extrabold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Shed <span className="text-brand-red">Availability</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  Metro Industrial Park · Moraiya, Changodar
                </motion.p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Map ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div
              ref={mapRef}
              className={`rounded-2xl overflow-hidden shadow-2xl border ${
                isDark
                  ? 'border-gray-800 shadow-black/50'
                  : 'border-gray-200 shadow-gray-300/40'
              }`}
            >
              <InteractiveSiteMap />
            </div>

            <p className={`text-center text-xs mt-3 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
              Use zoom buttons inside the map · Scroll to navigate when zoomed · Click any shed for details
            </p>

            {/* ── Changelog Panel ── */}
            <div className="mt-8">
              <ChangelogPanel isDark={isDark} />
            </div>
          </div>
        </motion.section>

      </div>
    </>
  );
};

export default SiteMapPage;

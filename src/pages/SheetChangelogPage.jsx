// src/pages/SheetChangelogPage.jsx
// Displays status change logs from _changelog sheet (written by onEdit trigger).
// Data shape: { date, id, previousStatus, newStatus }
// All logs shown as-is — no undo filtering.

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Clock, Tag, ArrowRight, AlertCircle, Inbox } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { getChangelog } from '../services/changelogService';

// ── Status badge colour map ───────────────────────────────────────────────────
const STATUS_STYLE = {
  available:    { bg: 'bg-green-500/15',  text: 'text-green-500',  dot: 'bg-green-500'  },
  'for-lease':  { bg: 'bg-yellow-500/15', text: 'text-yellow-500', dot: 'bg-yellow-500' },
  'pre-leased': { bg: 'bg-purple-500/15', text: 'text-purple-500', dot: 'bg-purple-500' },
  sold:         { bg: 'bg-red-500/15',    text: 'text-red-500',    dot: 'bg-red-500'    },
  leased:       { bg: 'bg-blue-500/15',   text: 'text-blue-500',   dot: 'bg-blue-500'   },
};
const statusStyle = (s = '') =>
  STATUS_STYLE[s.toLowerCase()] || { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' };

const StatusBadge = ({ label }) => {
  const s = statusStyle(label);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {label || '—'}
    </span>
  );
};

const fmt = (d) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(d));
  } catch { return d; }
};

// ── Page ──────────────────────────────────────────────────────────────────────
const SheetChangelogPage = () => {
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const isDark    = theme === 'dark';

  const [logs,      setLogs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [refreshed, setRefreshed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChangelog();
      // Simply sort newest first, no filtering
      const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(sorted);
    } catch (e) {
      setError(e.message || 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRefresh = () => {
    setRefreshed(true);
    load();
    setTimeout(() => setRefreshed(false), 1500);
  };

  const bg      = isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';
  const surface = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const head    = isDark ? 'text-white' : 'text-gray-900';
  const sub     = isDark ? 'text-gray-500' : 'text-gray-400';
  const rowHov  = isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50';
  const divider = isDark ? 'divide-gray-800' : 'divide-gray-100';

  return (
    <>
      <SEO
        title="Shed Status Change Log — Metro Industrial Park"
        description="Live status change history for Metro Industrial Park sheds."
        canonical="/sheet-changelog"
      />

      <div className={`min-h-screen pt-20 pb-16 px-4 ${bg}`}>
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            type="button"
            onClick={() => navigate('/site-map')}
            className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-black hover:bg-gray-200'
            }`}
          >
            <ArrowLeft size={15} /> Site Map
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-between gap-4 flex-wrap mb-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                <span className={`text-[10px] font-bold tracking-widest uppercase ${sub}`}>
                  Live · Auto-tracked via onEdit
                </span>
              </div>
              <h1 className={`text-3xl md:text-4xl font-extrabold ${head}`}>
                Shed Status <span className="text-brand-red">Change Log</span>
              </h1>
              <p className={`text-sm mt-1 ${sub}`}>
                {loading ? 'Loading…' : `${logs.length} change${logs.length !== 1 ? 's' : ''} · newest first`}
              </p>
            </div>

            <button
              type="button" onClick={handleRefresh} disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40'
              }`}
            >
              <RefreshCw size={14} className={refreshed ? 'animate-spin' : ''} />
              Refresh
            </button>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`rounded-2xl border shadow-xl overflow-hidden ${surface}`}
          >
            {/* Skeleton */}
            {loading && (
              <div className="p-6 space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className={`w-28 h-4 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    <div className={`w-10 h-4 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    <div className={`w-20 h-5 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    <div className={`w-4  h-4 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    <div className={`w-20 h-5 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
                <AlertCircle size={32} className="text-red-500 opacity-70" />
                <p className={`text-sm font-semibold ${head}`}>Could not load changelog</p>
                <p className={`text-xs max-w-xs ${sub}`}>{error}</p>
                <p className={`text-xs ${sub}`}>
                  Make sure <code className="px-1 rounded bg-gray-500/10">CHANGELOG_SCRIPT_URL</code> is set in Vercel env vars
                  and the <code className="px-1 rounded bg-gray-500/10">_changelog</code> sheet exists.
                </p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && logs.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
                <Inbox size={32} className={`opacity-40 ${sub}`} />
                <p className={`text-sm font-semibold ${head}`}>No changes recorded yet</p>
                <p className={`text-xs max-w-xs ${sub}`}>
                  Once the onEdit trigger is active, every status change will appear here automatically.
                </p>
              </div>
            )}

            {/* Rows */}
            {!loading && !error && logs.length > 0 && (
              <AnimatePresence>
                <div className={`divide-y ${divider}`}>
                  {/* Column headers */}
                  <div className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 items-center px-5 py-3 text-[10px] font-bold uppercase tracking-widest ${sub}`}>
                    <span className="flex items-center gap-1"><Clock size={10} /> Date &amp; Time</span>
                    <span className="flex items-center gap-1 justify-center"><Tag size={10} /> Shed</span>
                    <span>Previous</span>
                    <span />
                    <span>New Status</span>
                  </div>

                  {logs.map((log, i) => (
                    <motion.div
                      key={`${log.id}-${log.date}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.025 }}
                      className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 items-center px-5 py-3.5 transition-colors text-sm ${rowHov}`}
                    >
                      <span className={`text-xs tabular-nums ${sub}`}>{fmt(log.date)}</span>
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        #{log.id}
                      </span>
                      <StatusBadge label={log.previousStatus} />
                      <ArrowRight size={13} className={sub} />
                      <StatusBadge label={log.newStatus} />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>

          <p className={`text-center text-xs mt-4 ${sub}`}>
            Every status change is recorded automatically · All logs shown
          </p>
        </div>
      </div>
    </>
  );
};

export default SheetChangelogPage;

// src/pages/SheetChangelogPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RefreshCw, AlertCircle, Inbox, 
  ArrowRight, Activity, CalendarDays, Hash 
} from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { getChangelog } from '../services/changelogService';

// ── Status badge colour map ───────────────────────────────────────────────────
const STATUS_STYLE = {
  available:    { bg: 'bg-green-500/15',  text: 'text-green-600 dark:text-green-400',   dot: 'bg-green-500'  },
  'for-lease':  { bg: 'bg-red-500/15',    text: 'text-red-600 dark:text-red-400',       dot: 'bg-red-500'    },
  'pre-leased': { bg: 'bg-blue-500/15',   text: 'text-blue-600 dark:text-blue-400',     dot: 'bg-blue-500'   },
  sold:         { bg: 'bg-gray-500/15',   text: 'text-gray-600 dark:text-gray-400',     dot: 'bg-gray-500'   },
  leased:       { bg: 'bg-amber-500/15',  text: 'text-amber-600 dark:text-amber-400',   dot: 'bg-amber-500'  },
};

const statusStyle = (s = '') =>
  STATUS_STYLE[s.toLowerCase()] || { bg: 'bg-gray-500/10', text: 'text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' };

const StatusBadge = ({ label }) => {
  const s = statusStyle(label);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {label || '—'}
    </span>
  );
};

const formatTime = (d) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(d));
  } catch { return ''; }
};

const formatDate = (d) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date(d));
  } catch { return d; }
};

// ── Page ──────────────────────────────────────────────────────────────────────
const SheetChangelogPage = () => {
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const isDark    = theme === 'dark';

  const [groupedLogs, setGroupedLogs] = useState({});
  const [logCount,    setLogCount]    = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [refreshed,   setRefreshed]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChangelog();
      
      // Sort newest first
      const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Group by distinct dates for the timeline UI
      const grouped = sorted.reduce((acc, log) => {
        const dateKey = formatDate(log.date);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(log);
        return acc;
      }, {});

      setGroupedLogs(grouped);
      setLogCount(sorted.length);

    } catch (e) {
      let errMsg = e.message || 'Failed to load.';
      // Intercept the specific invalid JSON bug
      if (errMsg.includes('Unexpected token') || errMsg.includes('is not valid JSON')) {
        errMsg = 'The server returned an invalid response (HTML or Text) instead of JSON data. Please verify your API URL routing and App Script deployment.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRefresh = () => {
    setRefreshed(true);
    load();
    setTimeout(() => setRefreshed(false), 1000);
  };

  const bg      = isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';
  const surface = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const head    = isDark ? 'text-white' : 'text-gray-900';
  const sub     = isDark ? 'text-gray-500' : 'text-gray-500';

  return (
    <>
      <SEO
        title="Shed Status Change Log — Metro Industrial Projects"
        description="Live status change history and activity timeline for Metro Industrial sheds."
        canonical="/sheet-changelog"
      />

      <div className={`min-h-screen pt-24 pb-16 px-4 sm:px-6 ${bg}`}>
        <div className="max-w-3xl mx-auto">

          {/* Top Actions */}
          <motion.button
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            type="button"
            onClick={() => navigate('/site-map')}
            className={`flex items-center gap-2 mb-8 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 w-fit ${
              isDark 
                ? 'text-gray-400 bg-gray-800/50 hover:text-white hover:bg-gray-800 ring-1 ring-white/5' 
                : 'text-gray-600 bg-white hover:text-gray-900 hover:bg-gray-50 ring-1 ring-black/5 shadow-sm'
            }`}
          >
            <ArrowLeft size={16} /> Back to Maps
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-between gap-6 flex-wrap mb-10"
          >
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span className={`text-[10px] font-black tracking-widest uppercase ${sub}`}>
                  Live Network Activity
                </span>
              </div>
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${head}`}>
                Status <span className="text-brand-red">Activity Log</span>
              </h1>
              <p className={`text-sm mt-3 font-medium ${sub}`}>
                {loading ? 'Syncing timeline...' : `Tracking ${logCount} recent status update${logCount !== 1 ? 's' : ''}`}
              </p>
            </div>

            <button
              type="button" onClick={handleRefresh} disabled={loading}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white ring-1 ring-white/10 disabled:opacity-50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 ring-1 ring-black/10 shadow-sm disabled:opacity-50'
              }`}
            >
              <RefreshCw size={15} className={refreshed ? 'animate-spin' : ''} />
              {loading ? 'Syncing...' : 'Sync Logs'}
            </button>
          </motion.div>

          {/* Timeline Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-3xl border shadow-2xl p-4 sm:p-8 ${surface}`}
          >
            {/* Skeleton Loading State */}
            {loading && (
              <div className="space-y-8 py-2">
                {[1, 2].map(group => (
                  <div key={group} className="space-y-4">
                    <div className={`w-32 h-5 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                    <div className={`w-full h-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                    <div className={`w-full h-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <p className={`text-lg font-bold mb-2 ${head}`}>Failed to sync logs</p>
                <p className={`text-sm max-w-md leading-relaxed ${sub}`}>{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && logCount === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Inbox size={32} className={sub} />
                </div>
                <p className={`text-lg font-bold mb-2 ${head}`}>No updates found</p>
                <p className={`text-sm max-w-sm leading-relaxed ${sub}`}>
                  The network is quiet. Once your onEdit triggers are active, status changes will appear here dynamically.
                </p>
              </div>
            )}

            {/* Redesigned Activity Timeline */}
            {!loading && !error && logCount > 0 && (
              <AnimatePresence>
                <div className="space-y-10">
                  {Object.entries(groupedLogs).map(([date, logsInDate], groupIndex) => (
                    <div key={date}>
                      {/* Date Header */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          <CalendarDays size={14} />
                        </div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${head}`}>
                          {date}
                        </h3>
                        <div className={`h-px flex-grow ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                      </div>

                      {/* Log Entries */}
                      <div className="space-y-3">
                        {logsInDate.map((log, i) => (
                          <motion.div
                            key={`${log.id}-${log.date}-${i}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (groupIndex * 0.1) + (i * 0.05) }}
                            className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 rounded-2xl transition-all duration-300 ${
                              isDark ? 'bg-gray-800/30 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            {/* Time & Identifier */}
                            <div className="flex items-center sm:flex-col sm:items-start sm:justify-center gap-2 sm:gap-1 min-w-[100px] shrink-0">
                              <span className={`text-[11px] font-bold tracking-widest uppercase ${sub}`}>
                                {formatTime(log.date)}
                              </span>
                              <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                                isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                              }`}>
                                <Hash size={10} className="opacity-50" /> {log.id}
                              </span>
                            </div>

                            {/* Status Transition flow */}
                            <div className="flex flex-wrap items-center gap-3 w-full">
                              <div className="flex-1 min-w-[120px] max-w-fit">
                                <StatusBadge label={log.previousStatus} />
                              </div>
                              
                              <div className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-white shadow-sm border border-gray-200 text-gray-400'}`}>
                                <ArrowRight size={12} />
                              </div>
                              
                              <div className="flex-1 min-w-[120px] max-w-fit">
                                <StatusBadge label={log.newStatus} />
                              </div>
                            </div>
                            
                            {/* Visual decorative element */}
                            <div className="hidden sm:flex grow justify-end">
                              <Activity size={16} className={`opacity-20 ${sub}`} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>

          <div className="flex items-center justify-center gap-2 mt-8 opacity-60">
            <Activity size={12} className={sub} />
            <p className={`text-center text-[10px] font-bold uppercase tracking-widest ${sub}`}>
              End of activity log
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default SheetChangelogPage;
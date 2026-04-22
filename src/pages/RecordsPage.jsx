import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  CircleAlert,
  CircleCheckBig,
  Download,
  Factory,
  Loader2,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO/SEO';
import {
  fetchRecords,
  logoutRecords,
  submitRecord,
} from '../services/recordsService';

const initialForm = {
  role: 'Owner',
  fullName: '',
  phone: '',
  email: '',
  companyName: '',
  shedNumbers: '',
  dealType: 'Bought',
  agreementStatus: 'Active',
  notes: '',
};

const roleOptions = ['Owner', 'Lessee', 'Owner & Lessee'];
const dealOptions = ['Bought', 'Leased'];
const statusOptions = ['Active', 'Pending', 'Closed'];

const fieldClass = (isDark) => `w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all ${
  isDark
    ? 'border-gray-700 bg-gray-900 text-white placeholder:text-gray-600 focus:border-brand-red focus:ring-4 focus:ring-brand-red/15'
    : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-300 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10'
}`;

const labelClass = (isDark) => `text-[11px] font-bold uppercase tracking-[0.2em] ${
  isDark ? 'text-gray-400' : 'text-gray-500'
}`;

const pillClass = (isDark, active) => `rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
  active
    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25'
    : isDark
      ? 'bg-gray-900 text-gray-400 border border-gray-800'
      : 'bg-gray-100 text-gray-500 border border-gray-200'
}`;

const formatDate = (value) => {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const RecordsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { slug } = useParams();
  const normalizedSlug = String(slug || '').trim().toLowerCase();

  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [canAppend, setCanAppend] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await fetchRecords(normalizedSlug);
        setRecords(Array.isArray(data.records) ? data.records : []);
        setCanAppend(Boolean(data.canAppend));
        setError('');
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load records.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    if (!/^[a-f0-9]{8}$/.test(normalizedSlug)) {
      setError('Invalid access URL.');
      setIsLoading(false);
      return;
    }

    loadRecords();
  }, [normalizedSlug]);

  const sortedRecords = useMemo(() => {
    return [...records].sort((left, right) => {
      const leftTime = new Date(left.submittedAt || 0).getTime();
      const rightTime = new Date(right.submittedAt || 0).getTime();
      return rightTime - leftTime;
    });
  }, [records]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sortedRecords;

    return sortedRecords.filter((record) => {
      return [
        record.role,
        record.fullName,
        record.phone,
        record.email,
        record.companyName,
        record.shedNumbers,
        record.dealType,
        record.agreementStatus,
        record.notes,
      ].some((value) => String(value || '').toLowerCase().includes(term));
    });
  }, [search, sortedRecords]);

  const stats = useMemo(() => {
    const total = records.length;
    const ownerCount = records.filter((record) => String(record.role || '').toLowerCase().includes('owner')).length;
    const lesseeCount = records.filter((record) => String(record.role || '').toLowerCase().includes('lessee')).length;
    const linkedSheds = records.filter((record) => String(record.shedNumbers || '').trim().length > 0).length;

    return [
      { label: 'Total records', value: total, icon: <Users className="h-4 w-4" /> },
      { label: 'Owners', value: ownerCount, icon: <UserRound className="h-4 w-4" /> },
      { label: 'Lessees', value: lesseeCount, icon: <Building2 className="h-4 w-4" /> },
      { label: 'Linked sheds', value: linkedSheds, icon: <Factory className="h-4 w-4" /> },
    ];
  }, [records]);

  const syncNotice = notice || error;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const refreshRecords = async () => {
    setIsRefreshing(true);
    setError('');
    setNotice('');

    try {
      const data = await fetchRecords(normalizedSlug);
      setRecords(Array.isArray(data.records) ? data.records : []);
      setCanAppend(Boolean(data.canAppend));
      setNotice('Sheet synced successfully.');
    } catch (refreshError) {
      setError(refreshError.message || 'Unable to refresh records.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      const data = await submitRecord({
        ...form,
        submittedAt: new Date().toISOString(),
      }, normalizedSlug);

      if (data.record) {
        setRecords((previous) => [data.record, ...previous]);
      }

      setForm(initialForm);
      setNotice('Record sent to Google Sheets.');
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit the record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRecords();
    } finally {
      navigate('/calculator', { replace: true });
    }
  };

  return (
    <>
      <SEO
        title="Private Records Dashboard | Metro Enterprise"
        description="Protected records dashboard for owner and lessee details synced with Google Sheets through a secure webhook."
        canonical="/records"
        noindex={true}
      />

      <div className={`min-h-screen pt-24 pb-12 ${
        isDark
          ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/calculator')}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.02] ${
                isDark
                  ? 'border-gray-800 bg-gray-900 text-gray-300 hover:text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to calculator
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-red/25 transition-all hover:scale-[1.02] hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Lock page
            </button>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 rounded-[28px] border p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            style={{
              background: isDark ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.88)',
              borderColor: isDark ? 'rgba(31,41,55,1)' : 'rgba(229,231,235,1)',
            }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-red">
                  <Shield className="h-3.5 w-3.5" />
                  Private records vault
                </div>
                <h1 className={`text-3xl font-extrabold sm:text-4xl lg:text-5xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Owners and lessees sheet sync
                </h1>
                <p className={`mt-3 max-w-2xl text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add owner and lessee details here, then forward them to Google Sheets through the server-side webhook.
                  The webhook URL and unlock secret never touch the browser.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border px-4 py-3 ${
                      isDark
                        ? 'border-gray-800 bg-black'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-brand-red">
                      {stat.icon}
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {stat.label}
                      </span>
                    </div>
                    <div className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? 'border-gray-800 bg-gray-950/70 text-gray-400'
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}>
              <div className="flex flex-wrap items-center gap-2">
                <CircleCheckBig className="h-4 w-4 text-green-500" />
                <span>Protected by an HttpOnly cookie issued from the serverless unlock flow.</span>
                <span className="mx-1 hidden h-1 w-1 rounded-full bg-gray-400 sm:inline-block" />
                <span>Direct browser access without a valid session redirects back to the calculator.</span>
              </div>
            </div>
          </motion.section>

          {(syncNotice || isLoading || isRefreshing || isSubmitting) && (
            <div className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
              error
                ? isDark
                  ? 'border-red-900/40 bg-red-950/40 text-red-200'
                  : 'border-red-200 bg-red-50 text-red-700'
                : isDark
                  ? 'border-gray-800 bg-gray-900 text-gray-300'
                  : 'border-gray-200 bg-white text-gray-600'
            }`}>
              {error ? <CircleAlert className="h-4 w-4 text-red-500" /> : <Loader2 className="h-4 w-4 animate-spin text-brand-red" />}
              <span>{syncNotice || 'Loading records...'}</span>
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={`rounded-[28px] border p-5 shadow-xl ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Add record
                  </h2>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Each submission appends a row to the connected Google Sheet.
                  </p>
                </div>
                <div className={`rounded-2xl border px-3 py-2 text-right ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Download className="h-3.5 w-3.5 text-brand-red" />
                    Sheet fields
                  </div>
                  <div className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    role, name, phone, email, company, sheds, deal type, status, notes
                  </div>
                </div>
              </div>

              {!canAppend && (
                <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                  isDark
                    ? 'border-amber-900/40 bg-amber-950/30 text-amber-200'
                    : 'border-amber-200 bg-amber-50 text-amber-800'
                }`}>
                  Read-only demo mode is active. Set `RECORDS_WEBHOOK_URL` in Vercel to enable saving new rows to Google Sheets.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClass(isDark)}>Role</span>
                    <select name="role" value={form.role} onChange={handleChange} className={fieldClass(isDark)}>
                      {roleOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className={labelClass(isDark)}>Deal type</span>
                    <select name="dealType" value={form.dealType} onChange={handleChange} className={fieldClass(isDark)}>
                      {dealOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className={labelClass(isDark)}>Full name</span>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className={fieldClass(isDark)} placeholder="Enter owner or lessee name" required />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClass(isDark)}>Phone</span>
                    <input name="phone" value={form.phone} onChange={handleChange} className={fieldClass(isDark)} placeholder="Mobile number" />
                  </label>
                  <label className="space-y-2">
                    <span className={labelClass(isDark)}>Email</span>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className={fieldClass(isDark)} placeholder="name@example.com" />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className={labelClass(isDark)}>Company name</span>
                  <input name="companyName" value={form.companyName} onChange={handleChange} className={fieldClass(isDark)} placeholder="Business or company name" />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClass(isDark)}>Shed / unit numbers</span>
                    <input name="shedNumbers" value={form.shedNumbers} onChange={handleChange} className={fieldClass(isDark)} placeholder="E.g. 12, 14, 18" />
                  </label>

                  <label className="space-y-2">
                    <span className={labelClass(isDark)}>Agreement status</span>
                    <select name="agreementStatus" value={form.agreementStatus} onChange={handleChange} className={fieldClass(isDark)}>
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className={labelClass(isDark)}>Notes</span>
                  <textarea
                    name="notes"
                    rows="4"
                    value={form.notes}
                    onChange={handleChange}
                    className={fieldClass(isDark)}
                    placeholder="Add deal notes, payment status, possession date, or special terms"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || !canAppend}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-red px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-red/25 transition-all hover:scale-[1.01] hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleCheckBig className="h-4 w-4" />}
                  {isSubmitting
                    ? 'Sending to Google Sheets'
                    : !canAppend
                      ? 'Webhook required to save'
                      : 'Save record to sheet'}
                </button>
              </form>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`rounded-[28px] border p-5 shadow-xl ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}
            >
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Records list
                  </h2>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Latest entries from the connected Google Sheet.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                    <Search className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search records"
                      className={`w-44 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={refreshRecords}
                    className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition-all hover:scale-[1.01] ${
                      isDark
                        ? 'border-gray-800 bg-gray-900 text-gray-300 hover:text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-brand-red' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className={`overflow-hidden rounded-3xl border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left">
                    <thead className={isDark ? 'bg-gray-900' : 'bg-gray-50'}>
                      <tr>
                        {['Date', 'Role', 'Name', 'Phone', 'Email', 'Sheds', 'Deal', 'Status'].map((header) => (
                          <th
                            key={header}
                            className={`whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] ${
                              isDark ? 'text-gray-500' : 'text-gray-400'
                            }`}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-800 bg-black' : 'divide-gray-100 bg-white'}`}>
                      {!isLoading && filteredRecords.length === 0 && (
                        <tr>
                          <td colSpan="8" className={`px-4 py-12 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            No records found yet. Add the first owner or lessee record using the form.
                          </td>
                        </tr>
                      )}

                      {filteredRecords.map((record, index) => (
                        <tr key={`${record.recordId || record.submittedAt || index}`} className={index % 2 === 0 ? '' : isDark ? 'bg-gray-950/60' : 'bg-gray-50/60'}>
                          <td className={`whitespace-nowrap px-4 py-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDate(record.submittedAt)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className={pillClass(isDark, false)}>{record.role || 'Owner'}</span>
                          </td>
                          <td className={`px-4 py-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {record.fullName || '-'}
                            <div className={`mt-1 text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {record.companyName || 'Individual'}
                            </div>
                          </td>
                          <td className={`whitespace-nowrap px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <a href={record.phone ? `tel:${record.phone.replace(/\s+/g, '')}` : undefined} className="inline-flex items-center gap-2 hover:text-brand-red">
                              <Phone className="h-3.5 w-3.5 text-brand-red" />
                              {record.phone || '-'}
                            </a>
                          </td>
                          <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <a href={record.email ? `mailto:${record.email}` : undefined} className="inline-flex items-center gap-2 hover:text-brand-red">
                              <Mail className="h-3.5 w-3.5 text-brand-red" />
                              {record.email || '-'}
                            </a>
                          </td>
                          <td className={`whitespace-nowrap px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {record.shedNumbers || '-'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className={pillClass(isDark, false)}>{record.dealType || '-'}</span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className={record.agreementStatus === 'Active' ? 'rounded-full bg-green-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-green-500' : record.agreementStatus === 'Pending' ? 'rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500' : 'rounded-full bg-gray-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500'}>
                              {record.agreementStatus || '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                isDark ? 'border-gray-800 bg-gray-900/70 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}>
                <div className="flex items-start gap-2">
                  <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-red" />
                  <p>
                    The browser only talks to <span className="font-semibold text-brand-red">/api/records</span>. That route
                    verifies the private session, then forwards data to the Google Sheets webhook from the server.
                  </p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordsPage;

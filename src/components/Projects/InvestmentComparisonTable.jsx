// src/components/Projects/InvestmentComparisonTable.jsx
import { useTheme } from '../../context/ThemeContext';
import {
  TrendingUp,
  Percent,
  Clock,
  Wrench,
  ShieldCheck,
  Receipt,
  Building2,
  Home,
  Factory,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const COMPARISON_METRICS = [
  {
    feature: 'Annual Rental Yield',
    icon: Percent,
    industrial: '6% to 8% Net Yield',
    industrialHighlight: 'Nearly 3x Higher Rental Income',
    industrialPositive: true,
    residential: '2% to 3% Gross Yield',
    residentialDetail: 'Often diluted to 1.5–2% after maintenance & property taxes',
    verdict: 'Industrial sheds yield ~3x more regular monthly cash flow than flats.',
  },
  {
    feature: 'Annual Capital Appreciation',
    icon: TrendingUp,
    industrial: '10% to 15% Yearly Growth',
    industrialHighlight: 'High Industrial Corridor Demand',
    industrialPositive: true,
    residential: '5% to 7% Yearly Growth',
    residentialDetail: 'Constrained by large oversupply in residential suburbs',
    verdict: 'Scarcity of prime NA industrial land on NH-47 drives faster equity growth.',
  },
  {
    feature: 'Total Annualized Return (ROI)',
    icon: Sparkles,
    industrial: '16% to 23% Total Return',
    industrialHighlight: 'Yield + Capital Appreciation',
    industrialPositive: true,
    residential: '7% to 10% Total Return',
    residentialDetail: 'Barely beats inflation after taxes and wear-and-tear',
    verdict: 'Industrial real estate compounds total investor wealth more than twice as fast.',
  },
  {
    feature: 'Lease Agreement Tenure',
    icon: Clock,
    industrial: '5 to 10 Year Corporate Leases',
    industrialHighlight: '5% Annual Structured Escalation',
    industrialPositive: true,
    residential: '11-Month Rental Agreements',
    residentialDetail: 'Frequent tenant turnover, re-negotiations, and broker fees',
    verdict: 'Corporate lock-ins provide long-term income predictability.',
  },
  {
    feature: 'Maintenance & Upkeep',
    icon: Wrench,
    industrial: 'Triple Net (NNN) — Tenant Borne',
    industrialHighlight: 'Zero Maintenance Burden for Owner',
    industrialPositive: true,
    residential: '100% Landlord Borne',
    residentialDetail: 'Frequent painting, woodwork, plumbing, and wear repairs',
    verdict: 'Industrial tenants maintain their own shop floor; true hands-off passive asset.',
  },
  {
    feature: 'Tenant Vacancy & Default Risk',
    icon: ShieldCheck,
    industrial: 'Minimal / Near-Zero Vacancy',
    industrialHighlight: 'High Relocation Barriers',
    industrialPositive: true,
    residential: 'High Recurring Vacancy Risk',
    residentialDetail: '1–2 months vacancy between tenants + 1 month brokerage every cycle',
    verdict: 'Manufacturers invest heavily in machinery and logistics lines; moving is disruptive.',
  },
  {
    feature: 'GST & Tax Efficiency',
    icon: Receipt,
    industrial: '100% GST Input Tax Credit (ITC)',
    industrialHighlight: 'Full 18% GST Offset Eligible',
    industrialPositive: true,
    residential: 'Zero GST Benefit',
    residentialDetail: 'No business tax write-offs for residential residential tenants',
    verdict: 'Commercial tenants readily pay GST as it directly offsets their business output tax.',
  },
  {
    feature: 'Title Security & Financing',
    icon: Building2,
    industrial: '100% NA Industrial Clear Title',
    industrialHighlight: 'Fast Bank Project Financing',
    industrialPositive: true,
    residential: 'Variable / Developer Delays',
    residentialDetail: 'Undivided land share (UDS) risks and possession delays',
    verdict: 'Clear-title NA Industrial plots and sheds at Metro provide clean freehold security.',
  },
];

export default function InvestmentComparisonTable({ className = '' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200 shadow-xl'
      } ${className}`}
    >
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 border-b ${
          isDark
            ? 'bg-gradient-to-r from-red-950/40 via-gray-900 to-black border-gray-800'
            : 'bg-gradient-to-r from-red-50 via-rose-50/50 to-white border-gray-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-brand-red/10 text-brand-red border border-brand-red/20 mb-3">
              <Sparkles size={12} /> Investment Benchmark Analysis
            </span>
            <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'} leading-tight`}>
              Why Industrial Real Estate Beats Residential Properties in Ahmedabad
            </h2>
            <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              A comprehensive financial and operational comparison showing why high-net-worth investors and business owners achieve superior risk-adjusted wealth creation with industrial sheds and NA plots over residential apartments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="text-xs uppercase font-extrabold text-green-500 tracking-wider">Industrial ROI</div>
              <div className="text-2xl font-black text-brand-red mt-0.5" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                16% – 23%
              </div>
              <div className="text-[10px] text-gray-400 font-medium">Combined Annual Yield + Growth</div>
            </div>
            <div className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-gray-950/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">Residential ROI</div>
              <div className="text-2xl font-black text-gray-500 mt-0.5" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                7% – 10%
              </div>
              <div className="text-[10px] text-gray-400 font-medium">Before Vacancy &amp; Repairs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr
              className={`border-b text-[11px] uppercase tracking-wider font-extrabold ${
                isDark ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <th className="py-4 px-4 sm:px-6 w-1/4">Evaluation Metric</th>
              <th className="py-4 px-4 sm:px-6 w-3/8 text-brand-red bg-brand-red/5">
                <span className="flex items-center gap-1.5">
                  <Factory size={15} /> Industrial Property (Metro Industrial Park)
                </span>
              </th>
              <th className="py-4 px-4 sm:px-6 w-3/8 text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Home size={15} /> Residential Property (Flats / Villas)
                </span>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-800/80' : 'divide-gray-200'}`}>
            {COMPARISON_METRICS.map((row, idx) => {
              const Icon = row.icon;
              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-gray-900/50' : 'hover:bg-red-50/20'
                  }`}
                >
                  {/* Metric Label */}
                  <td className="py-4 px-4 sm:px-6 font-semibold align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                          {row.feature}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {row.verdict}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Industrial Cell (Metro) */}
                  <td className="py-4 px-4 sm:px-6 align-top bg-brand-red/5 font-medium">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-extrabold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {row.industrial}
                        </span>
                        <div className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          {row.industrialHighlight}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Residential Cell */}
                  <td className="py-4 px-4 sm:px-6 align-top text-gray-500">
                    <div className="flex items-start gap-2">
                      <XCircle size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {row.residential}
                        </span>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {row.residentialDetail}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Call-to-Action */}
      <div
        className={`p-5 sm:p-6 border-t flex flex-wrap items-center justify-between gap-4 ${
          isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center font-black">
            M
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Looking to deploy capital for maximum rental yield &amp; growth?
            </h4>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Explore ready sheds (MIP 1), plots to build your own shed (MIP 2), or Bavla industrial plots (MIP 3).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/calculator"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isDark
                ? 'border-gray-700 text-gray-200 hover:border-brand-red hover:text-white'
                : 'border-gray-300 text-gray-700 hover:border-brand-red hover:text-gray-900'
            }`}
          >
            Calculate Your ROI <ArrowRight size={13} />
          </Link>
          <Link
            to="/metro-industrial-park"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-red hover:bg-red-700 text-white shadow-md transition-all hover:scale-105"
          >
            Explore Metro Industrial Park <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// src/components/Projects/InvestmentComparisonTable.jsx
import { Link } from 'react-router-dom';
import {
  TrendingUp, Percent, Clock, Wrench, ShieldCheck, Receipt,
  Building2, Home, Factory, ArrowRight, ArrowUpRight, Check, Minus,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const COMPARISON_METRICS = [
  {
    feature: 'Annual Rental Yield',
    icon: Percent,
    industrial: '6% to 8% Net Yield',
    industrialHighlight: 'Nearly 3× higher rental cashflow',
    residential: '2% to 3% Gross Yield',
    residentialDetail: 'Often diluted to 1.5–2% after maintenance & property taxes',
    verdict: 'Industrial sheds yield ~3× more regular monthly cash flow than flats.',
  },
  {
    feature: 'Annual Capital Appreciation',
    icon: TrendingUp,
    industrial: '10% to 15% Yearly Growth',
    industrialHighlight: 'High industrial corridor demand',
    residential: '5% to 7% Yearly Growth',
    residentialDetail: 'Constrained by large oversupply in residential suburbs',
    verdict: 'Scarcity of prime NA industrial land on NH-47 drives faster equity growth.',
  },
  {
    feature: 'Total Annualized Return (ROI)',
    icon: TrendingUp,
    industrial: '16% to 23% Total Return',
    industrialHighlight: 'Yield + capital appreciation',
    residential: '7% to 10% Total Return',
    residentialDetail: 'Barely beats inflation after taxes and wear-and-tear',
    verdict: 'Industrial real estate compounds total investor wealth more than twice as fast.',
  },
  {
    feature: 'Lease Agreement Tenure',
    icon: Clock,
    industrial: '5 to 10 Year Corporate Leases',
    industrialHighlight: '5% annual structured escalation',
    residential: '11-Month Rental Agreements',
    residentialDetail: 'Frequent tenant turnover, re-negotiations, and broker fees',
    verdict: 'Corporate lock-ins provide long-term income predictability.',
  },
  {
    feature: 'Maintenance & Upkeep',
    icon: Wrench,
    industrial: 'Triple Net (NNN) — Tenant Borne',
    industrialHighlight: 'Zero maintenance burden for owner',
    residential: '100% Landlord Borne',
    residentialDetail: 'Frequent painting, woodwork, plumbing, and wear repairs',
    verdict: 'Industrial tenants maintain their own shop floor; true hands-off passive asset.',
  },
  {
    feature: 'Tenant Vacancy & Default Risk',
    icon: ShieldCheck,
    industrial: 'Minimal / Near-Zero Vacancy',
    industrialHighlight: 'High relocation barriers',
    residential: 'High Recurring Vacancy Risk',
    residentialDetail: '1–2 months vacancy between tenants + 1 month brokerage every cycle',
    verdict: 'Manufacturers invest heavily in machinery and logistics lines; moving is disruptive.',
  },
  {
    feature: 'GST & Tax Efficiency',
    icon: Receipt,
    industrial: '100% GST Input Tax Credit (ITC)',
    industrialHighlight: 'Full 18% GST offset eligible',
    residential: 'Zero GST Benefit',
    residentialDetail: 'No business tax write-offs for residential tenants',
    verdict: 'Commercial tenants readily pay GST as it directly offsets business output tax.',
  },
  {
    feature: 'Title Security & Financing',
    icon: Building2,
    industrial: '100% NA Industrial Clear Title',
    industrialHighlight: 'Fast bank project financing',
    residential: 'Variable / Developer Delays',
    residentialDetail: 'Undivided land share (UDS) risks and possession delays',
    verdict: 'Clear-title NA Industrial plots and sheds at Metro provide clean freehold security.',
  },
];

export default function InvestmentComparisonTable({ className = '' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F5F3EE]';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const bgTint    = isDark ? 'bg-[#171213]' : 'bg-[#FBF6F5]';
  const border    = isDark ? 'border-white/[0.1]' : 'border-black/[0.11]';
  const divide    = isDark ? 'divide-white/[0.1]' : 'divide-black/[0.11]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textBody  = isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]';
  const textMuted = isDark ? 'text-[#6E6E77]' : 'text-[#73726C]';

  return (
    <div className={`border ${border} ${bgSurface} ${className}`}>
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 border-b ${border} ${bgPage}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2.5 mb-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
              <span className="text-brand-red font-semibold">Benchmark Analysis</span>
              <span className={textMuted}>/</span>
              <span className={textMuted}>Ahmedabad Real Estate</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-[-0.025em] leading-tight ${textMain}`}>
              Industrial Real Estate vs. Residential Property
            </h2>
            <p className={`text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl ${textBody}`}>
              A direct financial and operational comparison showing why investors and business owners achieve higher risk-adjusted returns with industrial sheds and NA plots over apartments.
            </p>
          </div>

          {/* 2-Cell ROI Summary Box */}
          <div className={`lg:col-span-5 grid grid-cols-2 border ${border} divide-x ${divide} ${bgSurface}`}>
            <div className={`p-4 sm:p-5 relative ${bgTint}`}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-red font-semibold">
                Industrial ROI
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-brand-red mt-1">
                16–23%
              </div>
              <div className={`text-[11px] mt-0.5 ${textMuted}`}>Yield + Appreciation</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className={`font-mono text-[10px] uppercase tracking-[0.14em] ${textMuted}`}>
                Residential ROI
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums mt-1 ${textBody}`}>
                7–10%
              </div>
              <div className={`text-[11px] mt-0.5 ${textMuted}`}>Before Repairs &amp; Vacancy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className={`border-b ${border} ${bgPage} font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em]`}>
              <th className={`py-4 px-5 sm:px-6 w-1/4 font-semibold ${textMuted}`}>
                Evaluation Metric
              </th>
              <th className={`py-4 px-5 sm:px-6 w-[37.5%] font-bold text-brand-red border-x ${border} ${bgTint}`}>
                <span className="inline-flex items-center gap-2">
                  <Factory size={14} aria-hidden="true" />
                  Industrial Property (MIP)
                </span>
              </th>
              <th className={`py-4 px-5 sm:px-6 w-[37.5%] font-semibold ${textMuted}`}>
                <span className="inline-flex items-center gap-2">
                  <Home size={14} aria-hidden="true" />
                  Residential (Flats / Villas)
                </span>
              </th>
            </tr>
          </thead>

          <tbody className={`divide-y ${divide}`}>
            {COMPARISON_METRICS.map((row, idx) => {
              const Icon = row.icon;
              return (
                <tr
                  key={row.feature}
                  className={`transition-colors ${isDark ? 'hover:bg-[#17171B]/60' : 'hover:bg-[#FAF9F6]'}`}
                >
                  {/* Metric */}
                  <td className="py-5 px-5 sm:px-6 align-top">
                    <div className="flex items-start gap-3">
                      <span className={`w-7 h-7 border ${border} ${bgPage} flex items-center justify-center shrink-0 mt-0.5 text-brand-red`}>
                        <Icon size={13} aria-hidden="true" />
                      </span>
                      <div>
                        <div className={`font-bold text-xs sm:text-sm ${textMain}`}>
                          <span className={`font-mono text-[10px] mr-1.5 ${textMuted}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {row.feature}
                        </div>
                        <p className={`text-[11px] mt-1 leading-relaxed ${textMuted}`}>
                          {row.verdict}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Industrial */}
                  <td className={`py-5 px-5 sm:px-6 align-top border-x ${border} ${bgTint}`}>
                    <div className="flex items-start gap-2.5">
                      <Check size={15} className="text-brand-red shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <div className={`font-extrabold text-sm sm:text-base tracking-tight ${textMain}`}>
                          {row.industrial}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-brand-red mt-1">
                          {row.industrialHighlight}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Residential */}
                  <td className="py-5 px-5 sm:px-6 align-top">
                    <div className="flex items-start gap-2.5">
                      <Minus size={14} className={`${textMuted} shrink-0 mt-0.5`} aria-hidden="true" />
                      <div>
                        <div className={`font-semibold ${textBody}`}>
                          {row.residential}
                        </div>
                        <p className={`text-[11px] mt-1 leading-relaxed ${textMuted}`}>
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

      {/* Footer Action Bar */}
      <div className={`p-5 sm:p-6 border-t ${border} ${bgPage} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <h4 className={`text-sm font-extrabold tracking-tight ${textMain}`}>
            Deploy capital for higher rental yield &amp; land appreciation
          </h4>
          <p className={`text-xs mt-0.5 ${textBody}`}>
            Compare ready sheds (MIP 1), Moraiya plots (MIP 2), or Bavla plots (MIP 3).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/calculator"
            className={`py-2.5 px-4 border ${border} ${bgSurface} ${textMain} hover:border-brand-red hover:text-brand-red text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center gap-1.5 transition-colors`}
          >
            <span>ROI Calculator</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <Link
            to="/metro-industrial-park"
            className="py-2.5 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Explore MIP 1</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
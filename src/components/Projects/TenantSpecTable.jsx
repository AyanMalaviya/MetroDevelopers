// src/components/Projects/TenantSpecTable.jsx
import { Ruler, Zap, Truck, Award, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const TENANT_SPECS = [
  {
    code: '01',
    category: 'Shed Structure & Heights',
    icon: Ruler,
    specs: [
      { label: 'Available Unit Sizes', value: '4,000 to 50,000 sq.ft',               note: 'Modular layout; customizable multi-bay units' },
      { label: 'Clear Ceiling Height', value: '30 to 35 ft clearance',               note: 'Center height up to 38 ft; ideal for high-density racking' },
      { label: 'Structure Type',       value: 'Heavy Pre-Engineered Building (PEB)', note: 'High-tensile steel frame with insulated color-coated sheets' },
      { label: 'Bay Spacing',          value: 'Wide column-free work spans',         note: 'Unobstructed shop floor area for production & assembly' },
    ],
  },
  {
    code: '02',
    category: 'Flooring, Loading & Power',
    icon: Zap,
    specs: [
      { label: 'Floor Load Capacity',    value: '5.0 – 8.0 Ton / m²',             note: 'Laser-screed VDF concrete floor; heavy machinery certified' },
      { label: 'Electrical Power Load',  value: '3-Phase HT Power (UGVCL)',        note: 'Scalable to 100+ KVA per unit with dedicated transformer space' },
      { label: 'Rolling Shutters',       value: '14 ft (W) × 16 ft (H) Motorized', note: 'Wide entry for container trailers & forklifts' },
      { label: 'Docking & Loading Bays', value: 'Dedicated Dock Leveler Space',    note: 'Smooth simultaneous loading & unloading operations' },
    ],
  },
  {
    code: '03',
    category: 'Roads, Logistics & Utilities',
    icon: Truck,
    specs: [
      { label: 'Internal Road Width',  value: '60 Ft Heavy-Duty RCC',               note: 'Full 40-foot multi-axle freight trailer turnaround radius' },
      { label: 'Water Supply',         value: '24/7 Dedicated Industrial Connection', note: 'Continuous pressurized supply with overhead reserve tanks' },
      { label: 'Drainage & Waste',     value: 'Underground Industrial Drainage',    note: 'Integrated stormwater drainage & solid waste management' },
      { label: 'Weighbridge Facility', value: 'On-Site Heavy Vehicle Weighbridge',  note: 'Certified weighment for inbound & outbound logistics' },
    ],
  },
  {
    code: '04',
    category: 'Commercial & Lease Terms',
    icon: Award,
    specs: [
      { label: 'Possession Timeline',    value: 'Immediate to 30–90 Days',         note: 'Rapid key handover for fast machinery installation' },
      { label: 'Lease Agreement Tenure', value: '5 to 10 Year Corporate Leases',   note: 'Standard lock-in with 5% annual escalation terms' },
      { label: 'Tax & Fiscal Benefits',  value: '100% GST Input Tax Credit (ITC)', note: 'Eligible for all GST-registered corporate tenants' },
      { label: 'Security & Approvals',   value: '24/7 CCTV & Gated Security',      note: '100% NA Industrial Approved; fire safety NOC provisions' },
    ],
  },
];

export default function TenantSpecTable({ className = '' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const border    = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const divide    = isDark ? 'divide-white/[0.12]' : 'divide-gray-200';
  const textMain  = isDark ? 'text-white' : 'text-gray-900';
  const textBody  = isDark ? 'text-gray-200' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`border ${border} ${bgSurface} ${className}`}>
      {/* Header */}
      <div className={`p-6 sm:p-8 border-b ${border} ${bgPage}`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
              <span className="text-brand-red font-semibold">Technical Dossier</span>
              <span className={textMuted}>/</span>
              <span className={textMuted}>MIP 01 · Moraiya</span>
            </div>
            <h3 className={`text-xl sm:text-3xl font-bold tracking-tight leading-tight ${textMain}`}>
              Tenant Technical Specifications &amp;{' '}
              <span className="font-serif-editorial italic text-brand-red inline-block">
                Utility Matrix
              </span>
            </h3>
            <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${textBody}`}>
              Structural and utility specifications for corporate tenants, 3PL logistics operators, and manufacturing units at Metro Industrial Park 1.
            </p>
          </div>

          <span className={`inline-flex items-center gap-2 px-3 py-1.5 border ${border} ${bgSurface} font-mono text-[10px] uppercase tracking-[0.14em] ${textMain}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Ready for Fit-Out
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className={`divide-y ${divide}`}>
        {TENANT_SPECS.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.code} className="p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-brand-red">{cat.code}</span>
                  <h4 className={`text-sm sm:text-base font-bold tracking-tight ${textMain}`}>
                    {cat.category}
                  </h4>
                </div>
                <Icon size={15} className={textMuted} aria-hidden="true" />
              </div>

              <div className={`overflow-x-auto border ${border}`}>
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b ${border} ${bgPage} font-mono text-[10px] uppercase tracking-[0.14em]`}>
                      <th className={`py-2.5 px-4 font-semibold w-1/3 ${textMuted}`}>Parameter</th>
                      <th className="py-2.5 px-4 font-bold w-1/3 text-brand-red">Specification</th>
                      <th className={`py-2.5 px-4 font-semibold w-1/3 hidden sm:table-cell ${textMuted}`}>Operational Impact</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${divide}`}>
                    {cat.specs.map((item) => (
                      <tr
                        key={item.label}
                        className={`transition-colors ${isDark ? 'hover:bg-[#17171B]/70' : 'hover:bg-[#FAF9F6]'}`}
                      >
                        <td className={`py-3 px-4 font-medium ${textBody}`}>
                          {item.label}
                        </td>
                        <td className={`py-3 px-4 font-bold tabular-nums ${textMain}`}>
                          {item.value}
                        </td>
                        <td className={`py-3 px-4 text-xs hidden sm:table-cell ${textMuted}`}>
                          {item.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className={`px-5 sm:px-7 py-4 border-t ${border} ${bgPage} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}>
        <p className={textBody}>
          Custom floor loads, RCC crane girders (5T–20T), and office partitions available on request.
        </p>
        <a
          href={`https://wa.me/919824235642?text=${encodeURIComponent('Hello, I need technical leasing specs and rate sheet for Metro Industrial Park 1 in Changodar.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-brand-red hover:underline shrink-0"
        >
          <span>Request Spec Sheet</span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
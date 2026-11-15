// src/components/Projects/TenantSpecTable.jsx
import { Ruler, Zap, Truck, Clock, Shield, Award, CheckCircle2, Factory } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const TENANT_SPECS = [
  {
    category: 'Shed Structure & Heights',
    icon: Ruler,
    specs: [
      { label: 'Available Unit Sizes', value: '4,000 to 50,000 sq.ft', note: 'Modular layout; customizable multi-bay units' },
      { label: 'Clear Ceiling Height', value: '30 to 35 ft clearance', note: 'Center height up to 38 ft; ideal for high-density racking' },
      { label: 'Structure Type', value: 'Heavy Pre-Engineered Building (PEB)', note: 'High-tensile steel frame with insulated color-coated sheets' },
      { label: 'Bay Spacing', value: 'Wide column-free work spans', note: 'Unobstructed shop floor area for production & assembly' },
    ],
  },
  {
    category: 'Flooring, Loading & Power',
    icon: Zap,
    specs: [
      { label: 'Floor Load Capacity', value: '5.0 – 8.0 Ton / m²', note: 'Laser-screed VDF concrete floor; heavy machinery certified' },
      { label: 'Electrical Power Load', value: '3-Phase HT Power (UGVCL)', note: 'Scalable to 100+ KVA per unit with dedicated transformer space' },
      { label: 'Rolling Shutters', value: '14 ft (W) × 16 ft (H) Motorized', note: 'Wide entry for container trailers & forklifts' },
      { label: 'Docking & Loading Bays', value: 'Dedicated Dock Leveler Space', note: 'Smooth simultaneous loading & unloading operations' },
    ],
  },
  {
    category: 'Roads, Logistics & Utilities',
    icon: Truck,
    specs: [
      { label: 'Internal Road Width', value: '60 Ft Heavy-Duty RCC', note: 'Full 40-foot multi-axle freight trailer turnaround radius' },
      { label: 'Water Supply', value: '24/7 Dedicated Industrial Connection', note: 'Continuous pressurized supply with overhead reserve tanks' },
      { label: 'Drainage & Waste', value: 'Underground Industrial Drainage', note: 'Integrated stormwater drainage & solid waste management' },
      { label: 'Weighbridge Facility', value: 'On-Site Heavy Vehicle Weighbridge', note: 'Certified weighment for inbound & outbound logistics' },
    ],
  },
  {
    category: 'Commercial & Lease Terms',
    icon: Award,
    specs: [
      { label: 'Possession Timeline', value: 'Immediate to 30–90 Days', note: 'Rapid key handover for fast machinery installation' },
      { label: 'Lease Agreement Tenure', value: '5 to 10 Year Corporate Leases', note: 'Standard lock-in with 5% annual escalation terms' },
      { label: 'Tax & Fiscal Benefits', value: '100% GST Input Tax Credit (ITC)', note: 'Eligible for all GST-registered corporate tenants' },
      { label: 'Security & Approvals', value: '24/7 CCTV & Gated Security', note: '100% NA Industrial Approved; fire safety NOC provisions' },
    ],
  },
];

export default function TenantSpecTable({ className = '' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200 shadow-md'
    } ${className}`}>
      {/* Header */}
      <div className={`p-5 sm:p-6 border-b ${
        isDark ? 'bg-gradient-to-r from-red-950/40 via-gray-900 to-black border-gray-800' : 'bg-gradient-to-r from-red-50 via-rose-50/40 to-white border-gray-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-red/10 text-brand-red border border-brand-red/20 mb-2">
              <Factory size={11} /> Technical Engineering Data
            </span>
            <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Tenant Technical Specifications &amp; Utility Matrix
            </h3>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Full structural specifications for corporate tenants, 3PL logistics, and manufacturing operators at Metro Industrial Park (MIP 1).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20">
              <CheckCircle2 size={13} /> Ready for Fit-Out
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Spec Categories */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {TENANT_SPECS.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="p-4 sm:p-6">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-7 h-7 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </div>
                <h4 className={`text-sm sm:text-base font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {cat.category}
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b text-[11px] uppercase tracking-wider ${isDark ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                      <th className="py-2.5 px-3 font-semibold w-1/3">Feature</th>
                      <th className="py-2.5 px-3 font-bold w-1/3 text-brand-red">Technical Detail</th>
                      <th className="py-2.5 px-3 font-normal w-1/3 hidden sm:table-cell">Operational Impact</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-900' : 'divide-gray-100'}`}>
                    {cat.specs.map((item, sIdx) => (
                      <tr key={sIdx} className={`transition-colors ${isDark ? 'hover:bg-gray-900/40' : 'hover:bg-gray-50'}`}>
                        <td className={`py-3 px-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.label}
                        </td>
                        <td className={`py-3 px-3 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.value}
                        </td>
                        <td className={`py-3 px-3 text-xs hidden sm:table-cell ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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

      {/* Footer note */}
      <div className={`p-4 border-t text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
        isDark ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
      }`}>
        <p>
          Custom load requirements, RCC crane girders (5T–20T), and customized office partitions available on request.
        </p>
        <a
          href={`https://wa.me/919824235642?text=${encodeURIComponent('Hello, I need technical leasing specs and rate sheet for Metro Industrial Park 1 in Changodar.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-brand-red font-bold hover:underline shrink-0"
        >
          Request Technical Spec Sheet &rarr;
        </a>
      </div>
    </div>
  );
}

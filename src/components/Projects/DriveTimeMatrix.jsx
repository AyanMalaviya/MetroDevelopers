// src/components/Projects/DriveTimeMatrix.jsx
import { Clock, Navigation, ArrowUpRight, Compass, Building } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DRIVE_HUBS = [
  { code: '01', from: 'Sarkhej Cross Roads',            time: '10 Mins', dist: '8.0 km',  route: 'Direct via NH-47',           badge: 'Primary Junction' },
  { code: '02', from: 'Sanathal Circle (SP Ring Road)', time: '10 Mins', dist: '8.5 km',  route: 'Via Sardar Patel Ring Road', badge: 'Ring Road Access' },
  { code: '03', from: 'Ujala Circle (SG Highway)',      time: '12 Mins', dist: '10.2 km', route: 'Via Sarkhej-Bavla Highway',  badge: 'SG Highway Spine' },
  { code: '04', from: 'Juhapura & Prahlad Nagar',       time: '15 Mins', dist: '13.0 km', route: 'Via NH-47 Expressway Link',  badge: 'West Ahmedabad'   },
  { code: '05', from: 'Makarba & Corporate Road',       time: '15 Mins', dist: '12.5 km', route: 'Via SG Road / NH-47',        badge: 'Commercial Belt'  },
  { code: '06', from: 'Bopal & South Bopal',            time: '20 Mins', dist: '16.5 km', route: 'Via SP Ring Road South',     badge: 'Residential Hub'  },
  { code: '07', from: 'Sanand GIDC Industrial Cluster', time: '15 Mins', dist: '14.0 km', route: 'Via Sanand–Moraiya Link Rd', badge: 'Auto Corridor'    },
  { code: '08', from: 'Ahmedabad Airport (AMD)',        time: '35 Mins', dist: '34.0 km', route: 'Via SP Ring Rd Expressway',  badge: 'Air Freight'      },
];

const LOCAL_LANDMARKS = [
  { name: 'Suvas Industrial Estate',       relation: 'Directly Opposite', desc: 'Established manufacturing ecosystem across the road' },
  { name: 'Siya Industrial Park',          relation: 'Directly Behind',   desc: 'Adjacent logistics and warehousing cluster' },
  { name: 'Moraiya Railway Crossing',      relation: '2 Mins Away',       desc: 'Freight and suburban railway connectivity' },
  { name: 'Changodar GIDC Hub',            relation: '3 Mins Away',       desc: 'Heavy engineering, pharma & plastics zone' },
  { name: 'NH 47 (Sarkhej–Bavla Highway)', relation: 'Immediate Access',  desc: 'National freight corridor connecting Ahmedabad to ports' },
];

export default function DriveTimeMatrix({ className = '', locationName = 'Moraiya, Changodar' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F5F3EE]';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const border    = isDark ? 'border-white/[0.1]' : 'border-black/[0.11]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textBody  = isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]';
  const textMuted = isDark ? 'text-[#6E6E77]' : 'text-[#73726C]';

  return (
    <div className={`border ${border} ${bgSurface} ${className}`}>
      {/* Header */}
      <div className={`p-6 sm:p-8 border-b ${border} ${bgPage}`}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
              <Compass size={12} className="text-brand-red shrink-0" aria-hidden="true" />
              <span className="text-brand-red font-semibold">Regional Connectivity</span>
              <span className={textMuted}>/</span>
              <span className={textMuted}>NH-47 Corridor</span>
            </div>
            <h3 className={`text-xl sm:text-3xl font-extrabold tracking-[-0.025em] leading-tight ${textMain}`}>
              Drive-Time Matrix &amp; Corridor Landmarks
            </h3>
            <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${textBody}`}>
              Strategically positioned in {locationName} on NH-47 — connecting western Ahmedabad residential and corporate hubs directly to the Changodar manufacturing belt.
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/6fBawQdYxcmUw3WE6"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <Navigation size={13} aria-hidden="true" />
            <span>Google Maps</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Drive-Time Matrix */}
      <div className={`p-5 sm:p-8 border-b ${border}`}>
        <div className="flex items-center justify-between mb-5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
          <span className={`font-semibold ${textMuted}`}>
            01 / Drive Times from Ahmedabad City &amp; Freight Hubs
          </span>
          <span className={`hidden sm:inline ${textMuted}`}>EST. OFF-PEAK TRANSIT</span>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l ${border}`}>
          {DRIVE_HUBS.map((hub) => (
            <div
              key={hub.code}
              className={`p-4 sm:p-5 border-r border-b ${border} ${bgPage} flex flex-col justify-between transition-colors ${
                isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 font-mono text-[10px] uppercase tracking-wider">
                  <span className="text-brand-red font-semibold">{hub.badge}</span>
                  <span className={`tabular-nums ${textMuted}`}>{hub.dist}</span>
                </div>
                <p className={`font-bold text-sm leading-snug mb-4 ${textMain}`}>
                  {hub.from}
                </p>
              </div>

              <div className={`flex items-center justify-between gap-2 pt-3 border-t ${border}`}>
                <span className="font-mono text-xs font-bold text-brand-red inline-flex items-center gap-1 tabular-nums">
                  <Clock size={12} aria-hidden="true" />
                  {hub.time}
                </span>
                <span className={`text-[11px] text-right ${textMuted}`}>
                  {hub.route}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Landmarks & Neighbors */}
      <div className="p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
          <Building size={12} className="text-brand-red shrink-0" aria-hidden="true" />
          <span className={`font-semibold ${textMuted}`}>
            02 / Neighboring Industrial Hubs &amp; Immediate Landmarks
          </span>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l ${border}`}>
          {LOCAL_LANDMARKS.map((lm, idx) => (
            <div
              key={lm.name}
              className={`p-4 sm:p-5 border-r border-b ${border} ${bgSurface} ${
                idx === LOCAL_LANDMARKS.length - 1 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <p className={`font-bold text-sm ${textMain}`}>{lm.name}</p>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-red shrink-0">
                  {lm.relation}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${textBody}`}>{lm.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
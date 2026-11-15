// src/components/Projects/DriveTimeMatrix.jsx
import { Clock, MapPin, Navigation, Car, Compass, Building, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DRIVE_HUBS = [
  { from: 'Sarkhej Cross Roads', time: '10 Mins', dist: '8.0 km', route: 'Direct via NH-47', badge: 'Primary Junction' },
  { from: 'Sanathal Circle (SP Ring Road)', time: '10 Mins', dist: '8.5 km', route: 'Via Sardar Patel Ring Road', badge: 'Ring Road Access' },
  { from: 'Ujala Circle (SG Highway)', time: '12 Mins', dist: '10.2 km', route: 'Via Sarkhej-Bavla Highway', badge: 'SG Highway Spine' },
  { from: 'Juhapura & Prahlad Nagar', time: '15 Mins', dist: '13.0 km', route: 'Via NH-47 Expressway Link', badge: 'West Ahmedabad' },
  { from: 'Makarba & Corporate Road', time: '15 Mins', dist: '12.5 km', route: 'Via SG Road / NH-47', badge: 'Commercial Belt' },
  { from: 'Bopal & South Bopal', time: '20 Mins', dist: '16.5 km', route: 'Via SP Ring Road South', badge: 'Residential Hub' },
  { from: 'Sanand GIDC Industrial Cluster', time: '15 Mins', dist: '14.0 km', route: 'Via Sanand–Moraiya Link Road', badge: 'Auto Corridor' },
  { from: 'Ahmedabad Airport (AMD)', time: '35 Mins', dist: '34.0 km', route: 'Via SP Ring Road Expressway', badge: 'Air Freight' },
];

const LOCAL_LANDMARKS = [
  { name: 'Suvas Industrial Estate', relation: 'Directly Opposite', desc: 'Established manufacturing ecosystem across the road' },
  { name: 'Siya Industrial Park', relation: 'Directly Behind', desc: 'Adjacent logistics and warehousing cluster' },
  { name: 'Moraiya Railway Crossing', relation: '2 Mins Away', desc: 'Freight and suburban railway connectivity' },
  { name: 'Changodar GIDC Hub', relation: '3 Mins Away', desc: 'Heavy engineering, pharma & plastics zone' },
  { name: 'NH 47 (Sarkhej–Bavla Highway)', relation: 'Immediate Access', desc: 'National freight corridor connecting Ahmedabad to ports' },
];

export default function DriveTimeMatrix({ className = '', locationName = 'Moraiya, Changodar' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200 shadow-md'
    } ${className}`}>
      {/* Header */}
      <div className={`p-5 sm:p-6 border-b ${
        isDark ? 'bg-gradient-to-r from-red-950/30 via-gray-900 to-black border-gray-800' : 'bg-gradient-to-r from-orange-50 via-amber-50/30 to-white border-gray-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-2">
              <Compass size={11} /> Regional Connectivity &amp; "Near Me" Hubs
            </span>
            <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Drive-Time Matrix &amp; Corridor Landmarks from Ahmedabad City
            </h3>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Strategically located in {locationName} on NH-47 — seamlessly connecting western Ahmedabad city neighborhoods to the Changodar manufacturing belt.
            </p>
          </div>
          <a
            href="https://maps.app.goo.gl/6fBawQdYxcmUw3WE6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105 shrink-0"
          >
            <Navigation size={13} /> Open in Google Maps <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* Drive-Time Grid */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
        <h4 className={`text-xs uppercase font-extrabold tracking-wider mb-4 flex items-center gap-2 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Car size={14} className="text-brand-red" />
          Drive Times from Ahmedabad City Limits &amp; Transport Hubs
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DRIVE_HUBS.map((hub, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                isDark ? 'bg-gray-950 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-red/10 text-brand-red">
                  {hub.badge}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">{hub.dist}</span>
              </div>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'} leading-snug mb-1`}>
                {hub.from}
              </p>
              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-dashed border-gray-300 dark:border-gray-800">
                <span className="text-brand-red font-black flex items-center gap-1">
                  <Clock size={12} /> {hub.time}
                </span>
                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {hub.route}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Landmarks & Corridor Neighbors */}
      <div className="p-4 sm:p-6">
        <h4 className={`text-xs uppercase font-extrabold tracking-wider mb-4 flex items-center gap-2 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Building size={14} className="text-orange-500" />
          Neighboring Industrial Hubs &amp; Immediate Landmarks
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LOCAL_LANDMARKS.map((lm, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className={`font-bold text-xs sm:text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {lm.name}
                </p>
                <span className="text-[10px] font-bold text-orange-500 px-2 py-0.5 rounded bg-orange-500/10 shrink-0">
                  {lm.relation}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {lm.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

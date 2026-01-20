// src/components/InteractiveSiteMap/InteractiveSiteMap.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { plotCoordinates, getPlotCenter, sections } from '../../data/plotCoordinates';

export default function InteractiveSiteMap() {
  const { theme } = useTheme();
  const [plotStatuses, setPlotStatuses] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [zoom, setZoom] = useState(1);

  // Load plot statuses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('metroIndustrialPlotStatuses');
    if (saved) {
      try {
        setPlotStatuses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load plot statuses');
      }
    }
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'sold':
        return theme === 'dark' ? '#9CA3AF' : '#6B7280'; // Gray
      case 'rented':
        return theme === 'dark' ? '#34D399' : '#10B981'; // Green
      case 'available':
      default:
        return theme === 'dark' ? '#60A5FA' : '#3B82F6'; // Blue
    }
  };

  const getCircleRadius = (plotNumber) => {
    if (selectedPlot === plotNumber) return 18;
    if (hoveredPlot === plotNumber) return 16;
    return 14;
  };

  const getCircleStroke = (plotNumber) => {
    if (selectedPlot === plotNumber || hoveredPlot === plotNumber) {
      return theme === 'dark' ? '#FFFFFF' : '#000000';
    }
    return theme === 'dark' ? '#374151' : '#E5E7EB';
  };

  const getCircleStrokeWidth = (plotNumber) => {
    if (selectedPlot === plotNumber) return 3;
    if (hoveredPlot === plotNumber) return 2.5;
    return 2;
  };

  const handlePlotClick = (plotNumber) => {
    setSelectedPlot(plotNumber);
  };

  const getStatusLabel = (status) => {
    if (!status || status === 'available') return 'Available';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColorClass = (status) => {
    switch(status) {
      case 'sold': return 'text-gray-500';
      case 'rented': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  // Statistics
  const stats = {
    total: Object.keys(plotCoordinates).length,
    available: Object.keys(plotCoordinates).filter(p => !plotStatuses[p] || plotStatuses[p] === 'available').length,
    rented: Object.keys(plotCoordinates).filter(p => plotStatuses[p] === 'rented').length,
    sold: Object.keys(plotCoordinates).filter(p => plotStatuses[p] === 'sold').length
  };

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Interactive Site Map
          </h3>

          {/* Zoom Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              disabled={zoom <= 0.5}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-30'
              }`}
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              disabled={zoom >= 2}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-30'
              }`}
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className={`p-3 rounded-lg text-center ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stats.total}
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total
            </p>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
          }`}>
            <p className="text-2xl font-bold text-blue-500">{stats.available}</p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Available
            </p>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
          }`}>
            <p className="text-2xl font-bold text-green-500">{stats.rented}</p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Rented
            </p>
          </div>
          <div className={`p-3 rounded-lg text-center ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <p className="text-2xl font-bold text-gray-500">{stats.sold}</p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sold
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white shadow-lg"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Sold
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-lg"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Rented
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Available
            </span>
          </div>
          <div className={`ml-auto text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            💡 Click any circle for details
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className={`relative overflow-auto ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`} style={{ maxHeight: '70vh' }}>
        <div style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'top left',
          transition: 'transform 0.3s ease'
        }}>
          <div className="relative" style={{ minWidth: '910px', minHeight: '980px' }}>
            {/* Background Image */}
            <img 
              src="/images/metro-industrial-map.jpg" 
              alt="Metro Industrial Park Site Map"
              className="w-full h-auto select-none"
              style={{ width: '910px', height: 'auto' }}
              draggable={false}
            />

            {/* SVG Overlay with circles and numbers */}
            <svg
              className="absolute top-0 left-0"
              width="910"
              height="980"
              viewBox="0 0 910 980"
              preserveAspectRatio="xMidYMid meet"
              style={{ pointerEvents: 'none' }}
            >
              {Object.entries(plotCoordinates).map(([plotNumber, plotData]) => {
                const center = plotData.center;  // Direct center access!
                const status = plotStatuses[plotNumber] || 'available';
                const radius = getCircleRadius(plotNumber);
                const isHovered = hoveredPlot === plotNumber;
                const isSelected = selectedPlot === plotNumber;

                return (
                  <g key={plotNumber}>
                    {/* Glow effect for hover/select */}
                    {(isHovered || isSelected) && (
                      <circle
                        cx={center.x}
                        cy={center.y}
                        r={radius + 6}
                        fill={getStatusColor(status)}
                        opacity="0.3"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main circle */}
                    <circle
                      cx={center.x}
                      cy={center.y}
                      r={radius}
                      fill={getStatusColor(status)}
                      stroke={getCircleStroke(plotNumber)}
                      strokeWidth={getCircleStrokeWidth(plotNumber)}
                      className="cursor-pointer transition-all duration-200 drop-shadow-lg"
                      style={{ pointerEvents: 'auto' }}
                      onMouseEnter={() => setHoveredPlot(plotNumber)}
                      onMouseLeave={() => setHoveredPlot(null)}
                      onClick={() => handlePlotClick(plotNumber)}
                    />

                    {/* Plot number */}
                    <text
                      x={center.x}
                      y={center.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="cursor-pointer select-none font-bold pointer-events-none"
                      style={{ 
                        fontSize: isSelected ? '11px' : isHovered ? '10px' : '9px',
                        fill: '#FFFFFF',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {plotNumber}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPlot && (
              <div 
                className={`absolute pointer-events-none px-4 py-3 rounded-lg shadow-2xl text-sm z-50 ${
                  theme === 'dark' ? 'bg-gray-900 border border-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-900'
                }`}
                style={{ 
                  top: plotCoordinates[hoveredPlot].center.y - 60, 
                  left: plotCoordinates[hoveredPlot].center.x + 20,
                  maxWidth: '200px'
                }}
              >
                <p className="font-bold text-base mb-1">Plot {hoveredPlot}</p>
                <p className="text-xs opacity-75 mb-2">
                  Area: {plotCoordinates[hoveredPlot]?.area}
                </p>
                <p className={`text-xs font-semibold capitalize ${
                  getStatusColorClass(plotStatuses[hoveredPlot])
                }`}>
                  {getStatusLabel(plotStatuses[hoveredPlot])}
                </p>
                <p className="text-xs opacity-50 mt-1">Click for details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plot Detail Modal */}
      <AnimatePresence>
        {selectedPlot && plotCoordinates[selectedPlot] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedPlot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-md w-full rounded-2xl shadow-2xl p-6 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}
            >
              <button
                onClick={() => setSelectedPlot(null)}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ backgroundColor: getStatusColor(plotStatuses[selectedPlot] || 'available') }}
                  >
                    {selectedPlot}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Plot {selectedPlot}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Section {plotCoordinates[selectedPlot]?.section} - {sections[plotCoordinates[selectedPlot]?.section]?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                  <p className={`text-xs font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Plot Area
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plotCoordinates[selectedPlot]?.area}
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                  <p className={`text-xs font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Current Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getStatusColor(plotStatuses[selectedPlot] || 'available') }}
                    ></div>
                    <p className={`text-2xl font-bold capitalize ${
                      getStatusColorClass(plotStatuses[selectedPlot])
                    }`}>
                      {getStatusLabel(plotStatuses[selectedPlot])}
                    </p>
                  </div>
                </div>

                {(!plotStatuses[selectedPlot] || plotStatuses[selectedPlot] === 'available') && (
                  <div className={`p-4 rounded-lg border-2 border-dashed ${
                    theme === 'dark' 
                      ? 'bg-blue-900/20 border-blue-500/50' 
                      : 'bg-blue-50 border-blue-300'
                  }`}>
                    <p className={`text-sm font-semibold mb-2 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      ✅ This plot is available!
                    </p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Contact us for more information and booking details.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPlot(null)}
                className="mt-6 w-full px-4 py-3 rounded-lg font-semibold bg-brand-red text-white hover:bg-red-700 transition-all duration-300 shadow-lg"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
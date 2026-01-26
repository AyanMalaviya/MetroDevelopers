// src/components/InteractiveSiteMap/InteractiveSiteMap.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, ZoomIn, ZoomOut, RefreshCw, ExternalLink } from 'lucide-react';
import { plotCoordinates, getPlotCenter } from '../../data/plotcoordinates';
import { getPlotData } from '../../services/dataService';

// REPLACE with your actual Google Sheet edit URL
const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/100fiyz86pBVkMlU_Em8Veedqdhr-hV9yb1GrwD95n5w/edit';

export default function InteractiveSiteMap() {
  const { theme } = useTheme();
  const [plotData, setPlotData] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getPlotData();
      if (Object.keys(data).length === 0) {
        const initialData = {};
        Object.entries(plotCoordinates).forEach(([id, plot]) => {
          initialData[id] = {
            status: 'available',
            area: plot.area || 'N/A'
          };
        });
        setPlotData(initialData);
      } else {
        setPlotData(data);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  // 4 Status Colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'sold': return theme === 'dark' ? '#9CA3AF' : '#6B7280';
      case 'for-lease': return theme === 'dark' ? '#EF4444' : '#DC2626';
      case 'pre-leased': return theme === 'dark' ? '#60A5FA' : '#3B82F6';
      case 'available': default: return theme === 'dark' ? '#34D399' : '#10B981';
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
    switch(status) {
      case 'sold': return 'Sold';
      case 'for-lease': return 'Sold - Available for Lease';
      case 'pre-leased': return 'Pre Leased - Available';
      case 'available': default: return 'Available';
    }
  };

  const getStatusColorClass = (status) => {
    switch(status) {
      case 'sold': return 'text-gray-500';
      case 'for-lease': return 'text-red-500';
      case 'pre-leased': return 'text-blue-500';
      default: return 'text-green-500';
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diffMs = now - lastUpdated;
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  const stats = {
    total: Object.keys(plotCoordinates).length,
    available: Object.keys(plotCoordinates).filter(p => {
      const data = plotData[p];
      return !data || data.status === 'available';
    }).length,
    preLeased: Object.keys(plotCoordinates).filter(p => plotData[p]?.status === 'pre-leased').length,
    forLease: Object.keys(plotCoordinates).filter(p => plotData[p]?.status === 'for-lease').length,
    sold: Object.keys(plotCoordinates).filter(p => plotData[p]?.status === 'sold').length
  };

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Updated {formatLastUpdated()}
              </span>
            )}
          </div>
                    <div className={`ml-auto text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <RefreshCw className="w-3 h-3" />
            Auto-updates every 30s
          </div>

        </div>
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
            <p className="text-2xl font-bold text-green-500">{stats.available}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Available</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <p className="text-2xl font-bold text-blue-500">{stats.preLeased}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Pre leased</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <p className="text-2xl font-bold text-red-500">{stats.forLease}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>For Lease</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <p className="text-2xl font-bold text-gray-500">{stats.sold}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sold</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white shadow-lg"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>For Lease</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Pre Leased</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-lg"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Available</span>
          </div>
          <div className="flex gap-2 mx-auto">
            <a
              href={ADMIN_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              <ExternalLink className="w-3 h-3" />
              Edit Data
            </a>
            <button onClick={refreshData} disabled={loading} className={`p-2 rounded-lg transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setZoom(Math.max(0.3, zoom - 0.2))} disabled={zoom <= 0.3} className={`p-2 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30' : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-30'}`}>
              <ZoomOut className="w-5 h-5" />
            </button>
            <button onClick={() => setZoom(Math.min(2, zoom + 0.2))} disabled={zoom >= 2} className={`p-2 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30' : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-30'}`}>
              <ZoomIn className="w-5 h-5" />
            </button>
            <button onClick={() => setZoom(1)} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className={`relative overflow-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ maxHeight: '70vh' }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.3s ease' }}>
          <div className="relative" style={{ minWidth: '910px', minHeight: '980px' }}>
            <img src="/images/metro-industrial-map.jpg" alt="Metro Industrial Park Site Map" className="w-full h-auto select-none" style={{ width: '910px', height: 'auto' }} draggable={false} />
            <svg className="absolute top-0 left-0" width="910" height="980" viewBox="0 0 910 980" preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: 'none' }}>
              {Object.entries(plotCoordinates).map(([plotNumber, plotInfo]) => {
                const center = getPlotCenter(plotNumber);
                const data = plotData[plotNumber] || { status: 'available' };
                const status = data.status;
                const radius = getCircleRadius(plotNumber);
                const isHovered = hoveredPlot === plotNumber;
                const isSelected = selectedPlot === plotNumber;
                return (
                  <g key={plotNumber}>
                    {(isHovered || isSelected) && (
                      <circle cx={center.x} cy={center.y} r={radius + 6} fill={getStatusColor(status)} opacity="0.3" className="animate-pulse" />
                    )}
                    <circle cx={center.x} cy={center.y} r={radius} fill={getStatusColor(status)} stroke={getCircleStroke(plotNumber)} strokeWidth={getCircleStrokeWidth(plotNumber)} className="cursor-pointer transition-all duration-200 drop-shadow-lg" style={{ pointerEvents: 'auto' }} onMouseEnter={() => setHoveredPlot(plotNumber)} onMouseLeave={() => setHoveredPlot(null)} onClick={() => handlePlotClick(plotNumber)} />
                    <text x={center.x} y={center.y} textAnchor="middle" dominantBaseline="middle" className="cursor-pointer select-none font-bold pointer-events-none" style={{ fontSize: isSelected ? '11px' : isHovered ? '10px' : '9px', fill: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{plotNumber}</text>
                  </g>
                );
              })}
            </svg>
            {hoveredPlot && (
              <div className={`absolute pointer-events-none px-4 py-3 rounded-lg shadow-2xl text-sm z-50 ${theme === 'dark' ? 'bg-gray-900 border border-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-900'}`} style={{ top: getPlotCenter(hoveredPlot).y - 60, left: getPlotCenter(hoveredPlot).x + 20, maxWidth: '200px' }}>
                <p className="font-bold text-base mb-1">Plot {hoveredPlot}</p>
                <p className="text-xs opacity-75 mb-2">Area: {plotData[hoveredPlot]?.area || plotCoordinates[hoveredPlot]?.area || 'N/A'}</p>
                <p className={`text-xs font-semibold ${getStatusColorClass(plotData[hoveredPlot]?.status)}`}>{getStatusLabel(plotData[hoveredPlot]?.status)}</p>
                <p className="text-xs opacity-50 mt-1">Click for details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedPlot && plotCoordinates[selectedPlot] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedPlot(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className={`relative max-w-md w-full rounded-2xl shadow-2xl p-8 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <button onClick={() => setSelectedPlot(null)} className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-2xl mx-auto mb-4" style={{ backgroundColor: getStatusColor(plotData[selectedPlot]?.status || 'available') }}>{selectedPlot}</div>
                <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Plot {selectedPlot}</h3>
              </div>
              <div className="space-y-4">
                <div className={`p-6 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <p className={`text-sm font-semibold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Plot Area</p>
                  <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{plotData[selectedPlot]?.area || plotCoordinates[selectedPlot]?.area || 'N/A'}</p>
                </div>
                <div className={`p-6 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <p className={`text-sm font-semibold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 rounded-full shadow-lg" style={{ backgroundColor: getStatusColor(plotData[selectedPlot]?.status || 'available') }}></div>
                    <p className={`text-2xl font-bold ${getStatusColorClass(plotData[selectedPlot]?.status)}`}>{getStatusLabel(plotData[selectedPlot]?.status)}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPlot(null)} className="mt-8 w-full px-6 py-4 rounded-xl font-bold text-lg bg-brand-red text-white hover:bg-red-700 transition-all duration-300 shadow-xl">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
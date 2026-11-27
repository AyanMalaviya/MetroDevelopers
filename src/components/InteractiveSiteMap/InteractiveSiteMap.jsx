// src/components/InteractiveSiteMap/InteractiveSiteMap.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getPlotCenter } from '../../data/plotcoordinates';
import { phaseCoordinates } from '../../data/phaseCoordinates';
import { getPlotData } from '../../services/dataService';
import {
  PARK1_ADMIN_SHEET_URL,
  PARK1_PLOT_ENTRIES,
  PARK1_PLOT_IDS,
  normalizePark1Status,
  getPark1StatusColor,
  computePark1Stats,
  getPark1StatItems,
  getPark1HoverSummary,
  buildPark1ModalProps,
} from '../../utils/park1UnitData';
import {
  PARK1_DIMENSIONS,
} from '../../data/park1Dimensions';
import SiteMap2DViewport from './SiteMap2DViewport';
import DimensionOverlay from './DimensionOverlay';
import UnitDetailModal from './UnitDetailModal';

const PLOT_ENTRIES = PARK1_PLOT_ENTRIES;
const PLOT_IDS = PARK1_PLOT_IDS;

const PhaseOverlays = React.memo(function PhaseOverlays({ showPhases, isDark }) {
  if (!showPhases) return null;
  return (
    <g className="phase-overlays" pointerEvents="none">
      {Object.values(phaseCoordinates).map((phase) => {
        const pts = phase.points || phase.polygonCoordinates || phase.rectCoordinates;
        const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(' ');
        const { labelCenter, label, id, theme } = phase;
        return (
          <g key={id}>
            <polygon
              points={pointsStr}
              fill={theme?.fill || 'rgba(100, 116, 139, 0.28)'}
              stroke={theme?.stroke || 'rgba(71, 85, 105, 0.75)'}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeDasharray="5 3"
            />
            <text
              x={labelCenter.x}
              y={labelCenter.y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: '56px',
                fontWeight: '900',
                fill: theme?.watermarkColor || (isDark ? '#94A3B8' : '#334155'),
                opacity: isDark ? 0.35 : 0.25,
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '-2px',
                userSelect: 'none',
              }}
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
});

const PlotDot = React.memo(function PlotDot({
  plotNumber,
  center,
  status,
  dimmed,
  isHov,
  isSel,
  isDark,
  onSelect,
  onHover,
  onLeave,
}) {
  if (!center) return null;
  const statusColor = getPark1StatusColor(status, isDark);
  const radius = isSel ? 14 : isHov ? 12 : 10;
  const stroke = isSel || isHov ? '#FFFFFF' : isDark ? '#374151' : '#E5E7EB';
  const strokeWidth = isSel ? 3 : isHov ? 2.5 : 2;

  return (
    <g style={{ opacity: dimmed ? 0.2 : 1, transition: 'opacity 150ms ease' }}>
      {(isHov || isSel) && (
        <circle cx={center.x} cy={center.y} r={radius + 6} fill={statusColor} opacity="0.35" className="animate-pulse" />
      )}
      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill={statusColor}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        onMouseEnter={() => onHover(plotNumber)}
        onMouseLeave={onLeave}
        onClick={() => onSelect(plotNumber)}
      />
      <text
        x={center.x}
        y={center.y}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: isSel ? '11px' : isHov ? '10px' : '9px',
          fill: '#FFFFFF',
          fontWeight: 'bold',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {plotNumber}
      </text>
    </g>
  );
});

export default function InteractiveSiteMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [plotData, setPlotData] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showPhases, setShowPhases] = useState(true);
  const [dimensionUnit, setDimensionUnit] = useState('ft');

  const loadData = useCallback(async (silent = false, forceRefresh = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getPlotData(forceRefresh);
      if (!data || Object.keys(data).length === 0) {
        const init = {};
        PLOT_ENTRIES.forEach(([id, p]) => {
          init[id] = { status: 'available', area: p.area || 'N/A' };
        });
        setPlotData(init);
      } else {
        setPlotData(data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(false, false);
    const id = setInterval(() => loadData(true, true), 30000);
    return () => clearInterval(id);
  }, [loadData]);

  const stats = useMemo(() => computePark1Stats(plotData), [plotData]);

  const dimmedMap = useMemo(() => {
    if (statusFilter === 'ALL') return null;
    const map = {};
    PLOT_ENTRIES.forEach(([id]) => {
      if (normalizePark1Status(plotData[id]?.status) !== statusFilter) {
        map[id] = true;
      }
    });
    return map;
  }, [statusFilter, plotData]);

  const statItems = useMemo(() => getPark1StatItems(stats, isDark), [stats, isDark]);

  // Build canonical modal view data with full unit conversions
  const modalProps = useMemo(
    () => buildPark1ModalProps({ shedId: selectedPlot, plotData, isDark }),
    [selectedPlot, plotData, isDark]
  );

  return (
    <>
      <SiteMap2DViewport
        isDark={isDark}
        imageSrc="/images/metro-industrial-park-site-plan-moraiya.jpg"
        imageAlt="Industrial Park 1 Master Site Plan"
        nativeWidth={910}
        nativeHeight={991}
        svgViewBox={[20, 150, 860, 930]}
        statItems={statItems}
        activeStatusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        showPhases={showPhases}
        onTogglePhases={() => setShowPhases((v) => !v)}
        dimensionUnit={dimensionUnit}
        onDimensionUnitChange={setDimensionUnit}
        adminSheetUrl={PARK1_ADMIN_SHEET_URL}
        loading={loading}
        onSync={() => loadData(false, true)}
        fullscreenTitle="MIP 01 · Industrial Park 1"
        hoveredPlot={hoveredPlot}
        plotIds={PLOT_IDS}
        onSelectPlot={setSelectedPlot}
        getPlotCenter={getPlotCenter}
        renderSvg={({ movedRef }) => (
          <svg viewBox="20 150 860 930" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <PhaseOverlays showPhases={showPhases} isDark={isDark} />
            <DimensionOverlay
              units={PARK1_DIMENSIONS}
              unitMode={dimensionUnit}
              hoveredId={hoveredPlot}
              selectedId={selectedPlot}
              dimmedMap={dimmedMap}
            />
            <g className="plots-layer">
              {PLOT_ENTRIES.map(([plotNumber, plot]) => {
                const center = plot.center || getPlotCenter(plotNumber);
                const status = normalizePark1Status(plotData[plotNumber]?.status);
                const dimmed = statusFilter !== 'ALL' && status !== statusFilter;
                return (
                  <PlotDot
                    key={plotNumber}
                    plotNumber={plotNumber}
                    center={center}
                    status={status}
                    dimmed={dimmed}
                    isHov={hoveredPlot === plotNumber}
                    isSel={selectedPlot === plotNumber}
                    isDark={isDark}
                    onSelect={(id) => {
                      if (!movedRef?.current) setSelectedPlot(id);
                    }}
                    onHover={setHoveredPlot}
                    onLeave={() => setHoveredPlot(null)}
                  />
                );
              })}
            </g>
          </svg>
        )}
        renderHoverTooltip={(plotId, posX, posY) => {
          const hover = getPark1HoverSummary({ shedId: plotId, plotData, isDark });

          return (
            <div
              className={`absolute pointer-events-none p-2.5 border shadow-xl z-30 ${
                isDark ? 'border-white/15 bg-[#121215]/95 text-white' : 'border-gray-200 bg-white/95 text-gray-900'
              }`}
              style={{ top: Math.max(8, posY - 70), left: posX + 14, minWidth: '154px', backdropFilter: 'blur(8px)' }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono font-bold text-xs">{hover.title}</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase" style={{ background: hover.statusColor }}>
                  {hover.statusLabel}
                </span>
              </div>
              {hover.sqYdText ? (
                <p className="text-xs font-bold text-brand-red tabular-nums">
                  {hover.sqYdText} SQ.YD
                  <span className="font-normal text-gray-400 ml-1 text-[10px]">({hover.sqFtText} ft²)</span>
                </p>
              ) : (
                <p className="text-xs font-bold text-brand-red">{hover.rawArea}</p>
              )}
              {hover.dimsFt && (
                <p className={`font-mono text-[10px] mt-0.5 tabular-nums ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {hover.dimsFt} · {hover.dimsMt}
                </p>
              )}
              {hover.phaseLabel && <p className="font-mono text-[10px] text-gray-400 mt-0.5">{hover.phaseLabel}</p>}
            </div>
          );
        }}
      />

      <UnitDetailModal {...modalProps} isDark={isDark} onClose={() => setSelectedPlot(null)} />
    </>
  );
}

// src/components/InteractiveSiteMap/Park3InteractiveMap.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { park3PlotCoordinates, getPark3PlotCenter } from '../../data/park3PlotCoordinates';
import { getPark3PlotData } from '../../services/park3DataService';
import {
  parseAreaStringToSqYd,
  sqYdToSqFt,
  sqYdToSqMt,
  sqMtToSqYd,
  sqMtToSqFt,
  sqYdToVigha,
  fmtNum,
  buildCalculatorPrefill,
} from '../../utils/areaConversions';
import SiteMap2DViewport from './SiteMap2DViewport';
import UnitDetailModal from './UnitDetailModal';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1om2y2hG15CsH39lIIPtdiLrsAncSOSe0tYx6H3ih-1A/edit';
const PARK3_PLOT_ENTRIES = Object.entries(park3PlotCoordinates);
const PARK3_PLOT_IDS = PARK3_PLOT_ENTRIES.map(([id]) => id);

const getStatusColor = (status, isDark) => (status === 'sold' ? '#808080' : isDark ? '#34D399' : '#10B981');
const getStatusLabel = (status) => (status === 'sold' ? 'Sold' : 'Available');

const Park3PlotDot = React.memo(function Park3PlotDot({
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
  const statusColor = getStatusColor(status, isDark);
  const radius = isSel ? 13 : isHov ? 12 : 10;
  const stroke = isSel || isHov ? '#FFFFFF' : isDark ? '#1F2937' : '#FFFFFF';
  const strokeWidth = isSel ? 3 : isHov ? 2.5 : 1.5;

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
        y={center.y + 3.5}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={plotNumber.length > 2 ? '8' : '9'}
        fontWeight="bold"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {plotNumber}
      </text>
    </g>
  );
});

export default function Park3InteractiveMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [plotData, setPlotData] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getPark3PlotData();
      if (!data || Object.keys(data).length === 0) {
        const init = {};
        PARK3_PLOT_ENTRIES.forEach(([id, p]) => {
          init[id] = { status: p.status || 'available', area: p.area || 'N/A' };
        });
        setPlotData(init);
      } else {
        setPlotData(data);
      }
    } catch (err) {
      console.error('Error loading Park 3 data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const id = setInterval(() => loadData(true), 30000);
    return () => clearInterval(id);
  }, [loadData]);

  const stats = useMemo(() => {
    const total = PARK3_PLOT_ENTRIES.length;
    let available = 0;
    let sold = 0;
    for (let i = 0; i < total; i++) {
      const id = PARK3_PLOT_ENTRIES[i][0];
      const st = plotData[id]?.status || 'available';
      if (st === 'sold') sold++;
      else available++;
    }
    return { total, available, sold };
  }, [plotData]);

  const statItems = useMemo(
    () => [
      { key: 'ALL', filterKey: 'ALL', value: stats.total, label: 'Total Plots', numClass: isDark ? 'text-white' : 'text-gray-900', lblClass: isDark ? 'text-gray-400' : 'text-gray-500', accentHex: '#E11D48' },
      { key: 'available', filterKey: 'available', value: stats.available, label: 'Available', numClass: 'text-emerald-500', lblClass: 'text-emerald-500', accentHex: '#10B981' },
      { key: 'sold', filterKey: 'sold', value: stats.sold, label: 'Sold', numClass: isDark ? 'text-gray-400' : 'text-gray-600', lblClass: isDark ? 'text-gray-400' : 'text-gray-500', accentHex: '#6B7280' },
      { key: 'title', filterKey: null, value: '100% NA', label: 'Clear Title', numClass: 'text-blue-500', lblClass: 'text-blue-500' },
    ],
    [stats, isDark]
  );

  const modalProps = useMemo(() => {
    if (!selectedPlot || !park3PlotCoordinates[selectedPlot]) return { isOpen: false };
    const info = park3PlotCoordinates[selectedPlot];
    const live = plotData[selectedPlot] || {};
    const status = live.status || info.status || 'available';
    const statusColor = getStatusColor(status, isDark);

    const totalMt = Number(info.totalSqmt ?? info.total_sqmt ?? 0) || null;
    const carpetMt = Number(info.carpetSqmt ?? info.carpet_sqmt ?? 0) || null;
    const superPct = info.superPct || info.super_pct || '23.39%';

    const sqYd = parseAreaStringToSqYd(live.area || info.area) || (totalMt ? sqMtToSqYd(totalMt) : null);
    const resolvedMt = totalMt || (sqYd ? sqYdToSqMt(sqYd) : null);
    const totalFt = sqYd ? sqYdToSqFt(sqYd) : null;
    const vigha = sqYd ? sqYdToVigha(sqYd) : null;

    const carpetYd = carpetMt ? sqMtToSqYd(carpetMt) : null;
    const carpetFt = carpetMt ? sqMtToSqFt(carpetMt) : null;

    const loadingMt = carpetMt && resolvedMt ? resolvedMt - carpetMt : null;
    const loadingYd = carpetYd && sqYd ? sqYd - carpetYd : null;
    const loadingFt = loadingYd ? sqYdToSqFt(loadingYd) : null;

    const conversionRows = [
      ...(carpetMt
        ? [{ label: 'Carpet Area', sqYd: fmtNum(carpetYd), sqMt: fmtNum(carpetMt), sqFt: fmtNum(carpetFt), accent: 'text-emerald-500' }]
        : []),
      ...(loadingMt
        ? [{ label: `Loading (${superPct})`, sqYd: fmtNum(loadingYd), sqMt: fmtNum(loadingMt), sqFt: fmtNum(loadingFt) }]
        : []),
    ];

    const extraMetadata = [
      { label: 'Super Loading', value: superPct },
      { label: 'Road Access', value: '18m & 12m RCC' },
      live.monthlyRent ? { label: 'Monthly Rent', value: live.monthlyRent, accent: 'text-emerald-500' } : null,
      live.lessee ? { label: 'Lessee', value: live.lessee } : null,
      live.owner ? { label: 'Owner', value: live.owner } : null,
    ].filter(Boolean);

    const calculatorPrefill = sqYd
      ? buildCalculatorPrefill({
          parkCode: 'MIP 03',
          parkName: 'Industrial Park 3',
          unitTitle: `Plot #${selectedPlot}`,
          superSqYd: sqYd,
          carpetSqYd: carpetYd,
          monthlyRent: live.monthlyRent,
          loadingNote: `${superPct} super loading · Carpet ${fmtNum(carpetMt)} SQ.MT`,
        })
      : null;

    const whatsappMessage = encodeURIComponent(
      `Hello, I would like to inquire about Plot #${selectedPlot} (${fmtNum(sqYd)} SQ.YD / ${fmtNum(resolvedMt)} SQ.MT) in Industrial Park 3 on Bavla-Rajoda Road. Please share pricing and possession details.`
    );

    return {
      isOpen: true,
      unitNumber: selectedPlot,
      title: `Industrial Plot #${selectedPlot}`,
      locationText: 'MIP 03 · Bavla – Rajoda Road',
      statusLabel: getStatusLabel(status),
      statusColor,
      badges: [{ text: '100% NA Industrial', cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' }],
      primaryTotal: {
        heading: 'Total Plot Area & Conversions',
        sqYd: fmtNum(sqYd),
        sqMt: fmtNum(resolvedMt),
        sqFt: fmtNum(totalFt),
        vigha: vigha ? fmtNum(vigha) : null,
      },
      conversionRows,
      extraMetadata,
      calculatorPrefill,
      whatsappMessage,
    };
  }, [selectedPlot, plotData, isDark]);

  return (
    <>
      <SiteMap2DViewport
        isDark={isDark}
        imageSrc="/images/metro-industrial-park-3-site-plan.jpg"
        imageAlt="Industrial Park 3 Master Site Plan"
        nativeWidth={1200}
        nativeHeight={893}
        svgViewBox={[0, 0, 1200, 893]}
        statItems={statItems}
        activeStatusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        adminSheetUrl={ADMIN_SHEET_URL}
        loading={loading}
        onSync={loadData}
        fullscreenTitle="MIP 03 · Industrial Park 3"
        hoveredPlot={hoveredPlot}
        plotIds={PARK3_PLOT_IDS}
        onSelectPlot={setSelectedPlot}
        getPlotCenter={getPark3PlotCenter}
        renderSvg={({ movedRef }) => (
          <svg viewBox="0 0 1200 893" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            {PARK3_PLOT_ENTRIES.map(([plotNumber, plot]) => {
              const center = plot.center || getPark3PlotCenter(plotNumber);
              const status = plotData[plotNumber]?.status || 'available';
              const dimmed = statusFilter !== 'ALL' && status !== statusFilter;
              return (
                <Park3PlotDot
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
          </svg>
        )}
        renderHoverTooltip={(plotId, posX, posY) => {
          const plotInfo = park3PlotCoordinates[plotId];
          const status = plotData[plotId]?.status || 'available';
          const statusColor = getStatusColor(status, isDark);

          return (
            <div
              className={`absolute pointer-events-none p-2.5 border shadow-xl z-30 ${
                isDark ? 'border-white/15 bg-[#121215]/95 text-white' : 'border-gray-200 bg-white/95 text-gray-900'
              }`}
              style={{ top: Math.max(8, posY - 70), left: posX + 14, minWidth: '154px', backdropFilter: 'blur(8px)' }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono font-bold text-xs">Plot #{plotId}</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase" style={{ background: statusColor }}>
                  {getStatusLabel(status)}
                </span>
              </div>
              {plotInfo && (
                <p className="text-xs font-bold text-brand-red tabular-nums">
                  {plotInfo.area}
                  {(plotInfo.totalSqmt || plotInfo.total_sqmt) && (
                    <span className="text-[10px] text-gray-400 font-normal ml-1">
                      ({typeof (plotInfo.totalSqmt || plotInfo.total_sqmt) === 'number'
                        ? (plotInfo.totalSqmt || plotInfo.total_sqmt).toFixed(2)
                        : (plotInfo.totalSqmt || plotInfo.total_sqmt)} m²)
                    </span>
                  )}
                </p>
              )}
              <p className="font-mono text-[10px] text-gray-400 mt-0.5">Bavla – Rajoda Rd</p>
            </div>
          );
        }}
      />

      <UnitDetailModal {...modalProps} isDark={isDark} onClose={() => setSelectedPlot(null)} />
    </>
  );
}

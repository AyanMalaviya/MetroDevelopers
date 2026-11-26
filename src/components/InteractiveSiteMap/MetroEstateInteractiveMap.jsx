// src/components/InteractiveSiteMap/MetroEstateInteractiveMap.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { estatePlotCoordinates, getEstatePlotCenter } from '../../data/estatePlotCoordinates';
import { getEstatePlotData } from '../../services/estateDataService';
import {
  sqYdToSqFt,
  sqMtToSqYd,
  sqMtToSqFt,
  sqYdToGunta,
  fmtNum,
  buildCalculatorPrefill,
} from '../../utils/areaConversions';
import SiteMap2DViewport from './SiteMap2DViewport';
import UnitDetailModal from './UnitDetailModal';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Xu3J7wNp5Q7BanTlbLNeOrpRNpSP1UQGYFWbfQ1Hs9c/edit';
const ESTATE_PLOT_ENTRIES = Object.entries(estatePlotCoordinates);
const ESTATE_PLOT_IDS = ESTATE_PLOT_ENTRIES.map(([id]) => id);

const getStatusColor = (status, isDark) => (status === 'sold' ? '#808080' : isDark ? '#34D399' : '#10B981');
const getStatusLabel = (status) => (status === 'sold' ? 'Sold' : 'Available');

const EstatePlotDot = React.memo(function EstatePlotDot({
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
  const radius = isSel ? 14 : isHov ? 13 : 12;
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
          fontWeight: '900',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {plotNumber}
      </text>
    </g>
  );
});

export default function MetroEstateInteractiveMap() {
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
      const data = await getEstatePlotData();
      if (!data || Object.keys(data).length === 0) {
        const init = {};
        ESTATE_PLOT_ENTRIES.forEach(([id, p]) => {
          init[id] = { status: 'available', area: p.area || 'N/A' };
        });
        setPlotData(init);
      } else {
        setPlotData(data);
      }
    } catch (err) {
      console.error('Error loading Estate data:', err);
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
    const total = ESTATE_PLOT_ENTRIES.length;
    let available = 0;
    let sold = 0;
    for (let i = 0; i < total; i++) {
      const id = ESTATE_PLOT_ENTRIES[i][0];
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
    if (!selectedPlot || !estatePlotCoordinates[selectedPlot]) return { isOpen: false };
    const coord = estatePlotCoordinates[selectedPlot];
    const live = plotData[selectedPlot] || {};
    const status = live.status || 'available';
    const statusColor = getStatusColor(status, isDark);

    const totalYd = coord.totalPlotAreaSqYd;
    const totalMt = coord.totalPlotAreaSqMt;
    const totalFt = sqYdToSqFt(totalYd);
    const gunta = sqYdToGunta(totalYd);

    const netYd = coord.netPlotAreaSqYd;
    const netMt = coord.netPlotAreaSqMt;
    const netFt = sqYdToSqFt(netYd);

    const subYd = coord.subPlotAreaSqYd;
    const subMt = coord.subPlotAreaSqMt;
    const subFt = sqYdToSqFt(subYd);

    const roadMt = coord.roadAreaSqMt;
    const roadYd = sqMtToSqYd(roadMt);
    const roadFt = sqMtToSqFt(roadMt);

    const cpMt = coord.extraLandCpSqMt || 0;
    const cpYd = cpMt > 0 ? sqMtToSqYd(cpMt) : 0;
    const cpFt = cpMt > 0 ? sqMtToSqFt(cpMt) : 0;

    const loadingPct = totalMt > 0 ? (((totalMt - netMt) / totalMt) * 100).toFixed(2) : null;

    const conversionRows = [
      { label: 'Net Plotted', sqYd: fmtNum(netYd), sqMt: fmtNum(netMt), sqFt: fmtNum(netFt), accent: 'text-emerald-500' },
      { label: 'Sub Plot', sqYd: fmtNum(subYd), sqMt: fmtNum(subMt), sqFt: fmtNum(subFt) },
      { label: 'Road Share', sqYd: fmtNum(roadYd), sqMt: fmtNum(roadMt), sqFt: fmtNum(roadFt) },
      ...(cpMt > 0
        ? [{ label: 'Extra Land CP', sqYd: fmtNum(cpYd), sqMt: fmtNum(cpMt), sqFt: fmtNum(cpFt), accent: 'text-amber-500' }]
        : []),
    ];

    const extraMetadata = [
      { label: 'Block / Zone', value: `Block ${coord.section || 'A'} · NA Industrial` },
      loadingPct ? { label: 'Road Loading', value: `${loadingPct}%` } : null,
      live.monthlyRent ? { label: 'Monthly Rent', value: live.monthlyRent, accent: 'text-emerald-500' } : null,
      live.lessee ? { label: 'Lessee', value: live.lessee } : null,
      live.owner ? { label: 'Owner', value: live.owner } : null,
    ].filter(Boolean);

    const calculatorPrefill = buildCalculatorPrefill({
      parkCode: 'MIP 02',
      parkName: 'Industrial Park 2',
      unitTitle: `Plot #${selectedPlot} (Block ${coord.section || 'A'})`,
      superSqYd: totalYd,
      carpetSqYd: netYd,
      monthlyRent: live.monthlyRent,
      loadingNote: `${loadingPct || '24.08'}% road loading · Net ${fmtNum(netYd)} SQ.YD`,
    });

    const whatsappMessage = encodeURIComponent(
      `Hello, I would like to inquire about Plot #${selectedPlot} (Block ${coord.section || 'A'}, ${fmtNum(totalYd)} SQ.YD / ${fmtNum(totalMt)} SQ.MT) in Industrial Park 2, Moraiya. Please share pricing and possession details.`
    );

    return {
      isOpen: true,
      unitNumber: selectedPlot,
      title: `Industrial Plot #${selectedPlot}`,
      locationText: 'MIP 02 · Moraiya, Changodar',
      statusLabel: getStatusLabel(status),
      statusColor,
      badges: [{ text: `Block ${coord.section || 'A'}`, cls: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' }],
      primaryTotal: {
        heading: 'Total Plot Area & Conversions',
        sqYd: fmtNum(totalYd),
        sqMt: fmtNum(totalMt),
        sqFt: fmtNum(totalFt),
        gunta: fmtNum(gunta),
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
        imageSrc="/images/metro-industrial-park-2-site-plan.jpg"
        imageAlt="Industrial Park 2 Master Site Plan"
        nativeWidth={910}
        nativeHeight={800}
        svgViewBox={[0, 0, 910, 800]}
        statItems={statItems}
        activeStatusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        adminSheetUrl={ADMIN_SHEET_URL}
        loading={loading}
        onSync={loadData}
        fullscreenTitle="MIP 02 · Industrial Park 2"
        hoveredPlot={hoveredPlot}
        plotIds={ESTATE_PLOT_IDS}
        onSelectPlot={setSelectedPlot}
        getPlotCenter={getEstatePlotCenter}
        renderSvg={({ movedRef }) => (
          <svg viewBox="0 0 910 800" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            {ESTATE_PLOT_ENTRIES.map(([plotNumber, plot]) => {
              const center = plot.center || getEstatePlotCenter(plotNumber);
              const status = plotData[plotNumber]?.status || 'available';
              const dimmed = statusFilter !== 'ALL' && status !== statusFilter;
              return (
                <EstatePlotDot
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
          const plotInfo = estatePlotCoordinates[plotId];
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
                  {plotInfo.totalPlotAreaSqYd?.toFixed(2)} SQ.YD
                  <span className="text-[10px] text-gray-400 font-normal ml-1">({plotInfo.totalPlotAreaSqMt?.toFixed(2)} m²)</span>
                </p>
              )}
              <p className="font-mono text-[10px] text-gray-400 mt-0.5">Block {plotInfo?.section || 'A'}</p>
            </div>
          );
        }}
      />

      <UnitDetailModal {...modalProps} isDark={isDark} onClose={() => setSelectedPlot(null)} />
    </>
  );
}

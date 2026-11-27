// src/components/InteractiveSiteMap/DimensionOverlay.jsx
import React, { useMemo } from 'react';

const LINE_CLR = '#B91C1C';
const LINE_ACTIVE = '#DC2626';
const TEXT_CLR = '#0F172A';
const TEXT_ACTIVE = '#B91C1C';
const PILL_FILL = 'rgba(255, 255, 255, 0.94)';

/**
 * Renders architectural Length & Width SVG dimension lines with perpendicular
 * extension ticks, arrowheads, and high-contrast pill readouts aligned inside each unit box.
 */
const DimensionOverlay = React.memo(function DimensionOverlay({
  units = [],
  unitMode = 'ft',
  hoveredId = null,
  selectedId = null,
  dimmedMap = null,
}) {
  const renderedUnits = useMemo(() => {
    if (unitMode === 'off') return [];

    return units.map((u) => {
      const boxW = u.x2 - u.x1;
      const boxH = u.y2 - u.y1;
      const cx = (u.x1 + u.x2) / 2;
      const cy = (u.y1 + u.y2) / 2;

      const hLabel = unitMode === 'm' ? `${Number(u.hM).toFixed(1)}m` : `${u.hFt}'`;
      const vLabel = unitMode === 'm' ? `${Number(u.vM).toFixed(1)}m` : `${u.vFt}'`;

      // Horizontal dimension line inset along top or bottom edge farthest from center PlotDot
      const topDist = Math.abs(u.y1 + 6 - u.dotY);
      const botDist = Math.abs(u.y2 - 6 - u.dotY);
      const hy = u.hPos === 'bottom'
        ? u.y2 - 6
        : u.hPos === 'top'
          ? u.y1 + 6
          : botDist > topDist ? u.y2 - 6 : u.y1 + 6;
      const hx1 = u.x1 + 2.5;
      const hx2 = u.x2 - 2.5;

      // Place horizontal text pill clear of PlotDot when shed height is compact
      let hlx = cx;
      if (boxW >= 72 && Math.abs(hy - u.dotY) < 15.5) {
        const leftPocket = u.dotX - 11 - hx1;
        const rightPocket = hx2 - (u.dotX + 11);
        hlx = leftPocket >= rightPocket
          ? hx1 + leftPocket * 0.52
          : (u.dotX + 11) + rightPocket * 0.48;
      }

      // Vertical dimension line inset along left or right edge farthest from center PlotDot
      const leftDist = Math.abs(u.x1 + 6 - u.dotX);
      const rightDist = Math.abs(u.x2 - 6 - u.dotX);
      const vx = u.vPos === 'left'
        ? u.x1 + 6
        : u.vPos === 'right'
          ? u.x2 - 6
          : rightDist >= leftDist ? u.x2 - 6 : u.x1 + 6;
      const vy1 = u.y1 + 2.5;
      const vy2 = u.y2 - 2.5;

      // Place vertical text pill clear of PlotDot on narrow vertical sheds
      let vly = cy;
      if (boxH >= 70 && Math.abs(vx - u.dotX) < 16) {
        const topPocket = u.dotY - 11 - vy1;
        const botPocket = vy2 - (u.dotY + 11);
        vly = botPocket >= topPocket
          ? (u.dotY + 11) + botPocket * 0.48
          : vy1 + topPocket * 0.52;
      }

      // Dynamic pill widths to frame monospace text cleanly
      const hPillW = hLabel.length * 3.3 + 4;
      const vPillW = vLabel.length * 3.3 + 4;

      return {
        id: u.id,
        hx1, hx2, hy, hlx, hLabel, hPillW,
        vx, vy1, vy2, vly, vLabel, vPillW,
      };
    });
  }, [units, unitMode]);

  if (unitMode === 'off' || renderedUnits.length === 0) return null;

  return (
    <g className="dimension-lines-layer" pointerEvents="none">
      {renderedUnits.map((d) => {
        const isActive = hoveredId === d.id || selectedId === d.id;
        const isDimmed = !isActive && dimmedMap?.[d.id];
        const stroke = isActive ? LINE_ACTIVE : LINE_CLR;
        const txtFill = isActive ? TEXT_ACTIVE : TEXT_CLR;
        const sw = isActive ? 1.05 : 0.65;
        const opacity = isDimmed ? 0.16 : isActive ? 1 : 0.88;

        return (
          <g key={d.id} style={{ opacity, transition: 'opacity 150ms ease' }}>
            {/* ── Horizontal Length/Width Line + Extension Ticks + Arrowheads ── */}
            <line x1={d.hx1} y1={d.hy - 2.4} x2={d.hx1} y2={d.hy + 2.4} stroke={stroke} strokeWidth={sw} />
            <line x1={d.hx2} y1={d.hy - 2.4} x2={d.hx2} y2={d.hy + 2.4} stroke={stroke} strokeWidth={sw} />
            <line x1={d.hx1 + 0.5} y1={d.hy} x2={d.hx2 - 0.5} y2={d.hy} stroke={stroke} strokeWidth={sw} />
            <polygon points={`${d.hx1},${d.hy} ${d.hx1 + 2.6},${d.hy - 1.3} ${d.hx1 + 2.6},${d.hy + 1.3}`} fill={stroke} />
            <polygon points={`${d.hx2},${d.hy} ${d.hx2 - 2.6},${d.hy - 1.3} ${d.hx2 - 2.6},${d.hy + 1.3}`} fill={stroke} />

            <rect
              x={d.hlx - d.hPillW / 2}
              y={d.hy - 3.9}
              width={d.hPillW}
              height={7.8}
              rx={1.5}
              fill={PILL_FILL}
              stroke={stroke}
              strokeWidth={isActive ? 0.6 : 0.35}
            />
            <text
              x={d.hlx}
              y={d.hy + 0.2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={txtFill}
              style={{
                fontSize: '5.1px',
                fontWeight: '700',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                letterSpacing: '-0.02em',
                userSelect: 'none',
              }}
            >
              {d.hLabel}
            </text>

            {/* ── Vertical Width/Length Line + Extension Ticks + Arrowheads ── */}
            <line x1={d.vx - 2.4} y1={d.vy1} x2={d.vx + 2.4} y2={d.vy1} stroke={stroke} strokeWidth={sw} />
            <line x1={d.vx - 2.4} y1={d.vy2} x2={d.vx + 2.4} y2={d.vy2} stroke={stroke} strokeWidth={sw} />
            <line x1={d.vx} y1={d.vy1 + 0.5} x2={d.vx} y2={d.vy2 - 0.5} stroke={stroke} strokeWidth={sw} />
            <polygon points={`${d.vx},${d.vy1} ${d.vx - 1.3},${d.vy1 + 2.6} ${d.vx + 1.3},${d.vy1 + 2.6}`} fill={stroke} />
            <polygon points={`${d.vx},${d.vy2} ${d.vx - 1.3},${d.vy2 - 2.6} ${d.vx + 1.3},${d.vy2 - 2.6}`} fill={stroke} />

            <g transform={`translate(${d.vx}, ${d.vly}) rotate(-90)`}>
              <rect
                x={-d.vPillW / 2}
                y={-3.9}
                width={d.vPillW}
                height={7.8}
                rx={1.5}
                fill={PILL_FILL}
                stroke={stroke}
                strokeWidth={isActive ? 0.6 : 0.35}
              />
              <text
                x={0}
                y={0.2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={txtFill}
                style={{
                  fontSize: '5.1px',
                  fontWeight: '700',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  letterSpacing: '-0.02em',
                  userSelect: 'none',
                }}
              >
                {d.vLabel}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
});

export default DimensionOverlay;

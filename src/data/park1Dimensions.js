// src/data/park1Dimensions.js
import { plotCoordinates } from './plotcoordinates';

const FT_PER_M = 3.28084;

/**
 * Exact Park 1 (MIP 01) SVG bounding boxes (in viewBox="20 150 860 930")
 * paired with official Length (L) & Width (B) measurements from Area Schedule Tables 1 & 2
 * and site-plan boundary edge labels.
 *
 * `hM`: horizontal East-West dimension (meters)
 * `vM`: vertical North-South dimension (meters)
 */
const RAW_PARK1_DIMS = [
  // ── East Block A: Plots 1–13 (vertical dimensions aligned cleanly along straight W road) ──
  { id: '1',  x1: 651, y1: 831, x2: 726, y2: 874, hM: 30.36, vM: 17.68, hPos: 'top', vPos: 'left' },
  { id: '2',  x1: 651, y1: 788, x2: 750, y2: 831, hM: 35.13, vM: 14.00, vPos: 'left' },
  { id: '3',  x1: 651, y1: 746, x2: 746, y2: 788, hM: 34.04, vM: 14.00, vPos: 'left' },
  { id: '4',  x1: 651, y1: 703, x2: 743, y2: 746, hM: 32.60, vM: 14.00, vPos: 'left' },
  { id: '5',  x1: 651, y1: 660, x2: 739, y2: 703, hM: 31.00, vM: 14.00, vPos: 'left' },
  { id: '6',  x1: 651, y1: 618, x2: 736, y2: 660, hM: 29.96, vM: 14.00, vPos: 'left' },
  { id: '7',  x1: 651, y1: 575, x2: 737, y2: 618, hM: 30.21, vM: 14.00, vPos: 'left' },
  { id: '8',  x1: 651, y1: 533, x2: 741, y2: 575, hM: 31.87, vM: 14.00, vPos: 'left' },
  { id: '9',  x1: 651, y1: 491, x2: 739, y2: 533, hM: 30.93, vM: 14.00, vPos: 'left' },
  { id: '10', x1: 651, y1: 449, x2: 743, y2: 491, hM: 32.08, vM: 14.00, vPos: 'left' },
  { id: '11', x1: 651, y1: 408, x2: 749, y2: 449, hM: 34.39, vM: 14.00, vPos: 'left' },
  { id: '12', x1: 651, y1: 314, x2: 778, y2: 408, hM: 40.40, vM: 32.00, hPos: 'top', vPos: 'left' },
  { id: '13', x1: 725, y1: 158, x2: 805, y2: 279, hM: 30.50, vM: 42.42, hPos: 'top', vPos: 'right' },

  // ── Middle-North Block B: Plots 14–18 (Right) & 34–39 (Left) ────────────────
  { id: '14', x1: 515, y1: 295, x2: 618, y2: 344, hM: 34.50, vM: 20.80, hPos: 'bottom', vPos: 'left' },
  { id: '15', x1: 515, y1: 344, x2: 618, y2: 386, hM: 34.50, vM: 14.00, vPos: 'right' },
  { id: '16', x1: 515, y1: 386, x2: 618, y2: 428, hM: 34.50, vM: 14.00, vPos: 'right' },
  { id: '17', x1: 515, y1: 428, x2: 618, y2: 470, hM: 34.50, vM: 14.00, vPos: 'right' },
  { id: '18', x1: 515, y1: 470, x2: 618, y2: 512, hM: 34.50, vM: 14.00, vPos: 'right' },

  { id: '34', x1: 413, y1: 470, x2: 515, y2: 512, hM: 34.50, vM: 14.00, vPos: 'left' },
  { id: '35', x1: 413, y1: 428, x2: 515, y2: 470, hM: 34.50, vM: 14.00, vPos: 'left' },
  { id: '36', x1: 413, y1: 386, x2: 515, y2: 428, hM: 34.50, vM: 14.00, vPos: 'left' },
  { id: '37', x1: 413, y1: 344, x2: 515, y2: 386, hM: 34.50, vM: 14.00, vPos: 'left' },
  { id: '38', x1: 413, y1: 302, x2: 515, y2: 344, hM: 34.50, vM: 14.00, vPos: 'left' },
  { id: '39', x1: 413, y1: 256, x2: 515, y2: 302, hM: 34.50, vM: 14.00, hPos: 'bottom', vPos: 'left' },

  // ── Left-Top Block D: Plots 40–44, 59, 60 ──────────────────────────────────
  { id: '40', x1: 282, y1: 264, x2: 381, y2: 324, hM: 34.71, vM: 23.18, hPos: 'bottom', vPos: 'right' },
  { id: '41', x1: 267, y1: 324, x2: 381, y2: 366, hM: 39.00, vM: 14.00, hPos: 'bottom', vPos: 'right' },
  { id: '42', x1: 263, y1: 366, x2: 381, y2: 408, hM: 42.25, vM: 14.00, hPos: 'bottom', vPos: 'right' },
  { id: '43', x1: 266, y1: 408, x2: 381, y2: 460, hM: 39.00, vM: 17.45, vPos: 'right' },
  { id: '44', x1: 266, y1: 460, x2: 381, y2: 512, hM: 39.00, vM: 17.45, hPos: 'bottom', vPos: 'right' },
  { id: '59', x1: 216, y1: 408, x2: 266, y2: 512, hM: 16.90, vM: 34.90, hPos: 'bottom', vPos: 'right' },
  { id: '60', x1: 164, y1: 419, x2: 216, y2: 512, hM: 22.89, vM: 32.56, hPos: 'bottom', vPos: 'right' },

  // ── Central South Block C: Plots 19–33 ─────────────────────────────────────
  { id: '19', x1: 549, y1: 564, x2: 594, y2: 646, hM: 15.00, vM: 28.00 },
  { id: '20', x1: 503, y1: 564, x2: 549, y2: 646, hM: 15.00, vM: 28.00 },
  { id: '21', x1: 503, y1: 646, x2: 594, y2: 688, hM: 30.00, vM: 14.00 },
  { id: '22', x1: 503, y1: 688, x2: 594, y2: 730, hM: 30.00, vM: 14.00 },
  { id: '23', x1: 503, y1: 730, x2: 594, y2: 772, hM: 30.00, vM: 14.00 },
  { id: '24', x1: 503, y1: 772, x2: 594, y2: 814, hM: 30.00, vM: 14.00 },
  { id: '25', x1: 503, y1: 814, x2: 594, y2: 856, hM: 30.00, vM: 14.00 },

  { id: '26', x1: 413, y1: 856, x2: 503, y2: 914, hM: 29.82, vM: 22.02, hPos: 'top', vPos: 'right' },
  { id: '27', x1: 413, y1: 814, x2: 503, y2: 856, hM: 30.00, vM: 14.00 },
  { id: '28', x1: 413, y1: 772, x2: 503, y2: 814, hM: 30.00, vM: 14.00 },
  { id: '29', x1: 413, y1: 730, x2: 503, y2: 772, hM: 30.00, vM: 14.00 },
  { id: '30', x1: 413, y1: 688, x2: 503, y2: 730, hM: 30.00, vM: 14.00 },
  { id: '31', x1: 413, y1: 646, x2: 503, y2: 688, hM: 30.00, vM: 14.00 },
  { id: '32', x1: 458, y1: 564, x2: 503, y2: 646, hM: 15.00, vM: 28.00 },
  { id: '33', x1: 413, y1: 564, x2: 458, y2: 646, hM: 15.00, vM: 28.00 },

  // ── Mid-West South Block E: Plots 45–58 ────────────────────────────────────
  { id: '45', x1: 337, y1: 564, x2: 381, y2: 646, hM: 15.00, vM: 28.00 },
  { id: '46', x1: 293, y1: 564, x2: 337, y2: 646, hM: 15.00, vM: 28.00 },
  { id: '47', x1: 293, y1: 646, x2: 381, y2: 688, hM: 30.00, vM: 14.00 },
  { id: '48', x1: 293, y1: 688, x2: 381, y2: 730, hM: 30.00, vM: 14.00 },
  { id: '49', x1: 293, y1: 730, x2: 381, y2: 772, hM: 30.00, vM: 14.00 },
  { id: '50', x1: 293, y1: 772, x2: 381, y2: 814, hM: 30.00, vM: 14.00 },
  { id: '51', x1: 293, y1: 814, x2: 381, y2: 854, hM: 30.12, vM: 15.30, hPos: 'top', vPos: 'right' },

  { id: '52', x1: 222, y1: 819, x2: 293, y2: 862, hM: 26.86, vM: 15.60, hPos: 'top', vPos: 'right' },
  { id: '53', x1: 215, y1: 775, x2: 293, y2: 819, hM: 28.56, vM: 14.00, vPos: 'right' },
  { id: '54', x1: 210, y1: 732, x2: 293, y2: 775, hM: 29.34, vM: 14.00, vPos: 'right' },
  { id: '55', x1: 205, y1: 689, x2: 293, y2: 732, hM: 30.90, vM: 14.00, vPos: 'right' },
  { id: '56', x1: 200, y1: 646, x2: 293, y2: 689, hM: 32.45, vM: 14.00, vPos: 'right' },
  { id: '57', x1: 242, y1: 564, x2: 293, y2: 646, hM: 17.12, vM: 28.00 },
  { id: '58', x1: 191, y1: 564, x2: 242, y2: 646, hM: 17.12, vM: 28.00 },

  // ── Far-West South Block E: Plots 61–63 ────────────────────────────────────
  { id: '61', x1: 72,  y1: 564, x2: 157, y2: 638, hM: 40.02, vM: 25.80, hPos: 'bottom', vPos: 'right' },
  { id: '62', x1: 112, y1: 682, x2: 162, y2: 774, hM: 20.26, vM: 33.33, hPos: 'top', vPos: 'right' },
  { id: '63', x1: 120, y1: 776, x2: 172, y2: 862, hM: 20.26, vM: 32.43, hPos: 'bottom', vPos: 'right' },
];

export const PARK1_DIMENSIONS = RAW_PARK1_DIMS.map((d) => {
  const center = plotCoordinates[d.id]?.center || {
    x: (d.x1 + d.x2) / 2,
    y: (d.y1 + d.y2) / 2,
  };
  const hFt = +(d.hM * FT_PER_M).toFixed(1);
  const vFt = +(d.vM * FT_PER_M).toFixed(1);
  return {
    ...d,
    dotX: center.x,
    dotY: center.y,
    hFt,
    vFt,
    dimsFt: `${hFt} × ${vFt} ft`,
    dimsMt: `${d.hM} × ${d.vM} m`,
  };
});

export const PARK1_DIMENSIONS_BY_ID = Object.fromEntries(
  PARK1_DIMENSIONS.map((d) => [d.id, d])
);

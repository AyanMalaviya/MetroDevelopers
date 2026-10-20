// src/data/phaseCoordinates.js

/**
 * Phase definitions and coordinates for Metro Industrial Park Site Map.
 * 
 * You can easily customize or manually tweak coordinates below:
 * - `theme`: Custom fill, stroke, and badge colors for each phase.
 * - `rectCoordinates`: Exactly 4 corners [Top-Left, Top-Right, Bottom-Right, Bottom-Left].
 * - `polygonCoordinates`: Multi-point polygon capturing non-rectangular features
 *                         (e.g., shed 26 step-down, slanted northern roof, angled road).
 * - `points`: The active coordinates rendered on the SVG map. Defaults to polygonCoordinates,
 *             or you can swap it to rectCoordinates or your own manual points!
 * - `labelCenter`: Center coordinate { x, y } where the letter (A, B, C, D) is displayed.
 * - `sheds`: List of shed IDs belonging to this phase.
 */

export const phaseCoordinates = {
  // ── PHASE A ──────────────────────────────────────────────────────────────
  // Area covering sheds 19 to 33 (sheds 25, 26 to 33, 32, 20, 19)
  A: {
    id: 'A',
    name: 'Phase A',
    label: 'A',
    description: 'Sheds 19 to 33 (including 25, 26, 32, 33, 20, 19)',
    sheds: ['19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33'],

    // Translucent slate gray theme
    theme: {
      fill: 'rgba(100, 116, 139, 0.28)',
      stroke: 'rgba(71, 85, 105, 0.75)',
      badgeBg: 'rgba(30, 41, 59, 0.90)',
      badgeBorder: 'rgba(255, 255, 255, 0.95)',
      badgeText: '#FFFFFF',
      watermarkColor: '#64748B',
      tagClass: 'bg-slate-700 text-white',
    },

    // 4 Corner rectangle coordinates:
    // [Top-Left, Top-Right, Bottom-Right, Bottom-Left]
    rectCoordinates: [
      { x: 413, y: 565 }, // 1. Top-Left (shed 33 corner)
      { x: 597, y: 565 }, // 2. Top-Right (shed 19 corner)
      { x: 597, y: 862 }, // 3. Bottom-Right (shed 25 corner)
      { x: 413, y: 947 }, // 4. Bottom-Left (shed 26 corner)
    ],

    // Polygon coordinates (accounts for shed 26 extending southward below shed 25):
    polygonCoordinates: [
      { x: 413, y: 565 },
      { x: 594, y: 565 },
      { x: 594, y: 868 },
      { x: 505, y: 868 },
      { x: 505, y: 928 },
      { x: 413, y: 947 },
      { x: 400, y: 868 },
      { x: 410, y: 868 },
    ],

    // Active coordinates rendered on the map:
    points: [
      { x: 413, y: 565 },
      { x: 594, y: 565 },
      { x: 594, y: 868 },
      { x: 505, y: 868 },
      { x: 505, y: 928 },
      { x: 413, y: 947 },
      { x: 400, y: 868 },
      { x: 410, y: 868 }, 
    ],

    labelCenter: { x: 505, y: 710 },
  },

  // ── PHASE B ──────────────────────────────────────────────────────────────
  // Area covering sheds 1 to 11 along the eastern side
  B: {
    id: 'B',
    name: 'Phase B',
    label: 'B',
    description: 'Sheds 1 to 11',
    sheds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],

    // Translucent vibrant blue theme
    theme: {
      fill: 'rgba(59, 130, 246, 0.26)',
      stroke: 'rgba(37, 99, 235, 0.75)',
      badgeBg: 'rgba(29, 78, 216, 0.90)',
      badgeBorder: 'rgba(255, 255, 255, 0.95)',
      badgeText: '#FFFFFF',
      watermarkColor: '#3B82F6',
      tagClass: 'bg-blue-600 text-white',
    },

    // 4 Corner rectangle coordinates:
    // [Top-Left, Top-Right, Bottom-Right, Bottom-Left]
    rectCoordinates: [
      { x: 653, y: 410 }, // 1. Top-Left (shed 11 top-left)
      { x: 744, y: 410 }, // 2. Top-Right (shed 11 top-right)
      { x: 740, y: 883 }, // 3. Bottom-Right (shed 1 bottom-right)
      { x: 653, y: 883 }, // 4. Bottom-Left (shed 1 bottom-left)
    ],

    // Polygon coordinates (follows the slight eastern boundary curve):
    polygonCoordinates: [
      { x: 653, y: 410 }, // Top-Left (shed 11)
      { x: 744, y: 410 }, // Top-Right (shed 11)
      { x: 745, y: 520 }, // Eastern boundary mid-high
      { x: 740, y: 680 }, // Eastern boundary mid
      { x: 738, y: 805 }, // Eastern boundary mid-low
      { x: 715, y: 874 }, // Bottom-Right corner of shed 1
      { x: 653, y: 883 }, // Bottom-Left corner of shed 1
    ],

    // Active coordinates rendered on the map:
    points: [
      { x: 650, y: 410 },
      { x: 760, y: 410 },
      { x: 745, y: 520 },
      { x: 740, y: 600 },
      { x: 754, y: 810 },
      { x: 736, y: 882 },
      { x: 650, y: 900 },
    ],

    // Positioned at x: 700 in the road so it is not hidden behind shed #6 dot
    labelCenter: { x: 670, y: 645 },
  },

  // ── PHASE C ──────────────────────────────────────────────────────────────
  // Area covering sheds 18 to 39 (sheds 14-18 and 34-39)
  C: {
    id: 'C',
    name: 'Phase C',
    label: 'C',
    description: 'Sheds 18 to 39 (sheds 14 to 18 and 34 to 39)',
    sheds: ['14', '15', '16', '17', '18', '34', '35', '36', '37', '38', '39'],

    // Translucent rich purple / violet theme
    theme: {
      fill: 'rgba(168, 85, 247, 0.26)',
      stroke: 'rgba(147, 51, 234, 0.75)',
      badgeBg: 'rgba(109, 40, 217, 0.90)',
      badgeBorder: 'rgba(255, 255, 255, 0.95)',
      badgeText: '#FFFFFF',
      watermarkColor: '#A855F7',
      tagClass: 'bg-purple-600 text-white',
    },

    // 4 Corner rectangle coordinates (18 and 39 are opposite corners):
    // [Top-Left, Top-Right, Bottom-Right, Bottom-Left]
    rectCoordinates: [
      { x: 413, y: 237 }, // 1. Top-Left corner (shed 39)
      { x: 588, y: 237 }, // 2. Top-Right corner
      { x: 588, y: 512 }, // 3. Bottom-Right corner (shed 18)
      { x: 413, y: 512 }, // 4. Bottom-Left corner (shed 34)
    ],

    // Polygon coordinates (accounts for slanted northern road boundary above shed 39 and 14):
    polygonCoordinates: [
      { x: 413, y: 237 }, // Top-Left corner of shed 39
      { x: 507, y: 281 }, // Top divider between shed 39 & shed 14
      { x: 588, y: 276 }, // Top-Right corner of shed 14
      { x: 588, y: 512 }, // Bottom-Right corner of shed 18
      { x: 413, y: 512 }, // Bottom-Left corner of shed 34
    ],

    // Active coordinates rendered on the map:
    points: [
      { x: 413, y: 230 },
      { x: 570, y: 283 },
      { x: 620, y: 276 },
      { x: 620, y: 512 },
      { x: 413, y: 512 },
    ],

    labelCenter: { x: 520, y: 390 },
  },

  // ── PHASE D ──────────────────────────────────────────────────────────────
  // Area covering sheds 51 to 58 (sheds 45-51 and 52-58)
  D: {
    id: 'D',
    name: 'Phase D',
    label: 'D',
    description: 'Sheds 51 to 58 (sheds 45 to 51 and 52 to 58)',
    sheds: ['45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58'],

    // Translucent warm amber / orange theme
    theme: {
      fill: 'rgba(245, 158, 11, 0.26)',
      stroke: 'rgba(217, 119, 6, 0.75)',
      badgeBg: 'rgba(180, 83, 9, 0.90)',
      badgeBorder: 'rgba(255, 255, 255, 0.95)',
      badgeText: '#FFFFFF',
      watermarkColor: '#F59E0B',
      tagClass: 'bg-amber-600 text-white',
    },

    // 4 Corner rectangle coordinates (51 and 58 are opposite corners):
    // [Top-Left, Top-Right, Bottom-Right, Bottom-Left]
    rectCoordinates: [
      { x: 188, y: 565 }, // 1. Top-Left corner (shed 58)
      { x: 369, y: 565 }, // 2. Top-Right corner (shed 45)
      { x: 369, y: 868 }, // 3. Bottom-Right corner (shed 51)
      { x: 188, y: 868 }, // 4. Bottom-Left corner (shed 52)
    ],

    // Polygon coordinates (accounts for angled western road and stepped bottom between 51 & 52):
    polygonCoordinates: [
      { x: 188, y: 565 }, // Top-Left corner of shed 58
      { x: 369, y: 565 }, // Top-Right corner of shed 45
      { x: 369, y: 868 }, // Bottom-Right corner of shed 51
      { x: 285, y: 895 }, // Divider step between shed 51 & shed 52
      { x: 260, y: 870 }, // Bottom-Left corner of shed 52
      { x: 210, y: 870 }, // Bottom-Right corner of shed 52
      { x: 190, y: 640 }, // Angled road mid-point along western side
    ],

    // Active coordinates rendered on the map:
    points: [
      { x: 188, y: 565 },
      { x: 380, y: 565 },
      { x: 380, y: 868 },
      { x: 285, y: 895 },
      { x: 260, y: 870 },
      { x: 210, y: 870 },
      { x: 190, y: 640 },
    ],

    labelCenter: { x: 280, y: 710 },
  },
};

/**
 * Returns phase info for a given shed number (e.g. '22' -> phase A).
 */
export const getShedPhase = (shedNumber) => {
  const strId = String(shedNumber);
  for (const phase of Object.values(phaseCoordinates)) {
    if (phase.sheds.includes(strId)) {
      return phase;
    }
  }
  return null;
};

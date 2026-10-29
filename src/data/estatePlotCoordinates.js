// src/data/estatePlotCoordinates.js
import { estatePlotsSchedule, estateTotalStats } from './estatePlotsData';

const centerMap = {
  1: { x: 760, y: 190 },
  2: { x: 560, y: 170 },
  3: { x: 560, y: 240 },
  4: { x: 750, y: 260 },
  5: { x: 746, y: 320 },
  6: { x: 560, y: 306 },
  7: { x: 560, y: 370 },
  8: { x: 740, y: 380 },
  9: { x: 734, y: 460 },
  10: { x: 550, y: 470 },
  11: { x: 470, y: 450 },
  12: { x: 410, y: 440 },
  13: { x: 355, y: 435 },
  14: { x: 290, y: 430 },
  15: { x: 60, y: 550 },
  16: { x: 136, y: 552 },
  17: { x: 210, y: 554 },
  18: { x: 280, y: 556 },
  19: { x: 350, y: 560 },
  20: { x: 370, y: 650 },
  21: { x: 430, y: 720 },
  22: { x: 460, y: 650 },
  23: { x: 464, y: 580 },
};

export const estatePlotCoordinates = {};

estatePlotsSchedule.forEach((plot) => {
  estatePlotCoordinates[String(plot.plotNo)] = {
    name: `Plot ${plot.plotNo}`,
    area: `${plot.totalPlotAreaSqYd.toFixed(2)} YD`,
    section: plot.section,
    center: centerMap[plot.plotNo] || { x: 0, y: 0 },
    ...plot,
  };
});

export const getEstatePlotCenter = (plotNumber) => {
  return estatePlotCoordinates[plotNumber]?.center || { x: 0, y: 0 };
};

export const getEstatePlotsBySection = (section) => {
  return Object.entries(estatePlotCoordinates)
    .filter(([_, data]) => data.section === section)
    .map(([number, data]) => ({ number, ...data }));
};

export const estateSections = {
  A: { name: "Block A (Plots 1-8)",   color: "#3B82F6", plots: 8 },
  B: { name: "Block B (Plots 9-16)",  color: "#8B5CF6", plots: 8 },
  C: { name: "Block C (Plots 17-23)", color: "#10B981", plots: 7 }
};

export { estatePlotsSchedule, estateTotalStats };

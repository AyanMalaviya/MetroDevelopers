// src/data/park3PlotCoordinates.js
// Exact coordinates mapped to 1200x893 master layout site plan (ratio matching 5933x4417 drawing)
import { park3Plots } from './park3PlotsData';

const centerMap = {
  '1':  { x: 930, y: 630 },
  '2':  { x: 930, y: 530 },
  '3':  { x: 930, y: 470 },
  '4':  { x: 930, y: 420 },
  '5':  { x: 930, y: 315 },
  '6':  { x: 930, y: 246 },
  '7':  { x: 930, y: 180 },
  '8':  { x: 935, y: 100 },
  '9':  { x: 752, y: 118 },
  '10': { x: 752, y: 168 },
  '11': { x: 752, y: 220 },
  '12': { x: 752, y: 270 },
  '13': { x: 752, y: 320 },
  '14': { x: 752, y: 420 },
  '15': { x: 752, y: 470 },
  '16': { x: 752, y: 520 },
  '17': { x: 752, y: 570 },
  '18': { x: 752, y: 630 },
  '19': { x: 605, y: 636 },
  '20': { x: 605, y: 570 },
  '21': { x: 605, y: 520 },
  '22': { x: 605, y: 470 },
  '23': { x: 605, y: 420 },
  '24': { x: 630, y: 320 },
  '25': { x: 630, y: 280 },
  '26': { x: 630, y: 240 },
  '27': { x: 630, y: 200 },
  '28': { x: 630, y: 160 },
  '29': { x: 630, y: 117 },
  '30': { x: 575, y: 110 },
  '31': { x: 575, y: 160 },
  '32': { x: 575, y: 200 },
  '33': { x: 575, y: 240 },
  '34': { x: 575, y: 280 },
  '35': { x: 575, y: 320 },
  '36': { x: 490, y: 320 },
  '37': { x: 490, y: 280 },
  '38': { x: 490, y: 240 },
  '39': { x: 490, y: 200 },
  '40': { x: 490, y: 160 },
  '41': { x: 490, y: 110 },
  '42': { x: 436, y: 106 },
  '43': { x: 436, y: 160 },
  '44': { x: 436, y: 200 },
  '45': { x: 436, y: 240 },
  '46': { x: 436, y: 280 },
  '47': { x: 436, y: 320 },
  '48': { x: 462, y: 418 },
  '49': { x: 462, y: 468 },
  '50': { x: 462, y: 520 },
  '51': { x: 462, y: 570 },
  '52': { x: 462, y: 640 },
  '53': { x: 316, y: 706 },
  '54': { x: 316, y: 620 },
  '55': { x: 315, y: 570 },
  '56': { x: 314, y: 520 },
  '57': { x: 312, y: 470 },
  '58': { x: 311, y: 416 },
  '59': { x: 340, y: 330 },
  '60': { x: 340, y: 280 },
  '61': { x: 340, y: 240 },
  '62': { x: 340, y: 200 },
  '63': { x: 340, y: 156 },
  '64': { x: 340, y: 116 },
  '65': { x: 340, y: 76 },
  '66': { x: 272, y: 70 },
  '67': { x: 272, y: 116 },
  '68': { x: 272, y: 156 },
  '69': { x: 272, y: 200 },
  '70': { x: 272, y: 240 },
  '71': { x: 272, y: 280 },
  '72': { x: 272, y: 320 },
  '73': { x: 130, y: 360 },
  '74': { x: 131, y: 290 },
  '75': { x: 131, y: 230 },
  '76': { x: 132, y: 170 },
  '77': { x: 133, y: 110 },
};

export const park3PlotCoordinates = {};

park3Plots.forEach((plot) => {
  const pid = String(plot.id);
  park3PlotCoordinates[pid] = {
    ...plot,
    name: `Plot ${pid}`,
    center: centerMap[pid] || { x: 0, y: 0 },
    carpet_sqmt: plot.carpetSqmt,
    total_sqmt: plot.totalSqmt,
    super_pct: plot.superPct,
  };
});

export const getPark3PlotCenter = (plotNumber) => {
  return park3PlotCoordinates[String(plotNumber)]?.center || { x: 0, y: 0 };
};

export const getPark3PlotsBySection = (section) => {
  return Object.entries(park3PlotCoordinates)
    .filter(([_, data]) => data.section === section)
    .map(([number, data]) => ({ number, ...data }));
};

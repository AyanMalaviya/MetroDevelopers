

export const estatePlotCoordinates = {
  "1": { name: "Plot 1", area: "1472.29 YD", section: "A", center: { x: 760, y: 190 } },
  "2": { name: "Plot 2", area: "1930.90 YD", section: "A", center: { x: 560, y: 170 } },
  "3": { name: "Plot 3", area: "704.57 YD",  section: "A", center: { x: 560, y: 240 } },
  "4": { name: "Plot 4", area: "650.64 YD",  section: "A", center: { x: 750, y: 260 } },
  "5": { name: "Plot 5", area: "627.31 YD",  section: "A", center: { x: 746, y: 320 } },
  "6": { name: "Plot 6", area: "656.55 YD",  section: "A", center: { x: 560, y: 306 } },
  "7": { name: "Plot 7", area: "609.50 YD",  section: "A", center: { x: 560, y: 370 } },
  "8": { name: "Plot 8", area: "631.20 YD",  section: "A", center: { x: 740, y: 380 } },

  "9":  { name: "Plot 9",  area: "1425.00 YD", section: "B", center: { x: 734, y: 460 } },
  "10": { name: "Plot 10", area: "1137.83 YD", section: "B", center: { x: 550, y: 470 } },
  "11": { name: "Plot 11", area: "600.35 YD",  section: "B", center: { x: 470, y: 450 } },
  "12": { name: "Plot 12", area: "498.28 YD",  section: "B", center: { x: 410, y: 440 } },
  "13": { name: "Plot 13", area: "495.81 YD",  section: "B", center: { x: 355, y: 435 } },
  "14": { name: "Plot 14", area: "582.88 YD",  section: "B", center: { x: 290, y: 430 } },
  "15": { name: "Plot 15", area: "646.97 YD",  section: "B", center: { x: 60, y: 550 } },
  "16": { name: "Plot 16", area: "639.34 YD",  section: "B", center: { x: 136, y: 552 } },

  "17": { name: "Plot 17", area: "624.28 YD",  section: "C", center: { x: 210, y: 554 } },
  "18": { name: "Plot 18", area: "608.94 YD",  section: "C", center: { x: 280, y: 556 } },
  "19": { name: "Plot 19", area: "621.51 YD",  section: "C", center: { x: 350, y: 560 } },
  "20": { name: "Plot 20", area: "312.16 YD",  section: "C", center: { x: 370, y: 650 } },
  "21": { name: "Plot 21", area: "1155.96 YD", section: "C", center: { x: 430, y: 720 } },
  "22": { name: "Plot 22", area: "461.15 YD",  section: "C", center: { x: 460, y: 650 } },
  "23": { name: "Plot 23", area: "451.94 YD",  section: "C", center: { x: 464, y: 580 } }
};

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
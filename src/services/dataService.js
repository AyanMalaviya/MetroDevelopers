// src/services/dataService.js
// Google Sheets as Database - 4 Status Types

// REPLACE THIS with your published Google Sheet CSV URL
// Get it by: File > Share > Publish to web > Select sheet > CSV format
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlkFBTES7Dt-Qe6ocFozJNhckRwVPHfFE4g0rv4EuFyDsoN6zk3NUwqa8sVVA2s4GhXADDYnCOiSKm/pub?gid=0&single=true&output=csv';

import Papa from 'papaparse';

export const getPlotData = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        try {
          const plotData = {};

          results.data.forEach(row => {
            // Skip empty rows
            if (!row.id || !row.id.trim()) return;

            const id = row.id.trim();
            const status = (row.status || 'available').toLowerCase().trim();
            const area = (row.area || 'N/A').trim();

            // Validate status - must be one of 4 types
            const validStatuses = ['available', 'pre-leased', 'for-lease', 'sold'];
            const finalStatus = validStatuses.includes(status) ? status : 'available';

            plotData[id] = {
              status: finalStatus,
              area: area
            };
          });

          resolve(plotData);
        } catch (error) {
          console.error('Error parsing sheet data:', error);
          resolve({});
        }
      },
      error: (error) => {
        console.error('Error fetching Google Sheet:', error);
        reject(error);
      }
    });
  });
};

/**
 * Parse area string to square yards number
 * Examples: "12.55 YD" -> 12.55, "LARGE" -> null
 * Also supports legacy "112.92 FT" format (converts to yards)
 */
export const parseAreaToSqYd = (areaString) => {
  if (!areaString || areaString === 'LARGE' || areaString === 'N/A') {
    return null;
  }

  const match = areaString.match(/([0-9.]+)\s*(YD|FT)?/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2] ? match[2].toUpperCase() : 'YD';

  // If unit is FT (legacy), convert to yards
  if (unit === 'FT') {
    return value / 9;
  }

  // Otherwise assume square yards
  return value;
};

/**
 * Get total area for multiple plots
 * Input: "1,3,13,29" or "1 3 13 29" or ["1", "3", "13", "29"]
 * Returns: { totalSqYd: number, totalSqFt: number, plotCount: number, plots: [...] }
 */
export const calculateMultiplePlotArea = async (plotInput) => {
  const plotData = await getPlotData();

  // Parse plot input string
  let plotIds = [];

  if (Array.isArray(plotInput)) {
    plotIds = plotInput;
  } else if (typeof plotInput === 'string') {
    // Handle formats: "p1p3p13" or "1,3,13" or "1 3 13"
    const cleaned = plotInput.toLowerCase().replace(/p/g, ' ').trim();
    const parts = cleaned.split(/[,\s]+/);
    plotIds = parts.filter(id => id && /^\d+$/.test(id));
  }

  // Calculate total area
  let totalSqYd = 0;
  const validPlots = [];
  const invalidPlots = [];

  plotIds.forEach(id => {
    const plot = plotData[id];
    if (plot && plot.area) {
      const sqYd = parseAreaToSqYd(plot.area);
      if (sqYd !== null) {
        totalSqYd += sqYd;
        validPlots.push({
          id,
          area: plot.area,
          sqYd,
          sqFt: Math.round(sqYd * 9 * 100) / 100,
          status: plot.status
        });
      } else {
        invalidPlots.push({ id, reason: 'LARGE or unmeasured plot' });
      }
    } else {
      invalidPlots.push({ id, reason: 'Plot not found' });
    }
  });

  return {
    totalSqYd: Math.round(totalSqYd * 100) / 100,
    totalSqFt: Math.round((totalSqYd * 9) * 100) / 100,
    plotCount: validPlots.length,
    validPlots,
    invalidPlots
  };
};
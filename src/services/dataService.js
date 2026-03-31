// src/services/dataService.js
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlkFBTES7Dt-Qe6ocFozJNhckRwVPHfFE4g0rv4EuFyDsoN6zk3NUwqa8sVVA2s4GhXADDYnCOiSKm/pub?gid=0&single=true&output=csv';

import Papa from 'papaparse';

export const getPlotData = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      transformHeader: (h) => h.trim().toLowerCase(), // normalises Owner → owner, etc.
      complete: (results) => {
        try {
          const plotData = {};

          results.data.forEach(row => {
            if (!row.id || !row.id.trim()) return;

            const id          = row.id.trim();
            const status      = (row.status || 'available').toLowerCase().trim();
            const area        = (row.area   || 'N/A').trim();
            const owner       = (row.owner  || '').trim();
            const lessee      = (row.lessee || '').trim();
            // accept both "monthlyrent" and "monthly_rent" header spellings
            const monthlyRent = (row.monthlyrent || row.monthly_rent || '').trim();

            const validStatuses = ['available', 'pre-leased', 'for-lease', 'sold'];
            const finalStatus   = validStatuses.includes(status) ? status : 'available';

            plotData[id] = {
              status: finalStatus,
              area,
              ...(owner       && { owner }),
              ...(lessee      && { lessee }),
              ...(monthlyRent && { monthlyRent }),
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

export const parseAreaToSqYd = (areaString) => {
  if (!areaString || areaString === 'LARGE' || areaString === 'N/A') return null;
  const match = areaString.match(/([0-9.]+)\s*(YD|FT)?/i);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const unit  = match[2] ? match[2].toUpperCase() : 'YD';
  return unit === 'FT' ? value / 9 : value;
};

export const calculateMultiplePlotArea = async (plotInput) => {
  const plotData = await getPlotData();

  let plotIds = [];
  if (Array.isArray(plotInput)) {
    plotIds = plotInput;
  } else if (typeof plotInput === 'string') {
    const cleaned = plotInput.toLowerCase().replace(/p/g, ' ').trim();
    plotIds = cleaned.split(/[,\s]+/).filter(id => id && /^\d+$/.test(id));
  }

  let totalSqYd = 0;
  const validPlots   = [];
  const invalidPlots = [];

  plotIds.forEach(id => {
    const plot = plotData[id];
    if (plot?.area) {
      const sqYd = parseAreaToSqYd(plot.area);
      if (sqYd !== null) {
        totalSqYd += sqYd;
        validPlots.push({
          id, area: plot.area, sqYd,
          sqFt:        Math.round(sqYd * 9 * 100) / 100,
          status:      plot.status,
          owner:       plot.owner       || null,
          lessee:      plot.lessee      || null,
          monthlyRent: plot.monthlyRent || null,
        });
      } else {
        invalidPlots.push({ id, reason: 'LARGE or unmeasured plot' });
      }
    } else {
      invalidPlots.push({ id, reason: 'Plot not found' });
    }
  });

  return {
    totalSqYd:   Math.round(totalSqYd * 100) / 100,
    totalSqFt:   Math.round(totalSqYd * 9 * 100) / 100,
    plotCount:   validPlots.length,
    validPlots,
    invalidPlots,
  };
};
// src/services/park3DataService.js
import Papa from 'papaparse';
import { park3Plots, getPark3PlotMap } from '../data/park3PlotsData';

// Replace with published Google Sheet CSV URL when ready:
// e.g. File -> Share -> Publish to web -> Link -> CSV
export const PARK3_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbpDHOEarWSXt8ip3w8XjlJIZ1PMG1IEqP8zPb8gXjNcYXFZQu0KwX_5w5ONIXYrBv77WeP1vCK6bi/pub?output=csv';

export const getPark3PlotData = () => {
  return new Promise((resolve) => {
    if (!PARK3_SHEET_URL) {
      // Fallback to static 77 plots dataset from schedule table
      resolve(getPark3PlotMap());
      return;
    }

    Papa.parse(PARK3_SHEET_URL, {
      download: true,
      header: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (results) => {
        try {
          const plotData = {};

          results.data.forEach((row) => {
            if (!row.id || !row.id.trim()) return;

            const id = row.id.trim();
            const status = (row.status || 'available').toLowerCase().trim();
            const area = (row.area || 'N/A').trim();
            const owner = (row.owner || '').trim();
            const lessee = (row.lessee || '').trim();
            const monthlyRent = (row.monthlyrent || row.monthly_rent || '').trim();

            const validStatuses = ['available', 'pre-leased', 'for-lease', 'sold', 'booked'];
            const finalStatus = validStatuses.includes(status) ? status : 'available';

            plotData[id] = {
              status: finalStatus,
              area,
              ...(owner && { owner }),
              ...(lessee && { lessee }),
              ...(monthlyRent && { monthlyRent }),
            };
          });

          resolve(plotData);
        } catch (error) {
          console.error('Error parsing Park 3 sheet data, falling back to static:', error);
          resolve(getPark3PlotMap());
        }
      },
      error: (error) => {
        console.error('Error fetching Park 3 Google Sheet, falling back to static:', error);
        resolve(getPark3PlotMap());
      },
    });
  });
};


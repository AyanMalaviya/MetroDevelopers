import Papa from 'papaparse';

const ESTATE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMFIwhTgrZBQuo-TLTJ8fL2Td39uPSsd0LWWbQmjbCRyWn9zuz_mOY45Y32NmKCV18nCnmOcfsom2M/pub?gid=0&single=true&output=csv';

export const getEstatePlotData = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(ESTATE_SHEET_URL, {
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

            const validStatuses = ['available', 'pre-leased', 'for-lease', 'sold'];
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
          console.error('Error parsing Estate sheet data:', error);
          resolve({});
        }
      },
      error: (error) => {
        console.error('Error fetching Estate Google Sheet:', error);
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
  const unit = match[2] ? match[2].toUpperCase() : 'YD';
  return unit === 'FT' ? value / 9 : value;
};
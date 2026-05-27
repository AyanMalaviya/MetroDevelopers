// src/services/changelogService.js
// Fetches the "Changelog" sheet tab (gid must match your sheet tab's gid)
// Sheet columns expected: date | plotid | action | note | changedby
// Publish the Changelog tab separately: File → Share → Publish to web → CSV
// Then replace CHANGELOG_SHEET_URL below with that URL.

import Papa from 'papaparse';

// TODO: Replace this URL with the published CSV URL of your "Changelog" sheet tab
// Steps: In Google Sheets → File → Share → Publish to web
//        Select the "Changelog" sheet tab → CSV → Copy the link
export const CHANGELOG_SHEET_URL =
  'PASTE_YOUR_CHANGELOG_SHEET_CSV_URL_HERE';

/**
 * Fetches and parses the changelog sheet.
 * @returns {Promise<Array<{date: string, plotId: string, action: string, note: string, changedBy: string}>>}
 */
export const getChangelog = () => {
  return new Promise((resolve, reject) => {
    if (!CHANGELOG_SHEET_URL || CHANGELOG_SHEET_URL.startsWith('PASTE')) {
      // Return empty array gracefully if URL not yet configured
      resolve([]);
      return;
    }

    Papa.parse(CHANGELOG_SHEET_URL, {
      download: true,
      header: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, ''),
      complete: (results) => {
        try {
          const logs = results.data
            .filter((row) => row.date && row.date.trim())
            .map((row) => ({
              date:      (row.date      || '').trim(),
              plotId:    (row.plotid    || row['plot id'] || '').trim(),
              action:    (row.action   || '').trim(),
              note:      (row.note     || row.notes || '').trim(),
              changedBy: (row.changedby || row['changed by'] || 'Admin').trim(),
            }))
            // Sort newest first
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          resolve(logs);
        } catch (err) {
          console.error('Changelog parse error:', err);
          resolve([]);
        }
      },
      error: (err) => {
        console.error('Changelog fetch error:', err);
        reject(err);
      },
    });
  });
};

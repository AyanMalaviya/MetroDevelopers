// src/services/changelogService.js
// Fetches auto-detected status changes from our /api/changelog serverless proxy.
// No manual sheet needed — driven by Apps Script version history diff.

export const getChangelog = async () => {
  const res = await fetch('/api/changelog');
  if (!res.ok) throw new Error(`Changelog fetch failed: ${res.status}`);
  const { logs } = await res.json();
  return Array.isArray(logs) ? logs : [];
};

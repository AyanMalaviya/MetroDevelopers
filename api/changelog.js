// api/changelog.js
// Proxies the Google Apps Script Web App that reads version history.
// Env var needed: CHANGELOG_SCRIPT_URL
// The script returns JSON: [{date, id, previousStatus, newStatus}]

const getEnv = (name, fallback = '') => process.env[name] || fallback;

const toJson = (res, statusCode, payload) => {
  res.status(statusCode);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    toJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const scriptUrl = getEnv('CHANGELOG_SCRIPT_URL');

  if (!scriptUrl) {
    toJson(res, 503, { error: 'Changelog not configured.', logs: [] });
    return;
  }

  try {
    const upstream = await fetch(scriptUrl, {
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      throw new Error(text || `Upstream error ${upstream.status}`);
    }

    const logs = await upstream.json();
    toJson(res, 200, { logs });
  } catch (err) {
    toJson(res, 500, { error: err.message || 'Failed to fetch changelog.', logs: [] });
  }
}

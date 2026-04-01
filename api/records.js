import crypto from 'crypto';
import Papa from 'papaparse';

const COOKIE_NAME = 'metro_records_session';
const DEFAULT_TTL_HOURS = 8;

const getEnv = (name, fallback = '') => process.env[name] || fallback;

const normalizeKey = (value = '') => String(value)
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_');

const toJson = (res, statusCode, payload, headers = {}) => {
  res.status(statusCode);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  res.end(JSON.stringify(payload));
};

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const encodeBase64Url = (value) => Buffer.from(value).toString('base64url');
const decodeBase64Url = (value) => Buffer.from(value, 'base64url').toString('utf8');

const signPayload = (payload, secret) => crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('base64url');

const createSessionToken = (secret, ttlHours = DEFAULT_TTL_HOURS) => {
  const payload = JSON.stringify({
    exp: Date.now() + (ttlHours * 60 * 60 * 1000),
    scope: 'records',
  });

  const encodedPayload = encodeBase64Url(payload);
  const signature = signPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
};

const verifySessionToken = (token, secret) => {
  if (!token || !secret) return false;

  const [encodedPayload, signature] = String(token).split('.');

  if (!encodedPayload || !signature) return false;

  const expectedSignature = signPayload(encodedPayload, secret);

  if (!safeEqual(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload));
    if (payload.scope !== 'records') return false;
    if (!payload.exp || Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
};

const parseCookies = (cookieHeader = '') => Object.fromEntries(
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((pair) => {
      const separatorIndex = pair.indexOf('=');
      if (separatorIndex === -1) return [pair, ''];
      return [pair.slice(0, separatorIndex), decodeURIComponent(pair.slice(separatorIndex + 1))];
    })
);

const getAuthToken = (req) => parseCookies(req.headers.cookie || '')[COOKIE_NAME] || '';

const isAuthorized = (req) => verifySessionToken(getAuthToken(req), getEnv('RECORDS_SESSION_SECRET'));

const setAuthCookie = (res, token, ttlHours = DEFAULT_TTL_HOURS) => {
  const cookiePieces = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${Math.max(1, Math.round(ttlHours * 60 * 60))}`,
  ];

  if ((process.env.VERCEL_ENV || process.env.NODE_ENV) === 'production') {
    cookiePieces.push('Secure');
  }

  res.setHeader('Set-Cookie', cookiePieces.join('; '));
};

const clearAuthCookie = (res) => {
  const cookiePieces = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
  ];

  if ((process.env.VERCEL_ENV || process.env.NODE_ENV) === 'production') {
    cookiePieces.push('Secure');
  }

  res.setHeader('Set-Cookie', cookiePieces.join('; '));
};

const readBody = async (req) => {
  const body = req.body;

  if (body && typeof body === 'object') {
    return body;
  }

  if (typeof body === 'string' && body.trim()) {
    try {
      return JSON.parse(body);
    } catch {
      const params = new URLSearchParams(body);
      return Object.fromEntries(params.entries());
    }
  }

  return {};
};

const pickValue = (row, keys) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
      return String(row[key]).trim();
    }
  }

  return '';
};

const resolveCsvUrl = (csvUrl, req) => {
  if (!csvUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(csvUrl)) {
    return csvUrl;
  }

  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  const protocol = forwardedProto || (req.socket?.encrypted ? 'https' : 'http') || 'https';

  if (!host) {
    return csvUrl;
  }

  if (csvUrl.startsWith('/')) {
    return `${protocol}://${host}${csvUrl}`;
  }

  return `${protocol}://${host}/${csvUrl}`;
};

const normalizeRecordRow = (row) => {
  const normalized = {
    recordId: pickValue(row, ['record_id', 'recordid', 'id']),
    submittedAt: pickValue(row, ['submitted_at', 'submittedat', 'timestamp', 'created_at']),
    role: pickValue(row, ['role', 'record_type', 'recordtype']) || 'Owner',
    fullName: pickValue(row, ['full_name', 'fullname', 'name', 'owner_name', 'lessee_name']),
    phone: pickValue(row, ['phone', 'mobile', 'contact_number', 'contactnumber']),
    email: pickValue(row, ['email', 'mail', 'email_address']),
    companyName: pickValue(row, ['company_name', 'companyname', 'company', 'organization']),
    shedNumbers: pickValue(row, ['shed_numbers', 'shednumbers', 'shed_number', 'unit_numbers', 'unitnumbers', 'plot_numbers', 'plotnumbers']),
    dealType: pickValue(row, ['deal_type', 'dealetype', 'dealtype']) || 'Bought',
    agreementStatus: pickValue(row, ['agreement_status', 'agreementstatus', 'status']) || 'Active',
    notes: pickValue(row, ['notes', 'note', 'remarks', 'remark']),
  };

  if (!normalized.fullName && !normalized.phone && !normalized.email && !normalized.shedNumbers) {
    return null;
  }

  return normalized;
};

const loadSheetRecords = async (req) => {
  const csvUrl = resolveCsvUrl(getEnv('RECORDS_SHEET_CSV_URL'), req);

  if (!csvUrl) {
    return [];
  }

  const response = await fetch(csvUrl);

  if (!response.ok) {
    throw new Error('Unable to read the connected Google Sheet.');
  }

  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeKey,
  });

  const records = (parsed.data || [])
    .map(normalizeRecordRow)
    .filter(Boolean)
    .sort((left, right) => {
      const leftTime = new Date(left.submittedAt || 0).getTime();
      const rightTime = new Date(right.submittedAt || 0).getTime();
      return rightTime - leftTime;
    });

  return records;
};

const canAppendToSheet = () => Boolean(getEnv('RECORDS_WEBHOOK_URL'));

const appendToWebhook = async (record) => {
  const webhookUrl = getEnv('RECORDS_WEBHOOK_URL');

  if (!webhookUrl) {
    throw new Error('Google Sheets webhook is not configured.');
  }

  const payload = new URLSearchParams({
    action: 'appendRecord',
    recordId: record.recordId,
    submittedAt: record.submittedAt,
    role: record.role,
    fullName: record.fullName,
    phone: record.phone,
    email: record.email,
    companyName: record.companyName,
    shedNumbers: record.shedNumbers,
    dealType: record.dealType,
    agreementStatus: record.agreementStatus,
    notes: record.notes,
  });

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: payload.toString(),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || 'Unable to forward the record to Google Sheets.');
  }

  return true;
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  if (req.method === 'GET') {
    if (req.query?.action === 'session') {
      if (isAuthorized(req)) {
        toJson(res, 200, { authenticated: true, canAppend: canAppendToSheet() });
        return;
      }

      toJson(res, 401, { authenticated: false, error: 'Unauthorized' });
      return;
    }

    if (!isAuthorized(req)) {
      toJson(res, 401, { error: 'Unauthorized' });
      return;
    }

    try {
      const records = await loadSheetRecords(req);
      toJson(res, 200, { authenticated: true, canAppend: canAppendToSheet(), records });
    } catch (error) {
      toJson(res, 500, {
        authenticated: true,
        canAppend: canAppendToSheet(),
        error: error.message || 'Unable to load records.',
      });
    }
    return;
  }

  if (req.method === 'POST') {
    const body = await readBody(req);
    const action = String(body.action || '').toLowerCase();

    if (action === 'unlock') {
      const code = String(body.code || '').trim();
      const unlockCode = getEnv('RECORDS_UNLOCK_CODE');
      const sessionSecret = getEnv('RECORDS_SESSION_SECRET');

      if (!code) {
        toJson(res, 400, { error: 'An access code is required.' });
        return;
      }

      if (!unlockCode) {
        toJson(res, 500, { error: 'Unlock code is not configured.' });
        return;
      }

      if (!sessionSecret) {
        toJson(res, 500, { error: 'Records session secret is not configured.' });
        return;
      }

      if (!safeEqual(code, unlockCode)) {
        toJson(res, 401, { error: 'Invalid access code.' });
        return;
      }

      const ttlHours = Number(getEnv('RECORDS_SESSION_TTL_HOURS', String(DEFAULT_TTL_HOURS))) || DEFAULT_TTL_HOURS;
      const token = createSessionToken(sessionSecret, ttlHours);
      setAuthCookie(res, token, ttlHours);

      toJson(res, 200, { authenticated: true, expiresInHours: ttlHours });
      return;
    }

    if (action === 'logout') {
      clearAuthCookie(res);
      toJson(res, 200, { authenticated: false });
      return;
    }

    if (action === 'append') {
      if (!isAuthorized(req)) {
        toJson(res, 401, { error: 'Unauthorized' });
        return;
      }

      const incoming = body.record && typeof body.record === 'object' ? body.record : body;
      const record = {
        recordId: incoming.recordId || `REC-${Date.now()}`,
        submittedAt: incoming.submittedAt || new Date().toISOString(),
        role: String(incoming.role || 'Owner').trim(),
        fullName: String(incoming.fullName || '').trim(),
        phone: String(incoming.phone || '').trim(),
        email: String(incoming.email || '').trim(),
        companyName: String(incoming.companyName || '').trim(),
        shedNumbers: String(incoming.shedNumbers || '').trim(),
        dealType: String(incoming.dealType || 'Bought').trim(),
        agreementStatus: String(incoming.agreementStatus || 'Active').trim(),
        notes: String(incoming.notes || '').trim(),
      };

      if (!record.fullName) {
        toJson(res, 400, { error: 'Full name is required.' });
        return;
      }

      try {
        await appendToWebhook(record);
        toJson(res, 200, {
          ok: true,
          record,
        });
      } catch (error) {
        toJson(res, 500, {
          error: error.message || 'Unable to append record to Google Sheets.',
        });
      }
      return;
    }

    toJson(res, 400, { error: 'Unsupported action.' });
    return;
  }

  toJson(res, 405, { error: 'Method not allowed.' });
}

const API_PATH = '/api/records';

const parseJsonResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'Request failed');
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

const withSlug = (path, slug) => {
  if (!slug) return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}slug=${encodeURIComponent(slug)}`;
};

export const getRecordsSession = (slug) => requestJson(withSlug(`${API_PATH}?action=session`, slug));

export const fetchRecords = (slug) => requestJson(withSlug(API_PATH, slug));

export const unlockRecords = (code) => requestJson(API_PATH, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'unlock',
    code,
  }),
});

export const logoutRecords = () => requestJson(API_PATH, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'logout',
  }),
});

export const submitRecord = (record, slug) => requestJson(withSlug(API_PATH, slug), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'append',
    record,
  }),
});

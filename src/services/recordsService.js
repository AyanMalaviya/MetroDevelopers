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

export const getRecordsSession = () => requestJson(`${API_PATH}?action=session`);

export const fetchRecords = () => requestJson(API_PATH);

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

export const submitRecord = (record) => requestJson(API_PATH, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'append',
    record,
  }),
});

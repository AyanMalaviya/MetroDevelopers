
export const getChangelog = async () => {
  const res = await fetch('/api/changelog');
  if (!res.ok) throw new Error(`Changelog fetch failed: ${res.status}`);
  const { logs } = await res.json();
  return Array.isArray(logs) ? logs : [];
};

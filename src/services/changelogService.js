
const SCRIPT_URL = import.meta.env.VITE_CHANGELOG_SCRIPT_URL || import.meta.env.CHANGELOG_SCRIPT_URL;

export const getChangelog = async () => {
  try {
    // 1. Catch missing variables immediately
    if (!SCRIPT_URL) {
      throw new Error("Missing API URL. Please ensure VITE_CHANGELOG_SCRIPT_URL is set in your .env file or Vercel dashboard.");
    }

    // 2. Fetch the data
    const response = await fetch(SCRIPT_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // 3. Prevent HTML/Text fallback crashes
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON but got HTML/Text starting with: ${text.slice(0, 30)}... Please verify your Google Apps Script Web App URL.`);
    }

    // 4. Return the clean JSON
    return await response.json();
    
  } catch (error) {
    console.error("Changelog Fetch Error:", error);
    throw error;
  }
};
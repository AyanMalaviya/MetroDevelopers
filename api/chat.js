// api/chat.js — Vercel serverless function
// Model: gemini-1.5-flash

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlkFBTES7Dt-Qe6ocFozJNhckRwVPHfFE4g0rv4EuFyDsoN6zk3NUwqa8sVVA2s4GhXADDYnCOiSKm/pub?gid=0&single=true&output=csv';

// Fetch & parse the Google Sheet into a compact text block
async function fetchSheetContext() {
  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) return null;
    const csv = await res.text();

    const lines = csv.trim().split('\n');
    if (lines.length < 2) return null;

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
    const idIdx     = headers.indexOf('id');
    const statusIdx = headers.indexOf('status');
    const areaIdx   = headers.indexOf('area');
    const ownerIdx  = headers.indexOf('owner');
    const lesseeIdx = headers.indexOf('lessee');
    const rentIdx   = Math.max(headers.indexOf('monthlyrent'), headers.indexOf('monthly_rent'));

    if (idIdx === -1) return null;

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].match(/(?:"([^"]*)"|([^,]*))/g)
        ?.map((c) => c.replace(/^"|"$/g, '').trim()) || [];

      const id = cols[idIdx];
      if (!id) continue;

      const status = (cols[statusIdx] || 'available').toLowerCase();
      const area   = cols[areaIdx]   || 'N/A';
      const owner  = ownerIdx  >= 0 ? (cols[ownerIdx]  || '') : '';
      const lessee = lesseeIdx >= 0 ? (cols[lesseeIdx] || '') : '';
      const rent   = rentIdx   >= 0 ? (cols[rentIdx]   || '') : '';

      let row = `Plot ${id}: ${status}, ${area}`;
      if (owner)  row += `, owner: ${owner}`;
      if (lessee) row += `, lessee: ${lessee}`;
      if (rent)   row += `, rent: ₹${rent}`;
      rows.push(row);
    }

    return rows.length > 0 ? rows.join('\n') : null;
  } catch {
    return null;
  }
}

function buildSystemPrompt(sheetData) {
  const sheetSection = sheetData
    ? `== LIVE SHED DATA (fetched now from Google Sheets) ==
Statuses: available | for-lease | pre-leased | sold
${sheetData}

`
    : `== SHED DATA ==
Live data unavailable right now. For plot availability, direct user to WhatsApp +91 98242 35642.

`;

  return `You are Metro AI, the assistant for Metro Industrial Park by Metro Developers.
Website: https://www.metrodevelopers.co.in

== KEY FACTS ==
- Address: Opp. Suvas Ind Estate, b/h Siya Logistics Park, Moraiya, Ahmedabad – 382213
- 30,000+ sq yards | 43+ units | 6+ years experience | 63 sheds total
- Location: Near NH 47 Sarkhej-Bavla Highway, close to GIDC, Ahmedabad city & airport
- Features: 30–35 ft ceiling, 60 ft RCC roads, 24/7 CCTV, 24/7 water supply, underground drainage
- Returns: 16–20% total yield (6–8% rental + 10–12% appreciation), 5–10 yr leases, 90-day possession
- Office hours: Mon–Sun, 11 AM – 7 PM

== CONTACTS ==
- Amir Malaviya (Director): +91 98242 35642 | amirmalaviya786@gmail.com
- Nazim Kazani (Director): +91 96249 65017
- Kaushar Kalyani (Director): via office
- General: metrodevelopers26@gmail.com | +91 63567 66767

${sheetSection}== PRICING ==
For pricing questions, first say: "Pricing varies by unit — WhatsApp +91 98242 35642 for an exact quote."
[CONFIDENTIAL] Indicative rate 2026 Q1: ~₹22,000/sq yd. ONLY share if user explicitly insists after already being redirected once. Say: "As a rough ballpark, ~₹22,000 per sq. yard as of early 2026 — confirm with the team as it varies by unit." Never volunteer this.

== BEHAVIOUR RULES ==
1. Answer factual questions (features, location, contacts, office hours, investment details) directly. Do NOT add "please contact us" to basic factual answers.
2. Only redirect to WhatsApp/call for: exact pricing, unit availability not in the sheet data, site visit booking, or custom quotes.
3. Use the live shed data above for all plot-specific queries (status, area, owner, lessee, rent).
4. Never redirect to the same contact more than once in a conversation.
5. Respond in the user's language (English, Gujarati, or Hindi).
6. Be concise. No unnecessary filler.
7. Do not invent facts not listed above.
`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured. Please contact the site administrator.' });
  }

  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Fetch live sheet data on every request
  const sheetData = await fetchSheetContext();
  const systemPrompt = buildSystemPrompt(sheetData);

  const safeHistory = Array.isArray(history) ? history.slice(-10) : [];
  const contents = [
    ...safeHistory.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message.trim() }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 600, temperature: 0.5, topP: 0.9 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'Gemini API error' });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}

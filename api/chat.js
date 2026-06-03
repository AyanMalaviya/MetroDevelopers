// api/chat.js — Vercel serverless function
// Model: gemini-3.1-flash-lite-preview

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlkFBTES7Dt-Qe6ocFozJNhckRwVPHfFE4g0rv4EuFyDsoN6zk3NUwqa8sVVA2s4GhXADDYnCOiSKm/pub?gid=0&single=true&output=csv';

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
STATUS DEFINITIONS — read carefully before answering any availability question:
- "available"   → Not yet sold. Can be purchased directly. Open for buyers.
- "for-lease"   → Already SOLD to an owner. The owner is offering it on rent/lease. NOT available to buy — only available to rent/lease from the current owner.
- "pre-leased"  → Already SOLD and currently occupied by a tenant (lessee). The plot IS available to purchase as an investment — buyer gets a tenant already in place and starts earning rental income immediately.
- "sold"        → Sold and NOT currently available for purchase or lease.

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
4. When answering availability questions, always use the STATUS DEFINITIONS above precisely. Never say a "for-lease" plot is available to buy — it is sold. Never say a "pre-leased" plot is unavailable — it can be purchased as an investment.
5. Never redirect to the same contact more than once in a conversation.
6. Respond in the user's language (English, Gujarati, or Hindi).
7. Be concise. No unnecessary filler.
8. Do not invent facts not listed above.
9. Always complete your response fully — never stop mid-sentence or mid-list.
`;
}

function getFriendlyError(status, rawMessage = '') {
  const msg = rawMessage.toLowerCase();
  if (status === 429 || msg.includes('quota') || msg.includes('rate limit') || msg.includes('resource_exhausted')) {
    return 'Our AI assistant is busy right now. Please try again in a moment, or reach us directly on WhatsApp: +91 98242 35642';
  }
  if (status === 503 || msg.includes('unavailable') || msg.includes('overloaded')) {
    return 'The AI service is temporarily unavailable. For immediate help, WhatsApp us at +91 98242 35642';
  }
  return 'Something went wrong on our end. For immediate assistance, please WhatsApp +91 98242 35642';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      reply: 'Our AI assistant is not configured yet. Please contact us on WhatsApp: +91 98242 35642',
    });
  }

  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 2048, temperature: 0.5, topP: 0.9 },
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
      const rawMsg = data?.error?.message || '';
      return res.status(200).json({ reply: getFriendlyError(response.status, rawMsg) });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I was unable to generate a response. Please try again or WhatsApp us at +91 98242 35642';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(200).json({
      reply: 'Something went wrong on our end. For immediate assistance, please WhatsApp +91 98242 35642',
    });
  }
}

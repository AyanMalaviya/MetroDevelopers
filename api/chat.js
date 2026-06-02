// api/chat.js — Metro Developers AI Chatbot (Gemini + Google Sheets RAG)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlkFBTES7Dt-Qe6ocFozJNhckRwVPHfFE4g0rv4EuFyDsoN6zk3NUwqa8sVVA2s4GhXADDYnCOiSKm/pub?gid=0&single=true&output=csv';

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
  return lines.slice(1).map((line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQuotes = !inQuotes; continue; }
      if (line[i] === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += line[i];
    }
    values.push(current.trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = (values[i] || '').replace(/["']/g, '').trim(); });
    return row;
  }).filter((r) => r.id && r.id.trim());
}

function parseAreaNum(str = '') {
  return parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0;
}

// ─── Fetch & format live shed data ───────────────────────────────────────────
async function getLiveShedContext() {
  try {
    const res = await fetch(SHEET_CSV_URL, {
      headers: { 'User-Agent': 'MetroDevelopers-Chatbot/1.0' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const csv = await res.text();
    const rows = parseCsv(csv);

    const validStatuses = ['available', 'pre-leased', 'for-lease', 'sold'];
    const plots = rows.map((r) => ({
      id: r.id,
      status: validStatuses.includes((r.status || '').toLowerCase()) ? r.status.toLowerCase() : 'available',
      area: r.area || 'N/A',
      areaNum: parseAreaNum(r.area),
      owner: r.owner || '',
      lessee: r.lessee || '',
      monthlyRent: r.monthlyrent || r.monthly_rent || '',
    }));

    const available = plots.filter((p) => p.status === 'available');
    const forLease  = plots.filter((p) => p.status === 'for-lease');
    const preLeased = plots.filter((p) => p.status === 'pre-leased');
    const sold      = plots.filter((p) => p.status === 'sold');

    const actionable = [...available, ...forLease].sort((a, b) => a.areaNum - b.areaNum);
    const availableTable = actionable.map((p) =>
      `  Plot ${p.id}: ${p.area} sq yd | ${p.status}${p.monthlyRent ? ` | ₹${p.monthlyRent}/mo` : ''}`
    ).join('\n');

    const fullTable = plots.map((p) =>
      `  Plot ${p.id}: ${p.area} sq yd | ${p.status}${p.owner ? ` | Owner: ${p.owner}` : ''}${p.lessee ? ` | Lessee: ${p.lessee}` : ''}${p.monthlyRent ? ` | ₹${p.monthlyRent}/mo` : ''}`
    ).join('\n');

    return `
## LIVE SHED DATABASE (real-time from Google Sheets)
Timestamp: ${new Date().toISOString()}

Summary:
- Total plots: ${plots.length}
- Available (can be purchased): ${available.length}
- For Lease (sold, available to rent): ${forLease.length}
- Pre-Leased (occupied): ${preLeased.length}
- Sold: ${sold.length}

### All Plots:
${fullTable || '  (No data)'}

### Available & For-Lease Units (sorted by area):
${availableTable || '  (No plots currently available — direct users to contact page)'}

### RECOMMENDATION LOGIC (follow when user asks which shed to choose):
When a user asks which shed suits their requirement (e.g., "I need 1200-1500 sq yd"):
1. Filter plots where status is 'available' OR 'for-lease'
2. Match plots where areaNum falls within or close to their range (within ±15% tolerance)
3. If exact match exists, recommend those first
4. If no exact match, recommend the closest available options above their minimum
5. List each match with: Plot ID, area, status
6. If requirement is for purchase → prioritise 'available'; if for lease/rent → prioritise 'for-lease'
7. Always end with a CTA to contact Metro Developers for pricing and to visit the site map

IMPORTANT: Always tell users to visit /site-map for the visual map and /contact to enquire about pricing.
`;
  } catch (err) {
    console.error('Sheet fetch error:', err.message);
    return `
## LIVE SHED DATABASE
Note: Real-time data could not be fetched (${err.message}). Direct users to /site-map or /contact.
`;
  }
}

// ─── Static knowledge base ────────────────────────────────────────────────────
const STATIC_CONTEXT = `
You are the official AI assistant for Metro Developers and Metro Industrial Park.
Your role is to help potential investors, business owners, and tenants learn about
Metro Industrial Park in Changodar, Ahmedabad, Gujarat, India.

## About Metro Developers
Metro Developers is a real estate development company based in Gujarat, India,
specialising in industrial infrastructure. The flagship project is Metro Industrial Park.

## Metro Industrial Park — Key Facts
- **Location**: Changodar, Ahmedabad, Gujarat — on the Sarkhej-Bavla Highway (SH-17)
- **Strategic Position**: ~20 km from Ahmedabad city centre; near Sanand (Gujarat's auto hub)
- **Connectivity**: Excellent highway access via SH-17; close to NH-47 / NH-464
- **Shed Types**: Ready-to-move industrial sheds, warehouses, godowns
  - Small units: ~300–700 sq yd
  - Medium units: ~700–1500 sq yd
  - Large units: 1500+ sq yd
  - Custom/BTS (Build-to-Suit) options available
- **Area Units**: All plot areas are measured in square yards (sq yd / yd²). 1 sq yd = 9 sq ft.
- **Usage**: Manufacturing, warehousing, logistics, cold storage, e-commerce fulfilment, light engineering
- **Amenities**:
  - 24×7 security with CCTV surveillance
  - Wide internal roads for heavy vehicles & trucks
  - Three-phase power supply
  - Water supply & drainage
  - Fire safety systems
  - Dedicated parking areas
  - Admin/office block on-site
- **Legal & Compliance**: NA-converted land, clear titles, RERA compliant where applicable
- **Investment Highlights**:
  - Changodar is one of Gujarat's fastest-growing industrial corridors
  - High demand from auto-ancillary, pharma, FMCG, textiles, and logistics sectors
  - Strong rental yield: 7–10% annual yield in the Ahmedabad region
  - Capital appreciation: ~8–12% CAGR historically in this micro-market
  - GST Input Tax Credit (ITC) eligible for commercial/industrial tenants

## PRICING POLICY — CRITICAL RULE
NEVER quote, estimate, or discuss any specific price, rate, rent amount, or cost figure.
This includes: per sq ft rates, monthly rent, total price, EMI, deposit, any ₹ amounts.
When ANY pricing question is asked, respond EXACTLY like this pattern:
  "For accurate and up-to-date pricing, please contact our team directly — they will
   provide you with the best available rates tailored to your requirement.
   👉 Visit our Contact page: [metrodevelopers.in/contact]"
You may acknowledge that pricing varies by plot size, lease term, and availability,
but DO NOT give any numbers whatsoever. Redirect warmly and immediately.

## Website Pages
- **/** – Homepage
- **/metro-industrial-park** – Detailed project page
- **/site-map** – Interactive visual map of all plots with real-time status
- **/calculator** – EMI / yield / ROI calculator
- **/contact** – Enquiry form, WhatsApp, office address
- **/metro-arcade** – Metro Arcade: another commercial project

## Response Guidelines
1. Be helpful, professional, and warm — like a knowledgeable sales advisor
2. ALWAYS use live shed data to answer availability and recommendation questions
3. When user asks for shed recommendation by size — follow the RECOMMENDATION LOGIC above
4. NEVER discuss pricing — always redirect to /contact (see PRICING POLICY above)
5. For investment queries, provide factual Gujarat/Changodar industrial market context without figures
6. Keep responses concise (4–8 sentences) unless detail is needed
7. End enquiry/recommendation responses with a CTA to WhatsApp or the Contact page
8. Use ₹ symbol only if referring to pricing — which you must redirect, not answer
9. Respond in the same language the user writes in (English, Gujarati, or Hindi)
10. If asked about a specific plot number, look it up in the live data and report its status/area only
11. When recommending sheds, format as a clear list with Plot #, area, status (NO prices)

## Do NOT
- Quote any price, rate, rent, cost, or ₹ amount
- Make up specific plot availability not in the live data
- Make legal or regulatory promises
- Discuss competitor projects negatively
`;

// ─── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured. Please contact the site admin.' });
  }

  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 chars).' });
  }

  const liveContext = await getLiveShedContext();
  const fullSystemPrompt = `${STATIC_CONTEXT}\n${liveContext}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `[SYSTEM INSTRUCTIONS]\n${fullSystemPrompt}\n[END SYSTEM INSTRUCTIONS]\n\nAcknowledge you are ready.` }],
    },
    {
      role: 'model',
      parts: [{ text: 'Ready! I am the Metro Industrial Park AI assistant. I can help with shed availability, recommendations by size, location details, and amenities. For pricing I will always redirect to the contact page. How can I help you?' }],
    },
    ...history.slice(-10).map((t) => ({
      role: t.role === 'user' ? 'user' : 'model',
      parts: [{ text: t.content }],
    })),
    {
      role: 'user',
      parts: [{ text: message.trim() }],
    },
  ];

  const requestBody = {
    contents,
    generationConfig: {
      temperature: 0.55,
      topK: 40,
      topP: 0.92,
      maxOutputTokens: 900,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errBody);
      return res.status(502).json({ error: 'AI service temporarily unavailable. Please try again shortly.' });
    }

    const data = await geminiRes.json();
    const candidate = data?.candidates?.[0];

    if (!candidate || candidate.finishReason === 'SAFETY') {
      return res.status(200).json({
        reply: "I'm sorry, I can't answer that. Please contact our team directly via the Contact page.",
      });
    }

    const reply = candidate.content?.parts?.[0]?.text?.trim()
      || 'I apologize, I could not generate a response. Please try again.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

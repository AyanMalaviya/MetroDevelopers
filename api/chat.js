// api/chat.js — Metro Developers AI Chatbot (Gemini 1.5 Flash + Google Sheets RAG)
// Free tier: 15 RPM, 1M tokens/day

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Public Google Sheet CSV — same sheet used by dataService.js on the frontend
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlkFBTES7Dt-Qe6ocFozJNhckRwVPHfFE4g0rv4EuFyDsoN6zk3NUwqa8sVVA2s4GhXADDYnCOiSKm/pub?gid=0&single=true&output=csv';

// ─── CSV Parser (no deps — simple RFC 4180-compliant) ──────────────────────────────
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

// ─── Fetch & format live shed data from Google Sheets ───────────────────────────
async function getLiveShedContext() {
  try {
    const res = await fetch(SHEET_CSV_URL, {
      headers: { 'User-Agent': 'MetroDevelopers-Chatbot/1.0' },
      signal: AbortSignal.timeout(6000), // 6 s timeout
    });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const csv = await res.text();
    const rows = parseCsv(csv);

    const validStatuses = ['available', 'pre-leased', 'for-lease', 'sold'];
    const plots = rows.map((r) => ({
      id: r.id,
      status: validStatuses.includes((r.status || '').toLowerCase()) ? r.status.toLowerCase() : 'available',
      area: r.area || 'N/A',
      owner: r.owner || '',
      lessee: r.lessee || '',
      monthlyRent: r.monthlyrent || r.monthly_rent || '',
    }));

    // Summarise by status
    const available  = plots.filter((p) => p.status === 'available');
    const forLease   = plots.filter((p) => p.status === 'for-lease');
    const preLeased  = plots.filter((p) => p.status === 'pre-leased');
    const sold       = plots.filter((p) => p.status === 'sold');

    // Build a compact text table for the available/for-lease plots (most useful to visitors)
    const availableRows = [...available, ...forLease]
      .map((p) => `  Plot ${p.id}: ${p.area} sq yd — ${p.status}${p.monthlyRent ? ` (₹${p.monthlyRent}/mo)` : ''}`)
      .join('\n');

    return `
## LIVE SHED AVAILABILITY DATA (fetched in real-time from Google Sheets)
Data timestamp: ${new Date().toISOString()}

Summary:
- Total plots in database: ${plots.length}
- Available (for purchase/enquiry): ${available.length}
- For Lease / Rent: ${forLease.length}
- Pre-Leased (occupied): ${preLeased.length}
- Sold: ${sold.length}

Available & For-Lease Units:
${availableRows || '  (No plots currently listed as available — please contact us directly.)'}

IMPORTANT: Always recommend users visit /site-map for the visual interactive map, and /contact to enquire about specific plots. Prices shown are indicative; direct enquiry is needed for confirmed pricing.
`;
  } catch (err) {
    console.error('Sheet fetch error:', err.message);
    // Graceful degradation — return a note so Gemini knows data is unavailable
    return `
## LIVE SHED AVAILABILITY DATA
Note: Real-time availability data could not be fetched at this moment (${err.message}).
Direct users to the /site-map page or /contact page for up-to-date availability.
`;
  }
}

// ─── Static Metro Industrial Park Knowledge Base ─────────────────────────────────
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
  - Small units: ~2,000–5,000 sq ft
  - Medium units: ~5,000–15,000 sq ft
  - Large units: 15,000+ sq ft
  - Custom/BTS (Build-to-Suit) options available
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
- **Pricing (indicative)**:
  - Sale: ~₹2,500–₹4,500/sq ft depending on unit size (confirm with team)
  - Rent: ₹18–₹35/sq ft/month depending on unit and term
  - Negotiable for long-term leases (3+ years)

## Website Pages
- **/** – Homepage: overview of Metro Developers and key project highlights
- **/metro-industrial-park** – Detailed project page: location, amenities, unit types, gallery
- **/site-map** – Interactive visual map of all plots with real-time status (available/sold/leased)
- **/calculator** – EMI / yield / ROI calculator for investors
- **/contact** – Enquiry form, WhatsApp, office address, Google Maps
- **/metro-arcade** – Metro Arcade: another commercial project by Metro Developers
- **Guides**: GST ITC for industrial tenants, warehousing yield & CAGR in Gujarat, due diligence checklist, how to choose an industrial shed in Gujarat

## Response Guidelines
1. Be helpful, professional, and warm — like a knowledgeable sales advisor
2. When answering availability questions, USE the live shed data above (plot IDs, areas, status)
3. For pricing/availability always recommend contacting the team to confirm current figures
4. For investment queries, provide factual Gujarat/Changodar industrial market context
5. Keep responses concise (3–6 sentences) unless detail is needed
6. End enquiry responses with: “Feel free to fill the enquiry form on our Contact page or WhatsApp us for a site visit!”
7. Use ₹ symbol for Indian Rupee amounts
8. Respond in the same language the user writes in (English, Gujarati, or Hindi)
9. If asked about a specific plot number, look it up in the live data above and report its status/area

## Do NOT
- Make up specific plot availability not in the live data
- Make legal or regulatory promises
- Discuss competitor projects negatively
`;

// ─── Main Handler ──────────────────────────────────────────────────────────────
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

  // ── RAG: Fetch live shed data from Google Sheets in parallel with nothing (fast) ──
  const liveContext = await getLiveShedContext();

  // ── Build full system prompt = static knowledge + live RAG data ──
  const fullSystemPrompt = `${STATIC_CONTEXT}\n${liveContext}`;

  // ── Build Gemini conversation contents ──
  const contents = [
    {
      role: 'user',
      parts: [{ text: `[SYSTEM INSTRUCTIONS]\n${fullSystemPrompt}\n[END SYSTEM INSTRUCTIONS]\n\nAcknowledge you are ready.` }],
    },
    {
      role: 'model',
      parts: [{ text: 'Ready! I am the Metro Industrial Park AI assistant with access to live shed availability data. How can I help you today?' }],
    },
    // Last 10 history turns
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
      temperature: 0.65,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 800,
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

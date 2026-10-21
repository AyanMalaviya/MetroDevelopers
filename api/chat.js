// api/chat.js — Vercel serverless function
// Model: gemini-3.5-flash-lite (with automatic fallback to gemini-2.5-flash-lite & gemini-2.0-flash)

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlkFBTES7Dt-Qe6ocFozJNhckRwVPHfFE4g0rv4EuFyDsoN6zk3NUwqa8sVVA2s4GhXADDYnCOiSKm/pub?gid=0&single=true&output=csv';

// In-memory cache for live sheet context
let cachedSheetContext = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

async function fetchSheetContext() {
  const now = Date.now();
  if (cachedSheetContext && (now - cacheTimestamp < CACHE_TTL_MS)) {
    return cachedSheetContext;
  }

  try {
    const res = await fetch(SHEET_CSV_URL, {
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return cachedSheetContext;
    const csv = await res.text();
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return cachedSheetContext;

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
    const idIdx     = headers.indexOf('id');
    const statusIdx = headers.indexOf('status');
    const areaIdx   = headers.indexOf('area');
    const ownerIdx  = headers.indexOf('owner');
    const lesseeIdx = headers.indexOf('lessee');
    const rentIdx   = Math.max(headers.indexOf('monthlyrent'), headers.indexOf('monthly_rent'));
    if (idIdx === -1) return cachedSheetContext;

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

    if (rows.length > 0) {
      cachedSheetContext = rows.join('\n');
      cacheTimestamp = now;
      return cachedSheetContext;
    }
    return cachedSheetContext;
  } catch {
    return cachedSheetContext;
  }
}

function buildSystemPrompt(sheetData) {
  const sheetSection = sheetData
    ? `== LIVE SHED DATA FOR METRO INDUSTRIAL PARK (fetched now from Google Sheets) ==
STATUS DEFINITIONS — read carefully before answering any availability question:
- "available"   → Not yet sold. Can be PURCHASED or RENTED/LEASED. Open for both buyers and tenants.
- "for-lease"   → Already SOLD to an owner. The owner is offering it on rent/lease. NOT available to buy — only available to rent/lease from the current owner.
- "pre-leased"  → Already SOLD and currently occupied by a tenant (lessee). The plot IS available to purchase as an investment — buyer gets a tenant already in place and starts earning rental income immediately. NOT available to rent (already occupied).
- "sold"        → Sold and NOT currently available for purchase or lease.

${sheetData}

`
    : `== SHED DATA ==
Live data unavailable right now. For plot availability, direct user to WhatsApp +91 98242 35642.

`;

  return `You are Metro AI, the assistant for Metro Developers (Metro Industrial Park, Metro Industrial Estate, and Metro Arcade).
Website: https://www.metrodevelopers.co.in

== ABOUT METRO DEVELOPERS & OUR PROJECTS ==
We are premier industrial & commercial developers based in Ahmedabad, Gujarat, with over 6+ years of excellence, 43+ units delivered, and 84,000+ sq yards developed across prime industrial corridors.

1. METRO INDUSTRIAL PARK (Ready-to-Move Industrial Sheds & Warehouses):
   - Address: Opp. Suvas Ind Estate, b/h Siya Logistics Park, Moraiya, Ahmedabad – 382213 (near NH 47 Sarkhej–Bavla Highway).
   - 54,000+ sq yards campus | 63 industrial sheds & warehouse units | Unit sizes 4,000 to 50,000 sq ft.
   - Features: 30–35 ft clear ceiling height, 60 ft heavy RCC internal roads, 24/7 CCTV & security guards, 24/7 water supply, on-site weighbridge, underground drainage.
   - Returns: 16–20% total yield (6–8% rental yield + 10–12% capital appreciation), 5–10 yr leases, 90-day possession.

2. METRO INDUSTRIAL ESTATE (Industrial Plots — "Build Your Own Shed"):
   - Concept: "Build Your Own Shed" — Clear-title, premium industrial plots for clients who want to design, construct, and customize their own industrial shed or warehouse according to their exact business requirements.
   - Location: Situated directly opposite Metro Industrial Park in Moraiya, Changodar, Ahmedabad (accessible from NH 47 Sarkhej–Bavla Highway).
   - Facilities provided by Metro Developers in the Estate:
     • 24/7 Gated Security & comprehensive CCTV surveillance
     • Wide heavy-duty RCC internal and approach roads designed for multi-axle trailers & heavy container logistics
     • 24/7 dedicated industrial water supply
     • Underground drainage & storm water disposal
     • High-tension power / electricity connectivity provisions
     • Street lighting & dedicated industrial infrastructure
   - Why "Build Your Own Shed" at Metro Industrial Estate?
     • Total freedom of customization: Build custom ceiling heights (30–40+ ft), install heavy overhead EOT cranes (5T/10T/20T), customize floor load bearing capacity, dock levelers, mezzanine offices, and manufacturing workflow layouts.
     • Clear legal titles, NA permissions, zero title risk, and immediate registration support.
     • Ideal for manufacturing, fabrication, engineering, packaging, logistics, chemicals, and warehousing.
   - Live Plot Map: Users can view the live plot layout and availability map online under the "Industrial Plots" tab at https://www.metrodevelopers.co.in/site-map or directly visit https://www.metrodevelopers.co.in/metro-industrial-estate.

3. METRO ARCADE:
   - Highway-facing commercial hub with premium retail shops and showrooms on the bustling Changodar–Moraiya corridor.

== CONTACTS & DIRECTORS ==
- Amir Malaviya (Director): +91 98242 35642 | amirmalaviya786@gmail.com
- Nazim Kazani (Director): +91 96249 65017
- Kaushar Kalyani (Director): via office
- General: metrodevelopers26@gmail.com | +91 63567 66767
- Office hours: Mon–Sun, 11 AM – 7 PM

${sheetSection}== PRICING GUIDELINES ==
For pricing questions, first say: "Pricing varies by unit and plot size — WhatsApp +91 98242 35642 for an exact quote."
[CONFIDENTIAL] Indicative rate 2026 Q2: ~₹22,500/sq yd. ONLY share if user explicitly insists after already being redirected once. Say: "As a rough ballpark, ~₹22,500 per sq. yard as of 2026 Q2 — confirm with the team as it varies by unit." Never volunteer this.

== BEHAVIOUR RULES ==
1. Answer factual questions (features, location, facilities, contacts, office hours, investment details) directly and helpfully. Do NOT add unnecessary "please contact us" to basic factual answers.
2. Only redirect to WhatsApp/call for: exact pricing, booking a site visit, or custom quotes.
3. For questions about READY SHEDS / WAREHOUSES, refer to Metro Industrial Park and use the live sheet data above for plot-specific queries (status, area, owner, lessee, rent).
4. For questions about LAND, INDUSTRIAL PLOTS, or CUSTOM SHED CONSTRUCTION, introduce Metro Industrial Estate and highlight the "Build Your Own Shed" concept with full facilities like 24/7 security and wide heavy RCC roads.
5. When answering availability questions, always use the STATUS DEFINITIONS precisely. Never say a "for-lease" plot is available to buy. Never say a "pre-leased" plot is unavailable — it can be purchased as an investment.
6. Never redirect to the same contact more than once in a conversation.
7. Respond in the user's language (English, Gujarati, or Hindi).
8. Be concise, professional, and confident.
9. Do not invent facts not listed above.
10. Always complete your response fully — never stop mid-sentence or mid-list.
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

// Model hierarchy: Primary is gemini-3.5-flash-lite, with resilient fallbacks
const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
];

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

  // Sanitize conversational turn order so turns strictly alternate
  const safeHistory = Array.isArray(history) ? history.slice(-10) : [];
  const contents = [];
  let lastRole = null;

  for (const m of safeHistory) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    const text = typeof m.content === 'string' ? m.content.trim() : '';
    if (!text) continue;

    if (role === lastRole && contents.length > 0) {
      contents[contents.length - 1].parts[0].text += `\n${text}`;
    } else {
      contents.push({ role, parts: [{ text }] });
      lastRole = role;
    }
  }

  // Ensure last role before current prompt is not 'user'
  if (lastRole === 'user' && contents.length > 0) {
    contents.pop();
  }

  // Final turn must be user
  contents.push({ role: 'user', parts: [{ text: message.trim() }] });

  let reply = null;
  let lastStatus = 500;
  let lastError = '';

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: { maxOutputTokens: 2048 },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
          }),
          signal: AbortSignal.timeout(9000),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim().length > 0) {
          reply = candidateText.trim();
          break; // Model successfully answered!
        }
      } else {
        lastStatus = response.status;
        lastError = data?.error?.message || '';
        console.warn(`Gemini model ${model} responded with status ${response.status}: ${lastError}`);
      }
    } catch (err) {
      lastError = err.message || '';
      console.warn(`Gemini model ${model} network/timeout error:`, err);
    }
  }

  if (reply) {
    return res.status(200).json({ reply });
  }

  return res.status(200).json({ reply: getFriendlyError(lastStatus, lastError) });
}

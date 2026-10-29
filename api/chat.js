// api/chat.js — Vercel serverless function
// Model: gemini-3.5-flash-lite (with automatic fallback to gemini-2.5-flash-lite & gemini-2.0-flash)

const PARK1_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlkFBTES7Dt-Qe6ocFozJNhckRwVPHfFE4g0rv4EuFyDsoN6zk3NUwqa8sVVA2s4GhXADDYnCOiSKm/pub?gid=0&single=true&output=csv';
const PARK2_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMFIwhTgrZBQuo-TLTJ8fL2Td39uPSsd0LWWbQmjbCRyWn9zuz_mOY45Y32NmKCV18nCnmOcfsom2M/pub?gid=0&single=true&output=csv';
// Park 3 Google Sheet published CSV URL:
const PARK3_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbpDHOEarWSXt8ip3w8XjlJIZ1PMG1IEqP8zPb8gXjNcYXFZQu0KwX_5w5ONIXYrBv77WeP1vCK6bi/pub?output=csv';

// In-memory cache for live sheet context
let cachedSheetContext = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

async function parseCsvFromUrl(url, label) {
  if (!url) return '';
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) return '';
    const csv = await res.text();
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return '';

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
    const idIdx     = headers.indexOf('id');
    const statusIdx = headers.indexOf('status');
    const areaIdx   = headers.indexOf('area');
    const ownerIdx  = headers.indexOf('owner');
    const lesseeIdx = headers.indexOf('lessee');
    const rentIdx   = Math.max(headers.indexOf('monthlyrent'), headers.indexOf('monthly_rent'));
    if (idIdx === -1) return '';

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].match(/(?:"([^"]*)"|([^,]*))/g)?.map((c) => c.replace(/^"|"$/g, '').trim()) || [];
      const id = cols[idIdx];
      if (!id) continue;
      const status = (cols[statusIdx] || 'available').toLowerCase();
      const area   = cols[areaIdx]   || 'N/A';
      const owner  = ownerIdx  >= 0 ? (cols[ownerIdx]  || '') : '';
      const lessee = lesseeIdx >= 0 ? (cols[lesseeIdx] || '') : '';
      const rent   = rentIdx   >= 0 ? (cols[rentIdx]   || '') : '';
      let row = `${label} Plot ${id}: ${status}, ${area}`;
      if (owner)  row += `, owner: ${owner}`;
      if (lessee) row += `, lessee: ${lessee}`;
      if (rent)   row += `, rent: ₹${rent}`;
      rows.push(row);
    }
    return rows.join('\n');
  } catch {
    return '';
  }
}

async function fetchSheetContext() {
  const now = Date.now();
  if (cachedSheetContext && (now - cacheTimestamp < CACHE_TTL_MS)) {
    return cachedSheetContext;
  }

  try {
    const [p1, p2, p3] = await Promise.all([
      parseCsvFromUrl(PARK1_SHEET_CSV_URL, 'Park 1'),
      parseCsvFromUrl(PARK2_SHEET_CSV_URL, 'Park 2'),
      parseCsvFromUrl(PARK3_SHEET_CSV_URL, 'Park 3'),
    ]);

    const combined = [p1, p2, p3].filter(Boolean).join('\n\n');
    if (combined) {
      cachedSheetContext = combined;
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

  return `You are Metro AI, the assistant for Metro Developers (Industrial Park 1, Industrial Park 2, Industrial Park 3, and Metro Arcade).
Website: https://www.metrodevelopers.co.in

== ABOUT METRO DEVELOPERS & OUR PROJECTS ==
We are premier industrial & commercial developers based in Ahmedabad, Gujarat, with over 6+ years of excellence, 43+ units delivered, and 84,000+ sq yards developed across prime industrial corridors.

1. METRO INDUSTRIAL PARK 1 (Park 1 — Ready-to-Move Industrial Sheds & Warehouses):
   - Address: Opp. Suvas Ind Estate, b/h Siya Logistics Park, Moraiya, Ahmedabad – 382213 (near NH 47 Sarkhej–Bavla Highway).
   - Google Maps Location: https://maps.app.goo.gl/6fBawQdYxcmUw3WE6
   - 54,000+ sq yards campus | 63 industrial sheds & warehouse units | Unit sizes 4,000 to 50,000 sq ft.
   - Features: 30–35 ft clear ceiling height, 60 ft heavy RCC internal roads, 24/7 CCTV & security guards, 24/7 water supply, on-site weighbridge, underground drainage.
   - Returns: 16–20% total yield (6–8% rental yield + 10–12% capital appreciation), 5–10 yr leases, 90-day possession.
   - URL: https://www.metrodevelopers.co.in/metro-industrial-park

2. INDUSTRIAL PARK 2 (Park 2 — Industrial Plots — "Build Your Own Shed"):
   - Concept: "Build Your Own Shed" — Clear-title, premium industrial plots (23 plots, 300 to 1,930+ sq.yd) for clients who want to design and construct their customized factory or warehouse.
   - Location: Directly opposite Industrial Park 1 in Moraiya, Changodar, Ahmedabad (near NH 47 Sarkhej–Bavla Highway).
   - Google Maps Location: https://maps.app.goo.gl/oBMDfb38sNuo4pjD9 (Exact pin: 22.9138011, 72.4212934)
   - Facilities: Wide heavy-duty RCC roads, Street lights, Puran (Soil filling & precision ground leveling), Compound wall, and 24/7 Gated security (no CCTV).
   - Live Plot Map: View live layout at https://www.metrodevelopers.co.in/site-map or https://www.metrodevelopers.co.in/metro-industrial-estate.

3. METRO INDUSTRIAL PARK 3 (Park 3 — Industrial Plots on Bavla – Rajoda Road):
   - Location: Bavla – Rajoda Road, Ahmedabad (Google Maps: https://maps.app.goo.gl/5SaRAjuzrQzLjoZh9, Exact pin: 22.8443566, 72.3762037).
   - Concept: "Build Your Own Shed" with complete developer-executed infrastructure across an expansive ~60,000 sq.yards campus (59,508 SQYD total area).
   - 77 Industrial Plots ranging from 300 sq.yards to 2,876 sq.yards (including 851 SQMT common plot).
   - Key Facilities Provided in Park 3:
     • Precision Ground Filling & Leveling (Ongoing): Full-depth high-grade murrum filling and mechanical compaction actively in progress across all plots. Delivered elevated, flat, flood-safe, ready for immediate foundation casting. (In Gujarati known as Puran / પૂરાણ — confirm Puran/leveling is actively ongoing, bookings are open, and possession is soon).
      • Status & Possession: Bookings are officially OPEN. Ground leveling is ONGOING. Land possession will be handed over SOON.
     • LED Streetlights: Systematically installed high-lumen streetlights along all internal and approach roads for 24/7 night visibility and safe logistics.
     • 24/7 Gated Security: Gated entrance with security cabin and trained security guards (no CCTV).
     • Wide Heavy Roads: 18.00-meter (~60 Ft) wide main cross-over road, 12.00-meter (~40 Ft) wide cross-over roads, and 9.00-meter internal roads engineered for multi-axle freight trailers.
     • Compound Wall: Full perimeter boundary compound wall securing the entire industrial campus.
     • 100% Clear Titles with Non-Agricultural (NA) Industrial permissions and immediate registration.
   - URL: https://www.metrodevelopers.co.in/metro-industrial-park-3

4. METRO ARCADE:
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
4. For questions about LAND, INDUSTRIAL PLOTS, or "BUILD YOUR OWN SHED":
   - In Moraiya / Changodar: Introduce Metro Industrial Park 2 (23 plots opposite Park 1 with 24/7 security and RCC roads).
   - In Bavla / Rajoda Road: Introduce Metro Industrial Park 3 (77 plots, 300 to 2,876 sq.yd on Bavla Rajoda Road). Clarify that bookings are officially OPEN, ground filling & precision leveling (Puran) is actively ONGOING on-site, and land possession will be handed over SOON. Use professional English terms ("ground filling and leveling in progress, possession soon") unless the user explicitly converses in Gujarati/Hindi asking about "Puran" (પૂરાણ).
5. When answering availability questions, always use the STATUS DEFINITIONS precisely. Never say a "for-lease" plot is available to buy. Never say a "pre-leased" plot is unavailable — it can be purchased as an investment.
6. Never redirect to the same contact more than once in a conversation.
7. Respond in the user's language (English, Gujarati, or Hindi).
8. Be concise, professional, and confident.
9. Do not invent facts not listed above.
10. Always complete your response fully — never stop mid-sentence or mid-list.
11. EXACT GOOGLE MAPS LOCATIONS (CRITICAL):
    • For Metro Industrial Park 1 (Ready Sheds & Warehouses in Moraiya, Changodar): ALWAYS provide ONLY: https://maps.app.goo.gl/6fBawQdYxcmUw3WE6 (Pin: 22.9140377, 72.4206651).
    • For Metro Industrial Park 2 (Industrial Plots in Moraiya, Changodar): ALWAYS provide ONLY: https://maps.app.goo.gl/oBMDfb38sNuo4pjD9 (Pin: 22.9138011, 72.4212934).
    • For Metro Industrial Park 3 (Industrial Plots on Bavla – Rajoda Road): ALWAYS provide ONLY: https://maps.app.goo.gl/5SaRAjuzrQzLjoZh9 (Pin: 22.8443566, 72.3762037).
    • NEVER generate, guess, or search for any other map link or address (an older duplicate listing was closed permanently and must never be referenced).

12. PROACTIVE INDUSTRIAL RECOMMENDATIONS FOR AHMEDABAD & GUJARAT:
    • Whenever a user asks generally about finding industrial land, plots, NA land, ready sheds, factories, godowns, or warehouses in Ahmedabad, Gujarat, Moraiya, Changodar, Bavla, Rajoda, Sanand, Sarkhej, Dholera, Aslali, or nearby:
      ALWAYS proactively showcase our solutions and guide them to the right park:
      1) If they need READY SHEDS / FACTORIES / WAREHOUSES with high rental income (6–8% yield) or immediate business possession → Recommend METRO INDUSTRIAL PARK 1 (Moraiya, Changodar).
      2) If they want to "BUILD THEIR OWN SHED" or buy clear-title industrial land in the heart of the Moraiya–Changodar manufacturing belt (300 to 1,930 sq.yd) → Recommend METRO INDUSTRIAL PARK 2 (Moraiya).
      3) If they want an expansive plotted estate with ground leveling (Puran) ongoing, bookings open, land possession soon, and 18m (~60 Ft) wide heavy roads (300 to 2,876 sq.yd) → Recommend METRO INDUSTRIAL PARK 3 (Bavla – Rajoda Road).
    • Emphasize our strategic highway accessibility on NH 47, heavy 60ft/18m RCC roads, 24/7 security, high-tension power, and invite them for a guided site visit or WhatsApp discussion with Director Amir Malaviya (+91 98242 35642).
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

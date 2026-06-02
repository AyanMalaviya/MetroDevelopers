// api/chat.js — Vercel serverless function
// Model: gemini-3.5-flash (latest stable as of June 2026)
const SYSTEM_PROMPT = `You are Metro AI, an intelligent assistant for Metro Industrial Park by Metro Developers — a premium industrial shed development in Changodar (Moraiya area), Ahmedabad, Gujarat, India.

== ABOUT METRO INDUSTRIAL PARK ==
Location: Village Bhadaj, Taluka Sanand, Near Changodar, Ahmedabad – 382213. Situated on Sarkhej–Bavla Highway (SH-164), approx. 25 km from Ahmedabad city centre and 5 km from Sanand GIDC.

Connectivity:
- NH-48 (Delhi–Mumbai Expressway): ~8 km
- Ahmedabad–Rajkot Highway: ~12 km
- BRTS/City bus from Changodar Crossroads: walking distance
- Nearest Railway: Sarkhej Station ~9 km
- Airport: Sardar Vallabhbhai Patel International: ~22 km
- Proposed Metro Line extension corridor nearby

Project Overview:
- Total land: ~20 acres of planned industrial micro-park
- Shed types: Small (600–800 sq yd), Medium (900–1200 sq yd), Large (1300–2000 sq yd), XL/Custom (2000+ sq yd)
- Construction: RCC framing, Colour-coated GI sheet roofing, Vitrified tile flooring
- Height: 24–30 ft clear height inside sheds
- Both Lease and Sale options available

Amenities & Infrastructure:
- 24x7 security with CCTV surveillance
- Dedicated 3-phase power connection per unit (100–500 kVA as per size)
- Piped water supply
- Underground drainage & storm water management
- Wide 40 ft internal roads for heavy vehicle movement
- Truck turnaround yard
- Common office/admin block
- Visitor parking
- Fire NOC compliant infrastructure
- Solar-ready rooftop
- Borewell backup water supply
- Street lighting throughout campus

Pricing (approx. indicative):
- Lease: ₹18–28 per sq ft per month depending on size and duration
- Sale: ₹2,800–₹4,200 per sq ft depending on size and location in the park
- Security deposit: 6–12 months advance for lease
- Lease tenure: 3–9 years with renewal options

Investment Highlights:
- Changodar–Sanand belt: one of fastest-growing industrial corridors in Gujarat
- Major auto & pharma companies (Tata Motors, Zydus, Sun Pharma nearby)
- Expected rental yield: 6–9% per annum
- Capital appreciation estimate: 8–14% CAGR in the corridor
- RERA registered project

Target Tenants & Buyers:
- Auto ancillary, pharma, FMCG, engineering, logistics, e-commerce warehousing
- SME manufacturers, startups needing ready-to-use industrial space
- Investors looking for industrial real estate

Contact:
- Phone/WhatsApp: +91 98242 35642
- Site Address: Metro Industrial Park, Village Bhadaj, Changodar, Ahmedabad – 382213
- Site visit: Mon–Sun, 9 AM – 7 PM
- Website: metrodevelopers.in

== BEHAVIOUR ==
- Answer questions about sheds, pricing, location, amenities, availability, connectivity, investment, site visits, and the local industrial ecosystem.
- Be conversational, helpful, and concise.
- For pricing, always mention figures are indicative and recommend contacting the sales team for exact quotes.
- If asked something outside the scope of the project or industrial real estate, you may answer briefly but redirect back to Metro Industrial Park.
- Respond in the same language as the user (English, Gujarati, or Hindi).
- Never make up specific shed unit numbers or specific availability — say "contact us to check current availability".
- Always encourage site visits and WhatsApp contact for serious inquiries.
`;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI service not configured. Please contact the site administrator.',
    });
  }

  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Build contents array: interleave history + current message
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
            topP: 0.9,
          },
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
      const errMsg = data?.error?.message || 'Gemini API error';
      return res.status(response.status).json({ error: errMsg });
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

// api/chat.js — Vercel serverless function for Metro Developers AI Chatbot
// Uses Google Gemini 1.5 Flash (free tier: 15 RPM, 1M tokens/day)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// ─── Rich Metro Industrial Park Context ───────────────────────────────────────
const SYSTEM_CONTEXT = `
You are the official AI assistant for Metro Developers and Metro Industrial Park.
Your role is to help potential investors, business owners, and tenants learn about
Metro Industrial Park located in Changodar, Ahmedabad, Gujarat, India.

## About Metro Developers
Metro Developers is a real estate development company based in Gujarat, India, specialising
in industrial infrastructure. The flagship project is Metro Industrial Park.

## Metro Industrial Park — Key Facts
- **Location**: Changodar, Ahmedabad, Gujarat — on the Sarkhej-Bavla Highway (SH-17)
- **Strategic Position**: ~20 km from Ahmedabad city centre; near Sanand (Gujarat's auto hub)
- **Connectivity**: Excellent highway access via SH-17; close to NH-47 / NH-464
- **Area**: Large-scale industrial park with multiple industrial sheds (plots available for sale & rent)
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
- **Legal & Compliance**:
  - NA (Non-Agricultural) converted land
  - Clear titles; RERA compliant where applicable
  - Gujarat Industrial Development Corporation (GIDC) adjacent zone
- **Investment Highlights**:
  - Changodar is one of Gujarat's fastest-growing industrial corridors
  - High demand from auto-ancillary, pharma, FMCG, textiles, and logistics sectors
  - Strong rental yield — industrial real estate in the Ahmedabad region offers 7–10% annual yield
  - Capital appreciation — ~8–12% CAGR historically in this micro-market
  - GST Input Tax Credit (ITC) eligible for commercial/industrial tenants
- **Pricing (indicative)**:
  - Sale: Contact for current pricing (market rate ~₹2,500–₹4,500/sq ft depending on unit size)
  - Rent: ₹18–₹35/sq ft/month depending on unit and term
  - Negotiable for long-term leases (3+ years)

## Website Pages & Features
- **Homepage (/)**: Overview of Metro Developers, hero banner, key project highlights
- **Metro Industrial Park (/metro-industrial-park)**: Detailed project page — location, amenities, unit types, gallery
- **Interactive Site Map (/site-map)**: Visual map of available and sold/rented plots
- **Calculator (/calculator)**: EMI/yield/ROI calculator for investors
- **Contact (/contact)**: Enquiry form, WhatsApp contact, office address, Google Maps
- **Guides**: In-depth articles on GST ITC for industrial tenants, warehousing yield & CAGR in Gujarat, industrial property due diligence in Ahmedabad, how to choose an industrial shed in Gujarat
- **Local Market Pages**: SEO-optimised pages for Changodar, Moraiya, Sanand area sheds and warehouses
- **Metro Arcade (/metro-arcade)**: Another project by Metro Developers (commercial arcade/retail)

## Contact Information
- **Phone/WhatsApp**: Available via the Contact page
- **Location**: Changodar, Taluka Sanand, District Ahmedabad, Gujarat — 382213
- **Email**: Available on the Contact page

## How You Should Respond
1. Be helpful, professional, and warm — like a knowledgeable sales/advisory team member
2. For pricing/availability queries, provide indicative ranges and strongly encourage contacting the team for accurate, up-to-date figures
3. For investment queries, provide factual information about Changodar/Gujarat industrial market trends
4. For location queries, describe connectivity in detail (SH-17, proximity to Sanand, Ahmedabad city)
5. If you don't know something specific, say so honestly and direct them to the Contact page
6. Keep responses concise (3–6 sentences typically) unless a detailed answer is needed
7. Always end enquiry responses with a soft CTA: "Feel free to fill the enquiry form on our Contact page or WhatsApp us for a site visit!"
8. Use ₹ symbol for Indian Rupee amounts
9. Respond in the same language the user writes in (English or Gujarati or Hindi)

## Things You Should NOT Do
- Do NOT make up specific plot numbers, exact prices, or specific availability details
- Do NOT make legal or regulatory promises
- Do NOT discuss competitor projects negatively
`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured. Please contact the site admin.' });
  }

  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long. Please keep it under 2000 characters.' });
  }

  // Build conversation history for Gemini
  const contents = [
    // Inject system context as first user turn + model acknowledgment
    {
      role: 'user',
      parts: [{ text: `[SYSTEM INSTRUCTIONS — follow these for all responses]\n${SYSTEM_CONTEXT}\n[END SYSTEM INSTRUCTIONS]\n\nAcknowledge you understand and are ready to help visitors of Metro Industrial Park.` }],
    },
    {
      role: 'model',
      parts: [{ text: 'Understood! I am the Metro Industrial Park AI assistant. I am ready to help visitors, investors, and businesses learn about Metro Industrial Park in Changodar, Ahmedabad. How can I assist you today?' }],
    },
    // Previous conversation turns (max 10 for token efficiency)
    ...history.slice(-10).map((turn) => ({
      role: turn.role === 'user' ? 'user' : 'model',
      parts: [{ text: turn.content }],
    })),
    // Current user message
    {
      role: 'user',
      parts: [{ text: message.trim() }],
    },
  ];

  const requestBody = {
    contents,
    generationConfig: {
      temperature: 0.7,
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
      return res.status(200).json({ reply: "I'm sorry, I can't answer that. Please contact our team directly via the Contact page." });
    }

    const reply = candidate.content?.parts?.[0]?.text?.trim() || 'I apologize, I could not generate a response. Please try again.';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

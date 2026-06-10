export const SITE_BASE_URL = 'https://www.metrodevelopers.co.in';

// ─── LOCAL MARKET PAGES ────────────────────────────────────────────────────────
// Strategy:
//   • /industrial-sheds-in-moraiya → let /metro-industrial-park own Moraiya (no new Moraiya pages)
//   • Changodar, NH 47 / Sarkhej-Bavla, Ahmedabad, Warehouses → support pages
//   • NEW: for-sale / for-rent / godown intent pages → higher conversion keywords
//   • NEW: Sanand + NH 47 / Bavla corridor → capture expanding industrial belt
//   • Investment & Guide pages → trust + TOFU traffic
//   • All pages brand-aware: Metro Developers (not just Metro Industrial Park)
//
// HIGHWAY NAMING:
//   Always reference the road as: Sarkhej–Bavla Highway (NH 947)
//   Alternate names used for SEO breadth:
//     • NH 947 (official NHAI designation)
//     • Sarkhej–Bavla Highway
//     • Rajkot–Ahmedabad Expressway (SH 17 connector)
//     • Bavla–Sarkhej Road

export const LOCAL_MARKET_PAGES = [
  // ─── PRIORITY 1: #1 target — "industrial sheds in Moraiya" ─────────────────
  // NOTE: /metro-industrial-park is the primary Moraiya page.
  // This page acts as a supporting funnel, not a duplicate.
  {
    path: '/industrial-sheds-in-moraiya',
    breadcrumb: 'Industrial Sheds in Moraiya',
    title: 'Industrial Sheds in Moraiya | Sale & Lease | Metro Industrial Park',
    description:
      'Industrial sheds for sale and lease in Moraiya, Changodar, Ahmedabad. Metro Industrial Park offers 4,000–50,000 sq.ft units with 30–35 ft height, 60 ft roads, CCTV, 90-day possession.',
    keywords:
      'industrial sheds in moraiya, industrial shed moraiya, shed for sale moraiya, industrial space moraiya, moraiya industrial park, industrial shed moraiya changodar',
    image: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    ogImageAlt: 'Industrial sheds for sale and lease in Moraiya, Changodar, Ahmedabad',
    heading: 'Industrial Sheds in Moraiya for Sale and Lease',
    summary:
      'Metro Industrial Park is Moraiya\'s most strategically placed industrial development — 63 units on a 54,000 sq.yard campus, directly accessible from Sarkhej–Bavla National Highway (NH 47). Available for sale and lease with 90-day possession.',
    focusKeyword: 'Industrial sheds in Moraiya',
    locationName: 'Moraiya, Changodar',
    schemaName: 'Industrial Sheds in Moraiya, Changodar, Ahmedabad',
    showInPrimaryNavigation: true,
    localPitch:
      'Moraiya has emerged as one of Ahmedabad\'s most active industrial micro-markets, driven by direct access to the Sarkhej–Bavla Highway (NH 47) and proximity to GIDC clusters. Industrial sheds here attract consistent demand from logistics operators, manufacturers, and investors seeking stable lease income in a growth corridor.',
    demandDrivers: [
      'Direct Sarkhej–Bavla Highway (NH 47) access for faster truck turnaround',
      'Growing manufacturing and warehousing cluster in Moraiya–Changodar belt',
      'Strong rental demand from FMCG, pharma, auto-ancillary, and e-commerce sectors',
      'Proximity to Ahmedabad airport and major industrial hubs',
    ],
    bestFor: [
      'Manufacturers needing highway-accessible production space in Moraiya',
      'Logistics operators requiring large-format warehouse units',
      'Investors targeting 6–8% rental yield with long-term lease agreements',
    ],
    faqs: [
      {
        q: 'Where exactly are the industrial sheds in Moraiya located?',
        a: 'Metro Industrial Park is located in Moraiya, Changodar, Ahmedabad — opposite Suvas Industrial Estate, behind Siya Logistics Park, near the Sarkhej–Bavla National Highway (NH 47). GPS coordinates: 22.914°N, 72.417°E.',
      },
      {
        q: 'What are the sizes of industrial sheds available in Moraiya?',
        a: 'Metro Industrial Park in Moraiya offers 63 industrial units ranging from 4,000 sq.ft to 50,000 sq.ft on a 54,000 sq.yard campus — suitable for small manufacturing units to large warehousing operations.',
      },
      {
        q: 'What is the price of industrial sheds in Moraiya?',
        a: 'Industrial shed pricing in Moraiya depends on unit size, type (sale or lease), and construction specifications. Contact Metro Industrial Park at +91 98242 35642 or WhatsApp for a current price list.',
      },
      {
        q: 'How quickly can I get possession of an industrial shed in Moraiya?',
        a: 'Metro Industrial Park offers possession within 90 days of agreement execution — one of the fastest timelines for industrial sheds in Moraiya and the wider Changodar corridor.',
      },
      {
        q: 'Is Metro Industrial Park on Instagram?',
        a: 'Yes. Follow @metro.industrialpark on Instagram for the latest unit availability, site progress photos, and property updates from Metro Industrial Park, Moraiya.',
      },
    ],
  },

  // ─── PRIORITY 2: top-3 Changodar target ────────────────────────────────────
  {
    path: '/industrial-sheds-in-changodar',
    breadcrumb: 'Industrial Sheds in Changodar',
    title: 'Industrial Sheds in Changodar | NH 47 Corridor | Sale & Lease | Metro Industrial Park',
    description:
      'Premium industrial sheds in Changodar, Ahmedabad for sale and lease. Metro Industrial Park offers units from 4,000–50,000 sq.ft on the NH 47 / Sarkhej–Bavla Highway corridor with fast possession.',
    keywords:
      'industrial sheds in changodar, industrial shed changodar, shed for sale changodar, industrial space changodar ahmedabad, changodar industrial park, warehouse changodar, nh 47 industrial sheds, industrial property near nh 47, sarkhej bavla highway industrial property',
    image: '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
    ogImageAlt: 'Industrial sheds in Changodar Ahmedabad near NH 47',
    heading: 'Industrial Sheds in Changodar Built for Modern Business on NH 47',
    summary:
      'Changodar is one of Ahmedabad\'s fastest-growing industrial corridors. Metro Industrial Park sits at its heart — with 63 ready-to-occupy units, 60 ft RCC roads, and a location minutes from NH 47 / the Sarkhej–Bavla Highway.',
    focusKeyword: 'Industrial sheds in Changodar',
    locationName: 'Changodar, Ahmedabad',
    schemaName: 'Industrial Sheds in Changodar, Moraiya, Ahmedabad',
    showInPrimaryNavigation: true,
    localPitch:
      'Changodar consistently attracts industrial demand from manufacturers, traders, and logistics operators because of its NH 47 connectivity, deep labour pool, and proximity to Sanand and Bavla industrial zones. Metro Industrial Park is positioned at the Moraiya–Changodar intersection — maximising connectivity for tenants and investors alike.',
    demandDrivers: [
      'NH 47 connectivity reduces fleet operating costs',
      'Dense industrial ecosystem of FMCG, pharma, and auto-ancillary firms',
      'Strong lease demand from multi-city distribution operators',
      'Growing proximity to Sanand EV and manufacturing cluster',
    ],
    bestFor: [
      'Businesses scaling up from smaller GIDC units in Changodar',
      'Distribution-first businesses needing highway-linked storage',
      'Investors targeting stable 6–8% rental yield in Changodar',
    ],
    faqs: [
      {
        q: 'Where are the industrial sheds in Changodar?',
        a: 'Metro Industrial Park is located in Moraiya, Changodar, Ahmedabad — opp. Suvas Industrial Estate, near NH 47 / Sarkhej–Bavla Highway. It is one of the largest industrial parks in the Changodar belt.',
      },
      {
        q: 'What unit sizes are available for industrial sheds in Changodar?',
        a: 'Units at Metro Industrial Park in the Changodar corridor range from 4,000 sq.ft to 50,000 sq.ft. The 63-unit park sits on 54,000 sq.yards with 30–35 ft ceiling clearance.',
      },
      {
        q: 'Can I lease an industrial shed in Changodar for long-term use?',
        a: 'Yes. Metro Industrial Park offers 5–10 year lease agreements with 5–10% annual escalation clauses, providing stable income for investors and predictable costs for tenants in Changodar.',
      },
      {
        q: 'What is the rental yield for industrial sheds in Changodar?',
        a: 'Metro Industrial Park delivers 6–8% annual rental yield on shed units in Changodar, with up to 10–12% yearly appreciation in the Moraiya–Changodar industrial corridor.',
      },
    ],
  },

  // ─── Warehouses in Changodar ────────────────────────────────────────────────
  {
    path: '/warehouses-in-changodar',
    breadcrumb: 'Warehouses in Changodar',
    title: 'Warehouses in Changodar Ahmedabad | Industrial Lease and Sale',
    description:
      'Explore warehouses in Changodar with modern infra, CCTV security, and strategic connectivity to Ahmedabad and NH 47 (Sarkhej Bavla Highway).',
    keywords:
      'warehouses in changodar, warehouse for lease changodar, industrial warehouse ahmedabad, changodar storage space, warehouse near nh 947 ahmedabad',
    image: '/images/warehouse-unit-lease-changodar-ahmedabad.jpg',
    ogImageAlt: 'Warehouse units in Changodar Ahmedabad for lease and sale near NH 947',
    heading: 'Warehouses in Changodar Built for Scalable Logistics',
    summary:
      'Changodar attracts consistent warehousing demand because it balances highway accessibility with proximity to production zones. Metro Industrial Park is positioned at the heart of this corridor — with ready-to-lease units and fast possession, just minutes from NH 947 (Sarkhej–Bavla Highway).',
    focusKeyword: 'Warehouses in Changodar',
    locationName: 'Changodar, Ahmedabad',
    schemaName: 'Warehouses in Changodar, Ahmedabad',
    localPitch:
      "Changodar's density of FMCG, pharma, and e-commerce support chains makes it one of Ahmedabad's most consistently occupied warehousing corridors. The direct connection to NH 947 — the Sarkhej–Bavla Highway linking western Ahmedabad to Rajkot — means warehouses here see metro industrial Park sees strong repeat-lease demand from distribution-heavy operators.",
    demandDrivers: [
      'Reliable access to NH 947 (Sarkhej–Bavla Highway) freight corridors',
      'Lower downtime from smoother in-out truck circulation',
      'Growing demand from FMCG, pharma, and e-commerce support chains',
      'Future-ready fit for long-term lease agreements',
    ],
    bestFor: [
      'Regional distribution hubs',
      'Inventory-heavy businesses requiring high clear-height storage',
      'Investors looking for stable lease-linked rental yields',
    ],
    faqs: [
      {
        q: 'What warehouse sizes are available in Changodar?',
        a: 'Units at Metro Industrial Park range from 4,000 to 50,000 sq.ft, suitable for both boutique storage operations and large-format distribution hubs in the Changodar corridor.',
      },
      {
        q: 'Is warehousing in Changodar eligible for GST input credit?',
        a: 'Yes. Industrial lessees in Changodar operating as registered businesses can claim full GST input credit on lease payments — a significant advantage over residential or retail leasing.',
      },
      {
        q: 'How close is Changodar to NH 47?',
        a: "Changodar sits directly on the NH 47 / Sarkhej–Bavla National Highway corridor, giving warehouses here immediate access to Ahmedabad's primary westbound freight route and onward to national expressways.",
      },
      {
        q: 'What is the rental yield for warehouses in Changodar?',
        a: 'Metro Industrial Park delivers 6–8% annual rental yield on warehouse units, with 5–10 year lease agreements that include built-in 5–10% annual escalation clauses for inflation-adjusted income.',
      },
    ],
  },

  // ─── Industrial sheds near NH 47 / Sarkhej Bavla Highway ──────────────────
  {
    path: '/industrial-sheds-near-sarkhej-bavla-highway',
    breadcrumb: 'Industrial Sheds Near NH 47',
    title: 'Industrial Sheds Near NH 47 | Sarkhej-Bavla Highway Ahmedabad',
    description:
      'Discover industrial sheds near NH 47 in the Sarkhej-Bavla Highway corridor for faster logistics, better movement efficiency, and durable industrial infrastructure.',
    keywords:
      'industrial sheds near nh 47, industrial sheds near sarkhej bavla highway, industrial property near nh 47, industrial property near sarkhej bavla highway, warehouse near nh 47 ahmedabad, factory shed near nh 47',
    image: '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
    ogImageAlt: 'Industrial sheds near NH 47 Ahmedabad',
    heading: 'Industrial Sheds Near NH 47 for Faster Turnaround',
    summary:
      'If your operation depends on truck turnaround time and corridor access, the NH 47 / Sarkhej–Bavla Highway micro-market is one of the strongest in Ahmedabad. Metro Industrial Park delivers highway-adjacent sheds with 60 ft internal roads and 90-day possession.',
    focusKeyword: 'Industrial sheds near NH 47',
    locationName: 'NH 47 Corridor, Ahmedabad',
    schemaName: 'Industrial sheds near NH 47, Ahmedabad',
    localPitch:
      "The NH 47 / Sarkhej–Bavla Highway is Ahmedabad's busiest industrial freight axis, connecting the western GIDC clusters to the city core and the national expressway network. Sheds along this corridor consistently attract logistics-first tenants with multi-city movement requirements — driving stable occupancy and strong lease renewal rates.",
    demandDrivers: [
      'NH 947 (Sarkhej–Bavla Highway) adjacency for time-sensitive dispatch cycles',
      'Reduced routing complexity for incoming and outgoing freight',
      'Easy access for clients, vendors, and field teams',
      'Strong fit for companies with multi-city movement requirements',
    ],
    bestFor: [
      'Distribution-first business models',
      'Multi-client warehousing and transport-linked operations',
      'Investors prioritizing liquidity and tenant retention',
    ],
    faqs: [
      {
        q: 'Why choose industrial sheds near NH 47 over other Ahmedabad zones?',
        a: 'Highway-adjacent sheds dramatically reduce truck turnaround time. Businesses with time-sensitive dispatch cycles or fleet-heavy operations see measurable logistics cost savings compared to interior industrial zones.',
      },
      {
        q: 'What infrastructure do sheds near NH 47 offer?',
        a: 'Metro Industrial Park provides 60 ft RCC internal roads designed for heavy vehicles, 24/7 CCTV security, round-the-clock water supply, and underground drainage — all within minutes of NH 47.',
      },
      {
        q: 'What infrastructure do sheds near NH 947 (Sarkhej Bavla Highway) offer?',
        a: 'Metro Industrial Park provides 60 ft RCC internal roads designed for heavy vehicles, 24/7 CCTV security, round-the-clock water supply, and underground drainage — all within minutes of NH 947.',
      },
      {
        q: 'How quickly can I take possession of a shed near NH 47?',
        a: 'Metro Industrial Park offers possession within 90 days of agreement execution — one of the fastest timelines in the Ahmedabad industrial market.',
      },
    ],
  },

  // ─── Industrial sheds in Ahmedabad ─────────────────────────────────────────
  {
    path: '/industrial-sheds-in-ahmedabad',
    breadcrumb: 'Industrial Sheds in Ahmedabad',
    title: 'Industrial Sheds in Ahmedabad | Sale and Lease Near Changodar Corridor',
    description:
      'Explore industrial sheds in Ahmedabad with strong access to Changodar and NH 47 (Sarkhej Bavla Highway) through Metro Industrial Park.',
    keywords:
      'industrial sheds in ahmedabad, industrial property ahmedabad, warehouse in ahmedabad for lease, factory shed ahmedabad, industrial shed near nh 947 ahmedabad',
    image: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    ogImageAlt: 'Industrial sheds and warehouse options in Ahmedabad near NH 947',
    heading: 'Industrial Sheds in Ahmedabad with Corridor-Level Access',
    summary:
      "Ahmedabad's industrial market is expanding rapidly, anchored by the Moraiya–Changodar–Bavla corridor along NH 947 (Sarkhej–Bavla Highway). Metro Industrial Park puts your business at the centre of this growth — with scalable units, highway connectivity, and investor-grade yields.",
    focusKeyword: 'Industrial sheds in Ahmedabad',
    locationName: 'Ahmedabad',
    schemaName: 'Industrial sheds in Ahmedabad',
    showInPrimaryNavigation: false,
    localPitch:
      "Ahmedabad's industrial demand is anchored by the Changodar–Moraiya–Bavla corridor along NH 947, which has emerged as the city's primary logistics and manufacturing spine. Metro Industrial Park is positioned at its centre, giving tenants simultaneous access to NH 947 freight movement and Ahmedabad's urban supply chains.",
    demandDrivers: [
      'Ahmedabad industrial demand anchored by Changodar and NH 947 logistics clusters',
      'NH 947 (Sarkhej–Bavla Highway) access improves dispatch speed and fleet efficiency',
      'Suitable for both owner-users and yield-seeking industrial investors',
      'Search intent aligned for buyers evaluating city-level options first',
    ],
    bestFor: [
      'Businesses shortlisting Ahmedabad industrial locations before site visits',
      'Investors comparing yield-oriented industrial assets',
      'Operators needing scalable shed and warehousing footprints',
    ],
    faqs: [
      {
        q: 'Which area of Ahmedabad is best for industrial sheds?',
        a: "The Moraiya–Changodar corridor near NH 47 is Ahmedabad's most logistics-efficient industrial micro-market, combining highway access with proximity to GIDC zones and the international airport.",
      },
      {
        q: 'What sizes of industrial sheds are available in Ahmedabad?',
        a: 'Metro Industrial Park offers units from 4,000 to 50,000 sq.ft across 63 industrial units on a 54,000 sq.yard campus — accommodating everything from small-scale manufacturing to large warehousing operations.',
      },
      {
        q: 'Are industrial sheds in Ahmedabad a good investment in 2025–26?',
        a: "Ahmedabad industrial real estate has delivered 6–8% rental yield with 10–12% yearly appreciation in high-demand corridors. India's industrial leasing hit a record 37M sq.ft in 2025, with Ahmedabad among the key contributing markets.",
      },
      {
        q: 'Can I lease an industrial shed in Ahmedabad for manufacturing?',
        a: 'Yes. Metro Industrial Park units come with 30–35 ft ceiling clearance, reinforced flooring for heavy loads, 60 ft RCC internal roads, and 24/7 utilities — making them production-ready from day one.',
      },
    ],
  },

  // ─── NEW: Industrial Shed for Rent in Changodar (high buying-intent) ────────
  {
    path: '/industrial-shed-for-rent-changodar',
    breadcrumb: 'Industrial Shed for Rent in Changodar',
    title: 'Industrial Shed for Rent in Changodar | Warehouse on Lease Ahmedabad',
    description:
      'Industrial sheds for rent in Changodar, Moraiya. Metro Industrial Park offers warehouse and factory units on long-term lease — 4,000 to 50,000 sq.ft, 90-day possession, 6–8% yield. Near NH 947 (Sarkhej–Bavla Highway). Call now.',
    keywords:
      'industrial shed for rent changodar, shed for rent changodar, warehouse for lease changodar, factory for rent changodar ahmedabad, industrial unit rent moraiya changodar, shed for rent near nh 947',
    image: '/images/warehouse-unit-lease-changodar-ahmedabad.jpg',
    ogImageAlt: 'Industrial shed for rent in Changodar near NH 47',
    heading: 'Industrial Shed for Rent in Changodar — Ready-to-Lease Units',
    summary:
      'Need an industrial shed for rent in Changodar? Metro Industrial Park offers flexible lease units from 4,000 sq.ft in the heart of the Moraiya–Changodar industrial corridor — with 60 ft RCC roads, 24/7 security, and transparent 5–10 year agreements. Located minutes from the Sarkhej–Bavla Highway (NH 947).',
    focusKeyword: 'Industrial shed for rent in Changodar',
    locationName: 'Changodar, Moraiya, Ahmedabad',
    schemaName: 'Industrial shed for rent in Changodar, Ahmedabad',
    showInPrimaryNavigation: false,
    localPitch:
      'Changodar is one of the most in-demand industrial rental markets in Gujarat. Its direct access to NH 947 (Sarkhej–Bavla Highway) and proximity to GIDC zones means lease demand from manufacturers and distributors remains consistently high — making it equally attractive for owner-investors seeking stable, long-term tenants.',
    demandDrivers: [
      'Strong renter base from FMCG, pharma, auto-ancillary, and e-commerce sectors',
      'NH 947 (Sarkhej–Bavla Highway) adjacent location suits logistics-heavy tenants',
      'Lease agreement structures protect investor income through escalation clauses',
      'Consistent occupancy driven by Changodar industrial ecosystem depth',
    ],
    bestFor: [
      'Businesses seeking ready industrial space on flexible lease in Changodar',
      'Manufacturers looking for highway-linked production space',
      'Investors buying to lease — targeting 6–8% annual rental yield',
    ],
    faqs: [
      {
        q: 'What is the rent for an industrial shed in Changodar?',
        a: 'Lease pricing at Metro Industrial Park in Changodar varies by unit size, lease term, and specifications. Call +91 98242 35642 or WhatsApp for a current lease rate sheet and available inventory.',
      },
      {
        q: 'What lease terms are available for industrial sheds in Changodar?',
        a: 'Metro Industrial Park offers structured 5–10 year lease agreements with annual escalation clauses of 5–10%, giving both tenants and investors clear, long-term financial visibility.',
      },
      {
        q: 'Can I view the shed before signing a lease in Changodar?',
        a: 'Yes. Metro Industrial Park offers site visits by appointment. Call or WhatsApp +91 98242 35642 to schedule a free visit to Moraiya, Changodar.',
      },
      {
        q: 'Is GST applicable on industrial shed rent in Changodar?',
        a: 'Yes. GST at the applicable commercial rate applies to lease payments. However, most registered businesses can offset this as input tax credit, effectively reducing net lease cost.',
      },
    ],
  },

  // ─── NEW: Industrial Shed for Sale Changodar (for-sale intent) ──────────────
  {
    path: '/industrial-shed-for-sale-changodar',
    breadcrumb: 'Industrial Shed for Sale in Changodar',
    title: 'Industrial Shed for Sale in Changodar Ahmedabad | Metro Industrial Park',
    description:
      'Industrial sheds for sale in Changodar, Moraiya. Metro Industrial Park offers freehold units from 4,000–50,000 sq.ft with 90-day possession and 16–20% combined return potential. Near NH 947 (Sarkhej–Bavla Highway), Ahmedabad.',
    keywords:
      'industrial shed for sale changodar, shed for sale changodar ahmedabad, buy industrial shed changodar, industrial plot for sale changodar, factory shed sale moraiya changodar, shed for sale near nh 947',
    image: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    ogImageAlt: 'Industrial shed for sale in Changodar Ahmedabad at Metro Industrial Park near NH 947',
    heading: 'Industrial Shed for Sale in Changodar — Own Your Industrial Space',
    summary:
      'Metro Industrial Park in Moraiya, Changodar offers industrial sheds for outright sale. Units from 4,000 sq.ft to 50,000 sq.ft with strong investment fundamentals — 6–8% rental yield from day one and up to 10–12% annual appreciation in the Changodar corridor. Located on the Sarkhej–Bavla Highway (NH 947).',
    focusKeyword: 'Industrial shed for sale in Changodar',
    locationName: 'Changodar, Moraiya, Ahmedabad',
    schemaName: 'Industrial shed for sale in Changodar, Ahmedabad',
    showInPrimaryNavigation: false,
    localPitch:
      'Buying industrial property in Changodar gives you long-term control over costs — no rent escalation, full asset appreciation, and the ability to lease the unit out for consistent income. The Moraiya–Changodar corridor along NH 947 (Sarkhej–Bavla Highway) has seen 10–12% annual appreciation, making this one of Ahmedabad\'s most resilient industrial investment zones.',
    demandDrivers: [
      'Freehold ownership eliminates long-term rent exposure',
      'Asset appreciates with NH 947 corridor infrastructure growth',
      'Lease-back to tenants enables dual income from ownership',
      'Exit liquidity strong — active buyer market in Changodar industrial belt',
    ],
    bestFor: [
      'Business owners looking to own production or warehousing space in Changodar',
      'Investors seeking buy-and-lease industrial assets',
      'HNIs building a portfolio of industrial property in Ahmedabad',
    ],
    faqs: [
      {
        q: 'What is the price of an industrial shed for sale in Changodar?',
        a: 'Industrial shed pricing at Metro Industrial Park depends on unit size, floor count, construction type, and current availability. Contact the sales team at +91 98242 35642 for an updated price list.',
      },
      {
        q: 'What is the expected return on buying an industrial shed in Changodar?',
        a: 'Industrial sheds at Metro Industrial Park in Changodar deliver 6–8% annual rental yield combined with up to 10–12% annual capital appreciation — a total return potential of 16–20% in the Moraiya–Changodar corridor.',
      },
      {
        q: 'How long does possession take after purchasing a shed in Changodar?',
        a: 'Metro Industrial Park guarantees possession within 90 days of agreement execution — one of the fastest industrial possession timelines in the Changodar market.',
      },
      {
        q: 'Can I buy an industrial shed in Changodar and lease it out?',
        a: 'Yes. Many buyers at Metro Industrial Park purchase units as investment assets and lease them to manufacturing or logistics tenants on 5–10 year agreements with annual rent escalation clauses.',
      },
    ],
  },

  // ─── NEW: Godown for Rent Changodar (storage/godown specific intent) ─────────
  {
    path: '/godown-for-rent-changodar',
    breadcrumb: 'Godown for Rent in Changodar',
    title: 'Godown for Rent in Changodar Ahmedabad | Warehouse & Storage Space',
    description:
      'Godown and storage space for rent in Changodar, Moraiya, Ahmedabad. Metro Industrial Park offers industrial godown units on lease near NH 947 (Sarkhej–Bavla Highway) — CCTV, 24/7 water, 60ft roads, quick possession.',
    keywords:
      'godown for rent changodar, godown changodar ahmedabad, storage space for rent changodar, godown lease moraiya, warehouse godown changodar, godown near nh 947 ahmedabad',
    image: '/images/warehouse-unit-lease-changodar-ahmedabad.jpg',
    ogImageAlt: 'Godown and storage units for rent in Changodar Ahmedabad near NH 947',
    heading: 'Godown for Rent in Changodar — Industrial Storage with Modern Infrastructure',
    summary:
      'Looking for a godown for rent in Changodar? Metro Industrial Park provides secure, highway-connected industrial storage and godown units in Moraiya — with 30–35 ft clear height, wide internal roads, and flexible lease terms. Conveniently located near the Sarkhej–Bavla Highway (NH 947).',
    focusKeyword: 'Godown for rent in Changodar',
    locationName: 'Changodar, Moraiya, Ahmedabad',
    schemaName: 'Godown for rent in Changodar, Ahmedabad',
    showInPrimaryNavigation: false,
    localPitch:
      'Changodar is the primary storage and distribution hub for western Ahmedabad, anchored by NH 947 (Sarkhej–Bavla Highway). Its highway access and dense industrial ecosystem mean godown units here are rarely vacant — making it a reliable market for both operators needing storage and investors seeking occupancy-backed lease income.',
    demandDrivers: [
      'Strong godown demand from FMCG, pharma, and trading firms in Changodar',
      'NH 947 (Sarkhej–Bavla Highway) connectivity reduces in-bound and out-bound logistics time',
      'Clear-height units suited for stacked storage and pallet racking systems',
      '24/7 security ensures inventory protection at all times',
    ],
    bestFor: [
      'Trading and distribution businesses needing dedicated storage in Changodar',
      'E-commerce and FMCG firms requiring scalable inventory space',
      'Investors seeking fully-occupied godown assets for lease income',
    ],
    faqs: [
      {
        q: 'What is the rent for a godown in Changodar?',
        a: 'Godown lease pricing at Metro Industrial Park in Changodar varies by unit size and lease term. Call +91 98242 35642 or WhatsApp for current godown rental rates and available units.',
      },
      {
        q: 'What is the minimum size for a godown for rent in Changodar?',
        a: 'Metro Industrial Park offers godown and storage units from 4,000 sq.ft, with options up to 50,000 sq.ft for large-format warehouse and godown requirements in the Changodar corridor.',
      },
      {
        q: 'Are the godowns in Changodar suitable for FMCG storage?',
        a: 'Yes. Metro Industrial Park godowns in Changodar have 30–35 ft ceiling clearance, ground-level loading access, and 24/7 water supply and CCTV — making them well-suited for FMCG, pharma, and general trade storage.',
      },
      {
        q: 'How quickly can I get a godown in Changodar?',
        a: 'Metro Industrial Park offers possession of industrial godown and storage units within 90 days. Contact the sales team to check currently available units in Changodar.',
      },
    ],
  },

  // ─── NEW: Industrial Park near Sanand (corridor expansion) ──────────────────
  {
    path: '/industrial-park-near-sanand',
    breadcrumb: 'Industrial Park Near Sanand',
    title: 'Industrial Park Near Sanand Ahmedabad | Sheds & Warehouse — Metro Developers',
    description:
      'Industrial park near Sanand, Ahmedabad. Metro Industrial Park in Moraiya, Changodar is 15–20 min from Sanand via NH 947 (Sarkhej–Bavla Highway) — modern sheds, warehouses, and plots for sale and lease. Metro Developers.',
    keywords:
      'industrial park near sanand, industrial shed near sanand ahmedabad, warehouse near sanand gujarat, industrial property sanand corridor, shed for sale near sanand, industrial park nh 947 sanand',
    image: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    ogImageAlt: 'Industrial park near Sanand Ahmedabad on NH 947 — Metro Developers',
    heading: 'Industrial Park Near Sanand — Metro Industrial Park, Changodar',
    summary:
      'Metro Industrial Park by Metro Developers is located in Moraiya, Changodar — 15–20 minutes from the Sanand industrial cluster. With direct access to the Sarkhej–Bavla Highway (NH 47) and proximity to Sanand\'s EV and automotive manufacturing zones, it is one of the most well-connected industrial destinations in western Ahmedabad.',
    focusKeyword: 'Industrial park near Sanand',
    locationName: 'Near Sanand, Changodar, Ahmedabad',
    schemaName: 'Industrial park near Sanand, Changodar, Ahmedabad',
    showInPrimaryNavigation: false,
    localPitch:
      'Sanand has attracted large-scale manufacturing investments from Tata, Suzuki, and other automotive giants. The supply chain ecosystem growing around Sanand creates strong demand for ancillary industrial space in nearby corridors like Moraiya–Changodar — where Metro Industrial Park sits just off NH 947 (Sarkhej–Bavla Highway), providing equivalent highway connectivity at competitive pricing.',
    demandDrivers: [
      'Overflow demand from Sanand\'s automotive and EV supply chain ecosystem',
      'Lower land cost versus core Sanand GIDC with equivalent highway access',
      'Shared logistics network with Sanand, Bavla, and Ahmedabad western zones',
      'Growing demand from Tier-2 auto-ancillary and component manufacturers',
    ],
    bestFor: [
      'Auto-ancillary and component suppliers serving Sanand manufacturers',
      'Businesses priced out of Sanand GIDC looking for adjacent corridors on NH 947',
      'Investors tracking industrial appreciation tied to Sanand growth',
    ],
    faqs: [
      {
        q: 'How far is Metro Industrial Park from Sanand?',
        a: 'Metro Industrial Park in Moraiya, Changodar is approximately 15–20 minutes from the Sanand GIDC industrial zone via the Sarkhej–Bavla National Highway (NH 47).',
      },
      {
        q: 'Is industrial property near Sanand a good investment?',
        a: 'Yes. Sanand\'s rapid manufacturing growth has driven demand spillover into the adjacent Moraiya–Changodar corridor, supporting strong occupancy and 10–12% annual appreciation at Metro Industrial Park.',
      },
      {
        q: 'What types of businesses work best near the Sanand corridor?',
        a: 'Auto-ancillary suppliers, EV component manufacturers, logistics providers, and FMCG distributors serving the Sanand cluster are ideal tenants for industrial sheds in the Changodar–Moraiya belt along NH 947.',
      },
      {
        q: 'Does Metro Developers have projects near Sanand?',
        a: 'Metro Industrial Park by Metro Developers in Moraiya, Changodar is the current flagship project serving the Sanand corridor. Future projects by Metro Developers will be announced at metrodevelopers.co.in.',
      },
    ],
  },

  // ─── Investment in real estate in Ahmedabad ─────────────────────────────────
  {
    path: '/investment-in-real-estate-in-ahmedabad',
    breadcrumb: 'Investment in Real Estate in Ahmedabad',
    title: 'Investment in Real Estate in Ahmedabad | Warehouses, Godowns & Industrial Sheds',
    description:
      'Explore investment in real estate in Ahmedabad with warehouses, godowns, and industrial sheds near NH 947 (Sarkhej–Bavla Highway) that support manufacturing, storage, and practical business growth.',
    keywords:
      'investment in real estate in ahmedabad, invest in warehouses, invest in godowns, industrial sheds in ahmedabad, industrial property investment ahmedabad, build your own business in manufacturing, invest near nh 947 ahmedabad',
    image: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    ogImageAlt: 'Industrial sheds, warehouses, and manufacturing space in Ahmedabad near NH 947',
    heading: 'Investment in Real Estate in Ahmedabad for Warehouses, Godowns and Industrial Sheds',
    summary:
      'For business owners and investors, industrial real estate in Ahmedabad can be a practical way to build capacity, support manufacturing, and create space for storage or distribution. When real assets are put to work by real businesses, they help strengthen local employment and contribute steadily to India\'s economy.',
    focusKeyword: 'Investment in real estate in Ahmedabad',
    locationName: 'Ahmedabad',
    schemaName: 'Investment in real estate in Ahmedabad',
    localPitch:
      'Ahmedabad rewards asset choices that serve actual business use. Warehouses, godowns, and industrial sheds along the NH 947 (Sarkhej–Bavla Highway) corridor give manufacturers room to grow, help distributors manage inventory, and create durable industrial capacity that supports the city\'s economy in a practical way.',
    demandDrivers: [
      'Demand from manufacturers, distributors, and trading businesses',
      'Flexible use for storage, production, or business expansion',
      'A tangible asset class that supports operations, not just speculation',
      'Long-term relevance in Ahmedabad\'s industrial ecosystem along NH 947',
    ],
    bestFor: [
      'Investors seeking industrial real estate exposure in Ahmedabad',
      'Business owners planning to build their own business in manufacturing',
      'Operators needing warehouses, godowns, or industrial sheds',
    ],
    faqs: [
      {
        q: 'Why invest in real estate in Ahmedabad?',
        a: "Ahmedabad combines industrial demand, logistics access via NH 947 (Sarkhej–Bavla Highway), and a deep base of manufacturers and traders. That mix creates practical long-term utility for warehouses, godowns, and industrial sheds.",
      },
      {
        q: 'Are warehouses and godowns a good option for business owners?',
        a: 'Yes. If your business depends on storage, dispatch, or inventory management, warehouses and godowns can be more functional than pure retail property and easier to align with daily operations.',
      },
      {
        q: 'Can an industrial shed support manufacturing?',
        a: 'Yes. A well-planned industrial shed can support light to medium manufacturing, assembly, and processing work if the structure, access, flooring, and utilities match your workflow.',
      },
      {
        q: 'How does industrial real estate support the economy?',
        a: 'When warehouses, godowns, and sheds are occupied by real businesses, they help generate jobs, improve supply chains, and support local production in a steady and practical way.',
      },
      {
        q: 'What should I check before investing in industrial property?',
        a: 'Check access roads, utility readiness, legal compliance, clear height, load capacity, and whether the asset fits your storage or manufacturing plan before making a decision.',
      },
    ],
  },
];

// ─── GUIDE / INSIGHT PAGES ────────────────────────────────────────────────────
export const GUIDE_PAGES = [
  {
    path: '/guides/gst-input-credit-industrial-tenants-gujarat',
    breadcrumb: 'GST Input Credit Guide',
    title: 'GST Input Credit for Industrial Tenants in Gujarat | Practical Guide',
    description:
      'Understand how industrial tenants in Gujarat use GST input credit and why this increases lease attractiveness for warehouse and shed investors near NH 947 (Sarkhej–Bavla Highway), Changodar, Ahmedabad.',
    keywords:
      'gst input credit industrial tenants gujarat, industrial lease gst benefit, warehouse gst input credit, commercial lease tax benefit gujarat',
    image: '/images/metro-industrial-park-office-changodar.jpg',
    ogImageAlt: 'GST input credit guide for industrial shed tenants in Gujarat',
    heading: 'How GST Input Credit Strengthens Industrial Leasing in Gujarat',
    intro:
      'GST input credit often becomes a decisive factor for tenant preference in industrial assets. Investors who understand this dynamic can position sheds and warehouses more effectively and sustain stronger occupancy.',
    sections: [
      {
        title: 'Why GST input credit changes tenant economics',
        body: [
          'Eligible businesses can offset GST paid on lease-related expenses against output tax liability. That improves effective occupancy cost versus residential alternatives where this route is usually unavailable.',
          'When tenant-level cash flow improves, lease renewals and long-term occupancy become more likely, directly supporting predictable rental income.',
        ],
        points: [
          'Lower effective tax burden for eligible tenants',
          'Higher tenant stickiness due to better net operating economics',
          'Greater confidence in multi-year lease planning',
        ],
      },
      {
        title: 'What investors should highlight during leasing conversations',
        body: [
          'Focus on use-case fit, invoice quality, and transparent lease documentation. Tenants evaluating GST impact care about operational practicality and compliance confidence as much as rent.',
        ],
        points: [
          'Clear lease terms and invoicing timelines',
          'Infrastructure readiness for production or logistics workflows',
          'Stability signals: security, roads, water, and access',
        ],
      },
    ],
  },
  {
    path: '/guides/warehousing-yield-cagr-gujarat',
    breadcrumb: 'Warehousing Yield CAGR Guide',
    title: 'Why Warehousing Can Deliver 16-20% CAGR Potential in Gujarat',
    description:
      'A practical overview of how rental yield and appreciation combine to create strong warehousing CAGR potential in Ahmedabad and Gujarat industrial zones along the NH 947 (Sarkhej–Bavla Highway) corridor.',
    keywords:
      'warehousing cagr gujarat, industrial shed rental yield ahmedabad, warehouse appreciation gujarat, industrial real estate return analysis',
    image: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    ogImageAlt: 'Warehousing CAGR and rental yield guide for Gujarat investors',
    heading: 'Understanding 16-20% Warehousing Return Potential in Gujarat',
    intro:
      'Industrial returns are typically a blend of recurring rental yield and asset appreciation in expanding logistics corridors. This framework helps investors evaluate return quality, not just headline percentages.',
    sections: [
      {
        title: 'Return stack: yield plus appreciation',
        body: [
          'In industrial micro-markets with sustained demand, investors can target rental yield in the 6-8% range and combine it with long-term appreciation as infrastructure and tenant demand deepen.',
          'This blended approach is one reason industrial assets often outperform passive alternatives in inflationary cycles.',
        ],
        points: [
          'Rental stream supports ongoing cash flow',
          'Appreciation compounds long-term equity value',
          'Lease escalation clauses can improve real returns',
        ],
      },
      {
        title: 'Risk controls that improve compounding consistency',
        body: [
          'Not all industrial properties perform equally. Location access, tenant quality, and infrastructure reliability materially influence occupancy, renewal behavior, and valuation trajectory.',
        ],
        points: [
          'Prefer assets with established connectivity and truck movement efficiency',
          'Track lease tenor and escalation quality, not just initial rent',
          'Favor micro-markets with durable manufacturing and logistics demand',
        ],
      },
    ],
  },
  // ─── Industrial Property Due Diligence Guide ────────────────────────────────
  {
    path: '/guides/industrial-property-due-diligence-ahmedabad',
    breadcrumb: 'Industrial Property Due Diligence',
    title: 'Industrial Property Due Diligence Checklist | Ahmedabad Buyers & Investors',
    description:
      'A practical due diligence checklist for buying or leasing industrial property in Ahmedabad — covering title, infrastructure, zoning, and lease terms. Applies to sheds near NH 947 (Sarkhej–Bavla Highway), Changodar, and Moraiya.',
    keywords:
      'industrial property due diligence ahmedabad, buy industrial shed checklist gujarat, industrial real estate legal check, shed purchase checklist ahmedabad',
    image: '/images/metro-industrial-park-office-changodar.jpg',
    ogImageAlt: 'Industrial property due diligence guide for Ahmedabad buyers',
    heading: 'Industrial Property Due Diligence — What to Check Before Buying or Leasing in Ahmedabad',
    intro:
      'Buying or leasing industrial property in Ahmedabad involves more than price negotiation. A structured due diligence process protects your investment and ensures the asset performs as expected from day one.',
    sections: [
      {
        title: 'Title and legal checks',
        body: [
          'Verify clear title with no encumbrances. Confirm the land use classification permits industrial activity and that no acquisition or dispute notice has been registered against the plot.',
          'For new developments, check the developer\'s RERA registration and confirm all approvals (factory plan, fire NOC, environmental clearance) are in place before agreement.',
        ],
        points: [
          'Clear title deed with no mortgage or lien',
          'Industrial land use classification confirmed',
          'All statutory approvals obtained by developer',
        ],
      },
      {
        title: 'Infrastructure and operational readiness',
        body: [
          'Inspect road access for heavy vehicle movement, power load availability, water connection, and drainage. These directly affect operational costs and future lease demand.',
          'At Metro Industrial Park, all infrastructure is in place — 60 ft RCC roads, UGVCL power, 24/7 water supply, underground drainage, and a dedicated weigh bridge.',
        ],
        points: [
          'Road width adequate for trucks and trailers (min. 40 ft)',
          'Power load sanctioned and transformer on-site',
          'Water, drainage, and waste management confirmed',
        ],
      },
    ],
  },
  // ─── How to Find the Perfect Industrial Shed in Gujarat, Ahmedabad ──────────
  {
    path: '/guides/how-to-find-perfect-industrial-shed-gujarat-ahmedabad',
    breadcrumb: 'How to Find Perfect Industrial Shed in Gujarat',
    title: 'How to Find the Perfect Industrial Shed in Gujarat & Ahmedabad | Metro Developers',
    description:
      'Complete guide on how to find the perfect industrial shed in Gujarat and Ahmedabad — covering location, size, height, infrastructure, lease vs. buy, and why Moraiya–Changodar on NH 947 (Sarkhej–Bavla Highway) stands out.',
    keywords:
      'how to find perfect industrial shed in gujarat, find industrial shed ahmedabad, best industrial shed in gujarat, industrial shed guide ahmedabad gujarat, industrial shed checklist gujarat ahmedabad, perfect industrial shed changodar moraiya, find warehouse gujarat, industrial property search ahmedabad',
    image: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    ogImageAlt: 'How to find the perfect industrial shed in Gujarat and Ahmedabad — Metro Developers guide',
    heading: 'How to Find the Perfect Industrial Shed in Gujarat and Ahmedabad',
    intro:
      'Finding the right industrial shed in Gujarat is more than a property search — it is a business decision that shapes your logistics costs, operational efficiency, and long-term growth for years. This guide walks you through every factor that separates a great fit from a costly mismatch, with specific focus on Ahmedabad\'s top industrial corridors.',
    sections: [
      {
        title: 'Define your operational requirements first',
        body: [
          'Before opening a property portal or calling a broker, clearly define your minimum floor area, ceiling height, floor load capacity, number of loading bays, and power requirements. These are non-negotiable — retrofitting a shed after signing an agreement is expensive and often impossible.',
          'For most manufacturing and warehousing operations in Gujarat, 30–35 ft clear height, reinforced RCC flooring, and ground-level truck docks are the baseline. Metro Industrial Park units are built to these specifications, eliminating costly modifications after possession.',
        ],
        points: [
          'Floor area: current requirement + 25–30% buffer for business growth',
          'Ceiling height: 24 ft minimum for pallet racking; 30 ft+ for automated storage or tall machinery',
          'Floor load: verify slab load rating before placing heavy equipment or loaded forklifts',
          'Power: confirm transformer capacity and UGVCL/DISCOM sanctioned load for your machinery',
          'Loading docks: number of dock-height doors needed for your dispatch and receiving cycles',
        ],
      },
      {
        title: 'Choose the right location in Gujarat — Ahmedabad leads',
        body: [
          'Gujarat\'s industrial belt stretches across Surat, Rajkot, Vadodara, and Ahmedabad — but Ahmedabad consistently attracts the highest industrial demand due to its international airport, national highway connectivity, and deep GIDC ecosystem. Within Ahmedabad, the Moraiya–Changodar corridor along NH 947 (Sarkhej–Bavla Highway) is the city\'s most active micro-market for industrial sheds.',
          'NH 947 connects western Ahmedabad directly toward Rajkot and Bavla, creating a logistics spine that reduces fleet operating costs and improves turnaround time. Sheds within 3–5 km of this highway consistently show stronger occupancy rates, faster lease absorption, and higher capital appreciation than interior zones.',
        ],
        points: [
          'Proximity to NH 947 (Sarkhej–Bavla Highway) for truck movement efficiency in Ahmedabad',
          'Distance to GIDC clusters, labour markets, and vendor hubs in Moraiya–Changodar',
          'Access to Ahmedabad international airport for time-sensitive or export-linked operations',
          'Proximity to Sanand EV and automotive manufacturing zone — growing demand driver',
          'Avoid interior micro-markets with narrow approach roads or restricted HCV movement',
        ],
      },
      {
        title: 'Evaluate infrastructure quality, not just built area',
        body: [
          'The built area of a shed is only one variable. In Gujarat\'s industrial market, infrastructure quality — road width, power reliability, water availability, and security — determines how efficiently your business actually operates day to day.',
          'Metro Industrial Park in Moraiya, Changodar offers 60 ft RCC internal roads designed for heavy commercial vehicles, 24/7 CCTV surveillance, round-the-clock water supply, underground drainage, and a dedicated weigh bridge — removing common operational pain points from day one.',
        ],
        points: [
          '60 ft internal roads capable of accommodating 12-wheel trucks and trailers',
          '24/7 CCTV and on-site security for inventory protection and compliance requirements',
          'UGVCL power connection with transformer on-site and backup provision',
          'Underground drainage and solid waste management for manufacturing operations',
          'Dedicated weigh bridge for accurate dispatch and receiving',
        ],
      },
      {
        title: 'Lease or buy — matching the tenure to your plan',
        body: [
          'In Gujarat\'s industrial market, both sale and lease options are widely available. The right choice depends on your business stage, capital requirements, and long-term asset strategy. Buyers gain freehold ownership, full appreciation upside, and the option to lease-back for rental income. Lessees preserve working capital, retain flexibility to upsize, and benefit from GST input credit on lease payments.',
          'Metro Industrial Park offers both options. Buyers access 16–20% combined return potential (6–8% rental yield + 10–12% appreciation) in the Changodar corridor. Lessees benefit from structured 5–10 year agreements with annual escalation clauses that align with business cost planning.',
        ],
        points: [
          'Buy if you want asset ownership, capital appreciation, and lease-back income potential',
          'Lease if capital preservation, operational flexibility, or GST input recovery is a priority',
          '5–10 year lease agreements with 5–10% annual escalation are standard in Changodar',
          'Possession within 90 days at Metro Industrial Park — one of the fastest in Ahmedabad',
          'Freehold sale units at Metro Industrial Park carry no recurring ground rent or maintenance ambiguity',
        ],
      },
      {
        title: 'Verify legal status and developer credibility',
        body: [
          'In Gujarat\'s industrial real estate market, title clarity and statutory approvals are critical. Confirm industrial land use classification, clear title with no encumbrance, RERA registration for new developments, fire NOC, factory plan approval, and environmental clearance before signing any agreement.',
          'Metro Industrial Park in Moraiya, Changodar is a RERA-registered development with all statutory approvals in place — providing buyers and lessees with full legal transparency from the point of inquiry.',
        ],
        points: [
          'Industrial land use classification confirmed — not agricultural or residential conversion',
          'RERA registration verifiable at RERA Gujarat portal',
          'Fire NOC, factory plan, and environmental clearance obtained',
          'No encumbrance or acquisition notice on title',
          'Developer track record and delivery history verifiable',
        ],
      },
    ],
  },
];

// ─── SITEMAP ROUTES ───────────────────────────────────────────────────────────
// Used by the sitemap generator — covers all indexable pages.
// Future Metro Developers projects: add entries here with priority 0.85–0.90
// and update propertySchema / GUIDE_PAGES as projects launch.

export const SEO_ROUTES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: 1.0,
    images: [
      {
        loc: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
        title: 'Metro Industrial Park Aerial Site View',
        caption: 'Aerial view of Metro Industrial Park in Moraiya, Ahmedabad.',
      },
      {
        loc: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
        title: 'Industrial Sheds in Moraiya',
        caption: 'Industrial sheds for sale and lease in Moraiya, Ahmedabad.',
      },
    ],
  },
  {
    path: '/metro-industrial-park',
    changefreq: 'weekly',
    priority: 0.95, // bumped — primary money page
    images: [
      {
        loc: '/images/warehouse-unit-lease-changodar-ahmedabad.jpg',
        title: 'Warehouse Units in Changodar',
        caption: 'Warehouse and industrial units in Changodar, Ahmedabad.',
      },
    ],
  },
  {
    path: '/metro-arcade',
    changefreq: 'monthly',
    priority: 0.8,
    images: [
      {
        loc: '/images/arcade-top.jpeg',
        title: 'Metro Arcade Commercial Project',
      },
    ],
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: 0.7,
    images: [
      {
        loc: '/images/metro-industrial-park-office-changodar.jpg',
        title: 'Metro Enterprise Contact Office',
      },
    ],
  },
  {
    path: '/calculator',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    path: '/site-map',
    changefreq: 'weekly',
    priority: 0.7,
    images: [
      {
        loc: '/images/metro-industrial-park-site-plan-moraiya.jpg',
        title: 'Industrial Shed Site Plan',
      },
    ],
  },
  ...LOCAL_MARKET_PAGES.map((page) => ({
    path: page.path,
    changefreq: 'weekly',
    priority:
      page.path === '/industrial-sheds-in-moraiya' ||
      page.path === '/industrial-sheds-in-changodar' ||
      page.path === '/industrial-shed-for-rent-changodar' ||
      page.path === '/industrial-shed-for-sale-changodar'
        ? 0.88
        : 0.75,
    images: [{ loc: page.image, title: page.breadcrumb }],
  })),
  ...GUIDE_PAGES.map((page) => ({
    path: page.path,
    changefreq: 'monthly',
    priority: 0.64,
    images: [{ loc: page.image, title: page.breadcrumb }],
  })),
];

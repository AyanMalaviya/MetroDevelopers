// src/utils/schemas.js

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Metro Enterprise",
  "alternateName": "Metro Developers",
  "url": "https://www.metrodevelopers.co.in/"
};

export const propertySchema = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "name": "Industrial Sheds and Warehouses in Moraiya, Changodar, Ahmedabad | Metro Enterprise",
  "alternateName": "Metro Enterprise Moraiya Changodar Ahmedabad",
    "description": "Industrial sheds and warehouses for sale and lease in Moraiya, Changodar, and Ahmedabad. Unit sizes from 4,000 to 50,000 sq.ft with modern infrastructure and fast possession support.",
    "url": "https://www.metrodevelopers.co.in",
    "logo": "https://www.metrodevelopers.co.in/MDLogoBGH.png",
    "image": "https://www.metrodevelopers.co.in/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg",
    "telephone": "+919824235642",      
    "email": "metrodevelopers26@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp. Suvas Ind Estate, b/h Siya Logistics Park",
      "addressLocality": "Moraiya",
      "addressRegion": "Gujarat",
      "postalCode": "382213",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "22.914141879249897", 
      "longitude": "72.41748307531053"
    },
    "areaServed": [
      { "@type": "Place", "name": "Moraiya, Changodar" },
      { "@type": "City",  "name": "Ahmedabad" },
      { "@type": "Place", "name": "Sanand"    }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "director",
        "telephone": "+919824235642",
        "email": "metrodevelopers26@gmail.com",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "areaServed": "IN"
      },
      {
        "@type": "ContactPoint",
        "contactType": "director",
        "telephone": "+919624965017",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "areaServed": "IN"
      },
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+916356776767",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "areaServed": "IN"
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "telephone": "+916356766767",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "areaServed": "IN"
      },
    ],
    "priceRange": "Contact for pricing",
    "openingHours": "Mo-Su 10:00-19:00",
    "sameAs": [
      "https://www.facebook.com/metroindustrialpark1",
      "https://www.instagram.com/metro.industrialpark/"
    ]
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
   {
        "@type": "Question",
        "name": "What is the price of industrial sheds in Moraiya, Ahmedabad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Industrial sheds at Metro Industrial Park in Moraiya are available for sale and lease. Contact us at +91 98242 35642 for current pricing and customised unit options."
        }
      },
      {
        "@type": "Question",
        "name": "What sizes are available at Metro Industrial Park?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Units range from 4,000 sq.ft to 50,000 sq.ft across 63 sheds in a 54,000 sq.yard park in Moraiya, Changodar."
        }
      },
      {
        "@type": "Question",
        "name": "How long does possession take at Metro Industrial Park?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Possession is available within 90 days of booking at Metro Industrial Park, Moraiya."
        }
      },
      {
        "@type": "Question",
        "name": "What is the expected ROI on industrial sheds in Metro Industrial Park?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The expected annual return on investment is 6–8% for industrial sheds and warehouses at Metro Industrial Park, Moraiya, Ahmedabad."
        }
      },
      {
        "@type": "Question",
        "name": "Is RCC construction available at Metro Industrial Park?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RCC construction is not standard but is available on request with additional charges."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Metro Industrial Park located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Metro Industrial Park is located in Moraiya, Changodar, Ahmedabad, Gujarat — opposite Suvas Industrial Estate, behind Siya Logistics Park, near the Sarkhej Bavla Highway."
        }
      },
      {
        "@type": "Question",
        "name": "What amenities are available at Metro Industrial Park?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The park offers 24x7 water supply, CCTV surveillance, security guards, a dedicated weigh bridge, 60ft internal roads, waste management, and high ceilings of 30–35 feet."
        }
      }
  ]
};

export const imageObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Metro Industrial Park — Industrial Sheds & Warehouses Moraiya Ahmedabad',
    description: 'Photo gallery of Metro Industrial Park, 63 industrial sheds for sale and lease in Moraiya, Changodar, Ahmedabad.',
    url: 'https://www.metrodevelopers.co.in/metro-industrial-park',
    image: [
      {
        '@type': 'ImageObject',
        contentUrl: 'https://www.metrodevelopers.co.in/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
        name: 'Industrial Shed for Sale in Moraiya Ahmedabad',
        description: 'State-of-the-art industrial sheds with high ceilings of 30–35 ft at Metro Industrial Park, Moraiya.',
        width: 1920, height: 1080,
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://www.metrodevelopers.co.in/images/warehouse-unit-lease-changodar-ahmedabad.jpg',
        name: 'Warehouse Unit Available for Lease near Changodar Ahmedabad',
        description: 'Spacious warehouse units for lease at Metro Industrial Park, Changodar, Ahmedabad.',
        width: 1920, height: 1080,
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://www.metrodevelopers.co.in/images/metro-industrial-park-entrance-security-moraiya.jpg',
        name: 'Metro Industrial Park Entrance with 24x7 Security — Moraiya',
        description: 'Professional park entrance with 24/7 CCTV surveillance and security guards at Metro Industrial Park.',
        width: 1920, height: 1080,
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://www.metrodevelopers.co.in/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
        name: '60ft Wide Internal Road at Metro Industrial Park Ahmedabad',
        description: '60 feet wide RCC road inside Metro Industrial Park, Moraiya, engineered for heavy-duty vehicles.',
        width: 1920, height: 1080,
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://www.metrodevelopers.co.in/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
        name: 'Metro Industrial Park Aerial Site Map — Moraiya Gujarat',
        description: 'Drone view site map of Metro Industrial Park in Moraiya, Changodar, Ahmedabad, Gujarat.',
        width: 1920, height: 1080,
      },
      {
        '@type': 'ImageObject',
        contentUrl: 'https://www.metrodevelopers.co.in/images/metro-industrial-park-office-changodar.jpg',
        name: 'Metro Industrial Park Office — Changodar Ahmedabad',
        description: 'Modern office facility inside Metro Industrial Park, Changodar, Ahmedabad.',
        width: 1920, height: 1080,
      },
    ],
  };
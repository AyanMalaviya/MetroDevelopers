// src/components/StructuredData.jsx
const StructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",    
    "name": "Metro Enterprise - Metro Industrial Park",
    "alternateName": "Metro Industrial Park Changodar",
    "description": "Industrial sheds for lease and sale in Moraiya, Changodar, Ahmedabad. Past projects in Shiv Industrial Estate, Chavda Estate, and now Metro Industrial Park behind Siya Industrial Park. Contact us for the best industrial spaces in Ahmedabad.",
    "url": "https://www.metrodevelopers.co.in",
    "logo": "https://www.metrodevelopers.co.in/icon-512x512.png",
    "image": "https://www.metrodevelopers.co.in/images/2shed.jpg",
    "telephone": "+919824235642",      
    "email": "metrodevelopers26@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp. Suvas Ind Estate, b/h Siya Logistics Park",
      "addressLocality": "Moraiya, Changodar",
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
      { "@type": "City",  "name": "Ahmedabad" },
      { "@type": "Place", "name": "Changodar" },
      { "@type": "Place", "name": "Moraiya"   },
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
        "telephone": "+9163567 66767",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "areaServed": "IN"
      },
    ],
    "priceRange": "Contact for pricing",
    "openingHours": "Mo-Su 10:00-19:00",
    "sameAs": [
      "https://www.facebook.com/metroindustrialpark1",
      "https://www.instagram.com/metro.indsutrialpark/"
    ]
  };

  const faqSchema = {
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

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </>
  );
};

export default StructuredData;

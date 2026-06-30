import { SITE_BASE_URL } from '../data/seoRoutes';
import '../index.css';
import Providers from '../components/Providers';

export const metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: {
    default: 'Metro Industrial Park | Industrial Sheds & Warehouses in Moraiya, Changodar, Ahmedabad',
    template: '%s | Metro Industrial Park',
  },
  description:
    'Metro Industrial Park by Metro Developers — 63 premium industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad. Units from 4,000–50,000 sq.ft, 90-day possession, 6–8% rental yield. Near NH 947 (Sarkhej–Bavla Highway).',
  keywords:
    'industrial sheds moraiya, industrial sheds changodar, industrial park ahmedabad, warehouse changodar, industrial shed for sale ahmedabad, industrial shed for rent changodar, metro industrial park',
  authors: [{ name: 'Metro Developers', url: SITE_BASE_URL }],
  creator: 'Metro Developers',
  publisher: 'Metro Developers',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_BASE_URL,
    siteName: 'Metro Industrial Park',
    title: 'Metro Industrial Park | Industrial Sheds & Warehouses in Moraiya, Changodar, Ahmedabad',
    description:
      '63 premium industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad. Units from 4,000–50,000 sq.ft, 90-day possession, 6–8% rental yield.',
    images: [
      {
        url: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Industrial sheds and warehouses at Metro Industrial Park, Moraiya, Changodar, Ahmedabad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metro Industrial Park | Industrial Sheds in Moraiya, Changodar',
    description:
      '63 industrial sheds and warehouses from 4,000–50,000 sq.ft. 90-day possession. Near NH 947.',
    images: ['/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg'],
  },
  other: {
    'geo.region': 'IN-GJ',
    'geo.placename': 'Moraiya, Changodar, Ahmedabad, Gujarat',
    'geo.position': '22.914141879249897;72.41748307531053',
    'ICBM': '22.914141879249897, 72.41748307531053',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a3a4a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="canonical" href={SITE_BASE_URL} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

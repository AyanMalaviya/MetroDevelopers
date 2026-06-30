import { Anton, Bebas_Neue, Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '../context/ThemeContext';
import '../index.css';
import '../App.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.metrodevelopers.co.in'),
  title: {
    default: 'Industrial Sheds in Moraiya, Changodar, Ahmedabad | Metro Industrial Park',
    template: '%s | Metro Industrial Park',
  },
  description:
    'Metro Industrial Park offers premium industrial sheds and warehouses for sale and lease in Moraiya, Changodar, Ahmedabad. Units from 4,000–50,000 sq.ft. 90-day possession. Call +91 98242 35642.',
  keywords: [
    'industrial sheds moraiya',
    'industrial park changodar',
    'warehouse for rent ahmedabad',
    'warehouse for sale ahmedabad',
    'industrial shed for rent changodar',
    'industrial shed for sale moraiya',
    'godown for rent ahmedabad',
    'factory shed lease changodar',
    'industrial property investment gujarat',
    'metro industrial park',
  ],
  authors: [{ name: 'Metro Industrial Park', url: 'https://www.metrodevelopers.co.in' }],
  creator: 'Metro Industrial Park',
  publisher: 'Metro Industrial Park',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.metrodevelopers.co.in/',
    siteName: 'Metro Industrial Park',
    title: 'Industrial Sheds in Moraiya, Changodar, Ahmedabad | Metro Industrial Park',
    description:
      'Premium industrial sheds and warehouses for sale and lease. Units 4,000–50,000 sq.ft. 90-day possession.',
    images: [
      {
        url: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
        width: 1200,
        height: 630,
        alt: 'Metro Industrial Park — Industrial Sheds and Warehouses in Moraiya, Changodar, Ahmedabad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industrial Sheds in Moraiya, Changodar, Ahmedabad | Metro Industrial Park',
    description:
      'Premium industrial sheds and warehouses for sale and lease. Units 4,000–50,000 sq.ft. 90-day possession.',
    images: ['/images/metro-industrial-park-site-map-moraiya-gujarat.jpg'],
  },
  alternates: {
    canonical: 'https://www.metrodevelopers.co.in/',
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f5f7' },
    { media: '(prefers-color-scheme: dark)',  color: '#0b0b0d' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${anton.variable} ${bebasNeue.variable} ${instrumentSerif.variable} ${plusJakarta.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="me" href="https://www.instagram.com/metro.industrialpark/" type="text/html" />
        {/* Theme init script — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('metro-theme');var t=s==='light'||s==='dark'?s:window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

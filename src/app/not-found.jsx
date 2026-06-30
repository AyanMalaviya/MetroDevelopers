// src/app/not-found.jsx
// Next.js App Router 404 handler — metadata lives here, component in src/pages/NotFound.jsx
import NotFound from '../pages/NotFound';

export const metadata = {
  title: '404 — Page Not Found | Metro Industrial Park, Moraiya, Changodar, Ahmedabad',
  description:
    'The page you are looking for does not exist. Explore industrial sheds and warehouses for sale and rent in Moraiya, Changodar, Ahmedabad at Metro Industrial Park — near NH 947 (Sarkhej–Bavla Highway).',
  robots: { index: false, follow: false },
  other: {
    'geo.region':    'IN-GJ',
    'geo.placename': 'Moraiya, Changodar, Ahmedabad, Gujarat',
    'geo.position':  '22.914141879249897;72.41748307531053',
    'ICBM':          '22.914141879249897, 72.41748307531053',
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}

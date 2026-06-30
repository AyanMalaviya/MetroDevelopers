import NotFound from '../pages/NotFound';

export const metadata = {
  title: '404 — Page Not Found | Metro Industrial Park',
  description: 'The page you are looking for does not exist. Explore industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad at Metro Industrial Park.',
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return <NotFound />;
}

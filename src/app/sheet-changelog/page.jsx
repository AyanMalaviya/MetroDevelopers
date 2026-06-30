import { SITE_BASE_URL } from '../../data/seoRoutes';
import SheetChangelogPage from '../../pages/SheetChangelogPage';

export const metadata = {
  title: 'Shed Availability Change Log | Metro Industrial Park',
  description: 'View the change log of shed and warehouse availability updates at Metro Industrial Park, Moraiya, Changodar.',
  alternates: { canonical: `${SITE_BASE_URL}/sheet-changelog` },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SheetChangelogPage />;
}

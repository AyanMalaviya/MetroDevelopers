import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Calculator, FileText, Factory } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { useTheme } from '../context/ThemeContext';
import { GUIDE_PAGES, LOCAL_MARKET_PAGES } from '../data/seoRoutes';
import { createArticleSchema, createBreadcrumbSchema, propertySchema } from '../utils/schemas';

const InsightGuidePage = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const page = GUIDE_PAGES.find((entry) => entry.path === pathname);

  const visibleMarketPages = LOCAL_MARKET_PAGES.filter(
    (entry) => entry.showInPrimaryNavigation !== false,
  );

  if (!page) {
    return null;
  }

  const articleSchema = createArticleSchema({
    headline: page.title,
    description: page.description,
    path: page.path,
    keywords: page.keywords.split(',').map((item) => item.trim()),
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: page.breadcrumb, path: page.path },
  ]);

  return (
    <>
      <SEO
        title={page.title}
        description={page.description}
        keywords={page.keywords}
        canonical={page.path}
        ogImage={page.image}
        ogImageAlt={page.ogImageAlt}
        structuredData={[propertySchema, articleSchema, breadcrumbSchema]}
      />

      <div
        className={`min-h-screen pt-24 pb-16 ${
          isDark
            ? 'bg-gradient-to-b from-black via-gray-950 to-black'
            : 'bg-gradient-to-b from-white via-gray-50 to-white'
        }`}
      >
        <main className="max-w-5xl mx-auto px-4 sm:px-6">
          <section
            className={`rounded-3xl border p-7 sm:p-10 ${
              isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white shadow-xl shadow-gray-200/60'
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-brand-red">
              <FileText size={12} />
              Industrial investment guide
            </div>

            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight theme-text-primary">
              {page.heading}
            </h1>

            <p className={`mt-4 text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {page.intro}
            </p>
          </section>

          <section className="mt-8 space-y-5">
            {page.sections.map((section) => (
              <article
                key={section.title}
                className={`rounded-2xl border p-6 ${
                  isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white shadow-sm'
                }`}
              >
                <h2 className="text-2xl font-extrabold theme-text-primary">{section.title}</h2>

                <div className={`mt-4 space-y-3 text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <ul className="mt-5 space-y-2.5">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-red" />
                      <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <article
              className={`rounded-2xl border p-6 ${
                isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white shadow-sm'
              }`}
            >
              <h2 className="text-xl font-extrabold theme-text-primary">Move from research to action</h2>
              <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Validate numbers using the ROI calculator and then shortlist units based on your ideal micro-market.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/calculator"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-red-700"
                >
                  <Calculator size={15} />
                  Open ROI Calculator
                </Link>
                <Link
                  to="/metro-industrial-park"
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
                    isDark
                      ? 'border-gray-700 text-gray-200 hover:border-brand-red hover:text-brand-red'
                      : 'border-gray-200 text-gray-700 hover:border-brand-red hover:text-brand-red'
                  }`}
                >
                  <Factory size={15} />
                  Explore Inventory
                </Link>
              </div>
            </article>

            <article
              className={`rounded-2xl border p-6 ${
                isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white shadow-sm'
              }`}
            >
              <h2 className="text-xl font-extrabold theme-text-primary">Location-specific pages</h2>
              <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Compare demand pockets in Moraiya, Changodar, and the Sarkhej Bavla Highway corridor.
              </p>

              <div className="mt-4 space-y-3">
                {visibleMarketPages.map((locationPage) => (
                  <Link
                    key={locationPage.path}
                    to={locationPage.path}
                    className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      isDark
                        ? 'border-gray-700 bg-gray-800/70 text-gray-100 hover:border-brand-red'
                        : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-brand-red'
                    }`}
                  >
                    {locationPage.breadcrumb}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </article>
          </section>
        </main>
      </div>
    </>
  );
};

export default InsightGuidePage;

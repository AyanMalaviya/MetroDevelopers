import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, FileText, Factory } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { useTheme } from '../context/ThemeContext';
import { GUIDE_PAGES, LOCAL_MARKET_PAGES } from '../data/seoRoutes';
import { createArticleSchema, createBreadcrumbSchema, propertySchema } from '../utils/schemas';

const EASE = [0.16, 1, 0.3, 1];

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
        style={{ paddingTop: 'calc(var(--navbar-height, 67px) + 1.5rem)' }}
        className={`relative overflow-hidden min-h-screen pb-16 ${
          isDark
            ? 'bg-gradient-to-b from-black via-gray-950 to-black'
            : 'bg-gradient-to-b from-white via-gray-50 to-white'
        }`}
      >

        <main className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <section
            className={`rounded-3xl border p-7 sm:p-10 ${
              isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white shadow-xl shadow-gray-200/60'
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-brand-red">
              <FileText size={12} />
              Industrial investment guide
            </div>

            <h1 className="mt-4 text-3xl sm:text-5xl font-bold leading-tight theme-text-primary">
              {page.heading}
            </h1>

            <p className={`mt-4 text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {page.intro}
            </p>
          </section>

          <section className="mt-8 flex flex-col gap-6 sm:gap-8 w-full overflow-x-clip scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {page.sections.map((section, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className={`rounded-2xl border p-6 w-[84%] sm:w-[75%] lg:w-[65%] max-w-3xl ${
                    isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'
                  } ${
                    isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white shadow-sm'
                  }`}
                >
                  <h2 className="text-2xl font-bold theme-text-primary">{section.title}</h2>

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
                </motion.article>
              );
            })}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <article
              className={`rounded-2xl border p-6 ${
                isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white shadow-sm'
              }`}
            >
              <h2 className="text-xl font-bold theme-text-primary">
                Move from research to{' '}
                <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                  action
                </span>
              </h2>
              <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Validate numbers using the ROI calculator and then shortlist units based on your ideal micro-market.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/calculator"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-red-700 whitespace-nowrap"
                >
                  <Calculator size={15} />
                  ROI Calculator
                </Link>
                <Link
                  to="/metro-industrial-park"
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
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
              <h2 className="text-xl font-bold theme-text-primary">
                Location-specific{' '}
                <span className="font-serif-editorial italic text-brand-red inline-block">
                  pages
                </span>
              </h2>
              <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Compare demand pockets in Moraiya, Changodar, and the NH 47 (Sarkhej Bavla Highway) corridor.
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

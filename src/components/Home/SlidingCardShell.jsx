// src/components/Home/SlidingCardShell.jsx
import { useRef, memo } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const SLIDE_EASE = [0.16, 1, 0.3, 1];

const OUTER_CLIP =
  'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)';
const INNER_CLIP =
  'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)';
const MEDIA_CLIP =
  'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)';

/**
 * Architectural alternating slide-in card used across Home Features and Developments Portfolio.
 * Alternates left/right alignment with space on the opposite edge and subtle desktop scroll parallax.
 */
const SlidingCardShell = memo(({
  index,
  parallaxRange = [-20, 20],
  bgTexture,
  headerLeft,
  headerRight,
  media,
  isDark,
  isDesktop,
  surfaceTone = 'elevated',
  widthClass = 'w-[86%] sm:w-[74%] lg:w-[60%] max-w-2xl',
  children,
}) => {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: '-60px' });
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const cardY  = useTransform(scrollYProgress, [0, 1], parallaxRange);
  const imageY = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  const borderCol = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const surfaceBg = surfaceTone === 'page'
    ? (isDark ? 'bg-[#0B0B0D]/95' : 'bg-[#F8F9FA]/95')
    : (isDark ? 'bg-[#121215]/95' : 'bg-white/95');
  const washGradient = surfaceTone === 'page'
    ? (isDark
        ? 'bg-gradient-to-br from-[#0B0B0D]/90 via-[#0B0B0D]/84 to-[#121215]/95'
        : 'bg-gradient-to-br from-[#F8F9FA]/95 via-[#F8F9FA]/88 to-[#EFECE5]/95')
    : (isDark
        ? 'bg-gradient-to-br from-[#121215]/90 via-[#121215]/82 to-[#0B0B0D]/95'
        : 'bg-gradient-to-br from-white/95 via-white/88 to-[#F5F3EE]/95');

  return (
    <motion.article
      ref={cardRef}
      style={isDesktop ? { y: cardY } : undefined}
      initial={{ opacity: 0, x: isEven ? -55 : 55 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: SLIDE_EASE }}
      className={`${widthClass} ${
        isEven ? 'self-start mr-auto ml-0 sm:ml-2' : 'self-end ml-auto mr-0 sm:mr-2'
      } group relative`}
    >
      {/* Technical Corner Registration Brackets */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-1.5 -right-1.5 w-4 h-4 border-t border-r transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-brand-red z-20 ${
          isDark ? 'border-white/30' : 'border-black/30'
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b border-l transition-all duration-300 group-hover:w-6 group-hover:h-6 group-hover:border-brand-red z-20 ${
          isDark ? 'border-white/30' : 'border-black/30'
        }`}
      />

      {/* Custom 1px Chamfered Border Shell */}
      <div
        className={`relative p-[1px] transition-colors duration-300 ${
          isDark
            ? 'bg-white/[0.12] group-hover:bg-brand-red/70'
            : 'bg-black/[0.14] group-hover:bg-brand-red/75'
        }`}
        style={{ clipPath: OUTER_CLIP }}
      >
        {/* Inner Frosted Surface */}
        <div
          className={`relative h-full overflow-hidden backdrop-blur-md transition-colors duration-300 ${surfaceBg}`}
          style={{ clipPath: INNER_CLIP }}
        >
          {/* Low-Opacity Industrial Ambient Texture Inside Card */}
          {bgTexture && (
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-700 group-hover:scale-[1.04] ${
                isDark ? 'opacity-[0.09] mix-blend-luminosity' : 'opacity-[0.045] grayscale'
              }`}
              style={{ backgroundImage: `url(${bgTexture})` }}
            />
          )}

          {/* Readability Wash */}
          <div aria-hidden="true" className={`absolute inset-0 pointer-events-none ${washGradient}`} />

          {/* Top 2px Signal Red Reveal Line */}
          <div
            aria-hidden="true"
            className="relative z-10 h-[2px] w-full bg-brand-red scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"
          />

          {/* Top Spec Strip */}
          <div
            className={`relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b ${borderCol} font-mono text-[10px] tracking-[0.14em] uppercase gap-2`}
          >
            {headerLeft}
            {headerRight}
          </div>

          {/* Card Body: Clipped Media Frame + Right Content */}
          <div className="relative z-10 p-4 sm:p-6 flex flex-col md:flex-row md:items-stretch gap-5 sm:gap-6">
            {media && (
              <div
                className={`relative overflow-hidden flex-shrink-0 border ${borderCol} bg-neutral-950 w-full md:w-[41%] aspect-[16/10] md:aspect-auto md:min-h-[220px]`}
                style={{ clipPath: MEDIA_CLIP }}
              >
                {media.fallbackIcon && (
                  <div className="absolute inset-0 bg-[#17171B] flex items-center justify-center text-white/15">
                    <div className="scale-[2.5]">{media.fallbackIcon}</div>
                  </div>
                )}

                <motion.img
                  src={media.src}
                  alt={media.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  style={isDesktop ? { y: imageY, scale: 1.12 } : { scale: 1.04 }}
                  onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none"
                />

                {media.overlay}
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

SlidingCardShell.displayName = 'SlidingCardShell';

export default SlidingCardShell;

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { getImageUrl, GENRE_MAP, formatMediaDate, getMediaHref } from '@/lib/tmdb';
import PopcornRating from '@/components/ui/PopcornRating';
import { setAmbientBackdrop } from '@/components/layout/AmbientBackground';

const SLIDE_DURATION_MS = 7000; // 7 seconds per slide

export default function HeroSlider({ items }: { items: any[] }) {
  const displayItems = (items || []).slice(0, 7); // 7 slides in Hero Slider
  const slideCount = displayItems.length;

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  // Sync the project-wide blurred ambient background whenever the active hero slide changes
  useEffect(() => {
    const activeItem = displayItems[currentIndex];
    if (activeItem) {
      setAmbientBackdrop(activeItem.backdrop_path || activeItem.poster_path);
    }
  }, [currentIndex, displayItems]);

  // Simple 7-second slide rotation timer
  useEffect(() => {
    if (slideCount <= 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((current) => (current + 1) % slideCount);
    }, SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [currentIndex, slideCount]);

  if (slideCount === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-transparent h-[75vh] min-h-[500px] md:h-[92vh] xl:h-[96vh] md:min-h-[600px] group">
      <style>{`
        @keyframes sliderProgress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

      {displayItems.map((item, index) => {
        const isActive = index === currentIndex;
        const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
        const nextIndex = (currentIndex + 1) % slideCount;
        const shouldRenderImage = isActive || index === prevIndex || index === nextIndex;

        const title = item.title || item.name;
        const type = item.media_type || (item.name ? 'tv' : 'movie');
        const href = getMediaHref(item, type as 'movie' | 'tv');
        const overview = item.overview;
        const formattedDate = formatMediaDate(item.release_date || item.first_air_date);

        let itemGenres: string[] = [];
        if (item.genre_ids) {
          itemGenres = item.genre_ids.map((id: number) => GENRE_MAP[id]).filter(Boolean).slice(0, 2);
        }

        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out will-change-[opacity] ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {/* Masked Hero Backdrop Layer: dissolves smoothly into the unified blurred body background behind it */}
            <div className="absolute inset-0 w-full h-full pointer-events-none [mask-image:linear-gradient(to_bottom,black_0%,black_52%,rgba(0,0,0,0.72)_72%,rgba(0,0,0,0.25)_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_52%,rgba(0,0,0,0.72)_72%,rgba(0,0,0,0.25)_88%,transparent_100%)]">
              {shouldRenderImage && (
                <Image
                  src={getImageUrl(item.backdrop_path, 'original')}
                  alt={title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  priority={index === 0}
                />
              )}

              {/* Top gradient for fixed navbar legibility */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />

              {/* Left subtle shading for hero text legibility (inside mask so it never creates a bottom line) */}
              <div className="absolute inset-0 w-full md:w-2/3 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 md:px-10 lg:px-[max(3rem,calc((100vw-1440px)/2+48px))] pb-20 md:pb-24 w-full md:w-3/4 lg:w-2/3 pointer-events-none">
              <div
                className={`transition-all duration-700 ease-out transform pointer-events-auto ${
                  isActive ? 'translate-y-0 opacity-100 delay-150' : 'translate-y-6 opacity-0'
                }`}
              >
                {/* Title or Logo */}
                {item.logo_path ? (
                  <div className="relative w-48 sm:w-64 md:w-80 h-16 sm:h-20 md:h-28 mb-2 sm:mb-3 drop-shadow-lg">
                    {shouldRenderImage && (
                      <Image
                        src={getImageUrl(item.logo_path, 'w500')}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 256px, 320px"
                        className="object-contain object-left-bottom"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                ) : (
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-2 line-clamp-2 drop-shadow-lg leading-tight">
                    {title}
                  </h2>
                )}

                {/* Meta details (Rating • Date • Genres) */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 text-[12px] sm:text-[14px] md:text-[15px] font-medium text-white/90 drop-shadow-md">
                  <PopcornRating rating={item.vote_average} compact className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white font-semibold" />
                  {formattedDate && <span className="text-white/60">•</span>}
                  {formattedDate && <span>{formattedDate}</span>}
                  {itemGenres.map((genre: string) => (
                    <span key={genre} className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <span className="text-white/60">•</span>
                      <span>{genre}</span>
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-white/80 text-[13px] sm:text-sm md:text-lg line-clamp-3 mb-6 sm:mb-8 max-w-xl text-shadow-sm font-medium leading-relaxed">
                  {overview}
                </p>

                {/* Actions */}
                <div className="flex flex-row items-center gap-2.5 sm:gap-3 select-none w-full sm:w-auto">
                  <Link
                    href={href}
                    className="ios-btn-primary flex-1 sm:flex-none"
                  >
                    <Play className="w-[18px] h-[18px] fill-current" />
                    <span>Play</span>
                  </Link>
                  <Link
                    href={href}
                    className="ios-btn-glass flex-1 sm:flex-none"
                  >
                    <Info className="w-[18px] h-[18px]" />
                    <span>Details</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modern Animated Pagination Indicators (Apple TV / Netflix style) */}
      <div className="absolute bottom-6 md:bottom-10 right-4 sm:right-6 md:right-10 lg:right-[max(3rem,calc((100vw-1440px)/2+48px))] z-20 flex justify-end items-center gap-1.5 sm:gap-2 md:gap-2.5 pointer-events-auto">
        {displayItems.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden transition-all duration-500 rounded-full h-1.5 md:h-2 cursor-pointer bg-white/20 hover:bg-white/40 backdrop-blur-md ${
                isActive ? 'w-8 sm:w-11 md:w-14' : 'w-1.5 sm:w-2 md:w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {isActive && (
                <div
                  key={`progress-${currentIndex}`}
                  className="absolute inset-0 bg-white origin-left will-change-transform"
                  style={{
                    animationName: 'sliderProgress',
                    animationDuration: `${SLIDE_DURATION_MS}ms`,
                    animationTimingFunction: 'linear',
                    animationFillMode: 'forwards',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

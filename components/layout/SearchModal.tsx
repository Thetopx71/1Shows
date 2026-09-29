'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Film, Tv, Loader2, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { searchMediaAction } from '@/app/actions';
import { getImageUrl, getMediaHref } from '@/lib/tmdb';
import PopcornRating from '@/components/ui/PopcornRating';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const QUICK_SUGGESTIONS = [
  { label: 'Popular Movies', query: 'popular', href: '/movies' },
  { label: 'Trending Shows', query: 'shows', href: '/tv' },
  { label: 'Marvel', query: 'Marvel' },
  { label: 'Anime', query: 'Anime' },
  { label: 'Sci-Fi', query: 'Sci-Fi' },
  { label: 'Action', query: 'Action' },
];

export default function SearchModal({ isOpen, onClose, initialQuery = '' }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsLoading(false);
    onClose();
  }, [onClose]);

  // Focus input when opened and lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Global keydown listeners (Escape to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchMediaAction(trimmed);
        // Filter out people or items without title/name
        const filtered = (data || []).filter(
          (item: any) => item.media_type !== 'person' && (item.title || item.name)
        );
        setResults(filtered.slice(0, 8)); // Top 8 results
      } catch (err) {
        console.error('Failed to search media in modal:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
      handleClose();
    }
  };

  const handleSelectQuickSuggestion = (item: { label: string; query: string; href?: string }) => {
    if (item.href) {
      router.push(item.href);
      handleClose();
    } else {
      handleQueryChange(item.query);
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex flex-col items-center justify-start pt-20 sm:pt-28 md:pt-36 p-4 sm:p-6 overflow-y-auto hide-scrollbar animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-2xl bg-white/[0.10] bg-gradient-to-br from-white/[0.20] to-white/[0.06] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.26] rounded-2xl sm:rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.45)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/10"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white/50 shrink-0" strokeWidth={2.2} />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search movies, TV shows..."
            className="flex-1 bg-transparent text-white text-[16px] sm:text-[18px] placeholder:text-white/40 focus:outline-none font-medium"
          />

          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white/50 animate-spin shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                handleQueryChange('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition active:scale-95"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          {/* iOS ESC Key Badge / Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="hidden sm:flex items-center justify-center px-2 py-1 rounded-md bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-[11px] font-semibold text-white/60 hover:text-white tracking-wider transition select-none"
          >
            ESC
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="sm:hidden p-1 rounded-full text-white/60 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Search Content Body */}
        <div className="max-h-[60vh] overflow-y-auto filter-scrollbar divide-y divide-white/[0.06] overscroll-contain scroll-smooth mr-0.5">
          {/* Results List */}
          {results.length > 0 && (
            <div className="p-2 sm:p-2.5 space-y-1">
              {results.map((item) => {
                const title = item.title || item.name || 'Untitled';
                const dateStr = item.release_date || item.first_air_date;
                const year = dateStr ? dateStr.split('-')[0] : '';
                const type = item.media_type || (item.name ? 'tv' : 'movie');
                const href = getMediaHref(item, type as 'movie' | 'tv');

                return (
                  <Link
                    key={`${type}-${item.id}`}
                    href={href}
                    onClick={onClose}
                    className="flex items-center gap-3.5 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors group"
                  >
                    {/* Poster Thumbnail */}
                    <div className="relative w-11 h-15 sm:w-12 sm:h-16 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                      {item.poster_path ? (
                        <Image
                          src={getImageUrl(item.poster_path, 'w500')}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          {type === 'tv' ? <Tv className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[14px] sm:text-[15px] font-semibold text-white group-hover:text-white truncate">
                          {title}
                        </h4>
                        <span className="text-[10.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-white/10 text-white/70 shrink-0">
                          {type === 'tv' ? 'TV' : 'Movie'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 mt-1 text-[12px] sm:text-[13px] text-white/60">
                        {item.vote_average > 0 && (
                          <PopcornRating rating={item.vote_average} compact className="w-3.5 h-3.5 text-white" />
                        )}
                        {year && <span>{year}</span>}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all shrink-0 mr-1" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Query typed, but no results */}
          {query.trim() && !isLoading && results.length === 0 && (
            <div className="p-8 text-center">
              <Film className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white font-medium text-[15px]">No titles found</p>
              <p className="text-white/50 text-[13px] mt-1">
                We couldn&apos;t find any movies or TV shows matching &quot;{query}&quot;
              </p>
            </div>
          )}

          {/* Empty Query: Quick suggestions & trending shortcuts */}
          {!query.trim() && (
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-white/50 text-[12px] font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Suggestions
              </div>

              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug.label}
                    type="button"
                    onClick={() => handleSelectQuickSuggestion(sug)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/[0.08] hover:border-white/20 text-white/80 hover:text-white text-[13px] font-medium transition"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-white/40" />
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: View all results action */}
        {query.trim() && (
          <div className="p-3 sm:p-3.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span className="truncate">Press Enter to view all results</span>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 font-semibold text-white hover:text-amber-300 transition shrink-0 ml-2"
            >
              See all results
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

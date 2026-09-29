'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MediaCard from './MediaCard';
import { fetchDiscoverMedia, fetchWatchProviders } from '@/app/actions';
import {
  getImageUrl,
  STREAMING_PROVIDERS,
  resolveProviderLogos,
} from '@/lib/tmdb';
import { ChevronDown, Check, Loader2, Dices, Trash2 } from 'lucide-react';
import { setAmbientBackdrop } from '@/components/layout/AmbientBackground';

const SORT_OPTIONS = [
  { id: 'popularity.desc', label: 'Popular' },
  { id: 'vote_average.desc', label: 'Highest Rated' },
  { id: 'primary_release_date.desc', label: 'Newest Releases' }
];

const MOVIE_GENRES = [
  { id: '', label: 'All Genres' },
  { id: '28', label: 'Action' },
  { id: '12', label: 'Adventure' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '99', label: 'Documentary' },
  { id: '18', label: 'Drama' },
  { id: '10751', label: 'Family' },
  { id: '14', label: 'Fantasy' },
  { id: '36', label: 'History' },
  { id: '27', label: 'Horror' },
  { id: '10402', label: 'Music' },
  { id: '9648', label: 'Mystery' },
  { id: '10749', label: 'Romance' },
  { id: '878', label: 'Sci-Fi' },
  { id: '53', label: 'Thriller' },
  { id: '10752', label: 'War' },
  { id: '37', label: 'Western' }
];

const TV_GENRES = [
  { id: '', label: 'All Genres' },
  { id: '10759', label: 'Action & Adv' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '99', label: 'Documentary' },
  { id: '18', label: 'Drama' },
  { id: '10751', label: 'Family' },
  { id: '10762', label: 'Kids' },
  { id: '9648', label: 'Mystery' },
  { id: '10763', label: 'News' },
  { id: '10764', label: 'Reality' },
  { id: '10765', label: 'Sci-Fi' },
  { id: '10766', label: 'Soap' },
  { id: '10767', label: 'Talk' },
  { id: '10768', label: 'Politics' },
  { id: '37', label: 'Western' }
];

const YEARS = [
  { id: '', label: 'All Years' },
  ...Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { id: year.toString(), label: year.toString() };
  })
];

const COUNTRIES = [
  { id: '', label: 'All Countries' },
  { id: 'US', label: 'United States' },
  { id: 'KR', label: 'South Korea' },
  { id: 'JP', label: 'Japan' },
  { id: 'GB', label: 'United Kingdom' },
  { id: 'FR', label: 'France' },
  { id: 'IN', label: 'India' },
  { id: 'ES', label: 'Spain' },
  { id: 'IT', label: 'Italy' },
  { id: 'DE', label: 'Germany' },
  { id: 'CA', label: 'Canada' },
  { id: 'AU', label: 'Australia' }
];

function FilterDropdown({ 
  label, 
  options, 
  selectedId, 
  onChange, 
  activeDot = false 
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current && selectedId) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, selectedId]);

  const activeOption = options.find((o: any) => o.id === selectedId);
  const displayLabel = activeOption ? activeOption.label || activeOption.name : label;

  return (
    <div className="relative pointer-events-auto shrink-0" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 bg-gradient-to-br from-white/[0.18] to-white/[0.05] backdrop-blur-2xl backdrop-saturate-[1.9] border border-white/[0.24] hover:border-white/[0.38] text-white font-medium text-[13px] tracking-[-0.01em] shadow-[0_6px_18px_rgba(0,0,0,0.22),inset_0_1px_1px_0_rgba(255,255,255,0.42)] transition-all duration-200 select-none cursor-pointer whitespace-nowrap"
      >
        {activeDot && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
        <span>{displayLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-white/60'}`} />
      </button>

      {isOpen && (
        <div 
          ref={listRef}
          className="absolute left-0 top-full mt-2 min-w-[165px] bg-white/[0.12] bg-gradient-to-br from-white/[0.22] to-white/[0.07] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.26] rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.45)] animate-in fade-in slide-in-from-top-2 duration-150 z-50 max-h-72 overflow-y-auto filter-scrollbar overscroll-contain pr-1 scroll-smooth"
        >
          {options.map((opt: any) => (
             <button
               key={opt.id}
               data-selected={selectedId === opt.id ? "true" : undefined}
               onClick={() => { onChange(opt.id); setIsOpen(false); }}
               className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all flex items-center justify-between cursor-pointer ${selectedId === opt.id ? 'bg-white text-black font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
             >
                <span className="truncate pr-2">{opt.label || opt.name}</span>
                {selectedId === opt.id && <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={3} />}
             </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiSelectDropdown({ 
  label, 
  options, 
  selectedIds, 
  toggleOption, 
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSelection = selectedIds.length > 0;
  const selectedOptions = options.filter((opt: any) => selectedIds.includes(opt.id));

  return (
    <div className="relative pointer-events-auto shrink-0" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 bg-gradient-to-br from-white/[0.18] to-white/[0.05] backdrop-blur-2xl backdrop-saturate-[1.9] border border-white/[0.24] hover:border-white/[0.38] text-white font-medium text-[13px] tracking-[-0.01em] shadow-[0_6px_18px_rgba(0,0,0,0.22),inset_0_1px_1px_0_rgba(255,255,255,0.42)] transition-all duration-200 select-none cursor-pointer whitespace-nowrap"
      >
        {hasSelection ? (
          <div className="flex items-center -space-x-1.5 mr-0.5">
            {selectedOptions.slice(0, 3).map((opt: any) =>
              opt.logo_path ? (
                <div
                  key={opt.id}
                  className="relative w-4 h-4 rounded-full overflow-hidden ring-1 ring-white/40 bg-black shrink-0"
                >
                  <Image
                    src={getImageUrl(opt.logo_path, 'w300')}
                    alt={opt.name}
                    fill
                    sizes="32px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
              ) : null
            )}
          </div>
        ) : null}
        <span>{label}</span>
        {hasSelection && <span className="opacity-70">({selectedIds.length})</span>}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-white/60'}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 min-w-[210px] bg-white/[0.12] bg-gradient-to-br from-white/[0.22] to-white/[0.07] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.26] rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.45)] animate-in fade-in slide-in-from-top-2 duration-150 z-50 max-h-72 overflow-y-auto filter-scrollbar overscroll-contain pr-1 scroll-smooth">
          {options.map((opt: any) => {
             const isSelected = selectedIds.includes(opt.id);
             return (
               <button
                 key={opt.id}
                 onClick={() => toggleOption(opt.id)}
                 className={`w-full text-left px-2.5 py-2 rounded-xl text-[13px] transition-all flex items-center justify-between gap-2.5 cursor-pointer ${isSelected ? 'bg-white/15 text-white font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
               >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {opt.logo_path && (
                      <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-white/15 bg-black/30 shadow-sm">
                        <Image
                          src={getImageUrl(opt.logo_path, 'w300')}
                          alt={opt.name}
                          fill
                          sizes="48px"
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="truncate pr-1">{opt.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={3} />}
               </button>
             );
          })}
        </div>
      )}
    </div>
  );
}

export default function DiscoverGrid({ 
  type, 
  initialData, 
  title 
}: { 
  type: 'movie' | 'tv', 
  initialData: any,
  title: string 
}) {
  const [items, setItems] = useState(initialData?.results || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialData?.total_pages || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isAutoLoadEnabled, setIsAutoLoadEnabled] = useState(false);
  const [providerOptions, setProviderOptions] = useState(STREAMING_PROVIDERS);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Filters
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  const isFirstRender = useRef(true);

  useEffect(() => {
    let active = true;
    fetchWatchProviders(type).then((results) => {
      if (!active) return;
      setProviderOptions(resolveProviderLogos(results));
    });
    return () => {
      active = false;
    };
  }, [type]);

  const loadData = async (
    pageNum = 1,
    options: { append?: boolean; shuffle?: boolean } = {}
  ) => {
    const { append = false, shuffle = false } = options;
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const effectiveSortBy =
        type === 'tv' && sortBy === 'primary_release_date.desc'
          ? 'first_air_date.desc'
          : sortBy;

      const params: any = {
        page: pageNum,
        sort_by: effectiveSortBy,
        watch_region: 'US',
      };

      if (sortBy === 'vote_average.desc') {
        params['vote_count.gte'] = 100;
      }

      if (selectedProviders.length > 0) {
        const providerQueryIds = selectedProviders
          .map((id) => STREAMING_PROVIDERS.find((p) => p.id === id)?.queryIds || String(id))
          .join('|');
        params.with_watch_providers = providerQueryIds;
      }
      
      if (selectedGenre) {
        params.with_genres = selectedGenre;
      }
      
      if (selectedYear) {
        if (type === 'movie') {
          params.primary_release_year = selectedYear;
        } else {
          params.first_air_date_year = selectedYear;
        }
      }
      
      if (selectedCountry) {
        params.with_origin_country = selectedCountry;
      }

      const data = await fetchDiscoverMedia(type, params);
      const results = [...(data.results || [])];

      if (shuffle && results.length > 1) {
        for (let i = results.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [results[i], results[j]] = [results[j], results[i]];
        }
      }
      
      if (append) {
        setItems((prev: any) => [...prev, ...results]);
      } else {
        setItems(results);
      }
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRandomizing(false);
    }
  };

  const toggleProvider = (id: number) => {
    setSelectedProviders(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const hasActiveFilters =
    sortBy !== 'popularity.desc' ||
    selectedProviders.length > 0 ||
    Boolean(selectedGenre) ||
    Boolean(selectedYear) ||
    Boolean(selectedCountry);

  const clearAllFilters = () => {
    setSortBy('popularity.desc');
    setSelectedProviders([]);
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedCountry('');
  };

  const randomize = () => {
    if (isLoading || isRandomizing) return;
    setIsRandomizing(true);
    setIsAutoLoadEnabled(false);

    const maxPage = Math.max(1, Math.min(totalPages || 1, 50));
    let randomPage = 1;
    if (maxPage > 1) {
      do {
        randomPage = Math.floor(Math.random() * maxPage) + 1;
      } while (randomPage === page);
    }

    setPage(randomPage);
    loadData(randomPage, { append: false, shuffle: true });
  };

  const loadMore = () => {
    if (page < totalPages && !isLoading && !isLoadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, { append: true });
    }
  };

  useEffect(() => {
    const firstWithImage = items.find((m: any) => m?.backdrop_path || m?.poster_path);
    if (firstWithImage) {
      setAmbientBackdrop(firstWithImage.backdrop_path || firstWithImage.poster_path);
    }
  }, [items]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    setPage(1);
    setIsAutoLoadEnabled(false);
    loadData(1);
  }, [sortBy, selectedProviders, selectedGenre, selectedYear, selectedCountry]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isAutoLoadEnabled && !isLoadingMore && page < totalPages) {
          loadMore();
        }
      },
      { rootMargin: '600px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isAutoLoadEnabled, isLoadingMore, page, totalPages]);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] pt-24 pb-8 md:pt-28 md:pb-10">
      {/* Header & Filter Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-2">{title}</h1>
          <p className="text-white/60 text-base md:text-lg">Discover new {type === 'movie' ? 'movies' : 'shows'} to watch</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 z-40 relative">
          {/* Delete / Clear Filters Button (shown when any filter is active) */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 bg-gradient-to-br from-white/[0.18] to-white/[0.05] backdrop-blur-2xl backdrop-saturate-[1.9] border border-white/[0.24] hover:border-white/[0.38] text-rose-400 hover:text-rose-300 shadow-[0_6px_18px_rgba(0,0,0,0.22),inset_0_1px_1px_0_rgba(255,255,255,0.42)] transition-all duration-200 shrink-0 cursor-pointer select-none animate-in fade-in zoom-in-90"
              title="Clear all filters"
              aria-label="Clear all filters"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
            </button>
          )}

          {/* Random / Dice Button */}
          <button 
            type="button"
            onClick={randomize}
            disabled={isLoading || isRandomizing}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 disabled:opacity-50 bg-gradient-to-br from-white/[0.18] to-white/[0.05] backdrop-blur-2xl backdrop-saturate-[1.9] border border-white/[0.24] hover:border-white/[0.38] text-white/90 hover:text-white shadow-[0_6px_18px_rgba(0,0,0,0.22),inset_0_1px_1px_0_rgba(255,255,255,0.42)] transition-all duration-200 shrink-0 cursor-pointer select-none"
            title="Randomize"
            aria-label="Randomize"
          >
            <Dices className={`w-4 h-4 transition-transform duration-300 ${isRandomizing ? 'animate-spin' : ''}`} strokeWidth={2} />
          </button>
          
          <FilterDropdown 
            label="Genre" 
            options={type === 'movie' ? MOVIE_GENRES : TV_GENRES} 
            selectedId={selectedGenre} 
            onChange={setSelectedGenre}
            activeDot={!!selectedGenre}
          />
          
          <FilterDropdown 
            label="Year" 
            options={YEARS} 
            selectedId={selectedYear} 
            onChange={setSelectedYear} 
            activeDot={!!selectedYear}
          />

          <FilterDropdown 
            label="Sort"
            options={SORT_OPTIONS}
            selectedId={sortBy}
            onChange={setSortBy}
            activeDot={true}
          />

          <MultiSelectDropdown 
            label="Provider"
            options={providerOptions}
            selectedIds={selectedProviders}
            toggleOption={toggleProvider}
          />
          
          <FilterDropdown 
            label="Country" 
            options={COUNTRIES} 
            selectedId={selectedCountry} 
            onChange={setSelectedCountry} 
            activeDot={!!selectedCountry}
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="w-full min-w-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-white/50" />
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="poster-grid">
              {items.map((item: any, i: number) => (
                <MediaCard key={`${item.id}-${i}`} movie={item} />
              ))}
            </div>
            
            {page < totalPages && (
              <div ref={observerTarget} className="mt-12 flex justify-center pb-8">
                {!isAutoLoadEnabled ? (
                  <button
                    onClick={() => { setIsAutoLoadEnabled(true); loadMore(); }}
                    disabled={isLoadingMore}
                    className="ios-btn-glass px-8 font-semibold select-none disabled:opacity-50"
                  >
                    {isLoadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Load More'}
                  </button>
                ) : isLoadingMore ? (
                  <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                ) : <div className="h-12" />}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-xl text-white/70">No results found matching your filters.</p>
            <button 
              onClick={clearAllFilters}
              className="mt-6 ios-btn-primary"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import MediaCard from '@/components/media/MediaCard';
import ScrollableRow from '@/components/ui/ScrollableRow';
import { fetchDiscoverMedia, fetchWatchProviders } from '@/app/actions';
import {
  getImageUrl,
  STREAMING_PROVIDERS,
  StreamingProviderOption,
  resolveProviderLogos,
} from '@/lib/tmdb';

export default function NetworkPopularRow({
  movies = [],
  tv = [],
}: {
  movies?: any[];
  tv?: any[];
}) {
  type TabType = 'movies' | 'tv';
  const [activeTab, setActiveTab] = useState<TabType>('movies');
  const [selectedProviderId, setSelectedProviderId] = useState<number>(8);
  const [providerOptions, setProviderOptions] = useState<StreamingProviderOption[]>(STREAMING_PROVIDERS);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cache media by `${providerId}-${tab}` initialized with Netflix server-side results
  const [mediaCache, setMediaCache] = useState<Record<string, any[]>>({
    '8-movies': movies,
    '8-tv': tv,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchedProvidersRef = useRef<Set<number>>(new Set([8]));

  // Keep initial server props synced for Netflix if props update
  useEffect(() => {
    setMediaCache((prev) => ({
      ...prev,
      '8-movies': movies,
      '8-tv': tv,
    }));
  }, [movies, tv]);

  // Refresh official provider logos from TMDB
  useEffect(() => {
    let active = true;
    fetchWatchProviders('movie').then((results) => {
      if (!active) return;
      setProviderOptions(resolveProviderLogos(results));
    });
    return () => {
      active = false;
    };
  }, []);

  // Close network dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Movies & TV Shows for newly selected network if not cached yet
  useEffect(() => {
    if (fetchedProvidersRef.current.has(selectedProviderId)) {
      return;
    }

    const provider = STREAMING_PROVIDERS.find((p) => p.id === selectedProviderId);
    if (!provider) return;

    const movieKey = `${selectedProviderId}-movies`;
    const tvKey = `${selectedProviderId}-tv`;

    let active = true;
    setIsLoading(true);

    Promise.all([
      fetchDiscoverMedia('movie', {
        sort_by: 'popularity.desc',
        with_watch_providers: provider.queryIds,
        watch_region: 'US',
      }),
      fetchDiscoverMedia('tv', {
        sort_by: 'popularity.desc',
        with_watch_providers: provider.queryIds,
        watch_region: 'US',
      }),
    ])
      .then(([movieData, tvData]) => {
        if (!active) return;
        fetchedProvidersRef.current.add(selectedProviderId);
        setMediaCache((prev) => ({
          ...prev,
          [movieKey]: movieData?.results || [],
          [tvKey]: tvData?.results || [],
        }));
      })
      .catch((err) => {
        console.error('Failed to fetch network popular media:', err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedProviderId]);

  const activeProvider =
    providerOptions.find((p) => p.id === selectedProviderId) || providerOptions[0];

  const currentKey = `${selectedProviderId}-${activeTab}`;
  const items =
    mediaCache[currentKey] ||
    (activeTab === 'movies' ? movies : tv) ||
    [];

  if (movies.length === 0 && tv.length === 0 && items.length === 0) return null;

  const tabs = [
    { id: 'movies', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
  ];

  return (
    <div className={`relative ${isDropdownOpen ? 'z-40' : 'z-20'}`}>
      <div className="relative z-30 flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-5 mb-5">
        <div className="flex items-center gap-2 sm:gap-2.5 text-xl md:text-2xl font-bold tracking-tight text-white">
          <span className="drop-shadow-sm">Popular on</span>

          {/* Inline Network Switcher Dropdown with Network Icon & Name */}
          <div className="relative pointer-events-auto inline-flex items-center z-40" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="group inline-flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none focus:outline-none"
            >
              {activeProvider.logo_path && (
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden shrink-0 border border-white/25 bg-black/40 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src={getImageUrl(activeProvider.logo_path, 'w300')}
                    alt={activeProvider.name}
                    fill
                    sizes="48px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
              )}
              <span className="border-b-[2.5px] border-white/60 group-hover:border-white transition-colors pb-0.5 leading-none drop-shadow-sm">
                {activeProvider.name}
              </span>
              {isLoading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white/70 animate-spin shrink-0 translate-y-[1px]" />
              ) : (
                <ChevronDown
                  strokeWidth={2.5}
                  className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 shrink-0 translate-y-[1px] ${
                    isDropdownOpen
                      ? 'rotate-180 text-white'
                      : 'text-white/65 group-hover:text-white'
                  }`}
                />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-3 min-w-[215px] font-normal tracking-normal bg-[#141416]/90 bg-gradient-to-br from-white/[0.22] to-white/[0.08] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.28] rounded-2xl p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.75),inset_0_1px_1px_0_rgba(255,255,255,0.45)] animate-in fade-in slide-in-from-top-2 duration-150 z-50 max-h-72 overflow-y-auto filter-scrollbar overscroll-contain pr-1 scroll-smooth">
                {providerOptions.map((provider) => {
                  const isSelected = provider.id === selectedProviderId;
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => {
                        setSelectedProviderId(provider.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-[13px] transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black font-semibold'
                          : 'text-white/85 hover:bg-white/10 hover:text-white font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {provider.logo_path && (
                          <div
                            className={`relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border shadow-sm ${
                              isSelected
                                ? 'border-black/15 bg-black/20'
                                : 'border-white/15 bg-black/30'
                            }`}
                          >
                            <Image
                              src={getImageUrl(provider.logo_path, 'w300')}
                              alt={provider.name}
                              fill
                              sizes="48px"
                              referrerPolicy="no-referrer"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="truncate pr-1">{provider.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* iOS Segmented Control Switch (Movies / TV Shows) */}
        <div className="ios-segmented-track overflow-x-auto hide-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={
                activeTab === tab.id
                  ? 'ios-segmented-btn-active'
                  : 'ios-segmented-btn-inactive'
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`relative z-10 transition-opacity duration-200 ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
        <ScrollableRow>
          {items.map((item: any) => (
            <div key={`${selectedProviderId}-${activeTab}-${item.id}`} className="poster-row-item">
              <MediaCard movie={item} />
            </div>
          ))}
        </ScrollableRow>
      </div>
    </div>
  );
}

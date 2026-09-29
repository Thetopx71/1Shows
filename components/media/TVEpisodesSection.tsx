'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import { fetchSeasonData } from '@/app/actions';
import ScrollableRow from '@/components/ui/ScrollableRow';
import {
  ChevronDown,
  Search,
  ArrowUpDown,
  Play,
  X,
  Loader2,
} from 'lucide-react';

interface TVEpisodesSectionProps {
  tvId: number;
  seasons: any[];
  initialSeasonData?: any;
  onPlayEpisode?: (episode: any) => void;
  onToast?: (msg: string) => void;
}

export default function TVEpisodesSection({
  tvId,
  seasons,
  initialSeasonData,
  onPlayEpisode,
}: TVEpisodesSectionProps) {
  const filteredSeasons = seasons.filter((s: any) => s.season_number > 0);
  const defaultSeasonNumber =
    initialSeasonData?.season_number ||
    filteredSeasons[0]?.season_number ||
    1;

  const [selectedSeason, setSelectedSeason] = useState<number>(defaultSeasonNumber);
  const [seasonData, setSeasonData] = useState<any>(
    initialSeasonData && initialSeasonData.season_number === defaultSeasonNumber
      ? initialSeasonData
      : null
  );
  const [loading, setLoading] = useState<boolean>(!seasonData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const seasonCache = useRef<Record<number, any>>(
    initialSeasonData ? { [initialSeasonData.season_number]: initialSeasonData } : {}
  );

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch season data when selectedSeason changes
  useEffect(() => {
    let isCancelled = false;

    async function loadSeason() {
      if (seasonCache.current[selectedSeason]) {
        setSeasonData(seasonCache.current[selectedSeason]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchSeasonData(tvId, selectedSeason);
        if (!isCancelled) {
          seasonCache.current[selectedSeason] = data;
          setSeasonData(data);
        }
      } catch (err) {
        console.error('Failed to load season:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadSeason();

    return () => {
      isCancelled = true;
    };
  }, [tvId, selectedSeason]);

  const episodes: any[] = seasonData?.episodes || [];

  const filteredEpisodes = episodes
    .filter((ep: any) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const epName = (ep.name || '').toLowerCase();
      const epOverview = (ep.overview || '').toLowerCase();
      const epNum = String(ep.episode_number);
      return epName.includes(q) || epOverview.includes(q) || epNum === q;
    })
    .sort((a: any, b: any) => {
      const aNum = a.episode_number || 0;
      const bNum = b.episode_number || 0;
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    });

  const currentSeasonObj = filteredSeasons.find(
    (s: any) => s.season_number === selectedSeason
  );

  return (
    <div className="w-full">
      {/* Header: "Episodes" title */}
      <div className="flex items-center justify-between mb-5 select-none">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Episodes
        </h2>
      </div>

      {/* Control Bar: Season Selector + Search Bar + Sort Toggle */}
      <div className="flex flex-wrap items-center gap-3.5 mb-6 select-none">
        {/* Season Selector Dropdown */}
        {filteredSeasons.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="ios-btn-glass min-w-[150px] justify-between font-semibold"
              aria-label="Select season"
            >
              <span>{currentSeasonObj?.name || `Season ${selectedSeason}`}</span>
              <ChevronDown
                className={`w-[18px] h-[18px] text-white/70 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2.5 z-50 min-w-[210px] bg-white/[0.12] bg-gradient-to-br from-white/[0.22] to-white/[0.07] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.26] rounded-2xl p-2 shadow-[0_16px_40px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.45)] animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="max-h-64 overflow-y-auto filter-scrollbar overscroll-contain pr-1 scroll-smooth flex flex-col gap-1">
                  {filteredSeasons.map((season: any) => {
                    const isCurrent = season.season_number === selectedSeason;
                    return (
                      <button
                        key={season.id || season.season_number}
                        onClick={() => {
                          setSelectedSeason(season.season_number);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`flex items-center justify-between px-4 py-3 text-[14px] rounded-xl text-left transition-all duration-150 cursor-pointer ${
                          isCurrent
                            ? 'bg-white/20 text-white font-semibold shadow-inner'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{season.name || `Season ${season.season_number}`}</span>
                        {season.episode_count ? (
                          <span className="text-xs text-white/50 font-normal">
                            {season.episode_count} eps
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Episode Input */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <Search className="w-5 h-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search episode..."
            className="w-full h-11 bg-white/[0.08] hover:bg-white/[0.14] focus:bg-white/[0.16] bg-gradient-to-br from-white/[0.18] to-white/[0.05] md:backdrop-blur-2xl md:backdrop-saturate-[1.9] border border-white/[0.25] hover:border-white/[0.38] focus:border-white/50 rounded-full pl-11 pr-10 text-base sm:text-[15px] text-white placeholder-white/50 shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.45)] focus:outline-none transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 rounded-full transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Order Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="ios-btn-glass text-[14px] px-5 ml-auto"
          title={sortOrder === 'asc' ? 'Sorting 1 to N' : 'Sorting N to 1'}
          aria-label="Toggle sort order"
        >
          <ArrowUpDown className="w-[18px] h-[18px] text-white/80" />
          <span className="hidden sm:inline font-semibold">
            {sortOrder === 'asc' ? '1 → N' : 'N → 1'}
          </span>
        </button>
      </div>

      {/* Horizontal Episode Cards Carousel using Project Liquid-Glass Style & ScrollableRow */}
      <div className="relative min-h-[260px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/50 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-white/70" />
            <span className="text-sm font-medium">Loading episodes...</span>
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="bg-white/[0.07] bg-gradient-to-br from-white/[0.12] to-white/[0.03] md:backdrop-blur-2xl md:backdrop-saturate-[1.8] border border-white/[0.18] rounded-3xl p-12 text-center text-white/50 shadow-[0_8px_28px_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.28)]">
            {searchQuery ? (
              <p>
                No episodes matching &ldquo;{searchQuery}&rdquo; in this season.
              </p>
            ) : (
              <p>No episodes available for this season.</p>
            )}
          </div>
        ) : (
          <ScrollableRow className="flex items-stretch gap-3.5 sm:gap-4 md:gap-[18px] overflow-x-auto snap-x snap-mandatory pb-6 pt-2 custom-scrollbar px-0.5">
            {filteredEpisodes.map((episode: any) => {
              const epId = episode.id || episode.episode_number;
              const epNum = episode.episode_number;
              const rawName = (episode.name || '').trim();
              const displayTitle = rawName
                ? `${epNum}. ${rawName}`
                : `${epNum}. Episode ${epNum}`;

              const runtimeMinutes =
                episode.runtime ||
                (typeof episode.duration === 'number' ? episode.duration : null);

              return (
                <div
                  key={epId}
                  onClick={() => onPlayEpisode && onPlayEpisode(episode)}
                  className="group/card relative w-[260px] sm:w-[290px] md:w-[310px] lg:w-[322px] shrink-0 snap-start rounded-2xl sm:rounded-3xl bg-white/[0.07] hover:bg-white/[0.11] bg-gradient-to-br from-white/[0.12] to-white/[0.03] md:backdrop-blur-2xl md:backdrop-saturate-[1.8] border border-white/[0.18] hover:border-white/[0.32] p-3 pb-5 flex flex-col transition-all duration-200 cursor-pointer shadow-[0_8px_28px_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.28)] select-none"
                >
                  {/* Top 16:9 Thumbnail with Bottom-Right Runtime Pill */}
                  <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 shrink-0 shadow-inner">
                    {episode.still_path ? (
                      <Image
                        src={getImageUrl(episode.still_path, 'w500')}
                        alt={rawName || `Episode ${epNum}`}
                        fill
                        sizes="(max-width: 640px) 260px, 322px"
                        referrerPolicy="no-referrer"
                        className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/25 text-xs uppercase tracking-wider font-semibold">
                        Episode {epNum}
                      </div>
                    )}

                    {/* Hover Play Overlay matching project liquid glass */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/[0.2] bg-gradient-to-br from-white/[0.35] to-white/[0.1] md:backdrop-blur-xl md:backdrop-saturate-[1.9] border border-white/40 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.6)] transform scale-90 group-hover/card:scale-100 transition-transform duration-200">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom-Right Runtime Badge (e.g., "53m") */}
                    {runtimeMinutes ? (
                      <div className="absolute bottom-2 right-2 bg-black/60 bg-gradient-to-br from-white/[0.22] to-white/[0.06] backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-white/95 tracking-tight leading-snug shadow ring-1 ring-white/20">
                        {runtimeMinutes}m
                      </div>
                    ) : null}
                  </div>

                  {/* Card Body: Numbered Episode Title + 4-Line Synopsis */}
                  <div className="pt-3.5 px-1.5 flex-1 flex flex-col">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-white group-hover/card:text-white/95 leading-snug line-clamp-1 mb-2">
                      {displayTitle}
                    </h3>

                    <p className="text-[13px] sm:text-[13.5px] text-white/65 leading-[1.5] line-clamp-4 font-normal">
                      {episode.overview ||
                        'No description available for this episode.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </ScrollableRow>
        )}
      </div>
    </div>
  );
}

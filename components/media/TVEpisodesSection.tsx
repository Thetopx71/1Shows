'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import { fetchSeasonData } from '@/app/actions';
import {
  ChevronDown,
  Search,
  ArrowUpDown,
  Download,
  Check,
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
  onToast,
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
  const [downloadedEpisodes, setDownloadedEpisodes] = useState<Record<number, boolean>>({});

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

  const toggleDownload = (ep: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const epId = ep.id || ep.episode_number;
    const isNowDownloaded = !downloadedEpisodes[epId];
    setDownloadedEpisodes((prev) => ({
      ...prev,
      [epId]: isNowDownloaded,
    }));

    if (onToast) {
      onToast(
        isNowDownloaded
          ? `Episode ${ep.episode_number} saved for offline playback`
          : `Removed Episode ${ep.episode_number} from downloads`
      );
    }
  };

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
      {/* Header: "Episodes" title without any red bar */}
      <div className="flex items-center justify-between mb-6 select-none">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Episodes
        </h2>
      </div>

      {/* Control Bar: Season Selector + Search Bar + Sort Toggle */}
      <div className="flex flex-wrap items-center gap-3.5 mb-7 select-none">
        {/* Season Selector Dropdown (Styled with frosted glass pill button style) */}
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

            {/* Dropdown Menu */}
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

        {/* Search Episode Input (Styled as glass pill matching other buttons) */}
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

        {/* Sort Order Toggle (Styled as frosted glass pill button) */}
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

      {/* Episodes List Container */}
      <div className="relative min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/50 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-white/70" />
            <span className="text-sm font-medium">Loading episodes...</span>
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="bg-[#161618]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 text-center text-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {searchQuery ? (
              <p>
                No episodes matching &ldquo;{searchQuery}&rdquo; in this season.
              </p>
            ) : (
              <p>No episodes available for this season.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEpisodes.map((episode: any) => {
              const epId = episode.id || episode.episode_number;
              const isDownloaded = !!downloadedEpisodes[epId];
              const epName = episode.name || `Episode ${episode.episode_number}`;
              const formattedTitle = epName.toLowerCase().startsWith('episode')
                ? epName
                : `Episode ${episode.episode_number} · ${epName}`;

              const runtimeMinutes =
                episode.runtime ||
                (typeof episode.duration === 'number' ? episode.duration : 45);

              return (
                <div
                  key={epId}
                  onClick={() => onPlayEpisode && onPlayEpisode(episode)}
                  className="group relative bg-white/[0.07] hover:bg-white/[0.11] bg-gradient-to-br from-white/[0.12] to-white/[0.03] md:backdrop-blur-2xl md:backdrop-saturate-[1.8] border border-white/[0.18] hover:border-white/[0.32] rounded-2xl md:rounded-3xl p-3.5 sm:p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 transition-colors duration-200 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_1px_0_rgba(255,255,255,0.3)]"
                >
                  {/* Left: 16:9 Thumbnail with bottom-left episode number badge */}
                  <div className="aspect-video w-full sm:w-44 md:w-56 lg:w-60 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative bg-black/40 shadow-inner">
                    {episode.still_path ? (
                      <Image
                        src={getImageUrl(episode.still_path, 'w500')}
                        alt={epName}
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        referrerPolicy="no-referrer"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs uppercase tracking-wider font-semibold">
                        No Preview
                      </div>
                    )}

                    {/* Play icon on hover */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/[0.2] bg-gradient-to-br from-white/[0.35] to-white/[0.1] md:backdrop-blur-xl md:backdrop-saturate-[1.9] border border-white/40 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom-left Episode Number Badge */}
                    <div className="absolute bottom-2.5 left-2.5 bg-black/55 bg-gradient-to-br from-white/[0.24] to-white/[0.06] md:backdrop-blur-xl md:backdrop-saturate-[1.8] px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-white shadow ring-1 ring-white/25 select-none">
                      {episode.episode_number}
                    </div>
                  </div>

                  {/* Middle: Title, Duration, Overview */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-base sm:text-[17px] font-bold text-white group-hover:text-white/95 transition-colors line-clamp-1 mb-1">
                      {formattedTitle}
                    </h3>

                    <div className="text-xs sm:text-sm text-white/50 font-medium mb-2">
                      {runtimeMinutes} min
                    </div>

                    <p className="text-xs sm:text-[13.5px] text-white/65 line-clamp-2 md:line-clamp-3 leading-relaxed">
                      {episode.overview ||
                        'No description provided for this episode.'}
                    </p>
                  </div>

                  {/* Right: Download Action Button (Liquid glass button matching hero buttons) */}
                  <div className="sm:self-center shrink-0 ml-auto sm:ml-0">
                    <button
                      onClick={(e) => toggleDownload(episode, e)}
                      className={`ios-btn-circle ${
                        isDownloaded
                          ? '!bg-white/25 !text-white !border-white/40 shadow-[0_4px_20px_rgba(255,255,255,0.2)]'
                          : ''
                      }`}
                      title={isDownloaded ? 'Downloaded' : 'Download episode'}
                      aria-label="Download episode"
                    >
                      {isDownloaded ? (
                        <Check className="w-5 h-5 text-white" strokeWidth={2.4} />
                      ) : (
                        <Download className="w-5 h-5" strokeWidth={2.2} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

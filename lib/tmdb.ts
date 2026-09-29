const BASE_URL = 'https://api.themoviedb.org/3';

export interface StreamingProviderOption {
  id: number;
  queryIds: string;
  name: string;
  logo_path: string;
}

export const STREAMING_PROVIDERS: StreamingProviderOption[] = [
  { id: 8, queryIds: '8|1796', name: 'Netflix', logo_path: '/rK1KljqmbvO9HQa1PBFLILWah72.png' },
  { id: 9, queryIds: '9|119|2100', name: 'Prime Video', logo_path: '/gMZdpavHmxFNnLpMHwVxfqeux2g.png' },
  { id: 350, queryIds: '350|2|2243', name: 'Apple TV', logo_path: '/9icYBfYFcwgCbky5VdGUIKJ4C5i.png' },
  { id: 337, queryIds: '337', name: 'Disney+', logo_path: '/5eZ872CghnHFLB1j8grszbrx0dx.png' },
  { id: 15, queryIds: '15', name: 'Hulu', logo_path: '/44uAnmSqvA4yBOdbPWN8YgQHjWm.png' },
  { id: 1899, queryIds: '1899|384|1825', name: 'Max', logo_path: '/skypuy7SXuugIQeYg0IglmzoKaS.png' },
  { id: 2303, queryIds: '2303|2616|531|582|1853', name: 'Paramount+', logo_path: '/4N4BMd0Mm0kHAmF7RZgL5lW3cwc.png' },
  { id: 386, queryIds: '386|387|2553', name: 'Peacock', logo_path: '/a1UIdq5BrkcAxnxcUhFsNbXnxeu.png' },
];

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

export function resolveProviderLogos(
  results: any[] | undefined | null,
  defaults: StreamingProviderOption[] = STREAMING_PROVIDERS
): StreamingProviderOption[] {
  if (!Array.isArray(results) || results.length === 0) return defaults;
  const logoMap = new Map<number, string>();
  results.forEach((p: any) => {
    if (p?.provider_id && p?.logo_path) {
      logoMap.set(p.provider_id, p.logo_path);
    }
  });
  if (logoMap.size === 0) return defaults;

  return defaults.map((prov) => {
    const candidateIds = [prov.id, ...prov.queryIds.split('|').map(Number)];
    const matchedLogo = candidateIds.map((id) => logoMap.get(id)).find(Boolean);
    return {
      ...prov,
      logo_path: matchedLogo || prov.logo_path,
    };
  });
}

export function formatMediaDate(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }
  return dateStr;
}

export function slugifyMediaSegment(text?: string | null): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getMediaHref(
  item: {
    id: number | string;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    media_type?: string;
    type?: string;
  },
  explicitType?: 'movie' | 'tv'
): string {
  const type =
    explicitType ||
    (item.media_type === 'tv' ||
    item.type === 'tv' ||
    (!item.media_type && !item.type && item.name && !item.title)
      ? 'tv'
      : 'movie');

  const rawTitle = item.title || item.name || '';
  const titleSlug = slugifyMediaSegment(rawTitle);

  const dateStr = item.release_date || item.first_air_date || '';
  const yearMatch = dateStr.match(/^\d{4}/);
  const year = yearMatch ? yearMatch[0] : '';

  const slugParts = [String(item.id), titleSlug, year].filter(Boolean);
  return `/${type}/${slugParts.join('-')}`;
}

export function extractMediaId(slugOrId: string): string {
  if (!slugOrId) return '';
  const match = slugOrId.match(/^\d+/);
  return match ? match[0] : slugOrId.split('-')[0] || slugOrId;
}

export class TMDBError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TMDBError';
    this.status = status;
  }
}

async function fetchTMDB(
  endpoint: string,
  params: Record<string, string> = {},
  retries = 1
): Promise<any> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY?.trim();

  if (!TMDB_API_KEY) {
    throw new TMDBError(
      'TMDB_API_KEY is missing. Please add it to your environment variables.'
    );
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        await new Promise((res) => setTimeout(res, 500));
        return fetchTMDB(endpoint, params, retries - 1);
      }
      throw new TMDBError(
        `TMDB API Error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error: any) {
    if (error instanceof TMDBError) {
      throw error;
    }
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, 500));
      return fetchTMDB(endpoint, params, retries - 1);
    }
    throw new TMDBError(
      `Network error while contacting TMDB: ${error.message || 'Unknown error'}`
    );
  }
}

export async function getNowPlayingMovies() {
  return fetchTMDB('/movie/now_playing');
}

export async function getPopularByProvider(
  type: 'movie' | 'tv',
  providerQueryIds = '8|1796'
) {
  return fetchTMDB(`/discover/${type}`, {
    sort_by: 'popularity.desc',
    with_watch_providers: providerQueryIds,
    watch_region: 'US',
  });
}

export async function getStreamingMovies() {
  return fetchTMDB('/discover/movie', {
    with_watch_providers: '8|9|119|337|384|1899',
    watch_region: 'US',
  });
}

export async function getFreeMovies() {
  return fetchTMDB('/discover/movie', {
    with_watch_monetization_types: 'free',
    watch_region: 'US',
  });
}

export async function getFreeTVShows() {
  return fetchTMDB('/discover/tv', {
    with_watch_monetization_types: 'free',
    watch_region: 'US',
  });
}

export async function getTrending(timeWindow: 'day' | 'week' = 'day') {
  return fetchTMDB(`/trending/all/${timeWindow}`);
}

export async function searchMedia(query: string) {
  if (!query || !query.trim()) return { results: [] };
  return fetchTMDB('/search/multi', { query: query.trim() });
}

export async function getSeasonDetails(
  tvId: string | number,
  seasonNumber: number
) {
  return fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getMovieDetails(id: string) {
  return fetchTMDB(`/movie/${id}`, {
    append_to_response:
      'reviews,watch/providers,credits,recommendations,videos,keywords,images',
    include_image_language: 'en,null',
    include_video_language: 'en,null',
  });
}

export async function getTVDetails(id: string) {
  return fetchTMDB(`/tv/${id}`, {
    append_to_response:
      'reviews,watch/providers,credits,recommendations,videos,keywords,images',
    include_image_language: 'en,null',
    include_video_language: 'en,null',
  });
}

export async function getMediaImages(
  id: string | number,
  type: 'movie' | 'tv' = 'movie'
) {
  return fetchTMDB(`/${type}/${id}/images`, {
    include_image_language: 'en,null',
  });
}

export function getImageUrl(
  path: string | null | undefined,
  size: 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
) {
  if (!path) return 'https://picsum.photos/seed/movie/500/750';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
}

export async function discoverMovies(params: any = {}) {
  return fetchTMDB('/discover/movie', {
    ...params,
  });
}

export async function discoverTV(params: any = {}) {
  return fetchTMDB('/discover/tv', {
    ...params,
  });
}

export async function getWatchProviders(type: 'movie' | 'tv' = 'movie') {
  return fetchTMDB(`/watch/providers/${type}`, {
    watch_region: 'US',
  });
}

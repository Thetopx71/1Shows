export const SITE_URL = process.env.APP_URL?.trim() || 'https://1shows.im';
export const SITE_TITLE = '1Shows – Movies, TV Series, Anime & Streaming Guide';
export const SITE_DESCRIPTION =
  'Discover trending movies, TV series, and popular anime on 1Shows. Explore ratings, trailers, episode guides, and where to stream across top platforms.';

export const SITE_KEYWORDS = [
  '1Shows',
  'movies',
  'TV shows',
  'TV series',
  'popular anime',
  'streaming guide',
  'where to watch',
  'movie trailers',
  'episode guide',
  'movie ratings',
  'watchlist',
];

export const SORT_OPTIONS = [
  { id: 'popularity.desc', label: 'Popular' },
  { id: 'vote_average.desc', label: 'Highest Rated' },
  { id: 'primary_release_date.desc', label: 'Newest Releases' },
];

export const MOVIE_GENRES = [
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
  { id: '37', label: 'Western' },
];

export const TV_GENRES = [
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
  { id: '37', label: 'Western' },
];

export const YEARS = [
  { id: '', label: 'All Years' },
  ...Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { id: year.toString(), label: year.toString() };
  }),
];

export const COUNTRIES = [
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
  { id: 'AU', label: 'Australia' },
];

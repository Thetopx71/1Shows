import {
  searchMedia,
  getNowPlayingMovies,
  getPopularByProvider,
  getMediaImages,
  TMDBError,
  getTrending,
  getStreamingMovies,
  getFreeMovies,
  getFreeTVShows,
} from '@/lib/tmdb';
import MediaCard from '@/components/media/MediaCard';
import HeroSlider from '@/components/home/HeroSlider';
import TabbedMediaRow from '@/components/home/TabbedMediaRow';
import NetworkPopularRow from '@/components/home/NetworkPopularRow';
import { AlertCircle } from 'lucide-react';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q;

  let searchResults: any[] = [];
  let popularMovies: any[] = [];
  let nowPlaying: any[] = [];
  let popularTVShows: any[] = [];
  let trendingToday: any[] = [];
  let trendingWeek: any[] = [];
  let streaming: any[] = [];
  let freeMovies: any[] = [];
  let freeTv: any[] = [];
  let heroItems: any[] = [];
  let errorMsg: string | null = null;

  try {
    if (query) {
      const data = await searchMedia(query);
      searchResults = data?.results || [];
    } else {
      const settled = await Promise.allSettled([
        getPopularByProvider('movie', '8|1796'),
        getNowPlayingMovies(),
        getPopularByProvider('tv', '8|1796'),
        getTrending('day'),
        getTrending('week'),
        getStreamingMovies(),
        getFreeMovies(),
        getFreeTVShows(),
      ]);

      const getResults = (res: PromiseSettledResult<any>) =>
        res.status === 'fulfilled' ? res.value?.results || [] : [];

      popularMovies = getResults(settled[0]);
      nowPlaying = getResults(settled[1]);
      popularTVShows = getResults(settled[2]);
      trendingToday = getResults(settled[3]);
      trendingWeek = getResults(settled[4]);
      streaming = getResults(settled[5]);
      freeMovies = getResults(settled[6]);
      freeTv = getResults(settled[7]);

      const allFailed = settled.every((r) => r.status === 'rejected');
      if (allFailed) {
        const firstErr: any =
          settled[0].status === 'rejected' ? settled[0].reason : null;
        errorMsg =
          firstErr instanceof TMDBError
            ? firstErr.message
            : 'Failed to fetch media from TMDB.';
      }

      // Fetch logos for top 7 Trending Today items for the Hero Slider
      heroItems = trendingToday
        .filter((m: any) => m.backdrop_path && m.media_type !== 'person')
        .slice(0, 7);

      await Promise.all(
        heroItems.map(async (item: any) => {
          try {
            const type = item.media_type || (item.name ? 'tv' : 'movie');
            const images = await getMediaImages(item.id, type);
            if (images.logos && images.logos.length > 0) {
              const enLogo = images.logos.find((l: any) => l.iso_639_1 === 'en');
              item.logo_path = (enLogo || images.logos[0]).file_path;
            }
          } catch {
            // Ignore if logo fetch fails
          }
        })
      );
    }
  } catch (err: any) {
    errorMsg = err instanceof TMDBError ? err.message : 'Failed to fetch media.';
  }

  return (
    <main className="flex-1 w-full relative overflow-hidden flex flex-col">
      {!query && heroItems.length > 0 && (
        <div className="w-full">
          <HeroSlider items={heroItems} />
        </div>
      )}

      <div
        className={`container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] relative z-20 ${
          !query ? 'mt-6 sm:mt-8 md:mt-12' : 'pt-24 mt-8 md:mt-12'
        }`}
      >
        {errorMsg ? (
          <div className="rounded-2xl bg-red-500/10 p-6 border border-red-500/20 max-w-2xl mx-auto flex gap-4 items-start text-red-400 backdrop-blur-xl mb-12">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-red-300">Configuration Required</h3>
              <p className="text-sm">{errorMsg}</p>
              <p className="text-sm mt-2">
                To fix this, go to your project settings and add a valid{' '}
                <strong>TMDB_API_KEY</strong> secret.
              </p>
            </div>
          </div>
        ) : query ? (
          <div className="space-y-8 mb-24">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                Search Results for &ldquo;{query}&rdquo;
              </h2>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-24 text-white/50">
                No movies or shows found matching &quot;{query}&quot;. Try a
                different search term.
              </div>
            ) : (
              <div className="poster-grid">
                {searchResults.map((item: any) => (
                  <MediaCard key={item.id} movie={item} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16 mb-24">
            <TabbedMediaRow
              title="Trending"
              tabs={[
                { id: 'day', label: 'Today', items: trendingToday },
                { id: 'week', label: 'This Week', items: trendingWeek },
              ]}
            />

            <NetworkPopularRow movies={popularMovies} tv={popularTVShows} />

            <TabbedMediaRow
              title="What's Popular"
              tabs={[
                { id: 'streaming', label: 'Streaming', items: streaming },
                { id: 'inTheaters', label: 'In Theaters', items: nowPlaying },
              ]}
            />

            <TabbedMediaRow
              title="Free To Watch"
              tabs={[
                { id: 'movies', label: 'Movies', items: freeMovies },
                { id: 'tv', label: 'TV', items: freeTv },
              ]}
            />
          </div>
        )}
      </div>
    </main>
  );
}

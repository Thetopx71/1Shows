import { discoverMovies } from '@/lib/tmdb';
import DiscoverGrid from '@/components/media/DiscoverGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movies - 1Shows',
  description: 'Discover popular movies, filter by streaming providers.',
};

export const dynamic = 'force-dynamic';

export default async function MoviesPage() {
  let initialData = { results: [], total_pages: 1 };
  try {
    initialData = await discoverMovies({
      sort_by: 'popularity.desc',
      watch_region: 'US',
      'vote_count.gte': 100
    });
  } catch {
    // Fallback to empty initial data when TMDB_API_KEY is not configured
  }

  return <DiscoverGrid type="movie" initialData={initialData} title="Explore Movies" />;
}

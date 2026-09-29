import { discoverTV } from '@/lib/tmdb';
import DiscoverGrid from '@/components/media/DiscoverGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TV Shows - 1Shows',
  description: 'Discover popular TV shows, filter by streaming providers.',
};

export const dynamic = 'force-dynamic';

export default async function TVShowsPage() {
  let initialData = { results: [], total_pages: 1 };
  try {
    initialData = await discoverTV({
      sort_by: 'popularity.desc',
      watch_region: 'US',
      'vote_count.gte': 100
    });
  } catch {
    // Fallback to empty initial data when TMDB_API_KEY is not configured
  }

  return <DiscoverGrid type="tv" initialData={initialData} title="Explore TV Shows" />;
}

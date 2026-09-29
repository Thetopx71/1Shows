import { discoverMovies } from '@/lib/tmdb';
import DiscoverGrid from '@/components/media/DiscoverGrid';
import { Metadata } from 'next';

const MOVIES_TITLE = 'Explore Movies – Popular, Top Rated & Streaming';
const MOVIES_DESC =
  'Browse popular and top-rated movies on 1Shows. Filter by genre, release year, and streaming services including Netflix, Apple TV+, Disney+, and Prime Video.';

export const metadata: Metadata = {
  title: MOVIES_TITLE,
  description: MOVIES_DESC,
  alternates: {
    canonical: '/movies',
  },
  openGraph: {
    type: 'website',
    url: '/movies',
    title: `${MOVIES_TITLE} | 1Shows`,
    description: MOVIES_DESC,
    siteName: '1Shows',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${MOVIES_TITLE} | 1Shows`,
    description: MOVIES_DESC,
  },
};

export const dynamic = 'force-dynamic';

export default async function MoviesPage() {
  let initialData = { results: [], total_pages: 1 };
  try {
    initialData = await discoverMovies({
      sort_by: 'popularity.desc',
      watch_region: 'US',
      'vote_count.gte': 100,
    });
  } catch {
    // Fallback to empty initial data when TMDB_API_KEY is not configured
  }

  return (
    <DiscoverGrid
      type="movie"
      initialData={initialData}
      title="Explore Movies"
    />
  );
}

import { discoverTV } from '@/lib/tmdb';
import DiscoverGrid from '@/components/media/DiscoverGrid';
import { Metadata } from 'next';

const TV_TITLE = 'Explore TV Shows & Series – Episode Guides & Streaming';
const TV_DESC =
  'Discover trending TV series, popular anime, and top-rated shows on 1Shows. Filter by genre and streaming provider with full season and episode guides.';

export const metadata: Metadata = {
  title: TV_TITLE,
  description: TV_DESC,
  alternates: {
    canonical: '/tv',
  },
  openGraph: {
    type: 'website',
    url: '/tv',
    title: `${TV_TITLE} | 1Shows`,
    description: TV_DESC,
    siteName: '1Shows',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TV_TITLE} | 1Shows`,
    description: TV_DESC,
  },
};

export const dynamic = 'force-dynamic';

export default async function TVShowsPage() {
  let initialData = { results: [], total_pages: 1 };
  try {
    initialData = await discoverTV({
      sort_by: 'popularity.desc',
      watch_region: 'US',
      'vote_count.gte': 100,
    });
  } catch {
    // Fallback to empty initial data when TMDB_API_KEY is not configured
  }

  return (
    <DiscoverGrid
      type="tv"
      initialData={initialData}
      title="Explore TV Shows"
    />
  );
}

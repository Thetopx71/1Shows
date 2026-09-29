import type { Metadata } from 'next';
import {
  getTVDetails,
  getSeasonDetails,
  extractMediaId,
  TMDBError,
} from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MediaDetail from '@/components/media/MediaDetail';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tvId = extractMediaId(id);
  try {
    const show = await getTVDetails(tvId);
    const name = show?.name || 'TV Show';
    const year = show?.first_air_date ? show.first_air_date.slice(0, 4) : '';
    return {
      title: year ? `${name} (${year}) - 1Shows` : `${name} - 1Shows`,
      description: show?.overview || 'TV show ratings, reviews, and streaming provider information.',
    };
  } catch {
    return {
      title: 'TV Show - 1Shows',
    };
  }
}

export default async function TVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tvId = extractMediaId(id);

  let show;
  let errorMsg = null;

  try {
    show = await getTVDetails(tvId);
  } catch (err: any) {
    if (
      err instanceof TMDBError &&
      (err.status === 404 || err.message.includes('404'))
    ) {
      notFound();
    }
    errorMsg =
      err instanceof TMDBError
        ? err.message
        : 'Failed to load TV show details.';
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-2xl bg-red-500/10 p-6 border border-red-500/20 max-w-xl flex flex-col gap-4 items-center text-red-400 backdrop-blur-xl">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-white/80">{errorMsg}</p>
          <Link href="/" className="ios-btn-glass">
            <ArrowLeft className="w-4 h-4" /> Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  if (!show) {
    notFound();
  }

  let initialSeasonData = null;
  if (show && show.seasons && Array.isArray(show.seasons)) {
    const firstSeason =
      show.seasons.find((s: any) => s.season_number > 0)?.season_number || 1;
    try {
      initialSeasonData = await getSeasonDetails(tvId, firstSeason);
    } catch {
      // Non-blocking fallback to client fetch
    }
  }

  return (
    <MediaDetail
      media={show}
      type="tv"
      initialSeasonData={initialSeasonData}
    />
  );
}

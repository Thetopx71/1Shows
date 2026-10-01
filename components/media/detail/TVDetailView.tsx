import {
  getTVDetails,
  getSeasonDetails,
  extractMediaId,
  TMDBError,
} from '@/lib/tmdb';
import { buildTVJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MediaDetail from '@/components/media/MediaDetail';

export default async function TVDetailView({
  idParam,
  isIntercepted = false,
}: {
  idParam: string;
  isIntercepted?: boolean;
}) {
  const tvId = extractMediaId(idParam);

  let show;
  let errorMsg: string | null = null;

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

  const tvJsonLd = buildTVJsonLd(show);

  return (
    <>
      {!isIntercepted && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tvJsonLd) }}
        />
      )}
      <MediaDetail
        media={show}
        type="tv"
        initialSeasonData={initialSeasonData}
        isIntercepted={isIntercepted}
      />
    </>
  );
}

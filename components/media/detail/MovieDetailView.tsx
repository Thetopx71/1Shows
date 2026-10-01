import { getMovieDetails, extractMediaId, TMDBError } from '@/lib/tmdb';
import { buildMovieJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MediaDetail from '@/components/media/MediaDetail';

export default async function MovieDetailView({
  idParam,
  isIntercepted = false,
}: {
  idParam: string;
  isIntercepted?: boolean;
}) {
  const movieId = extractMediaId(idParam);

  let movie;
  let errorMsg: string | null = null;

  try {
    movie = await getMovieDetails(movieId);
  } catch (err: any) {
    if (
      err instanceof TMDBError &&
      (err.status === 404 || err.message.includes('404'))
    ) {
      notFound();
    }
    errorMsg =
      err instanceof TMDBError ? err.message : 'Failed to load movie details.';
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

  if (!movie) {
    notFound();
  }

  const movieJsonLd = buildMovieJsonLd(movie);

  return (
    <>
      {!isIntercepted && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
        />
      )}
      <MediaDetail media={movie} type="movie" isIntercepted={isIntercepted} />
    </>
  );
}

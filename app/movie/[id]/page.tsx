import type { Metadata } from 'next';
import {
  getMovieDetails,
  extractMediaId,
  getMediaHref,
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
  const movieId = extractMediaId(id);
  try {
    const movie = await getMovieDetails(movieId);
    const title = movie?.title || 'Movie';
    const year = movie?.release_date ? movie.release_date.slice(0, 4) : '';
    const fullTitle = year
      ? `${title} (${year}) – Watch, Trailer & Cast`
      : `${title} – Watch, Trailer & Cast`;
    const description =
      movie?.overview && movie.overview.length > 20
        ? movie.overview.slice(0, 158)
        : `Explore ratings, trailers, cast, and streaming providers for ${title} on 1Shows.`;
    const canonicalPath = getMediaHref(movie, 'movie');
    const imagePath = movie?.backdrop_path || movie?.poster_path;
    const ogImage = imagePath
      ? `https://image.tmdb.org/t/p/w1280${imagePath}`
      : undefined;

    return {
      title: fullTitle,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        type: 'video.movie',
        url: canonicalPath,
        title: `${fullTitle} | 1Shows`,
        description,
        siteName: '1Shows',
        ...(ogImage ? { images: [{ url: ogImage, width: 1280, height: 720, alt: title }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${fullTitle} | 1Shows`,
        description,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    };
  } catch {
    return {
      title: 'Movie Details',
      description: 'Explore movie ratings, trailers, cast, and where to stream on 1Shows.',
    };
  }
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = extractMediaId(id);

  let movie;
  let errorMsg = null;

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

  const imagePath = movie.backdrop_path || movie.poster_path;
  const directors = (movie.credits?.crew || [])
    .filter((c: any) => c.job === 'Director')
    .slice(0, 3)
    .map((d: any) => ({ '@type': 'Person', name: d.name }));
  const actors = (movie.credits?.cast || [])
    .slice(0, 8)
    .map((a: any) => ({ '@type': 'Person', name: a.name }));

  const movieJsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview || undefined,
    datePublished: movie.release_date || undefined,
    image: imagePath ? `https://image.tmdb.org/t/p/w1280${imagePath}` : undefined,
    genre: Array.isArray(movie.genres)
      ? movie.genres.map((g: any) => g.name)
      : undefined,
    ...(directors.length > 0 ? { director: directors } : {}),
    ...(actors.length > 0 ? { actor: actors } : {}),
    ...(movie.vote_average > 0 && movie.vote_count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(movie.vote_average.toFixed(1)),
            bestRating: 10,
            worstRating: 1,
            ratingCount: movie.vote_count,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
      />
      <MediaDetail media={movie} type="movie" />
    </>
  );
}

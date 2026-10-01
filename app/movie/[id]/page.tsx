import type { Metadata } from 'next';
import { getMovieDetails, extractMediaId, getMediaHref } from '@/lib/tmdb';
import MovieDetailView from '@/components/media/detail/MovieDetailView';

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
        ...(ogImage
          ? { images: [{ url: ogImage, width: 1280, height: 720, alt: title }] }
          : {}),
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
      description:
        'Explore movie ratings, trailers, cast, and where to stream on 1Shows.',
    };
  }
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MovieDetailView idParam={id} />;
}

import type { Metadata } from 'next';
import {
  getTVDetails,
  getSeasonDetails,
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
  const tvId = extractMediaId(id);
  try {
    const show = await getTVDetails(tvId);
    const name = show?.name || 'TV Show';
    const year = show?.first_air_date ? show.first_air_date.slice(0, 4) : '';
    const fullTitle = year
      ? `${name} (${year}) – Episodes, Trailer & Cast`
      : `${name} – Episodes, Trailer & Cast`;
    const description =
      show?.overview && show.overview.length > 20
        ? show.overview.slice(0, 158)
        : `Explore episode guides, ratings, trailers, and where to stream ${name} on 1Shows.`;
    const canonicalPath = getMediaHref(show, 'tv');
    const imagePath = show?.backdrop_path || show?.poster_path;
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
        type: 'video.tv_show',
        url: canonicalPath,
        title: `${fullTitle} | 1Shows`,
        description,
        siteName: '1Shows',
        ...(ogImage ? { images: [{ url: ogImage, width: 1280, height: 720, alt: name }] } : {}),
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
      title: 'TV Series Details',
      description: 'Explore TV show episodes, ratings, trailers, and streaming providers on 1Shows.',
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

  const imagePath = show.backdrop_path || show.poster_path;
  const actors = (show.credits?.cast || [])
    .slice(0, 8)
    .map((a: any) => ({ '@type': 'Person', name: a.name }));

  const tvJsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.name,
    description: show.overview || undefined,
    startDate: show.first_air_date || undefined,
    numberOfSeasons: show.number_of_seasons || undefined,
    numberOfEpisodes: show.number_of_episodes || undefined,
    image: imagePath ? `https://image.tmdb.org/t/p/w1280${imagePath}` : undefined,
    genre: Array.isArray(show.genres)
      ? show.genres.map((g: any) => g.name)
      : undefined,
    ...(actors.length > 0 ? { actor: actors } : {}),
    ...(show.vote_average > 0 && show.vote_count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(show.vote_average.toFixed(1)),
            bestRating: 10,
            worstRating: 1,
            ratingCount: show.vote_count,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tvJsonLd) }}
      />
      <MediaDetail
        media={show}
        type="tv"
        initialSeasonData={initialSeasonData}
      />
    </>
  );
}

import type { Metadata } from 'next';
import { getTVDetails, extractMediaId, getMediaHref } from '@/lib/tmdb';
import TVDetailView from '@/components/media/detail/TVDetailView';

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
        ...(ogImage
          ? { images: [{ url: ogImage, width: 1280, height: 720, alt: name }] }
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
      title: 'TV Series Details',
      description:
        'Explore TV show episodes, ratings, trailers, and streaming providers on 1Shows.',
    };
  }
}

export default async function TVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TVDetailView idParam={id} />;
}

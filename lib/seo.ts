import { SITE_URL, SITE_DESCRIPTION } from './constants';

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: '1Shows',
        description: SITE_DESCRIPTION,
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/movies?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#app`,
        name: '1Shows',
        url: SITE_URL,
        applicationCategory: 'EntertainmentApplication',
        operatingSystem: 'All',
        description: SITE_DESCRIPTION,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  };
}

export function buildMovieJsonLd(movie: any): Record<string, any> {
  const imagePath = movie.backdrop_path || movie.poster_path;
  const directors = (movie.credits?.crew || [])
    .filter((c: any) => c.job === 'Director')
    .slice(0, 3)
    .map((d: any) => ({ '@type': 'Person', name: d.name }));
  const actors = (movie.credits?.cast || [])
    .slice(0, 8)
    .map((a: any) => ({ '@type': 'Person', name: a.name }));

  return {
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
}

export function buildTVJsonLd(show: any): Record<string, any> {
  const imagePath = show.backdrop_path || show.poster_path;
  const actors = (show.credits?.cast || [])
    .slice(0, 8)
    .map((a: any) => ({ '@type': 'Person', name: a.name }));

  return {
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
}

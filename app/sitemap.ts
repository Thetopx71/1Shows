import type { MetadataRoute } from 'next';
import { discoverMovies, discoverTV, getMediaHref } from '@/lib/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL?.trim() || 'https://1shows.im';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tv`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/list`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    const [moviesData, tvData] = await Promise.all([
      discoverMovies({ sort_by: 'popularity.desc' }),
      discoverTV({ sort_by: 'popularity.desc' }),
    ]);

    const movieEntries: MetadataRoute.Sitemap = (moviesData?.results || [])
      .slice(0, 20)
      .map((movie: any) => ({
        url: `${baseUrl}${getMediaHref(movie, 'movie')}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    const tvEntries: MetadataRoute.Sitemap = (tvData?.results || [])
      .slice(0, 20)
      .map((show: any) => ({
        url: `${baseUrl}${getMediaHref(show, 'tv')}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    return [...staticRoutes, ...movieEntries, ...tvEntries];
  } catch {
    return staticRoutes;
  }
}

'use server';

import {
  getSeasonDetails,
  discoverMovies,
  discoverTV,
  searchMedia,
  getWatchProviders,
} from '@/lib/tmdb';

export async function fetchSeasonData(tvId: string | number, seasonNumber: number) {
  try {
    return await getSeasonDetails(tvId, seasonNumber);
  } catch (error) {
    console.error('Error fetching season details:', error);
    throw new Error('Failed to fetch season details');
  }
}

export async function fetchWatchProviders(type: 'movie' | 'tv' = 'movie') {
  try {
    const data = await getWatchProviders(type);
    return data?.results || [];
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return [];
  }
}

export async function searchMediaAction(query: string) {
  try {
    const data = await searchMedia(query);
    return data?.results || [];
  } catch (error) {
    console.error('Error searching media:', error);
    return [];
  }
}

export async function fetchDiscoverMedia(type: 'movie' | 'tv', params: any = {}) {
  try {
    return type === 'movie'
      ? await discoverMovies(params)
      : await discoverTV(params);
  } catch (error) {
    console.error('Error fetching discover media:', error);
    throw new Error('Failed to fetch media');
  }
}

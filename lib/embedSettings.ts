'use client';

export interface EmbedPlayerConfig {
  id: string;
  name: string;
  movieTemplate: string;
  tvTemplate: string;
}

export interface EmbedSettings {
  enabled: boolean;
  movieTemplate: string;
  tvTemplate: string;
  players: EmbedPlayerConfig[];
  activePlayerIndex: number;
}

const STORAGE_KEY = 'popcorn-embed-settings';
export const EMBED_SETTINGS_EVENT = 'popcorn:embed-settings-updated';

export const DEFAULT_PLAYER: EmbedPlayerConfig = {
  id: 'player-1',
  name: 'Player 1',
  movieTemplate: '',
  tvTemplate: '',
};

export const DEFAULT_SETTINGS: EmbedSettings = {
  enabled: false,
  movieTemplate: '',
  tvTemplate: '',
  players: [DEFAULT_PLAYER],
  activePlayerIndex: 0,
};

function normalizePlayers(
  rawPlayers: unknown,
  fallbackMovie = '',
  fallbackTv = ''
): EmbedPlayerConfig[] {
  if (Array.isArray(rawPlayers) && rawPlayers.length > 0) {
    return rawPlayers.map((item, idx) => ({
      id: typeof item?.id === 'string' && item.id ? item.id : `player-${idx + 1}`,
      name: `Player ${idx + 1}`,
      movieTemplate: typeof item?.movieTemplate === 'string' ? item.movieTemplate : '',
      tvTemplate: typeof item?.tvTemplate === 'string' ? item.tvTemplate : '',
    }));
  }

  return [
    {
      id: 'player-1',
      name: 'Player 1',
      movieTemplate: fallbackMovie,
      tvTemplate: fallbackTv,
    },
  ];
}

export function getEmbedSettings(): EmbedSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const fallbackMovie = typeof parsed?.movieTemplate === 'string' ? parsed.movieTemplate : '';
    const fallbackTv = typeof parsed?.tvTemplate === 'string' ? parsed.tvTemplate : '';
    const players = normalizePlayers(parsed?.players, fallbackMovie, fallbackTv);
    const rawActiveIdx =
      typeof parsed?.activePlayerIndex === 'number' ? parsed.activePlayerIndex : 0;
    const activePlayerIndex =
      rawActiveIdx >= 0 && rawActiveIdx < players.length ? rawActiveIdx : 0;

    return {
      enabled: Boolean(parsed?.enabled),
      movieTemplate: players[0]?.movieTemplate ?? fallbackMovie,
      tvTemplate: players[0]?.tvTemplate ?? fallbackTv,
      players,
      activePlayerIndex,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveEmbedSettings(next: EmbedSettings): void {
  if (typeof window === 'undefined') return;
  try {
    const normalizedPlayers = normalizePlayers(
      next.players,
      next.movieTemplate,
      next.tvTemplate
    );
    const safeActiveIndex =
      typeof next.activePlayerIndex === 'number' &&
      next.activePlayerIndex >= 0 &&
      next.activePlayerIndex < normalizedPlayers.length
        ? next.activePlayerIndex
        : 0;

    const payload: EmbedSettings = {
      enabled: Boolean(next.enabled),
      movieTemplate: normalizedPlayers[0]?.movieTemplate ?? '',
      tvTemplate: normalizedPlayers[0]?.tvTemplate ?? '',
      players: normalizedPlayers,
      activePlayerIndex: safeActiveIndex,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(EMBED_SETTINGS_EVENT, { detail: payload }));
  } catch {
    // ignore storage errors
  }
}

export function resolveTemplateUrl(
  movieTemplate: string,
  tvTemplate: string,
  options: {
    type: 'movie' | 'tv';
    id: string | number;
    season?: number;
    episode?: number;
  }
): string | null {
  const { type, id, season = 1, episode = 1 } = options;
  const rawTemplate =
    type === 'movie'
      ? movieTemplate.trim() || tvTemplate.trim()
      : tvTemplate.trim() || movieTemplate.trim();

  if (!rawTemplate) return null;

  let url = rawTemplate;

  if (type === 'tv' && !tvTemplate.trim() && url.includes('/movie/{id}')) {
    url = url.replace('/movie/{id}', '/tv/{id}-{season}-{episode}');
  } else if (
    type === 'movie' &&
    !movieTemplate.trim() &&
    url.includes('/tv/{id}-{season}-{episode}')
  ) {
    url = url.replace('/tv/{id}-{season}-{episode}', '/movie/{id}');
  }

  const hasIdToken = /\{(id|tmdb|tmdb_id)\}/i.test(url);

  url = url
    .replace(/\{(id|tmdb|tmdb_id)\}/gi, String(id))
    .replace(/\{(season|s)\}/gi, String(season))
    .replace(/\{(episode|ep|e)\}/gi, String(episode));

  if (!hasIdToken) {
    try {
      const parsed = new URL(url);
      const cleanPath = parsed.pathname.replace(/\/+$/, '');
      if (type === 'movie') {
        parsed.pathname = `${cleanPath}/${id}`;
      } else {
        parsed.pathname = `${cleanPath}/${id}-${season}-${episode}`;
      }
      url = parsed.toString();
    } catch {
      // Return as-is if not a standard URL
    }
  }

  return url;
}

export interface ResolvedEmbedPlayer {
  index: number;
  id: string;
  name: string;
  url: string;
}

/**
 * Returns all configured players that have a valid embed link for the given media.
 */
export function getAvailableEmbedPlayers(
  settings: EmbedSettings,
  options: {
    type: 'movie' | 'tv';
    id: string | number;
    season?: number;
    episode?: number;
  }
): ResolvedEmbedPlayer[] {
  if (!settings.enabled) return [];

  const players =
    Array.isArray(settings.players) && settings.players.length > 0
      ? settings.players
      : [
          {
            id: 'player-1',
            name: 'Player 1',
            movieTemplate: settings.movieTemplate || '',
            tvTemplate: settings.tvTemplate || '',
          },
        ];

  const resolved: ResolvedEmbedPlayer[] = [];
  players.forEach((player, idx) => {
    const url = resolveTemplateUrl(
      player.movieTemplate || '',
      player.tvTemplate || '',
      options
    );
    if (url) {
      resolved.push({
        index: idx,
        id: player.id || `player-${idx + 1}`,
        name: `Player ${idx + 1}`,
        url,
      });
    }
  });

  return resolved;
}

/**
 * Resolves a user-provided embed link template into a playable embed URL.
 * Supports {id}, {tmdb}, {tmdb_id}, {season}, {s}, {episode}, {e}, {ep} placeholders,
 * as well as direct base URLs.
 */
export function buildEmbedUrl(
  settings: EmbedSettings,
  options: {
    type: 'movie' | 'tv';
    id: string | number;
    season?: number;
    episode?: number;
    playerIndex?: number;
  }
): string | null {
  if (!settings.enabled) return null;

  const available = getAvailableEmbedPlayers(settings, options);
  if (available.length === 0) return null;

  const targetIndex =
    typeof options.playerIndex === 'number'
      ? options.playerIndex
      : settings.activePlayerIndex ?? 0;

  const matched = available.find((p) => p.index === targetIndex);
  return matched ? matched.url : available[0].url;
}

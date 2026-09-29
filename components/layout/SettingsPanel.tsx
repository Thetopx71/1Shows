'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Check, Code2, Trash2, Plus } from 'lucide-react';
import {
  DEFAULT_SETTINGS,
  EmbedPlayerConfig,
  EmbedSettings,
  EMBED_SETTINGS_EVENT,
  getEmbedSettings,
  saveEmbedSettings,
} from '@/lib/embedSettings';

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [embedSettings, setEmbedSettings] = useState<EmbedSettings>(DEFAULT_SETTINGS);
  const [savedFlash, setSavedFlash] = useState(false);
  const [discordInviteUrl, setDiscordInviteUrl] = useState('https://discord.com');
  const [telegramInviteUrl, setTelegramInviteUrl] = useState('https://t.me');

  useEffect(() => {
    fetch('/api/social')
      .then((r) => r.json())
      .then((data) => {
        if (data?.discordUrl) setDiscordInviteUrl(data.discordUrl);
        if (data?.telegramUrl) setTelegramInviteUrl(data.telegramUrl);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setEmbedSettings(getEmbedSettings());

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<EmbedSettings>;
      if (custom.detail) {
        setEmbedSettings(custom.detail);
      } else {
        setEmbedSettings(getEmbedSettings());
      }
    };

    window.addEventListener(EMBED_SETTINGS_EVENT, handleSync);
    return () => window.removeEventListener(EMBED_SETTINGS_EVENT, handleSync);
  }, []);

  const updateSettings = (patch: Partial<EmbedSettings>) => {
    const nextPlayers = patch.players ?? embedSettings.players;
    const next: EmbedSettings = {
      ...embedSettings,
      ...patch,
      players: nextPlayers,
      movieTemplate: nextPlayers[0]?.movieTemplate ?? '',
      tvTemplate: nextPlayers[0]?.tvTemplate ?? '',
    };
    setEmbedSettings(next);
    saveEmbedSettings(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1400);
  };

  const handleToggleEmbed = () => {
    updateSettings({ enabled: !embedSettings.enabled });
  };

  const handleUpdatePlayer = (
    index: number,
    patch: Partial<Pick<EmbedPlayerConfig, 'movieTemplate' | 'tvTemplate'>>
  ) => {
    const nextPlayers = embedSettings.players.map((p, idx) =>
      idx === index ? { ...p, ...patch, name: `Player ${idx + 1}` } : { ...p, name: `Player ${idx + 1}` }
    );
    updateSettings({ players: nextPlayers });
  };

  const handleAddPlayer = () => {
    const nextIndex = embedSettings.players.length + 1;
    const nextPlayers: EmbedPlayerConfig[] = [
      ...embedSettings.players,
      {
        id: `player-${Date.now()}`,
        name: `Player ${nextIndex}`,
        movieTemplate: '',
        tvTemplate: '',
      },
    ];
    updateSettings({ players: nextPlayers });
  };

  const handleRemovePlayer = (index: number) => {
    if (embedSettings.players.length <= 1) return;
    const filtered = embedSettings.players
      .filter((_, idx) => idx !== index)
      .map((p, idx) => ({ ...p, name: `Player ${idx + 1}` }));
    const nextActive =
      embedSettings.activePlayerIndex >= filtered.length
        ? Math.max(0, filtered.length - 1)
        : embedSettings.activePlayerIndex;
    updateSettings({
      players: filtered,
      activePlayerIndex: nextActive,
    });
  };

  const handleClearLinks = () => {
    updateSettings({
      players: [
        {
          id: 'player-1',
          name: 'Player 1',
          movieTemplate: '',
          tvTemplate: '',
        },
      ],
      activePlayerIndex: 0,
    });
  };

  const hasAnyLinks = embedSettings.players.some(
    (p) => p.movieTemplate.trim() !== '' || p.tvTemplate.trim() !== ''
  );

  return (
    <div className="w-[320px] sm:w-[370px] bg-white/[0.12] bg-gradient-to-br from-white/[0.22] to-white/[0.07] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.26] rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.45)] animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-top-2 duration-150 z-50 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm tracking-wide">Settings</h3>
          {savedFlash && (
            <span className="ml-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 rounded-full animate-in fade-in duration-150">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          aria-label="Close settings"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {/* Streaming Mode Toggle Section */}
        <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-white text-[13px] block leading-tight">
                  Streaming Mode
                </span>
                <span className="text-[11px] text-white/55 block mt-0.5">
                  Use your own custom browser embed link
                </span>
              </div>
            </div>

            {/* Toggle Switch with ON / OFF labels */}
            <button
              type="button"
              role="switch"
              aria-checked={embedSettings.enabled}
              onClick={handleToggleEmbed}
              className={`relative inline-flex h-7 w-[58px] shrink-0 cursor-pointer items-center rounded-full border transition-all duration-200 ease-in-out focus:outline-none select-none ${
                embedSettings.enabled
                  ? 'bg-emerald-500 border-emerald-300/60 shadow-[0_0_14px_rgba(16,185,129,0.45)]'
                  : 'bg-white/15 border-white/25 hover:bg-white/20'
              }`}
            >
              <span
                className={`absolute left-2.5 text-[10px] font-extrabold tracking-wider text-white transition-opacity duration-150 ${
                  embedSettings.enabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                ON
              </span>
              <span
                className={`absolute right-2 text-[10px] font-extrabold tracking-wider text-white/75 transition-opacity duration-150 ${
                  embedSettings.enabled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                OFF
              </span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-in-out ${
                  embedSettings.enabled ? 'translate-x-[33px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </div>

          {/* Expandable Custom Embed Link Inputs when Embed Mode is ON */}
          {embedSettings.enabled && (
            <div className="pt-2.5 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/60 font-medium">
                  Placeholders: <code className="text-amber-300 font-mono">{'{id}'}</code>{' '}
                  <code className="text-amber-300 font-mono">{'{season}'}</code>{' '}
                  <code className="text-amber-300 font-mono">{'{episode}'}</code>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleAddPlayer}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full transition cursor-pointer active:scale-95"
                    title="Add another player"
                  >
                    <Plus className="w-3 h-3" strokeWidth={2.5} />
                    <span>Add Player</span>
                  </button>
                  {(hasAnyLinks || embedSettings.players.length > 1) && (
                    <button
                      type="button"
                      onClick={handleClearLinks}
                      className="inline-flex items-center justify-center text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 p-1 rounded-full transition cursor-pointer"
                      title="Reset embed links"
                      aria-label="Reset embed links"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable List of Player Embed Link Inputs */}
              <div className="space-y-3 max-h-[240px] overflow-y-auto filter-scrollbar pr-0.5">
                {embedSettings.players.map((player, idx) => (
                  <div
                    key={player.id || idx}
                    className="p-2.5 rounded-xl bg-black/25 border border-white/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 tracking-wide">
                        Player {idx + 1}
                      </span>
                      {embedSettings.players.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePlayer(idx)}
                          className="text-white/40 hover:text-rose-400 p-0.5 rounded-full hover:bg-white/10 transition cursor-pointer"
                          aria-label={`Remove Player ${idx + 1}`}
                          title={`Remove Player ${idx + 1}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Movie Embed Link Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-white/75 font-medium block">
                        Movie Embed Link
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={player.movieTemplate}
                          onChange={(e) =>
                            handleUpdatePlayer(idx, { movieTemplate: e.target.value })
                          }
                          placeholder="Enter movie embed link"
                          className="w-full h-10 sm:h-9 rounded-xl bg-black/35 hover:bg-black/45 focus:bg-black/55 border border-white/20 focus:border-white/50 px-3 pr-7 text-base sm:text-[12px] text-white placeholder-white/35 font-mono focus:outline-none transition select-text"
                        />
                        {player.movieTemplate && (
                          <button
                            type="button"
                            onClick={() => handleUpdatePlayer(idx, { movieTemplate: '' })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                            aria-label={`Clear Player ${idx + 1} movie link`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* TV Show Embed Link Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-white/75 font-medium block">
                        TV Show Embed Link
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={player.tvTemplate}
                          onChange={(e) =>
                            handleUpdatePlayer(idx, { tvTemplate: e.target.value })
                          }
                          placeholder="Enter TV embed link"
                          className="w-full h-10 sm:h-9 rounded-xl bg-black/35 hover:bg-black/45 focus:bg-black/55 border border-white/20 focus:border-white/50 px-3 pr-7 text-base sm:text-[12px] text-white placeholder-white/35 font-mono focus:outline-none transition select-text"
                        />
                        {player.tvTemplate && (
                          <button
                            type="button"
                            onClick={() => handleUpdatePlayer(idx, { tvTemplate: '' })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                            aria-label={`Clear Player ${idx + 1} TV link`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-white/50 block mb-2 font-medium">
            Join Us
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 h-10 px-3 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/35 border border-[#5865F2]/45 hover:border-[#5865F2]/75 text-white font-semibold text-xs transition-all duration-150 active:scale-95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
              aria-label="Join our Discord"
            >
              <span className="w-5 h-5 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-3.5 h-3.5 fill-white"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </span>
              <span>Discord</span>
            </a>
            <a
              href={telegramInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 h-10 px-3 rounded-xl bg-[#26A5E4]/20 hover:bg-[#26A5E4]/35 border border-[#26A5E4]/45 hover:border-[#26A5E4]/75 text-white font-semibold text-xs transition-all duration-150 active:scale-95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
              aria-label="Join our Telegram"
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-b from-[#37AEE2] to-[#1E96C8] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-3.5 h-3.5 fill-white -translate-x-[0.5px]"
                >
                  <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
                </svg>
              </span>
              <span>Telegram</span>
            </a>
          </div>
        </div>

        <div>
          <label className="text-white/50 block mb-1 font-medium">
            Region &amp; Streaming
          </label>
          <p className="text-white/80">
            United States (US) &middot; Global Providers
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-white/50">App Version</span>
          <span className="text-white/70 font-mono text-[11px]">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

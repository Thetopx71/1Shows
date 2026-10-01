'use client';

import Image from 'next/image';
import { Tv, ExternalLink } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';

export default function WhereToWatchSection({
  streamProviders,
  rentProviders,
  buyProviders,
  justWatchLink,
}: {
  streamProviders: any[];
  rentProviders: any[];
  buyProviders: any[];
  justWatchLink?: string;
}) {
  if (
    streamProviders.length === 0 &&
    rentProviders.length === 0 &&
    buyProviders.length === 0
  ) {
    return null;
  }

  return (
    <div className="mb-14 p-5 sm:p-6 rounded-3xl bg-white/[0.07] bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/[0.2] md:backdrop-blur-2xl md:backdrop-saturate-[1.8] shadow-[0_12px_36px_rgba(0,0,0,0.28),inset_0_1px_1px_0_rgba(255,255,255,0.3)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center text-amber-400">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Where to Watch
            </h3>
            <p className="text-xs text-white/60">
              Streaming, rent and purchase options
            </p>
          </div>
        </div>

        {justWatchLink && (
          <a
            href={justWatchLink}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors bg-white/[0.08] hover:bg-white/[0.15] bg-gradient-to-br from-white/[0.18] to-white/[0.05] md:backdrop-blur-xl md:backdrop-saturate-[1.9] border border-white/25 hover:border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.4)] px-4 py-2 rounded-full self-start sm:self-auto"
          >
            <span>Powered by JustWatch</span>
            <ExternalLink className="w-3 h-3 text-white/60" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
        {/* Stream With Subscription */}
        {streamProviders.length > 0 && (
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 block mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Stream
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {streamProviders.map((prov: any) => (
                <div
                  key={prov.provider_id}
                  className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-3 py-1.5 rounded-2xl transition-colors"
                  title={prov.provider_name}
                >
                  {prov.logo_path && (
                    <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={getImageUrl(prov.logo_path, 'w500')}
                        alt={prov.provider_name}
                        fill
                        sizes="48px"
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-xs font-medium text-white/90">
                    {prov.provider_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rent Options */}
        {rentProviders.length > 0 && (
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 block mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Rent
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {rentProviders.slice(0, 6).map((prov: any) => (
                <div
                  key={prov.provider_id}
                  className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-3 py-1.5 rounded-2xl transition-colors"
                  title={prov.provider_name}
                >
                  {prov.logo_path && (
                    <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={getImageUrl(prov.logo_path, 'w500')}
                        alt={prov.provider_name}
                        fill
                        sizes="48px"
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-xs font-medium text-white/90">
                    {prov.provider_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buy Options */}
        {buyProviders.length > 0 && (
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-400 block mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Buy
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {buyProviders.slice(0, 6).map((prov: any) => (
                <div
                  key={prov.provider_id}
                  className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-3 py-1.5 rounded-2xl transition-colors"
                  title={prov.provider_name}
                >
                  {prov.logo_path && (
                    <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={getImageUrl(prov.logo_path, 'w500')}
                        alt={prov.provider_name}
                        fill
                        sizes="48px"
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-xs font-medium text-white/90">
                    {prov.provider_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { Layers } from 'lucide-react';

function formatCurrency(amount: number) {
  if (!amount || amount <= 0) return null;
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

export default function ProductionDetailsSection({
  media,
  type,
  director,
  creator,
  fullReleaseDate,
}: {
  media: any;
  type: 'movie' | 'tv';
  director?: string | null;
  creator?: string | null;
  fullReleaseDate?: string;
}) {
  return (
    <section className="mb-16 md:mb-20 p-6 md:p-8 rounded-3xl bg-white/[0.07] bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/[0.18] md:backdrop-blur-2xl md:backdrop-saturate-[1.8] shadow-[0_12px_36px_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.28)]">
      <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2.5">
        <Layers className="w-5 h-5 text-amber-400" />
        <span>Story &amp; Production Details</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
        {director && (
          <div>
            <span className="text-xs text-white/45 block mb-1">Director</span>
            <span className="font-semibold text-white/90">{director}</span>
          </div>
        )}
        {creator && (
          <div>
            <span className="text-xs text-white/45 block mb-1">Created By</span>
            <span className="font-semibold text-white/90">{creator}</span>
          </div>
        )}
        {fullReleaseDate && (
          <div>
            <span className="text-xs text-white/45 block mb-1">
              Release Date
            </span>
            <span className="font-semibold text-white/90">
              {fullReleaseDate}
            </span>
          </div>
        )}
        {media.original_language && (
          <div>
            <span className="text-xs text-white/45 block mb-1">
              Original Language
            </span>
            <span className="font-semibold text-white/90 uppercase">
              {media.original_language}
            </span>
          </div>
        )}
        {type === 'movie' && formatCurrency(media.budget) && (
          <div>
            <span className="text-xs text-white/45 block mb-1">Budget</span>
            <span className="font-semibold text-white/90">
              {formatCurrency(media.budget)}
            </span>
          </div>
        )}
        {type === 'movie' && formatCurrency(media.revenue) && (
          <div>
            <span className="text-xs text-white/45 block mb-1">
              Box Office Revenue
            </span>
            <span className="font-semibold text-white/90">
              {formatCurrency(media.revenue)}
            </span>
          </div>
        )}
        {type === 'tv' && media.number_of_episodes && (
          <div>
            <span className="text-xs text-white/45 block mb-1">
              Total Episodes
            </span>
            <span className="font-semibold text-white/90">
              {media.number_of_episodes} Episodes
            </span>
          </div>
        )}
        {media.production_companies && media.production_companies.length > 0 && (
          <div className="col-span-2">
            <span className="text-xs text-white/45 block mb-1">Production</span>
            <span className="font-semibold text-white/90">
              {media.production_companies
                .slice(0, 3)
                .map((c: any) => c.name)
                .join(' · ')}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import ScrollableRow from '@/components/ui/ScrollableRow';

export default function CastAndCrewRow({ cast }: { cast: any[] }) {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="mb-16 md:mb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          Cast &amp; Crew
        </h2>
      </div>
      <ScrollableRow className="flex gap-3 min-[390px]:gap-3.5 sm:gap-4 md:gap-[18px] overflow-x-auto snap-x snap-mandatory pb-6 pt-2 custom-scrollbar">
        {cast.map((person: any) => (
          <div
            key={person.id}
            className="w-[120px] min-[390px]:w-[132px] sm:w-[145px] md:w-[156px] lg:w-[166px] shrink-0 snap-start rounded-xl sm:rounded-2xl overflow-hidden bg-white/[0.07] bg-gradient-to-br from-white/[0.12] to-white/[0.03] md:backdrop-blur-2xl md:backdrop-saturate-[1.8] border border-white/[0.18] shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.25)] flex flex-col select-none"
          >
            <div className="relative w-full aspect-[2/3] bg-white/5">
              {person.profile_path ? (
                <Image
                  src={getImageUrl(person.profile_path, 'w500')}
                  alt={person.name}
                  fill
                  sizes="(max-width: 640px) 132px, 166px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-white/20">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="p-3 flex-1 flex flex-col justify-start">
              <p className="font-bold text-[13px] sm:text-sm text-white line-clamp-2 leading-snug mb-1">
                {person.name}
              </p>
              <p className="text-[11px] sm:text-xs text-white/60 line-clamp-2 leading-snug">
                {person.character}
              </p>
            </div>
          </div>
        ))}
      </ScrollableRow>
    </section>
  );
}

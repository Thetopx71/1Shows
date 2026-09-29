import Image from 'next/image';
import Link from 'next/link';
import PopcornRating from '@/components/ui/PopcornRating';
import { getImageUrl, formatMediaDate, getMediaHref } from '@/lib/tmdb';

interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: 'movie' | 'tv' | 'person';
}

export default function MediaCard({ movie }: { movie: Media }) {
  if (!movie || !movie.id || movie.media_type === 'person') return null;

  const title = movie.title || movie.name || 'Untitled';
  const formattedDate = formatMediaDate(movie.release_date || movie.first_air_date);
  const type = movie.media_type || (movie.name ? 'tv' : 'movie');
  const href = getMediaHref(movie, type as 'movie' | 'tv');

  return (
    <Link 
      href={href} 
      className="group flex flex-col gap-2 sm:gap-2.5 w-full min-w-0 select-none cursor-pointer focus:outline-none"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl sm:rounded-[14px] md:rounded-2xl bg-[#161618] border border-white/[0.09] shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.12)] transition-all duration-300 group-hover:scale-[1.03] group-hover:border-white/25 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] group-active:scale-[0.97]">
        <Image
          src={getImageUrl(movie.poster_path)}
          alt={title}
          fill
          referrerPolicy="no-referrer"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 499px) 46vw, (max-width: 767px) 31vw, (max-width: 1023px) 23vw, (max-width: 1279px) 19vw, 210px"
        />
      </div>
      
      <div className="flex flex-col gap-0.5 sm:gap-1 px-0.5 min-w-0">
        <h3 className="line-clamp-1 text-[13px] sm:text-[14px] md:text-[14.5px] font-semibold tracking-tight text-white group-hover:text-white/90 transition-colors leading-snug">
          {title}
        </h3>
        <div className="flex items-center justify-between gap-1.5 text-[11.5px] sm:text-[12px] md:text-[12.5px] text-white/50 font-medium">
          <span className="truncate">{formattedDate}</span>
          <PopcornRating 
            rating={movie.vote_average} 
            compact 
            className="shrink-0 w-3.5 h-3.5 text-[11.5px] sm:text-[12px] md:text-[12.5px] text-white font-semibold" 
          />
        </div>
      </div>
    </Link>
  );
}

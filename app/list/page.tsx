'use client';

import { useState, useEffect } from 'react';
import MediaCard from '@/components/media/MediaCard';
import { Bookmark, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { setAmbientBackdrop } from '@/components/layout/AmbientBackground';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('popcorn-watchlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          setWatchlist(parsed);
          const firstItem = Array.isArray(parsed)
            ? parsed.find((m: any) => m?.backdrop_path || m?.poster_path)
            : null;
          if (firstItem) {
            setAmbientBackdrop(firstItem.backdrop_path || firstItem.poster_path);
          }
        }
      } catch (err) {
        console.error('Failed to load watchlist', err);
      } finally {
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <main className="flex-1 w-full flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] pt-28 pb-20">
      <div className="flex items-center gap-3 mb-8 sm:mb-10 border-b border-white/10 pb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10 text-amber-400 shrink-0">
          <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
            My List
          </h1>
          <p className="text-white/60 text-[13px] sm:text-sm mt-1">Movies and shows you&apos;ve saved to watch later.</p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center mb-5 border border-white/10">
            <LayoutGrid className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">Your list is empty</h2>
          <p className="text-white/50 text-sm sm:text-[15px] max-w-sm mb-8 px-4">
            Add movies and TV shows to your list to easily find them later.
          </p>
          <Link 
            href="/"
            className="ios-btn-primary"
          >
            Explore Titles
          </Link>
        </div>
      ) : (
        <div className="poster-grid">
          {watchlist.map((item: any) => (
            <MediaCard 
              key={`${item.type}-${item.id}`} 
              movie={{
                ...item,
                media_type: item.type 
              }} 
            />
          ))}
        </div>
      )}
    </main>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';

export default function DetailLoadingSkeleton() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-transparent text-white pb-24 overflow-hidden select-none">
      {/* Top Floating Back Button matching MediaDetail */}
      <div className="absolute top-5 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 md:top-8 md:left-8 md:right-8 z-50 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="ios-btn-circle"
          aria-label="Go back"
        >
          <ChevronLeft className="w-[22px] h-[22px] mr-0.5" strokeWidth={2.2} />
        </button>
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative z-10 w-full min-h-[70svh] sm:min-h-[76svh] md:min-h-[85svh] lg:min-h-[88svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-white/75" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] w-full pb-8 sm:pb-12 md:pb-16 pt-24 sm:pt-28 md:pt-32">
          <div className="max-w-xl md:max-w-2xl w-full flex flex-col items-start gap-4 animate-pulse">
            <div className="h-12 sm:h-16 md:h-20 w-56 sm:w-80 rounded-2xl bg-white/[0.08]" />
            <div className="flex items-center gap-2.5">
              <div className="h-5 w-16 rounded-full bg-white/[0.08]" />
              <div className="h-5 w-12 rounded-full bg-white/[0.06]" />
              <div className="h-5 w-24 rounded-full bg-white/[0.06]" />
            </div>
            <div className="space-y-2 w-full max-w-lg">
              <div className="h-3.5 w-full rounded-full bg-white/[0.07]" />
              <div className="h-3.5 w-11/12 rounded-full bg-white/[0.07]" />
              <div className="h-3.5 w-3/4 rounded-full bg-white/[0.05]" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-11 w-28 rounded-full bg-white/[0.14]" />
              <div className="h-11 w-11 rounded-full bg-white/[0.08]" />
              <div className="h-11 w-11 sm:w-28 rounded-full bg-white/[0.08]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

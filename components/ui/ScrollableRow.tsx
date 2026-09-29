'use client';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ScrollableRow({ 
  children,
  className = "flex gap-3 min-[390px]:gap-3.5 sm:gap-4 md:gap-[18px] lg:gap-5 overflow-x-auto snap-x snap-mandatory pb-6 sm:pb-8 pt-2 custom-scrollbar px-0.5"
}: { 
  children: React.ReactNode,
  className?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2); // 2px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    let rafId: number | null = null;
    const handleResize = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        checkScroll();
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const clientWidth = scrollRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/row">
      {/* Left Arrow */}
      <div
        className={`absolute left-1 top-2 bottom-8 z-40 transition-all duration-300 hidden md:flex items-center justify-center ${
          showLeft
            ? 'opacity-0 group-hover/row:opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => scroll('left')}
          className="group/arrow p-1.5 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all duration-200 cursor-pointer focus:outline-none select-none"
          aria-label="Scroll left"
        >
          <ChevronLeft
            className="w-7 h-7 md:w-8 md:h-8 transition-transform duration-200 transform group-hover/arrow:scale-110 group-hover/arrow:-translate-x-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            strokeWidth={2.2}
          />
        </button>
      </div>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className={className}
      >
        {children}
      </div>

      {/* Right Arrow */}
      <div
        className={`absolute right-1 top-2 bottom-8 z-40 transition-all duration-300 hidden md:flex items-center justify-center ${
          showRight
            ? 'opacity-0 group-hover/row:opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => scroll('right')}
          className="group/arrow p-1.5 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all duration-200 cursor-pointer focus:outline-none select-none"
          aria-label="Scroll right"
        >
          <ChevronRight
            className="w-7 h-7 md:w-8 md:h-8 transition-transform duration-200 transform group-hover/arrow:scale-110 group-hover/arrow:translate-x-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            strokeWidth={2.2}
          />
        </button>
      </div>
    </div>
  );
}

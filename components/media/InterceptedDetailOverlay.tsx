'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import AmbientBackground, {
  getAmbientBackdrop,
  setAmbientBackdrop,
} from '@/components/layout/AmbientBackground';

export default function InterceptedDetailOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const previousBackdropRef = useRef<string | null>(null);

  const isDetailPathname = Boolean(
    pathname?.startsWith('/movie/') ||
      (pathname?.startsWith('/tv/') && pathname !== '/tv')
  );

  // Capture the underlying browse page's ambient backdrop on mount and restore it when leaving the detail route
  useEffect(() => {
    if (!previousBackdropRef.current) {
      previousBackdropRef.current = getAmbientBackdrop();
    }

    return () => {
      if (previousBackdropRef.current) {
        setAmbientBackdrop(previousBackdropRef.current);
      }
    };
  }, []);

  // Lock background page scroll while intercepted detail overlay is active
  useEffect(() => {
    if (!isDetailPathname) {
      document.body.style.overflow = '';
      if (previousBackdropRef.current) {
        setAmbientBackdrop(previousBackdropRef.current);
      }
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDetailPathname]);

  // Reset overlay scroll position to top when navigating between titles inside the intercepted route
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    }
  }, [pathname]);

  if (!isDetailPathname) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRef}
      data-intercepted-scroll-container
      className="fixed inset-0 z-[90] overflow-y-auto overflow-x-hidden overscroll-contain bg-[#07070b] text-white selection:bg-white/20 selection:text-white antialiased isolate"
    >
      <AmbientBackground />
      <div className="relative z-10 w-full min-w-0 max-w-full">
        {children}
      </div>
    </div>
  );
}

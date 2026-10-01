'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  getAmbientBackdrop,
  setAmbientBackdrop,
} from '@/components/layout/AmbientBackground';

const InterceptedRouteContext = createContext<{
  setInterceptedOpen: (open: boolean) => void;
}>({
  setInterceptedOpen: () => {},
});

export function useInterceptedRoute() {
  return useContext(InterceptedRouteContext);
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function ParallelRouteShell({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isInterceptedOpen, setInterceptedOpen] = useState(false);

  const savedScrollYRef = useRef<number>(0);
  const savedBackdropRef = useRef<string | null>(null);
  const wasActiveRef = useRef<boolean>(false);

  const isDetailPathname = Boolean(
    pathname?.startsWith('/movie/') ||
      (pathname?.startsWith('/tv/') && pathname !== '/tv')
  );

  const isInterceptedActive = isInterceptedOpen && isDetailPathname;

  // Continuously track window scroll position and ambient backdrop while on browse pages
  useEffect(() => {
    if (isDetailPathname) return;

    const handleScroll = () => {
      if (!isDetailPathname) {
        savedScrollYRef.current = window.scrollY;
      }
    };

    savedScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDetailPathname]);

  // Synchronously manage scroll position & ambient backdrop when entering/leaving an intercepted detail route
  useIsomorphicLayoutEffect(() => {
    if (isInterceptedActive && !wasActiveRef.current) {
      // Entering intercepted detail view from browse page
      wasActiveRef.current = true;
      savedBackdropRef.current = getAmbientBackdrop();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    } else if (!isInterceptedActive && wasActiveRef.current) {
      // Returning to underlying browse page
      wasActiveRef.current = false;
      if (savedBackdropRef.current) {
        setAmbientBackdrop(savedBackdropRef.current);
      }
      window.scrollTo({
        top: savedScrollYRef.current,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    } else if (isInterceptedActive && wasActiveRef.current) {
      // Navigating between detail pages while intercepted (e.g. clicking "More Like This")
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [isInterceptedActive, pathname]);

  return (
    <InterceptedRouteContext.Provider value={{ setInterceptedOpen }}>
      <div
        className={
          isInterceptedActive
            ? 'hidden'
            : 'flex-1 relative z-10 w-full min-w-0 max-w-full'
        }
        aria-hidden={isInterceptedActive}
      >
        {children}
      </div>

      {isDetailPathname && (
        <div
          className={
            isInterceptedActive
              ? 'flex-1 relative z-10 w-full min-w-0 max-w-full'
              : 'contents'
          }
        >
          {modal}
        </div>
      )}
    </InterceptedRouteContext.Provider>
  );
}

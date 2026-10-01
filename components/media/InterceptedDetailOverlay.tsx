'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useInterceptedRoute } from '@/components/layout/ParallelRouteShell';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function InterceptedDetailOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setInterceptedOpen } = useInterceptedRoute();

  const isDetailPathname = Boolean(
    pathname?.startsWith('/movie/') ||
      (pathname?.startsWith('/tv/') && pathname !== '/tv')
  );

  useIsomorphicLayoutEffect(() => {
    if (isDetailPathname) {
      setInterceptedOpen(true);
    } else {
      setInterceptedOpen(false);
    }

    return () => {
      setInterceptedOpen(false);
    };
  }, [isDetailPathname, setInterceptedOpen]);

  if (!isDetailPathname) {
    return null;
  }

  return <>{children}</>;
}

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer completely on detail pages (e.g. /movie/[id], /tv/[id])
  const isDetailPage = Boolean(
    pathname?.startsWith("/movie/") ||
    (pathname?.startsWith("/tv/") && pathname !== "/tv")
  );

  if (isDetailPage) {
    return null;
  }

  return (
    <footer className="relative z-10 bg-transparent py-8 md:py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/60 font-medium">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p>Copyright © {new Date().getFullYear()} 1Shows. All rights reserved.</p>
          <div className="flex items-center gap-3 mt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB Logo"
              className="h-3 md:h-4 opacity-70"
            />
            <p className="text-gray-500 max-w-xs text-center md:text-left text-[11px] leading-tight">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}

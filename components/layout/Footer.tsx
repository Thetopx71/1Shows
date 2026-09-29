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
    <footer className="relative z-10 bg-transparent pt-4 pb-8 md:pt-6 md:pb-10 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/60 font-medium">
        <div className="flex flex-col items-center md:items-start gap-1.5">
          <p>Copyright © {new Date().getFullYear()} 1Shows. All rights reserved.</p>
          <p className="text-white/40 text-[11px] text-center md:text-left">
            Discover movies, TV series, popular anime, trailers, and streaming guides.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}

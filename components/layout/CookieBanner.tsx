'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem('popcorn-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('popcorn-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white/[0.09] bg-gradient-to-br from-white/[0.18] to-white/[0.05] backdrop-blur-3xl backdrop-saturate-[1.9] border-t border-white/20 p-4 md:p-6 shadow-[0_-12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_0_rgba(255,255,255,0.4)] animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto max-w-[1440px] flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
        <div className="flex-1 text-sm text-white/80 text-center sm:text-left leading-relaxed">
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
          By clicking &quot;Accept All&quot;, you consent to our use of cookies as described in our{' '}
          <Link href="/privacy" className="text-white underline hover:text-white/80 font-medium">Privacy Policy</Link>.
        </div>
        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <button 
            onClick={acceptCookies} 
            className="ios-btn-glass w-full sm:w-auto px-8"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';

const EVENT_NAME = 'popcorn:ambient-backdrop';

let lastBackdropPath: string | null = null;

export function setAmbientBackdrop(path: string | null | undefined) {
  if (typeof window === 'undefined') return;
  const normalized = path || null;
  if (!normalized || normalized === lastBackdropPath) return;
  lastBackdropPath = normalized;
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, { detail: { path: normalized } })
  );
}

function AmbientLayer({
  path,
  isActive,
  animateIn,
}: {
  path: string;
  isActive: boolean;
  animateIn: boolean;
}) {
  const [entered, setEntered] = useState(!animateIn);

  useEffect(() => {
    if (!animateIn) return;
    const raf = requestAnimationFrame(() => {
      setEntered(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [animateIn]);

  const show = isActive && entered;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Full-viewport continuous color-blurred wash from top to footer (lightweight w300 for 60fps GPU) */}
      <div className="absolute -inset-16 sm:-inset-24 scale-125 blur-[60px] sm:blur-[95px] md:blur-[120px] saturate-[1.9] brightness-[0.68] opacity-90 transform-gpu">
        <Image
          src={getImageUrl(path, 'w300')}
          alt=""
          fill
          sizes="300px"
          referrerPolicy="no-referrer"
          className="object-cover object-center"
          priority={false}
        />
      </div>

      {/* Upper & mid-section vibrant color bridge directly beneath Hero Slider */}
      <div className="absolute inset-x-0 -top-12 h-[70%] scale-115 blur-[55px] sm:blur-[85px] md:blur-[105px] saturate-[2.05] brightness-[0.72] opacity-75 transform-gpu">
        <Image
          src={getImageUrl(path, 'w300')}
          alt=""
          fill
          sizes="300px"
          referrerPolicy="no-referrer"
          className="object-cover object-top"
          priority={false}
        />
      </div>

      {/* Lower-body & footer ambient color continuation so the whole page feels like one unified canvas */}
      <div className="absolute inset-x-0 -bottom-16 h-[70%] scale-125 blur-[60px] sm:blur-[95px] md:blur-[120px] saturate-[1.95] brightness-[0.66] opacity-80 transform-gpu">
        <Image
          src={getImageUrl(path, 'w300')}
          alt=""
          fill
          sizes="300px"
          referrerPolicy="no-referrer"
          className="object-cover object-bottom"
          priority={false}
        />
      </div>
    </div>
  );
}

export default function AmbientBackground() {
  const counterRef = useRef(2);
  const [layers, setLayers] = useState<
    { id: number; path: string; animateIn: boolean }[]
  >(() =>
    lastBackdropPath
      ? [{ id: 1, path: lastBackdropPath, animateIn: false }]
      : []
  );

  useEffect(() => {
    if (lastBackdropPath) {
      setLayers((prev) =>
        prev.length === 0
          ? [{ id: 1, path: lastBackdropPath!, animateIn: false }]
          : prev
      );
    }

    const handleBackdropChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string | null }>;
      const newPath = customEvent.detail?.path;
      if (!newPath) return;

      setLayers((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].path === newPath) {
          return prev;
        }
        const nextId = counterRef.current++;
        return [
          ...prev.slice(-1),
          { id: nextId, path: newPath, animateIn: prev.length > 0 },
        ];
      });
    };

    window.addEventListener(EVENT_NAME, handleBackdropChange);
    return () => window.removeEventListener(EVENT_NAME, handleBackdropChange);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0c0d14] [contain:strict]"
      aria-hidden="true"
    >
      {/* Default ambient color gradient before media loads */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_30%,rgba(68,48,105,0.42),rgba(24,22,38,0.75)_70%,#0c0d14_100%)]" />

      {/* Dynamic Hero/Media Color-Blurred Layers */}
      {layers.map((layer, idx) => (
        <AmbientLayer
          key={layer.id}
          path={layer.path}
          isActive={idx === layers.length - 1}
          animateIn={layer.animateIn}
        />
      ))}

      {/* Even, subtle glass tint across the entire viewport (no black bottom gradient) */}
      <div className="absolute inset-0 bg-[#08090f]/30" />
    </div>
  );
}

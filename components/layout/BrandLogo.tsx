import { useId } from 'react';

export default function BrandLogo({ className }: { className?: string }) {
  const rawId = useId();
  const gradId = `one-cyan-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      viewBox="0 0 48 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="10" y1="3" x2="38" y2="73" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00d8ff" />
          <stop offset="50%" stopColor="#00a8ff" />
          <stop offset="100%" stopColor="#0077ff" />
        </linearGradient>
      </defs>

      {/* Solid fallback path so the "1" is always visible even if SVG gradient refs are blocked */}
      <path
        d="M 3 13.5 L 23.5 3 L 45 3 L 45 73 L 21.5 73 L 21.5 24.5 L 3 32.5 Z"
        fill="#00a8ff"
      />

      {/* Gradient overlay matching the reference "1Shows" cyan number 1 */}
      <path
        d="M 3 13.5 L 23.5 3 L 45 3 L 45 73 L 21.5 73 L 21.5 24.5 L 3 32.5 Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}

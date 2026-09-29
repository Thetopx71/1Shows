import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07070b',
          borderRadius: '40px',
        }}
      >
        <svg
          width="90"
          height="142"
          viewBox="0 0 48 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="one-cyan-grad"
              x1="10"
              y1="3"
              x2="38"
              y2="73"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00d8ff" />
              <stop offset="50%" stopColor="#00a8ff" />
              <stop offset="100%" stopColor="#0077ff" />
            </linearGradient>
          </defs>
          <path
            d="M 3 13.5 L 23.5 3 L 45 3 L 45 73 L 21.5 73 L 21.5 24.5 L 3 32.5 Z"
            fill="url(#one-cyan-grad)"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

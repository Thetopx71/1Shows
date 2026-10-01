import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import AmbientBackground from '@/components/layout/AmbientBackground';
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from '@/lib/constants';
import { buildWebsiteJsonLd } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | 1Shows',
  },
  description: SITE_DESCRIPTION,
  applicationName: '1Shows',
  keywords: SITE_KEYWORDS,
  authors: [{ name: '1Shows' }],
  creator: '1Shows',
  publisher: '1Shows',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.svg'],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: '1Shows',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#07070b',
  viewportFit: 'cover',
};

const structuredData = buildWebsiteJsonLd();

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const rawGaId =
    process.env.GA_MEASUREMENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ||
    '';
  const gaMeasurementId = /^G-[A-Z0-9]+$/i.test(rawGaId) ? rawGaId : '';

  return (
    <html lang="en" className="dark w-full overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className="font-sans min-h-screen w-full max-w-full bg-[#07070b] text-white selection:bg-white/20 selection:text-white antialiased flex flex-col relative overflow-x-hidden"
        suppressHydrationWarning
      >
        <AmbientBackground />
        <Navbar />

        <div className="flex-1 relative z-10 w-full min-w-0 max-w-full">
          {children}
        </div>

        {modal}

        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

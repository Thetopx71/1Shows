import type { Metadata } from 'next';

const LIST_TITLE = 'My Watchlist – Saved Movies & TV Series';
const LIST_DESC =
  'Manage your personal watchlist of saved movies, TV shows, and anime on 1Shows so you never lose track of what to watch next.';

export const metadata: Metadata = {
  title: LIST_TITLE,
  description: LIST_DESC,
  alternates: {
    canonical: '/list',
  },
  openGraph: {
    type: 'website',
    url: '/list',
    title: `${LIST_TITLE} | 1Shows`,
    description: LIST_DESC,
    siteName: '1Shows',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${LIST_TITLE} | 1Shows`,
    description: LIST_DESC,
  },
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

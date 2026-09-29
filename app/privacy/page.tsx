import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the 1Shows Privacy Policy to learn how we handle analytics, cookies, third-party media services, and user inquiries.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-4xl py-24 md:py-32">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
        Privacy Policy
      </h1>
      <p className="text-white/50 text-sm mb-10">Last Updated: August 2026</p>

      <div className="space-y-8 text-white/80 leading-relaxed text-[15px] sm:text-base">
        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">1. Introduction</h2>
          <p>
            Welcome to 1Shows (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data.
            This Privacy Policy explains how we handle your data when you visit and use our website.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">2. Data We Collect</h2>
          <p>
            We may collect standard, anonymous analytics data (such as IP addresses, browser types, and page interactions) to understand how our site is used and to improve the user experience.
            Your saved watchlist and player preferences are stored locally in your browser so you remain in full control of your data.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">3. Third-Party Services &amp; Media Content</h2>
          <p>
            Our platform aggregates movie, TV series, and anime metadata, artwork, ratings, and streaming availability from licensed third-party entertainment data providers.
            Your interaction with externally hosted media assets is subject to the respective privacy guidelines of those content networks.
          </p>
          <p>
            Additionally, we embed official trailers and video players. Viewing embedded videos may subject you to the privacy policies and data collection practices of the respective video hosting platforms.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">4. Cookies and Local Storage</h2>
          <p>
            We use cookies and browser local storage technologies to remember your preferences (such as your personal watchlist and player settings) and improve site performance.
            You can instruct your browser to refuse cookies or clear local storage at any time.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">5. Advertising and Monetization</h2>
          <p>
            We may use third-party advertising companies to serve ads when you visit our website.
            These companies may use aggregated information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className="space-y-2.5 pt-2 border-t border-white/10">
          <h2 className="text-xl font-bold text-white">7. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact our administrative team at{' '}
            <a
              href="mailto:contact@1shows.im"
              className="font-semibold text-[#00d8ff] hover:text-[#67e8f9] underline decoration-[#00d8ff]/60 hover:decoration-[#67e8f9] underline-offset-4 transition-colors"
            >
              contact@1shows.im
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

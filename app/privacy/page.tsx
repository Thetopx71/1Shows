import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContactFormTrigger from '@/components/layout/ContactFormTrigger';

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
            If you create an account in the future, we will collect information necessary to maintain your profile (e.g., email address, saved lists).
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">3. Third-Party Services &amp; APIs</h2>
          <p>
            Our application heavily utilizes <strong className="text-white">The Movie Database (TMDB) API</strong> to fetch and display movie data, images, and reviews.
            Please note that while we use TMDB services, we are not endorsed or certified by TMDB. Your interaction with TMDB-served content is also subject to their respective privacy guidelines.
          </p>
          <p>
            Additionally, we embed YouTube trailers. Viewing these trailers may subject you to YouTube&apos;s (Google&apos;s) privacy policies and data collection practices.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">4. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information.
            Cookies are files with a small amount of data which may include an anonymous unique identifier.
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
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
          <div>
            If you have any questions or concerns about this Privacy Policy, please contact our administrative team through our{' '}
            <ContactFormTrigger defaultTopic="Privacy Policy Inquiry" />.
          </div>
        </section>
      </div>
    </div>
  );
}

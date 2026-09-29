import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Review the Terms of Use for 1Shows, including intellectual property guidelines, content disclaimers, and acceptable use policies.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfUse() {
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
        Terms of Use
      </h1>
      <p className="text-white/50 text-sm mb-10">Last Updated: August 2026</p>

      <div className="space-y-8 text-white/80 leading-relaxed text-[15px] sm:text-base">
        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using 1Shows (&quot;the Service&quot;), you accept and agree to be bound by the terms and provisions of this agreement.
            If you do not agree to abide by these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">2. Intellectual Property and Copyright</h2>
          <p>
            The original code, layout, branding, and interface design of 1Shows are the property of 1Shows. Media assets displayed on this site—including movie posters, backdrop images, cast headshots, character names, trailers, and synopses—are the intellectual property of their respective film studios, networks, and creators.
          </p>
          <p>
            We utilize these assets under <strong className="text-white">Fair Use</strong> principles for the purpose of commentary, review, discovery, and informational database indexing. We do not claim ownership over any third-party copyrighted entertainment materials.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">3. Third-Party Data &amp; Attribution</h2>
          <p>
            All movie, TV series, and anime metadata, release schedules, ratings, and streaming availability guides are dynamically aggregated from third-party entertainment databases and public catalog services.
            1Shows is an independent discovery platform and is not endorsed, certified, or affiliated with any motion picture studio or streaming network (including TMDB, whose API is used for metadata indexing).
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">4. User Conduct</h2>
          <p>
            You agree not to use the Service in any way that causes, or may cause, damage to the Service or impairment of the availability or accessibility of the Service; or in any way which is unlawful, illegal, fraudulent, or harmful.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">5. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties of any kind, express or implied.
            We do not guarantee the accuracy, completeness, or timeliness of entertainment metadata or streaming availability provided, as regional catalogs change frequently.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xl font-bold text-white">6. Limitation of Liability</h2>
          <p>
            In no event shall 1Shows, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section className="space-y-2.5 pt-2 border-t border-white/10">
          <h2 className="text-xl font-bold text-white">7. Contact Us</h2>
          <p>
            If you have any questions or inquiries regarding these Terms of Use, please contact our administrative team at{' '}
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

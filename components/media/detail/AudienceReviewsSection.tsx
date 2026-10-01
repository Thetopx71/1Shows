'use client';

import { Quote, Star, ExternalLink } from 'lucide-react';

export default function AudienceReviewsSection({
  reviews,
}: {
  reviews: any[];
}) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mb-16 md:mb-20">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6 flex items-center gap-2.5">
        <Quote className="w-5 h-5 text-amber-400" />
        <span>Reviews &amp; Thoughts</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map((rev: any) => {
          const authorRating = rev.author_details?.rating;
          return (
            <div
              key={rev.id}
              className="p-5 md:p-6 rounded-2xl bg-white/[0.07] bg-gradient-to-br from-white/[0.12] to-white/[0.03] border border-white/[0.18] md:backdrop-blur-2xl md:backdrop-saturate-[1.8] shadow-[0_8px_28px_rgba(0,0,0,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.28)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 font-bold text-xs uppercase">
                      {rev.author?.[0] || 'U'}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {rev.author}
                      </span>
                      <span className="text-[11px] text-white/45">
                        {rev.created_at
                          ? new Date(rev.created_at).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : 'Verified Reviewer'}
                      </span>
                    </div>
                  </div>

                  {authorRating && (
                    <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full text-xs font-bold text-amber-300">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{authorRating}/10</span>
                    </div>
                  )}
                </div>

                <p className="text-[13.5px] text-white/75 leading-relaxed line-clamp-4">
                  {rev.content}
                </p>
              </div>

              {rev.url && (
                <a
                  href={rev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 mt-4 transition-colors font-medium self-start"
                >
                  <span>Read full review</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

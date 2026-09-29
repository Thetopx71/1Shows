import React from 'react';

const SharpStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default function PopcornRating({ 
  rating, 
  showText = true,
  compact = false,
  className = ""
}: { 
  rating: number, 
  showText?: boolean,
  compact?: boolean,
  className?: string
}) {
  const validRating = typeof rating === 'number' && rating > 0 ? rating : 0;
  const ratingOutOf5 = validRating / 2;
  
  // Extract width/height classes (including responsive prefixes like sm:w-4) to apply to the Star SVG directly
  const isSizeClass = (c: string) => /(^|:)(w-|h-)/.test(c);
  const sizeClasses = className.split(' ').filter(isSizeClass).join(' ');
  const outerClasses = className.split(' ').filter(c => !isSizeClass(c)).join(' ');

  // If sizeClasses is empty, default to w-4 h-4
  const finalSizeClasses = sizeClasses || 'w-4 h-4';

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-semibold ${outerClasses}`}>
        <SharpStar className={`${finalSizeClasses} shrink-0 text-white drop-shadow-sm`} />
        {showText && <span>{validRating > 0 ? validRating.toFixed(1) : 'NR'}</span>}
      </div>
    );
  }

  // Full 5-star rating
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let fillPercent = 0;
    if (ratingOutOf5 >= i) {
      fillPercent = 100;
    } else if (ratingOutOf5 > i - 1) {
      fillPercent = (ratingOutOf5 - (i - 1)) * 100;
    }
    
    stars.push(
      <div key={i} className={`relative inline-block ${finalSizeClasses}`}>
        {/* Background (Empty state) */}
        <SharpStar className="w-full h-full text-white/20" />
        
        {/* Foreground (Filled state - clipped via width) */}
        {fillPercent > 0 && (
          <div 
            className="absolute top-0 left-0 overflow-hidden h-full" 
            style={{ width: `${fillPercent}%` }}
          >
            <SharpStar className="w-full h-full text-white drop-shadow-sm" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${outerClasses}`}>
      <div className="flex items-center gap-0.5">
        {stars}
      </div>
      {showText && <span className="font-semibold ml-1.5">{validRating > 0 ? validRating.toFixed(1) : 'NR'}</span>}
    </div>
  );
}

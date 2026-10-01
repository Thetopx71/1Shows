import InterceptedDetailOverlay from '@/components/media/InterceptedDetailOverlay';
import DetailLoadingSkeleton from '@/components/media/DetailLoadingSkeleton';

export default function InterceptedMovieLoading() {
  return (
    <InterceptedDetailOverlay>
      <DetailLoadingSkeleton />
    </InterceptedDetailOverlay>
  );
}

import MovieDetailView from '@/components/media/detail/MovieDetailView';
import InterceptedDetailOverlay from '@/components/media/InterceptedDetailOverlay';

export default async function InterceptedMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <InterceptedDetailOverlay>
      <MovieDetailView idParam={id} isIntercepted />
    </InterceptedDetailOverlay>
  );
}

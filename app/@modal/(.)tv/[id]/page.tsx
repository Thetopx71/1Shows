import TVDetailView from '@/components/media/detail/TVDetailView';
import InterceptedDetailOverlay from '@/components/media/InterceptedDetailOverlay';

export default async function InterceptedTVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <InterceptedDetailOverlay>
      <TVDetailView idParam={id} isIntercepted />
    </InterceptedDetailOverlay>
  );
}

//src/components/releases/release-cover-image.tsx
import { useGetReleaseCover } from '@/hooks/use-release-hooks';
import { toast } from 'sonner';
import type { ReactNode } from 'react';

interface ReleaseCoverImageProps {
  releaseId: number;
  releaseName?: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  fallback?: ReactNode;
}

export const ReleaseCoverImage = ({
  releaseId,
  releaseName = 'Release',
  alt = 'Release cover',
  className = '',
  width,
  height,
  fallback,
}: ReleaseCoverImageProps) => {
  const { data: coverUrl, isLoading, error } = useGetReleaseCover(releaseId);

  const handleError = () => {
    toast.error(`Failed to get cover for ${releaseName}`);
  };

  const shouldShowFallback = (!coverUrl && !isLoading) || (error && !coverUrl);

  if (isLoading && !coverUrl) {
    return (
      <div
        className={`bg-gray-200 animate-pulse rounded-lg overflow-hidden ${className}`}
        style={{ width, height }}
      />
    );
  }

  if (shouldShowFallback) {
    return (
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center ${className}`}
        style={{ width, height }}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={alt}
      className={`object-cover rounded-lg ${className}`}
      width={width}
      height={height}
      onError={handleError}
      loading="lazy"
    />
  );
};

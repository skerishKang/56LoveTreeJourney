import { useState, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  fallback = "/placeholder.svg",
  loading = "lazy",
  sizes,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallback) {
      setImageSrc(fallback);
    }
  };

  // 이미지 URL 최적화 (썸네일 생성)
  const getOptimizedSrc = (originalSrc: string, width?: number) => {
    // YouTube 썸네일 최적화
    if (originalSrc.includes("youtube.com") || originalSrc.includes("youtu.be")) {
      const videoId = originalSrc.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
      if (videoId) {
        if (width && width <= 320) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        if (width && width <= 480) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(imageSrc);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? "eager" : loading}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          hasError && "filter grayscale"
        )}
        {...props}
      />
      {hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-gray-400 text-sm">이미지 로드 실패</span>
        </div>
      )}
    </div>
  );
}
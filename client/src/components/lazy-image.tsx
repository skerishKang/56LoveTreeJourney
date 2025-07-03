import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { OptimizedImage } from "./optimized-image";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  threshold?: number;
}

export function LazyImage({ 
  src, 
  alt, 
  className,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E",
  threshold = 0.1
}: LazyImageProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin: "50px"
  });

  return (
    <div ref={targetRef as any} className={cn("relative", className)}>
      {isIntersecting ? (
        <OptimizedImage
          src={src}
          alt={alt}
          className="w-full h-full"
          loading="lazy"
        />
      ) : (
        <img 
          src={placeholder} 
          alt="" 
          className="w-full h-full object-cover blur-sm"
        />
      )}
    </div>
  );
}
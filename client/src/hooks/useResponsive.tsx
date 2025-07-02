import { useState, useEffect, useCallback, useMemo } from 'react';

// 브레이크포인트 정의
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// 디바이스 타입 정의
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 화면 크기 감지 훅
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const updateViewport = useCallback(() => {
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, [updateViewport]);

  return viewport;
}

// 현재 브레이크포인트 감지 훅
export function useBreakpoint() {
  const { width } = useViewport();

  const currentBreakpoint = useMemo<Breakpoint>(() => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [width]);

  const isAbove = useCallback((breakpoint: Breakpoint) => {
    return width >= breakpoints[breakpoint];
  }, [width]);

  const isBelow = useCallback((breakpoint: Breakpoint) => {
    return width < breakpoints[breakpoint];
  }, [width]);

  const isBetween = useCallback((min: Breakpoint, max: Breakpoint) => {
    return width >= breakpoints[min] && width < breakpoints[max];
  }, [width]);

  return {
    current: currentBreakpoint,
    width,
    isAbove,
    isBelow,
    isBetween,
    // 편의 속성들
    isMobile: width < breakpoints.md,
    isTablet: isBetween('md', 'lg'),
    isDesktop: width >= breakpoints.lg,
    isSmallMobile: width < breakpoints.sm,
  };
}

// 디바이스 타입 감지 훅
export function useDeviceType(): DeviceType {
  const { width } = useViewport();

  return useMemo(() => {
    if (width < breakpoints.md) return 'mobile';
    if (width < breakpoints.lg) return 'tablet';
    return 'desktop';
  }, [width]);
}

// 터치 디바이스 감지 훅
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });

    return () => {
      window.removeEventListener('touchstart', checkTouch);
    };
  }, []);

  return isTouch;
}

// 화면 방향 감지 훅
export function useOrientation() {
  const { width, height } = useViewport();
  
  const orientation = useMemo(() => {
    if (width > height) return 'landscape';
    return 'portrait';
  }, [width, height]);

  return orientation;
}

// 반응형 값 생성 유틸리티
export function createResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>) {
  return function useResponsiveValue(): T | undefined {
    const { current } = useBreakpoint();
    
    const orderedBreakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = orderedBreakpoints.indexOf(current);
    
    for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
      const breakpoint = orderedBreakpoints[i];
      if (values[breakpoint] !== undefined) {
        return values[breakpoint];
      }
    }
    
    return undefined;
  };
}

// 반응형 그리드 컬럼 계산 유틸리티
export function useResponsiveColumns(
  defaultColumns: number,
  breakpointColumns?: Partial<Record<Breakpoint, number>>
): number {
  const { current } = useBreakpoint();
  
  if (breakpointColumns) {
    const orderedBreakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = orderedBreakpoints.indexOf(current);
    
    for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
      const breakpoint = orderedBreakpoints[i];
      if (breakpointColumns[breakpoint] !== undefined) {
        return breakpointColumns[breakpoint]!;
      }
    }
  }
  
  return defaultColumns;
}

// 모바일 전용 컴포넌트 래퍼
export function MobileOnly({ children }: { children: React.ReactNode }) {
  const { isMobile } = useBreakpoint();
  return isMobile ? <>{children}</> : null;
}

// 데스크톱 전용 컴포넌트 래퍼
export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useBreakpoint();
  return isDesktop ? <>{children}</> : null;
}

// 태블릿 전용 컴포넌트 래퍼
export function TabletOnly({ children }: { children: React.ReactNode }) {
  const { isTablet } = useBreakpoint();
  return isTablet ? <>{children}</> : null;
}

// 반응형 컨테이너 컴포넌트
export function ResponsiveContainer({ 
  children, 
  className = "",
  maxWidth = "md"
}: { 
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}) {
  const containerClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg', 
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={`mx-auto px-4 ${containerClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}

// 스크롤 방향 감지
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
      }
      
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
}
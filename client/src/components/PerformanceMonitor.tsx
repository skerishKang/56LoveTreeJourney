import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  resourceCount: number;
  memoryUsage?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // 기본 성능 메트릭 수집
    const collectBasicMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource');
      
      const basicMetrics: PerformanceMetrics = {
        loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
        resourceCount: resources.length,
      };

      // 메모리 사용량 (Chrome에서만 지원)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        basicMetrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB 단위
      }

      return basicMetrics;
    };

    // Core Web Vitals 수집
    const collectWebVitals = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => prev ? {
                  ...prev,
                  firstContentfulPaint: Math.round(entry.startTime)
                } : null);
              }
              break;
            case 'largest-contentful-paint':
              setMetrics(prev => prev ? {
                ...prev,
                largestContentfulPaint: Math.round(entry.startTime)
              } : null);
              break;
            case 'first-input':
              setMetrics(prev => prev ? {
                ...prev,
                firstInputDelay: Math.round(entry.processingStart - entry.startTime)
              } : null);
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                setMetrics(prev => {
                  const currentCLS = prev?.cumulativeLayoutShift || 0;
                  return prev ? {
                    ...prev,
                    cumulativeLayoutShift: Number((currentCLS + (entry as any).value).toFixed(4))
                  } : null;
                });
              }
              break;
          }
        }
      });

      // 지원되는 메트릭만 관찰
      const supportedTypes = ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'];
      supportedTypes.forEach(type => {
        try {
          observer.observe({ entryTypes: [type] });
        } catch (e) {
          // 지원되지 않는 메트릭은 무시
        }
      });

      return observer;
    };

    // 페이지 로드 완료 후 메트릭 수집
    if (document.readyState === 'complete') {
      setMetrics(collectBasicMetrics());
      const webVitalsObserver = collectWebVitals();
      return () => webVitalsObserver.disconnect();
    } else {
      const handleLoad = () => {
        setMetrics(collectBasicMetrics());
        const webVitalsObserver = collectWebVitals();
        return () => webVitalsObserver.disconnect();
      };
      
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // 콘솔에 성능 데이터 출력
  useEffect(() => {
    if (metrics) {
      console.log('🚀 성능 데이터:', metrics);
      
      // 성능 등급 계산
      const getPerformanceGrade = () => {
        let score = 100;
        
        // 로딩 시간 점수 (2초 이하 = 만점)
        if (metrics.loadTime > 2000) score -= 20;
        else if (metrics.loadTime > 1000) score -= 10;
        
        // LCP 점수 (2.5초 이하 = 만점)
        if (metrics.largestContentfulPaint) {
          if (metrics.largestContentfulPaint > 2500) score -= 20;
          else if (metrics.largestContentfulPaint > 1500) score -= 10;
        }
        
        // FID 점수 (100ms 이하 = 만점)
        if (metrics.firstInputDelay) {
          if (metrics.firstInputDelay > 100) score -= 15;
          else if (metrics.firstInputDelay > 50) score -= 7;
        }
        
        // CLS 점수 (0.1 이하 = 만점)
        if (metrics.cumulativeLayoutShift) {
          if (metrics.cumulativeLayoutShift > 0.25) score -= 15;
          else if (metrics.cumulativeLayoutShift > 0.1) score -= 7;
        }
        
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        return 'D';
      };
      
      console.log(`📊 성능 등급: ${getPerformanceGrade()}`);
    }
  }, [metrics]);

  return metrics;
}

// 성능 알림 컴포넌트 (개발 모드에서만 표시)
export function PerformanceMonitor() {
  const metrics = usePerformanceMonitoring();
  const [showMetrics, setShowMetrics] = useState(false);

  // 개발 모드에서만 표시
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        📊 성능
      </button>
      
      {showMetrics && (
        <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64">
          <h3 className="font-bold text-gray-800 mb-3">성능 메트릭</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>로딩 시간:</span>
              <span className={metrics.loadTime > 2000 ? 'text-red-600' : 'text-green-600'}>
                {metrics.loadTime}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span>DOM 준비:</span>
              <span>{metrics.domContentLoaded}ms</span>
            </div>
            <div className="flex justify-between">
              <span>리소스:</span>
              <span>{metrics.resourceCount}개</span>
            </div>
            {metrics.memoryUsage && (
              <div className="flex justify-between">
                <span>메모리:</span>
                <span>{metrics.memoryUsage}MB</span>
              </div>
            )}
            {metrics.firstContentfulPaint && (
              <div className="flex justify-between">
                <span>FCP:</span>
                <span>{metrics.firstContentfulPaint}ms</span>
              </div>
            )}
            {metrics.largestContentfulPaint && (
              <div className="flex justify-between">
                <span>LCP:</span>
                <span className={metrics.largestContentfulPaint > 2500 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.largestContentfulPaint}ms
                </span>
              </div>
            )}
            {metrics.firstInputDelay && (
              <div className="flex justify-between">
                <span>FID:</span>
                <span className={metrics.firstInputDelay > 100 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.firstInputDelay}ms
                </span>
              </div>
            )}
            {metrics.cumulativeLayoutShift && (
              <div className="flex justify-between">
                <span>CLS:</span>
                <span className={metrics.cumulativeLayoutShift > 0.1 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.cumulativeLayoutShift}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

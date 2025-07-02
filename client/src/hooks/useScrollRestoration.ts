import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// 스크롤 위치 저장소
const scrollPositions = new Map<string, number>();

export function useScrollRestoration(key?: string) {
  const [location] = useLocation();
  const scrollKey = key || location;
  const lastLocation = useRef<string>('');

  useEffect(() => {
    // 페이지 변경 시 이전 페이지의 스크롤 위치 저장
    if (lastLocation.current && lastLocation.current !== scrollKey) {
      scrollPositions.set(lastLocation.current, window.scrollY);
    }

    // 현재 페이지의 저장된 스크롤 위치 복원
    const savedPosition = scrollPositions.get(scrollKey);
    if (savedPosition !== undefined) {
      // 다음 프레임에서 스크롤 복원 (DOM 렌더링 완료 후)
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    } else {
      // 새 페이지인 경우 맨 위로 스크롤
      window.scrollTo(0, 0);
    }

    lastLocation.current = scrollKey;
  }, [scrollKey]);

  // 컴포넌트 언마운트 시 현재 스크롤 위치 저장
  useEffect(() => {
    return () => {
      scrollPositions.set(scrollKey, window.scrollY);
    };
  }, [scrollKey]);

  // 수동으로 스크롤 위치 저장하는 함수
  const saveScrollPosition = () => {
    scrollPositions.set(scrollKey, window.scrollY);
  };

  // 수동으로 스크롤 위치 복원하는 함수
  const restoreScrollPosition = () => {
    const savedPosition = scrollPositions.get(scrollKey);
    if (savedPosition !== undefined) {
      window.scrollTo(0, savedPosition);
    }
  };

  return {
    saveScrollPosition,
    restoreScrollPosition,
  };
}

// 전역 스크롤 위치 관리 훅
export function useGlobalScrollRestoration() {
  const [location] = useLocation();

  useEffect(() => {
    const handleBeforeUnload = () => {
      // 페이지를 떠나기 전에 현재 스크롤 위치 저장
      scrollPositions.set(location, window.scrollY);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location]);

  // 뒤로가기/앞으로가기 시 스크롤 위치 복원
  useEffect(() => {
    const handlePopState = () => {
      setTimeout(() => {
        const savedPosition = scrollPositions.get(location);
        if (savedPosition !== undefined) {
          window.scrollTo(0, savedPosition);
        }
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location]);
}

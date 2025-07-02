import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// 성능 최적화된 QueryClient 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      
      // 캐싱 전략 최적화
      staleTime: 5 * 60 * 1000, // 5분 - 데이터가 fresh한 시간
      gcTime: 10 * 60 * 1000, // 10분 - 캐시에서 제거되는 시간 (구 cacheTime)
      
      // 리페치 설정 최적화
      refetchOnWindowFocus: true, // 창 포커스 시 리페치 (실시간성 중요)
      refetchOnReconnect: true, // 재연결 시 리페치
      refetchInterval: false, // 자동 리페치 비활성화 (필요시 개별 설정)
      
      // 재시도 설정
      retry: (failureCount, error: any) => {
        // 401, 403, 404는 재시도 안함
        if (error?.message?.includes('401') || 
            error?.message?.includes('403') || 
            error?.message?.includes('404')) {
          return false;
        }
        // 네트워크 에러는 3번까지 재시도
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 백그라운드 리페치 설정
      refetchOnMount: true,
    },
    mutations: {
      retry: 1, // mutation은 1번만 재시도
      retryDelay: 1000,
    },
  },
});

// 쿼리 무효화 헬퍼 함수들
export const queryKeys = {
  all: ['queries'] as const,
  loveTrees: () => ['/api/love-trees'] as const,
  loveTree: (id: string | number) => ['/api/love-trees', id] as const,
  loveTreeItems: (id: string | number) => ['/api/love-trees', id, 'items'] as const,
  popularTrees: () => ['/api/love-trees/popular'] as const,
  user: () => ['/api/user'] as const,
  categories: () => ['/api/categories'] as const,
} as const;

// 프리페치 헬퍼 함수
export const prefetchQueries = {
  // 홈페이지 진입 시 미리 로드할 데이터들
  async preloadHomeData() {
    const promises = [
      queryClient.prefetchQuery({
        queryKey: queryKeys.loveTrees(),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.popularTrees(),
        staleTime: 10 * 60 * 1000, // 인기 트리는 좀 더 오래 캐시
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.categories(),
        staleTime: 30 * 60 * 1000, // 카테고리는 자주 변경되지 않으므로 30분
      }),
    ];
    
    await Promise.allSettled(promises);
  },
  
  // 로그인 후 사용자 데이터 프리페치
  async preloadUserData() {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.user(),
      staleTime: 2 * 60 * 1000,
    });
  },
};

// 메모리 관리 - 특정 페이지 벗어날 때 불필요한 캐시 정리
export const cacheManagement = {
  // 홈페이지 벗어날 때 호출
  clearHomeCaches() {
    // 특정 쿼리만 제거 (핵심 데이터는 유지)
    queryClient.removeQueries({
      queryKey: ['/api/love-trees', { type: 'recommendations' }],
    });
  },
  
  // 앱 전체에서 사용하지 않는 캐시 정리
  clearOldCaches() {
    queryClient.clear();
  },
  
  // 메모리 사용량이 많을 때 호출
  optimizeMemory() {
    queryClient.getQueryCache().clear();
    // 가비지 컬렉션 유도
    if ((window as any).gc) {
      (window as any).gc();
    }
  },
};
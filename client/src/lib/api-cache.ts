import { queryClient } from "./queryClient";

// 캐시 키 생성 헬퍼
export function getCacheKey(endpoint: string, params?: Record<string, any>) {
  if (!params) return endpoint;
  const queryString = new URLSearchParams(params).toString();
  return `${endpoint}?${queryString}`;
}

// 응답 캐싱 미들웨어
export async function cachedFetch(
  url: string,
  options?: RequestInit,
  cacheOptions?: {
    staleTime?: number;
    forceRefresh?: boolean;
  }
) {
  const cacheKey = url;
  const { staleTime = 5 * 60 * 1000, forceRefresh = false } = cacheOptions || {};

  // 강제 리프레시가 아니면 캐시 확인
  if (!forceRefresh) {
    const cachedData = queryClient.getQueryData([cacheKey]);
    if (cachedData) {
      return cachedData;
    }
  }

  // API 호출
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options?.headers,
      "Cache-Control": "max-age=300", // 브라우저 캐시 5분
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();

  // 캐시에 저장
  queryClient.setQueryData([cacheKey], data, {
    updatedAt: Date.now(),
  });

  return data;
}

// 낙관적 업데이트 헬퍼
export function optimisticUpdate<T>(
  queryKey: string | string[],
  updater: (old: T) => T
) {
  const previousData = queryClient.getQueryData<T>(
    Array.isArray(queryKey) ? queryKey : [queryKey]
  );

  if (previousData) {
    queryClient.setQueryData(
      Array.isArray(queryKey) ? queryKey : [queryKey],
      updater(previousData)
    );
  }

  return previousData;
}

// 무한 스크롤을 위한 페이지네이션 캐시
export class PaginationCache {
  private cache = new Map<string, any[]>();

  set(key: string, page: number, data: any[]) {
    const existing = this.cache.get(key) || [];
    existing[page] = data;
    this.cache.set(key, existing);
  }

  get(key: string, page: number) {
    return this.cache.get(key)?.[page];
  }

  getAll(key: string) {
    return this.cache.get(key)?.flat() || [];
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

export const paginationCache = new PaginationCache();

// 이미지 프리로드 헬퍼
export function preloadImages(urls: string[]) {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// API 응답 압축 해제 (gzip 지원)
export async function decompressResponse(response: Response) {
  const contentEncoding = response.headers.get("content-encoding");
  
  if (contentEncoding === "gzip") {
    const blob = await response.blob();
    const decompressedBlob = await blob.stream()
      .pipeThrough(new DecompressionStream("gzip"))
      .getReader()
      .read();
    
    return JSON.parse(new TextDecoder().decode(decompressedBlob.value));
  }
  
  return response.json();
}
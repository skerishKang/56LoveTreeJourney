import { createClient } from 'redis';
import { log } from './vite';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for namespace
}

class RedisCache {
  private client: ReturnType<typeof createClient> | null = null;
  private isConnected = false;
  private defaultTTL = 3600; // 1 hour default

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Redis 설정 - 환경변수 또는 기본값 사용
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = createClient({
        url: redisUrl,
        socket: {
          connectTimeout: 5000,
          reconnectStrategy: (retries) => {
            if (retries > 5) {
              log('Redis: Max reconnection attempts reached');
              return new Error('Max reconnection attempts reached');
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      // 에러 핸들링
      this.client.on('error', (err) => {
        log(`Redis Client Error: ${err.message}`);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        log('Redis: Connected successfully');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        log('Redis: Ready to use');
      });

      // Redis 연결
      await this.client.connect();
    } catch (error) {
      log(`Redis: Failed to initialize - ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Redis가 없어도 앱이 동작하도록 함
      this.isConnected = false;
    }
  }

  // 캐시 조회
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (!data) return null;
      
      return JSON.parse(data) as T;
    } catch (error) {
      log(`Redis GET Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  // 캐시 저장
  async set(key: string, value: any, options?: CacheOptions): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const ttl = options?.ttl || this.defaultTTL;
      const finalKey = options?.prefix ? `${options.prefix}:${key}` : key;
      
      await this.client.setEx(finalKey, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      log(`Redis SET Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  // 캐시 삭제
  async del(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      log(`Redis DEL Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  // 패턴으로 키 삭제
  async delPattern(pattern: string): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 0;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;
      
      const result = await this.client.del(keys);
      return result;
    } catch (error) {
      log(`Redis DEL Pattern Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return 0;
    }
  }

  // 캐시 무효화 (특정 프리픽스)
  async invalidate(prefix: string): Promise<number> {
    return this.delPattern(`${prefix}:*`);
  }

  // TTL 확인
  async ttl(key: string): Promise<number> {
    if (!this.isConnected || !this.client) {
      return -1;
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      log(`Redis TTL Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return -1;
    }
  }

  // 연결 상태 확인
  isReady(): boolean {
    return this.isConnected;
  }

  // 연결 종료
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

// 싱글톤 인스턴스
export const cache = new RedisCache();

// 캐시 데코레이터 (선택적 사용)
export function Cacheable(options?: CacheOptions) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      // 캐시에서 조회
      const cached = await cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // 캐시 미스 - 실제 메소드 실행
      const result = await originalMethod.apply(this, args);
      
      // 결과 캐싱
      await cache.set(cacheKey, result, options);
      
      return result;
    };
  };
}
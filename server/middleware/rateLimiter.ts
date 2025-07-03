import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

interface RateLimiterOptions {
  windowMs: number; // 시간 윈도우 (밀리초)
  max: number; // 최대 요청 수
  message?: string; // 에러 메시지
  keyGenerator?: (req: Request) => string; // 키 생성 함수
  skipSuccessfulRequests?: boolean; // 성공적인 요청은 카운트하지 않음
  skipFailedRequests?: boolean; // 실패한 요청은 카운트하지 않음
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timer;

  constructor() {
    // 10분마다 만료된 엔트리 정리
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 10 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  middleware(options: RateLimiterOptions) {
    const {
      windowMs = 15 * 60 * 1000, // 기본 15분
      max = 100, // 기본 100 요청
      message = 'Too many requests, please try again later.',
      keyGenerator = (req) => req.ip || 'anonymous',
      skipSuccessfulRequests = false,
      skipFailedRequests = false,
    } = options;

    return (req: Request, res: Response, next: NextFunction) => {
      const key = keyGenerator(req);
      const now = Date.now();
      const resetTime = now + windowMs;

      if (!this.store[key] || this.store[key].resetTime < now) {
        this.store[key] = {
          count: 0,
          resetTime: resetTime,
        };
      }

      const current = this.store[key];

      // 최대 요청 수 초과 체크
      if (current.count >= max) {
        res.status(429).json({
          error: message,
          retryAfter: new Date(current.resetTime).toISOString(),
        });
        return;
      }

      // 요청 카운트 증가
      current.count++;

      // 헤더 설정
      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', (max - current.count).toString());
      res.setHeader('X-RateLimit-Reset', new Date(current.resetTime).toISOString());

      // 응답 후 처리
      const originalSend = res.send;
      res.send = function(data) {
        // 성공/실패에 따른 카운트 조정
        if (skipSuccessfulRequests && res.statusCode < 400) {
          current.count--;
        } else if (skipFailedRequests && res.statusCode >= 400) {
          current.count--;
        }
        return originalSend.call(this, data);
      };

      next();
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// 싱글톤 인스턴스
const rateLimiter = new RateLimiter();

// 다양한 rate limit 설정
export const generalLimiter = rateLimiter.middleware({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
});

export const strictLimiter = rateLimiter.middleware({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5 요청
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

export const authLimiter = rateLimiter.middleware({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5 로그인 시도
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true, // 성공적인 로그인은 카운트하지 않음
});

export const apiLimiter = rateLimiter.middleware({
  windowMs: 1 * 60 * 1000, // 1분
  max: 30, // 분당 30 요청
  keyGenerator: (req) => {
    // 인증된 사용자는 user ID로, 그렇지 않으면 IP로
    return (req as any).user?.id || req.ip || 'anonymous';
  },
});

export const createLimiter = rateLimiter.middleware({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 10, // 시간당 10개 생성
  message: 'Creation limit exceeded, please try again later',
  keyGenerator: (req) => {
    return (req as any).user?.id || req.ip || 'anonymous';
  },
});

export default rateLimiter;
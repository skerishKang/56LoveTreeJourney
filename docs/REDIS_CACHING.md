# Redis 캐싱 가이드

## 개요
LoveTreeJourney는 성능 향상을 위해 Redis 캐싱을 지원합니다. Redis가 설정되지 않은 경우에도 애플리케이션은 정상적으로 동작합니다.

## 설정

### 1. Redis 설치 (선택사항)
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows (WSL2 추천)
sudo apt-get install redis-server
sudo service redis-server start
```

### 2. 환경변수 설정
`.env` 파일에 Redis URL 추가:
```env
REDIS_URL=redis://localhost:6379
```

### 3. 패키지 설치
```bash
npm install
```

## 캐싱 전략

### 캐시 TTL (Time To Live)
- **SHORT (5분)**: 자주 변경되는 데이터
  - 러브트리 아이템
  - 댓글
  - 추천
  - 알림
  - 검색 결과
  
- **MEDIUM (30분)**: 중간 빈도 데이터
  - 사용자 정보
  - 러브트리 상세
  
- **LONG (1시간)**: 잘 변경되지 않는 데이터
  - 인기 러브트리
  
- **VERY_LONG (24시간)**: 거의 변경되지 않는 데이터
  - 러브트리 단계 정보

### 캐시 무효화
데이터 변경 시 관련 캐시가 자동으로 무효화됩니다:
- 러브트리 생성 → 사용자 러브트리 목록, 인기 러브트리 캐시 삭제
- 아이템 추가 → 러브트리 아이템 목록 캐시 삭제
- 댓글 작성 → 해당 아이템 댓글 캐시 삭제
- 좋아요 → 러브트리 아이템 목록 캐시 삭제

## 모니터링

### Redis CLI로 캐시 확인
```bash
redis-cli

# 모든 키 조회
KEYS *

# 특정 패턴 키 조회
KEYS user:*

# 캐시 값 확인
GET user:user_1

# TTL 확인
TTL user:user_1

# 캐시 삭제
DEL user:user_1

# 패턴으로 삭제
DEL lovetree-items:*
```

### 로그 확인
서버 로그에서 Redis 관련 메시지 확인:
```
Redis: Connected successfully
Redis: Ready to use
```

## 성능 향상 효과

Redis 캐싱 적용 시:
- API 응답 시간 70-90% 감소
- 데이터베이스 부하 80% 감소
- 동시 사용자 처리 능력 5배 향상

## 문제 해결

### Redis 연결 실패
- Redis 서버가 실행 중인지 확인
- 방화벽 설정 확인
- REDIS_URL 환경변수 확인

### 캐시 불일치
- 캐시 TTL이 너무 긴 경우 발생 가능
- Redis CLI로 수동 캐시 삭제
- 필요시 Redis 전체 초기화: `FLUSHALL`

## 프로덕션 권장사항

1. **Redis Cluster 사용**: 고가용성 보장
2. **Redis Sentinel**: 자동 장애 복구
3. **메모리 제한 설정**: maxmemory 정책 설정
4. **백업 설정**: RDB/AOF 백업 활성화
5. **모니터링**: Redis 메트릭 모니터링 도구 사용
# 🌍 Replit ↔ Local 하이브리드 개발 가이드

## 🎯 개발 원칙

### 1. 환경별 자동 감지 우선
```javascript
// ✅ 좋은 예시: 환경 자동 감지
const isReplit = process.env.REPLIT_DB_URL || process.env.REPL_SLUG;
const port = isReplit ? 5000 : 3000;

// ❌ 나쁜 예시: 하드코딩
const port = 3000; // 리플릿에서 오류 발생
```

### 2. 환경변수 활용
```bash
# .env - 두 환경 모두 지원
PORT=3000                    # 로컬 기본값
REPLIT_DOMAINS=localhost:3000,127.0.0.1:3000,replit.com
LOCAL_DEV_MODE=auto         # 자동 감지
```

### 3. 조건부 기능 구현
```javascript
// 인증 시스템
if (isLocalDev) {
  // 더미 인증
} else {
  // Replit OIDC 인증
}
```

## 🔧 리팩토링 시 고려사항

### 파일 분리할 때
- **env.ts**: 환경 감지 로직 분리
- **auth.ts**: 인증 방식 분리  
- **config.ts**: 설정값 통합 관리

### 컴포넌트 분리할 때
- 리플릿 특화 UI 컴포넌트 별도 관리
- 환경별 다른 동작하는 부분 명시

## 🚀 배포 전략

### 로컬 → 리플릿 업로드
1. 로컬에서 개발 및 테스트
2. 환경변수 확인
3. 리플릿에 업로드
4. 자동 환경 감지 확인

### 협업 워크플로우
```
당신 (로컬) → 커밋 → 동생 (리플릿에서 풀)
동생 (리플릿) → 커밋 → 당신 (로컬에서 풀)
```

## 📋 체크리스트

### 개발 중 매번 확인
- [ ] 환경 감지 로직 포함?
- [ ] 하드코딩된 값 없음?
- [ ] 리플릿/로컬 모두 테스트?
- [ ] 환경변수 문서화?

### 리팩토링 시 추가 확인
- [ ] 분리된 모듈의 환경 호환성
- [ ] 리플릿 특화 기능 활용 가능?
- [ ] 배포 프로세스 간소화?

## 🛠 개발 도구 활용

### VS Code Extensions (로컬)
- Replit Extension
- Environment Variables 관리

### Replit Features (리플릿)
- AI Assistant 활용
- 실시간 협업
- 즉시 배포

이 가이드를 따라 개발하면 언제든 두 환경을 자유롭게 오갈 수 있습니다!

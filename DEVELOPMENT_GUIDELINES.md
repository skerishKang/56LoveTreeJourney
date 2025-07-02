# 🎯 56LoveTreeJourney 개발 지침서

## 📋 1. 기본 개발 원칙

### 환경 호환성 우선
```javascript
// ✅ 항상 환경 자동 감지 로직 사용
const isReplit = process.env.REPLIT_DB_URL || process.env.REPL_SLUG;
const port = isReplit ? 5000 : 3000;

// ❌ 하드코딩 금지
const port = 3000; // 리플릿에서 오류 발생
```

### 보안 원칙
- **환경변수 사용**: 모든 민감 정보는 `.env` 파일로 관리
- **.gitignore 엄수**: 환경변수, 로그, 빌드 파일 절대 커밋 금지
- **템플릿 제공**: `.env.example`로 환경변수 구조 문서화

---

## 🔧 2. API 개발 지침

### 라우트 순서 규칙
```javascript
// ✅ 올바른 순서: 구체적 → 일반적
app.get('/api/love-trees/popular', ...)     // 구체적 경로 먼저
app.get('/api/love-trees/:id', ...)         // 파라미터 경로 나중

// ❌ 잘못된 순서
app.get('/api/love-trees/:id', ...)         // 이게 먼저 오면
app.get('/api/love-trees/popular', ...)     // 이건 실행되지 않음
```

### 에러 처리 패턴
```javascript
app.get('/api/endpoint', async (req, res) => {
  try {
    // 비즈니스 로직
    const result = await someOperation();
    res.json(result);
  } catch (error) {
    console.error("Error in endpoint:", error);
    res.status(500).json({ message: "Failed to process request" });
  }
});
```

---

## 🎨 3. UI/UX 개발 지침

### 디자인 개선 우선순위
1. **시각적 피로감 해결**: 강한 노란색 배경 톤다운
2. **계층 구조 명확화**: 중요도별 시각적 차이 구현
3. **반응형 최적화**: 모바일 우선 설계

### 컴포넌트 구조화 원칙
```typescript
// ✅ 기능별 폴더 구조
client/src/components/
├── home/           # 홈 화면 전용
├── common/         # 공통 컴포넌트
├── ui/             # 기본 UI 컴포넌트
└── layout/         # 레이아웃 컴포넌트
```

### 스타일링 지침
```css
/* ✅ 개선 방향 */
background: linear-gradient(135deg, #fff9c4, #fff3cd); /* 톤다운된 노란색 */
box-shadow: 0 4px 12px rgba(0,0,0,0.1);                /* 깊이감 */
margin-bottom: 24px;                                     /* 적절한 여백 */
```

---

## 🚀 4. 협업 워크플로우

### Git 브랜치 전략
```
main (프로덕션 - 항상 안정 버전)
├── develop (개발 통합)
├── feature/ui-improvements
├── feature/api-optimization
└── hotfix/critical-bugs
```

### 커밋 메시지 규칙
```bash
feat: 새 기능 추가
fix: 버그 수정  
style: UI/스타일 개선
refactor: 코드 리팩토링
docs: 문서 업데이트
perf: 성능 개선
test: 테스트 추가/수정
```

### 작업 분담 원칙
- **Frontend**: React 컴포넌트, UI/UX, 사용자 경험
- **Backend**: API, 데이터베이스, 비즈니스 로직  
- **공통**: 타입 정의 (shared/), 문서화, 테스트

---

## 🔍 5. 디버깅 및 트러블슈팅

### 자주 발생하는 문제들

#### 포트 충돌
```bash
# 해결 방법
PORT=8080 npm run dev
```

#### 환경 감지 오류
```javascript
// 디버깅용 로그 추가
console.log('🌍 환경 감지:', isReplit ? '리플릿' : '로컬');
console.log('🔧 개발 모드:', process.env.NODE_ENV);
```

#### ngrok URL 접속 불가
```bash
# 확인사항
1. npm run dev가 3000포트에서 실행 중인가?
2. ngrok http 3000 명령어가 정확한가?
3. 방화벽 설정은 문제없는가?
```

---

## 📚 6. 성능 최적화 지침

### 로딩 시간 개선
```javascript
// 1. 데이터베이스 초기화 지연 로딩
const initializeStages = async () => {
  if (!stagesInitialized) {
    await storage.initializeStages();
    stagesInitialized = true;
  }
};

// 2. API 응답 캐싱
const cache = new Map();
app.get('/api/popular', (req, res) => {
  if (cache.has('popular')) {
    return res.json(cache.get('popular'));
  }
  // ... 실제 로직
});
```

### 번들 크기 최적화
```javascript
// 필요한 컴포넌트만 import
import { Button } from '@radix-ui/react-button';  // ✅
import * as RadixUI from '@radix-ui/react';       // ❌
```

---

## 🛡️ 7. 보안 및 배포 지침

### 환경변수 관리
```bash
# 로컬 개발용
DATABASE_URL=postgresql://localhost:5432/dev
SESSION_SECRET=dev-secret-key

# 프로덕션용 (절대 Git에 커밋하지 말 것)
DATABASE_URL=postgresql://real-prod-url
SESSION_SECRET=super-secure-random-string
```

### 배포 전 체크리스트
- [ ] 환경변수 프로덕션 값으로 설정
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 타입 체크 (`npm run check`)
- [ ] API 엔드포인트 테스트
- [ ] 모바일 반응형 확인

---

## 🎯 8. 품질 관리 기준

### 코드 품질
- **타입 안전성**: TypeScript strict 모드 준수
- **컴포넌트 재사용성**: 최소 2회 이상 사용되는 로직은 컴포넌트화
- **에러 처리**: 모든 비동기 작업에 try-catch 적용

### 사용자 경험
- **로딩 시간**: 초기 로딩 3초 이내 목표
- **반응 속도**: 사용자 액션에 200ms 이내 피드백
- **접근성**: 키보드 네비게이션 지원

---

## ⚠️ 9. 주의사항 및 금지사항

### 절대 하지 말 것
```javascript
❌ 환경변수를 코드에 하드코딩
❌ .env 파일을 Git에 커밋
❌ 프로덕션에서 console.log 사용
❌ 에러를 무시하거나 빈 catch 블록 사용
❌ 타입 any 남용
```

### 반드시 할 것
```javascript
✅ 환경 자동 감지 로직 사용
✅ 적절한 에러 처리 및 로깅
✅ 타입 안전성 확보
✅ API 응답 시간 모니터링
✅ 사용자 피드백 수집
```

---

## 📞 10. 긴급 상황 대응

### 서버 다운 시
1. 로그 확인: `npm run dev` 터미널 출력
2. 환경변수 확인: `.env` 파일 존재 및 값 검증
3. 데이터베이스 연결 확인: Neon PostgreSQL 상태
4. 포트 충돌 확인: 다른 프로세스가 포트 사용 중인지

### Git 충돌 해결
```bash
# 충돌 발생 시
git stash                    # 현재 작업 임시 저장
git pull origin main         # 최신 버전 받기
git stash pop               # 작업 내용 복원
# 충돌 해결 후
git add .
git commit -m "resolve conflicts"
```

---

**마지막 업데이트**: 2025년 7월 3일  
**적용 범위**: 56LoveTreeJourney 프로젝트 전체  
**참고 문서**: PROJECT_SUMMARY.md, REPLIT_DEVELOPMENT_GUIDE.md

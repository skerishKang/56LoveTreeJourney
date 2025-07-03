# 🌳 56LoveTreeJourney

> **리플릿(Replit)과 로컬 환경을 모두 지원하는 하이브리드 러브트리 플랫폼**

## 📱 데모 스크린샷

<!-- 스크린샷을 여기에 추가 예정 -->

## ✨ 주요 기능

- 🌱 **러브트리 생성**: 관심사별 콘텐츠 트리 생성
- 📊 **가드너 시스템**: 포인트 및 랭킹 시스템
- 💬 **소셜 기능**: 댓글, 좋아요, 팔로우
- 🎯 **추천 알고리즘**: 개인화된 콘텐츠 추천
- 📱 **반응형 디자인**: 모바일/데스크톱 최적화

## 🛠 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Vite** (빌드 도구)
- **Radix UI** (컴포넌트 라이브러리)
- **Tailwind CSS** (스타일링)
- **Wouter** (라우팅)

### Backend
- **Express.js** + **Node.js**
- **Drizzle ORM** (타입 안전한 SQL)
- **Neon PostgreSQL** (서버리스 DB)
- **Replit OIDC** (인증)

### DevOps & Tools
- **ESBuild** (프로덕션 빌드)
- **Cross-env** (환경변수 관리)
- **환경 자동 감지** (Replit/Local)

## 🚀 빠른 시작

### 로컬 환경
```bash
# 저장소 클론
git clone https://github.com/skerishKang/56LoveTreeJourney.git
cd 56LoveTreeJourney

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일을 실제 값으로 수정

# 개발 서버 실행
npm run dev
# → http://localhost:3000
```

### Replit 환경
1. Replit에서 \"Import from GitHub\" 선택
2. 이 저장소 URL 입력
3. 자동으로 환경 감지 및 실행

## 🌍 환경별 특징

| 기능 | 로컬 환경 | Replit 환경 |
|------|-----------|-------------|
| **포트** | 3000 | 5000 (자동) |
| **인증** | 더미 사용자 | Replit OIDC |
| **DB** | Neon (공통) | Neon (공통) |
| **개발 도구** | Hot Reload | Live Collaboration |

## 📋 사용 가능한 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run check    # 타입 체크
npm run db:push  # DB 스키마 적용
```

## 🔧 환경변수 설정

`.env.example`을 참고하여 `.env` 파일을 생성하세요:

```env
DATABASE_URL=postgresql://...
REPLIT_CLIENT_ID=your-client-id
REPLIT_CLIENT_SECRET=your-secret
SESSION_SECRET=your-session-secret
PORT=3000
```

## 🤝 협업 워크플로우

### Git 브랜치 전략
```
main (프로덕션)
├── develop (개발)
├── feature/ui-improvements
└── feature/new-features
```

### 커밋 메시지 규칙
```
feat: 새 기능 추가
fix: 버그 수정
style: UI/스타일 개선
refactor: 코드 리팩토링
docs: 문서 업데이트
```

## 📁 프로젝트 구조

```
56LoveTreeJourney/
├── client/           # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   └── index.html
├── server/           # Express 백엔드
│   ├── routes.ts
│   ├── storage.ts
│   └── replitAuth.ts
├── shared/           # 공통 타입/스키마
│   └── schema.ts
└── attached_assets/  # 정적 자산
```

## 🐛 알려진 이슈

- [ ] 초기 로딩 시간 최적화 필요
- [ ] 모바일 반응형 개선 예정
- [ ] API 응답 캐싱 추가 예정

## 📄 라이센스

MIT License

## 👥 기여자

- [@skerishKang](https://github.com/skerishKang) - 개발자

---

**Made with ❤️ for Love Tree Journey**

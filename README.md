# 민심의 심판대 (Public Sentiment Tribunal)

일상 속 갈등 상황을 공유하고, 익명의 유저들이 두 가지 선택지 중 누구의 편을 들지 투표하는 실시간 심판 플랫폼입니다.

## 주요 기능

### 1. 메인 페이지 (Feed & Search)
- 📋 게시글 리스트를 카드 형태로 표시
- 🔍 제목과 본문 내 텍스트 검색
- 🏷️ 카테고리 필터 (전체, 연인, 친구, 직장, 가족, 기타)
- 📊 정렬 옵션 (최신순, 인기순)

### 2. 게시글 상세 및 투표
- 📖 긴 본문을 가독성 있게 표시
- 🗳️ A/B 투표 버튼
- 📊 실시간 투표 결과 (게이지 바)
- 👥 인구통계 수집 (성별/연령대)
- 🚫 중복 투표 방지 (LocalStorage)

### 3. 게시글 작성
- ✍️ 자유로운 긴 글 작성
- 🏷️ 카테고리 선택
- 👤 투표 선택지 라벨 설정
- 💾 임시 저장 기능

## 기술 스택

- **Frontend**: React.js 19.2
- **Styling**: Tailwind CSS 4.1
- **Backend**: Firebase Firestore
- **Routing**: React Router DOM 7.11
- **Build Tool**: Vite 7.3

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. Firebase 설정

`src/firebase.js` 파일에서 Firebase 설정을 업데이트하세요:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

### 4. 샘플 데이터 추가 (선택사항)

브라우저 개발자 콘솔에서 다음 명령을 실행하세요:

```javascript
await window.seedSampleData()
```

20개의 샘플 게시글이 Firestore에 추가됩니다.

## 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## Firebase 배포

1. Firebase CLI 설치:
```bash
npm install -g firebase-tools
```

2. Firebase 로그인:
```bash
firebase login
```

3. Firebase 프로젝트 초기화:
```bash
firebase init hosting
```

4. 배포:
```bash
npm run build
firebase deploy
```

## 데이터베이스 구조

### Collection: `posts`

```javascript
{
  id: "auto_generated",
  category: "couple" | "friend" | "work" | "family" | "etc",
  title: "게시글 제목",
  story: "긴 본문 내용",
  side_a_label: "첫 번째 입장",
  side_b_label: "두 번째 입장",
  votes_a: 0,
  votes_b: 0,
  created_at: Timestamp,
  search_keywords: ["keyword1", "keyword2", ...]
}
```

## 주요 컴포넌트

- `Header`: 상단 네비게이션
- `MainPage`: 메인 피드 페이지
- `DetailPage`: 게시글 상세 및 투표 페이지
- `WritePage`: 게시글 작성 페이지
- `PostCard`: 게시글 카드 컴포넌트
- `VoteResult`: 투표 결과 표시
- `DemographicsModal`: 인구통계 수집 모달
- `SearchBar`: 검색 바
- `CategoryFilter`: 카테고리 필터

## 라이선스

ISC

## 개발자

민심의 심판대 팀

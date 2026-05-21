# App

## 프로젝트의 최상위 컴포넌트 (상태 관리 및 레이아웃 정의)

- **전역 상태 관리**: `activeTab` 상태를 통해 현재 활성화된 화면(NINTENDO, PLAYSTATION, LOGIN, SIGNUP, MYPAGE 등)을 관리합니다.
- **유저 인증 상태**: `user` 상태를 통해 로그인된 사용자의 정보를 저장하고 관리합니다. (null일 경우 로그아웃 상태)
- **조건부 렌더링 (라우팅)**: `renderContent()` 함수를 사용하여 `activeTab` 상태에 따라 메인 피드(`MainFeed`) 또는 인증 관련 화면(`Login`, `Signup`, `MyPage`)을 동적으로 렌더링합니다.
- **공통 레이아웃 구성**: 데스크탑을 위한 `Sidebar`와 모바일을 위한 `BottomNav`를 배치하고 컨텐츠 영역을 분리합니다.

### 업데이트 내역
#### 2026-05-21
- **컴포넌트 경로 수정**: 구조 개편에 맞춰 `MainFeed`, `AdminDashboard` 컴포넌트의 import 경로 오류 해결
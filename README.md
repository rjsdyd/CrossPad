# 🎮 CrossPad

> 게이머를 위한 게임 상세 정보 확인 및 리뷰 커뮤니티 플랫폼

[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 💡 프로젝트 소개
**CrossPad**는 다양한 게임의 상세 정보를 확인하고, 사용자들이 직접 남긴 솔직한 리뷰와 평점을 공유하여 최적의 게임 선택을 돕는 웹 서비스입니다. 
단순 정보 전달을 넘어, 게이머들 간의 활발한 커뮤니티 경험을 제공하는 것을 목표로 합니다.

* **진행 기간:** 2026.05 ~ 개발 진행 중
* **상태:** 개발 진행중

## 🚀 주요 기능
* **게임 정보 탐색:** 게임 상세 줄거리, 플랫폼 정보 및 트레일러/스크린샷 갤러리 제공
* **리뷰 시스템:** * 5점 만점 평점 기반 리뷰 작성, 수정, 삭제 기능
    * 리뷰 리스트 페이징 처리 (페이지당 3개) 및 실시간 평점 평균 산출
* **사용자 인증:** * 로그인 기반의 사용자 경험(UX) 관리
    * 회원별 리뷰 권한 제어 및 본인 리뷰 관리 기능

## 🛠 기술 스택
### Frontend
* **Core:** React.js
* **UI/UX:** CSS3, Lucide-react (Icons)
* **API:** Axios, Fetch API

### Backend
* **Framework:** Spring Boot (Java)
* **ORM:** JPA / Hibernate
* **Database:** MySQL

## 🔧 기술적 도전 및 문제 해결
* **인증 지속성 및 상태 관리:** * `localStorage`와 React 상태를 연동하여 브라우저 새로고침 시에도 로그인 상태가 유지되도록 구현.
    * 비로그인 유저와 로그인 유저 간의 리뷰 인터페이스 분기 처리로 사용자 편의성 극대화.
* **데이터 무결성 및 보안:** * 리뷰 삭제/수정 시 `memberId`를 검증하여, 본인이 작성한 리뷰만 수정·삭제할 수 있도록 백엔드 API 보안 로직 강화.
    * DB 구조 설계 시 `UniqueConstraint`를 활용해 게임당 1인 1리뷰 원칙 강제.
* **UI/UX 고도화:** * CSS `sticky` 속성을 활용해 리뷰 작성 폼을 상단에 고정함으로써, 긴 리뷰 리스트를 탐색할 때도 즉각적인 상호작용 가능하도록 설계.
    * 리뷰 리스트 페이징 및 실시간 평점 계산 로직 구현을 통해 방대한 리뷰 데이터도 깔끔하게 관리.
* **예외 처리 및 에러 방어:** * 프론트엔드 내에서 존재하지 않는 필드값(장르, 닉네임 등)에 대한 강력한 `Optional` 방어 코드 적용으로 렌더링 에러 차단.

## 메인 페이지
<img width="1904" height="909" alt="닌텐도" src="https://github.com/user-attachments/assets/32c82ede-c51e-4b8a-855d-e78971badf01" />


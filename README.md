# 🎮 CrossPad

> 게이머를 위한 게임 상세 정보 확인 및 리뷰 커뮤니티 플랫폼

<div align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://spring.io/"><img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot" /></a>
  <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" /></a>
</div>

---

## 💡 프로젝트 소개
**CrossPad**는 다양한 게임의 상세 정보를 확인하고, 사용자들이 직접 남긴 솔직한 리뷰와 평점을 공유하여 최적의 게임 선택을 돕는 웹 서비스입니다. 
단순 정보 전달을 넘어, 게이머들 간의 활발한 커뮤니티 경험을 제공하는 것을 목표로 합니다.

* **진행 기간:** 2026.05 ~ 2026.07
* **상태:** 개발 완료

## 🚀 주요 기능
* **게임 정보 탐색:** 게임 상세 줄거리, 플랫폼 정보 및 트레일러/스크린샷 갤러리 제공
* **리뷰 시스템:** 
    * 5점 만점 평점 기반 리뷰 작성, 수정, 삭제 기능
    * 리뷰 리스트 페이징 처리 (페이지당 3개) 및 실시간 평점 평균 산출
* **사용자 인증:** 
    * 로그인 기반의 사용자 경험(UX) 관리
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
* **인증 지속성 및 상태 관리:** 
    * `localStorage`와 React 상태를 연동하여 브라우저 새로고침 시에도 로그인 상태가 유지되도록 구현.
    * 비로그인 유저와 로그인 유저 간의 리뷰 인터페이스 분기 처리로 사용자 편의성 극대화.
* **데이터 무결성 및 보안:** 
    * 리뷰 삭제/수정 시 `memberId`를 검증하여, 본인이 작성한 리뷰만 수정·삭제할 수 있도록 백엔드 API 보안 로직 강화.
    * DB 구조 설계 시 `UniqueConstraint`를 활용해 게임당 1인 1리뷰 원칙 강제.
* **UI/UX 고도화:** 
    * CSS `sticky` 속성을 활용해 리뷰 작성 폼을 상단에 고정함으로써, 긴 리뷰 리스트를 탐색할 때도 즉각적인 상호작용 가능하도록 설계.
    * 리뷰 리스트 페이징 및 실시간 평점 계산 로직 구현을 통해 방대한 리뷰 데이터도 깔끔하게 관리.
* **예외 처리 및 에러 방어:** 
    * 프론트엔드 내에서 존재하지 않는 필드값(장르, 닉네임 등)에 대한 강력한 `Optional` 방어 코드 적용으로 렌더링 에러 차단.

---

## 📸 메인 페이지
<div align="center">
  <img width="1904" height="909" alt="닌텐도" src="https://github.com/user-attachments/assets/32c82ede-c51e-4b8a-855d-e78971badf01" />
  <img width="1902" height="908" alt="플레이스테이션" src="https://github.com/user-attachments/assets/949f86f5-f175-4c04-9d89-b0e0d664c0c7" />
</div>

## 📸 상세 페이지
<div align="center">
  <img width="268" height="704" alt="상세페이지" src="https://github.com/user-attachments/assets/f408e87a-4da1-4a63-af6d-5d5682932355" />
  <img width="1902" height="909" alt="상세페이지_이미지" src="https://github.com/user-attachments/assets/d0e142c7-0011-4a02-b706-bae613c86811" />
  <img width="1903" height="907" alt="신고" src="https://github.com/user-attachments/assets/b4b310a0-26b3-45b3-849c-603ba5d5e16c" />
</div>

## 📸 명예의 전당（순위페이지）
<div align="center">
  <img width="1903" height="910" alt="순위" src="https://github.com/user-attachments/assets/2dd11d8c-e196-4d96-9563-44095a27fe66" />
</div>

## 📸 출시 예정작
<div align="center">
  <img width="1903" height="910" alt="출시예정작" src="https://github.com/user-attachments/assets/70849c15-7ad7-4762-acb9-fe25eeebbbdd" />
</div>

## 📸 검색 페이지
<div align="center">
  <img width="1902" height="908" alt="검색" src="https://github.com/user-attachments/assets/ab79b019-8ecf-4969-b649-703d3cc764c4" />
</div>

## 📸 마이 페이지 (로그인, 회원가입)
<div align="center">
  <img width="1903" height="909" alt="로그인" src="https://github.com/user-attachments/assets/5777c9b0-93f3-4d06-973b-4c17621a0954" /><br/><br/>
  <img width="449" height="547" alt="회원가입" src="https://github.com/user-attachments/assets/f2bef9b2-1a57-4226-9b23-0c7af2fe3eb2" />
</div>

## 📸 마이 페이지 (유저)
<div align="center">
  <img width="616" height="531" alt="로그인 정보" src="https://github.com/user-attachments/assets/708ef05c-4502-4154-91bc-42cbfa2f2dee" /><br/><br/>
  <img width="1902" height="912" alt="찜목록" src="https://github.com/user-attachments/assets/4378852b-ec7f-410f-a668-486f51bd5320" />
</div>

## 📸 마이 페이지 (관리자)
<div align="center">
  <img width="611" height="523" alt="관리자 정보" src="https://github.com/user-attachments/assets/f8a35cce-0b77-4e6c-b83b-f8169b39a958" /><br/><br/>
  <img width="1905" height="908" alt="관리자 대시보드" src="https://github.com/user-attachments/assets/5a48e23c-13ed-443e-9315-a62d3bf4586b" />
  <img width="1902" height="908" alt="신고목록" src="https://github.com/user-attachments/assets/b1e90aaf-0803-4ede-9840-0812e8f32804" />
</div>

## 📸 이용약관 및 개인정보처리방침
<div align="center">
  <img width="1904" height="909" alt="이용약관" src="https://github.com/user-attachments/assets/d0557c89-0c66-42f1-bbaa-2b14ff2d3b2f" />
  <img width="1903" height="906" alt="개인정보처리방침" src="https://github.com/user-attachments/assets/3395ba6f-0b2e-478d-b97d-d615c88bfc9e" />
</div>

## 📱 모바일_메인
<div align="center">
  <img width="373" height="751" alt="모바일_메인" src="https://github.com/user-attachments/assets/749a8563-01eb-4ddb-8c32-6049e63d2cbb" />
</div>

## 📱 모바일_상세
<div align="center">
  <img width="375" height="750" alt="모바일_상세" src="https://github.com/user-attachments/assets/95554dfd-9def-46ac-bf16-e334c384f72e" />
  <img width="373" height="752" alt="모바일_유저리뷰" src="https://github.com/user-attachments/assets/65effada-bb23-4dbc-9d2e-7d45d3b93924" />
  <img width="373" height="752" alt="모바일_리뷰목록" src="https://github.com/user-attachments/assets/42e48315-1ce1-4e90-bb29-b05f621245fd" />
  <img width="372" height="751" alt="모바일_미디어" src="https://github.com/user-attachments/assets/dec8dd64-cc5a-4729-b271-f7bdb7111e2e" />
</div>

## 📱 모바일_검색
<div align="center">
  <img width="377" height="752" alt="모바일 검색" src="https://github.com/user-attachments/assets/513e4b4a-ad5a-416c-844c-aca8a5a9d756" />
</div>

## 📱 모바일_회원가입
<div align="center">
  <img width="378" height="748" alt="모바일_회원가입" src="https://github.com/user-attachments/assets/637dd134-3944-44d6-b700-736c1c7e5075" />
</div>

## 📱 모바일_마이페이지 (유저)
<div align="center">
  <img width="375" height="750" alt="모바일_내 찜 목록" src="https://github.com/user-attachments/assets/10572d69-7847-4cc6-8f5f-73379ddb9fe9" />
</div>

## 📱 모바일_마이페이지 (관리자)
<div align="center">
  <img width="375" height="751" alt="모바일_관리자 대시보드" src="https://github.com/user-attachments/assets/210f3b2a-462e-4bc2-9290-81f4dd62224a" />
  <img width="374" height="752" alt="모바일_신고목록" src="https://github.com/user-attachments/assets/6ca0eceb-d333-40a3-abcc-5a7b7a0e5293" />
</div>

## DB
### ERD
<img width="822" height="1090" alt="ERD" src="https://github.com/user-attachments/assets/303956e7-6536-4b91-baf6-ff80b2a8a4e0" />

## 개선점
1. 모바일 환경의 다양성
2. 배포 환경 구축 및 배포

# BottomNav

## 모바일 반응형 하단 고정 탭 바

- **모바일 전용 네비게이션**: 화면 너비가 768px 미만일 때만 화면 하단에 고정(`position: fixed; left: 0; bottom: 0;`)되어 나타납니다.
- **안전 영역(Safe Area) 대응**: 아이폰 등의 하단 홈 바 영역을 침범하지 않도록 `env(safe-area-inset-bottom)`가 적용되어 있습니다.
- **상태 변경**: 사이드바와 동일하게 `activeTab` 상태를 변경하여 피드 및 마이페이지 화면 전환을 수행합니다.
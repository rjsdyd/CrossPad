import './SkeletonCard.css';

// 검색 결과 카드의 모양을 그대로 흉내 낸 스켈레톤
function SkeletonCard() {
  return (
    <div className="search-result-card" style={{ cursor: 'default', pointerEvents: 'none' }}>
      {/* 1. 게임 커버 이미지 뼈대 */}
      <div className="skeleton-box skeleton-cover"></div>
      
      {/* 2. 게임 정보 뼈대 */}
      <div className="search-result-info" style={{ width: '100%' }}>
        <div className="skeleton-box skeleton-title"></div>
        <div className="skeleton-box skeleton-rating"></div>
        <div className="skeleton-box skeleton-summary"></div>
        <div className="skeleton-box skeleton-summary-short"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
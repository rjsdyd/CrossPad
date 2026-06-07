import { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, AlertCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import ReportModal from './ReportModal';
import './ReviewSection.css';

function ReviewSection({ gameId, currentMember }) {
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0); // 💡 요청하신 0점 시작 기본값
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState(null);
  const activeMember = currentMember;

  // 1. 리뷰 목록 불러오기 (GET)
  const fetchReviews = () => {
    if (!gameId) return;
    fetch(`http://localhost:8080/api/reviews/game/${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("❌ 리뷰 로딩 실패:", err));
  };

  useEffect(() => {
    fetchReviews();
  }, [gameId]);

  // 💡 평균 평점 계산 로직
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // 💡 내가 작성한 리뷰와 나머지 리뷰를 분리
  const otherReviews = activeMember
    ? reviews.filter((r) => r.memberId !== activeMember.id)
    : reviews;

  // 💡 3개씩 끊어서 보여주기 위한 페이지네이션 로직
  const REVIEWS_PER_PAGE = 3;
  const totalPages = Math.ceil(otherReviews.length / REVIEWS_PER_PAGE);
  const currentReviews = otherReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [otherReviews.length, currentPage, totalPages]);

  // 2. 현재 로그인한 멤버가 작성한 리뷰가 이미 존재치 않는지 필터링 (memberId 기준)
  const myExistingReview = activeMember
    ? reviews.find((r) => r.memberId === activeMember.id)
    : null;

  const isEditing = editingReviewId !== null;

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  // 3. 리뷰 등록 및 수정 핸들러 (POST / PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activeMember) {
      setErrorMsg('리뷰를 작성하려면 로그인이 필요합니다.');
      return;
    }
    if (rating === 0) {
      setErrorMsg('별점을 선택해주세요. (1점 이상 선택 가능)');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('리뷰 내용을 입력해주세요.');
      return;
    }
    if (content.length > 200) {
      setErrorMsg('리뷰는 200자 이내로 작성해주세요.');
      return;
    }

    try {
      let response;
      if (isEditing) {
        // 💡 백엔드 PUT 규격: /api/reviews/{reviewId}?memberId={memberId}
        response = await fetch(`http://localhost:8080/api/reviews/${editingReviewId}?memberId=${activeMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, rating }),
        });
      } else {
        // 💡 백엔드 POST 규격: ReviewRequest DTO 체제 매핑
        response = await fetch('http://localhost:8080/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameId,
            memberId: activeMember.id,
            nickname: activeMember.nickname || activeMember.name || activeMember.username || "익명멤버",
            content,
            rating,
          }),
        });
      }

      if (response.ok) {
        setContent('');
        setRating(0); // 등록 혹은 수정 완료 시 0점으로 초기화
        setEditingReviewId(null);
        setErrorMsg('');
        setCurrentPage(1); // 💡 새 리뷰를 등록하면 가장 최신인 1페이지로 자동 이동
        fetchReviews(); // 목록 리로드
      } else {
        const errMsg = await response.text();
        setErrorMsg(errMsg || '요청 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setErrorMsg('서버와 통신 중 문제가 발생했습니다.');
    }
  };

  // 4. 리뷰 삭제 핸들러 (DELETE)
  const handleDelete = async (reviewId) => {
    if (!activeMember) return;
    if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;

    try {
      // 💡 백엔드 DELETE 규격: /api/reviews/{reviewId}?memberId={memberId}
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}?memberId=${activeMember.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchReviews();
        if (editingReviewId === reviewId) resetForm();
      } else {
        const errMsg = await response.text();
        alert(errMsg || '삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error("❌ 삭제 통신 실패:", err);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setContent(review.content);
    setRating(review.rating);
    setErrorMsg('');
  };

  const resetForm = () => {
    setEditingReviewId(null);
    setContent('');
    setRating(0);
    setErrorMsg('');
  };

  const handleOpenReport = (reviewId) => {
    setReportingReviewId(reviewId);
    setIsReportModalOpen(true);
  };

  return (
    <div className="review-section-wrapper">
      <h2 className="review-title">유저 리뷰 (평균 평점: ⭐ {averageRating})</h2>

      <div className="review-split-layout">
        {/* ⬅️ 왼쪽 패널: 고정형 입력/수정 창 또는 이미 작성함 가드 패널 */}
        <div className="review-left-panel">
          {myExistingReview && !isEditing ? (
            <div className="already-reviewed-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <AlertCircle size={20} color="#a78bfa" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>내가 작성한 리뷰</h3>
              </div>
              
              <div className="review-card my-review" style={{ marginBottom: '16px', border: 'none', padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div className="review-card-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {myExistingReview.nickname ? myExistingReview.nickname.charAt(0) : '?'}
                    </div>
                    <span className="reviewer-name">{myExistingReview.nickname || '익명멤버'}</span>
                  </div>
                  <div className="review-stars">
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span>{myExistingReview.rating}</span>
                  </div>
                </div>
                <p className="review-content">{myExistingReview.content}</p>
                <div className="review-card-footer">
                  <span className="review-date">
                    {myExistingReview.createdAt ? new Date(myExistingReview.createdAt).toLocaleDateString() : ''}
                  </span>
                  <div className="review-actions">
                    <button onClick={() => handleDelete(myExistingReview.id)} title="삭제" className="delete-btn">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <button className="edit-my-review-btn" onClick={() => handleEditClick(myExistingReview)}>
                내 리뷰 수정하기
              </button>
            </div>
          ) : (
            <form className="review-form-card" onSubmit={handleSubmit}>
              <h3>{isEditing ? '리뷰 수정하기' : '이 게임 어떠셨나요?'}</h3>

              {/* 별점 인풋 구역 */}
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={`star-icon-btn ${star <= rating ? 'active' : ''}`}
                    onClick={() => handleStarClick(star)}
                    fill={star <= rating ? "#fbbf24" : "none"}
                  />
                ))}
                <span className="rating-number-display">
                  {rating === 0 ? '선택' : `${rating}점`}
                </span>
              </div>

              {/* 200자 바인딩 텍스트 필드 구역 */}
              <div className="textarea-wrapper">
                <textarea
                  className="review-textarea"
                placeholder={activeMember ? "게임에 대한 솔직한 평가를 남겨주세요. (최대 200자)" : "로그인 후 리뷰를 작성할 수 있습니다."}
                  value={content}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setContent(e.target.value);
                    }
                  }}
                  rows={5}
                  maxLength={200}
                disabled={!activeMember}
                />
                <div className="char-count">{content.length}/200</div>
              </div>

              {errorMsg && <div className="review-error-msg">{errorMsg}</div>}

              <div className="form-action-btns">
                {isEditing && (
                  <button type="button" className="review-cancel-btn" onClick={resetForm}>
                    취소
                  </button>
                )}
                <button type="submit" className="review-submit-btn" disabled={!activeMember}>
                  {isEditing ? '수정 완료' : '리뷰 등록'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ➡️ 오른쪽 패널: 무제한 스트리밍 리뷰 카드 리스트 리포지토리 */}
        <div className="review-right-panel">
          <div className="reviews-board-card">
            {otherReviews.length === 0 ? (
              <div className="no-reviews-msg">아직 작성된 다른 유저의 리뷰가 없습니다!</div>
            ) : (
              <>
                <div className="review-list">
                  {currentReviews.map((review) => (
                    <div
                      key={review.id}
                    className={`review-card ${activeMember && review.memberId === activeMember.id ? 'my-review' : ''}`}
                    >
                  <div className="review-card-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.nickname ? review.nickname.charAt(0) : '?'}
                      </div>
                      <span className="reviewer-name">{review.nickname || '익명멤버'}</span>
                      {activeMember && review.memberId === activeMember.id && (
                        <span className="my-badge">내가 쓴 글</span>
                      )}
                    </div>
                    <div className="review-stars">
                      <Star size={14} fill="#fbbf24" color="#fbbf24" />
                      <span>{review.rating}</span>
                    </div>
                  </div>

                  <p className="review-content">{review.content}</p>

                  <div className="review-card-footer">
                    <span className="review-date">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                    </span>

                    <div className="review-actions">
                      {activeMember && review.memberId === activeMember.id ? (
                        <>
                          <button onClick={() => handleEditClick(review)} title="수정">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(review.id)} title="삭제" className="delete-btn">
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        /* 로그인된 상태이고, 본인 글이 아니며, 일반 유저일 경우에만 신고 버튼 노출 */
                        activeMember && activeMember.role === 'ROLE_USER' && (
                          <button onClick={() => handleOpenReport(review.id)} title="신고하기" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                            <AlertTriangle size={14} /> 신고
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지 이동 버튼 영역 */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button className="page-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  <ChevronLeft size={20} />
                </button>
                <span className="page-info">{currentPage} / {totalPages}</span>
                <button className="page-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
          )}
        </div>
      </div>
    </div>

      {/* 💡 신고하기 모달 컴포넌트 렌더링 */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        reviewId={reportingReviewId}
        reporterId={activeMember?.id}
      />
    </div>
  );
}

export default ReviewSection;
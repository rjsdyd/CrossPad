import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';
import './BookmarkPage.css';

function BookmarkPage({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      // 백엔드에서 찜한 시간 순서대로 데이터를 가져옴 (최신순)
      const response = await axios.get(`http://localhost:8080/api/bookmarks/member/${user.id}`);
      setBookmarks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("찜 목록을 불러오는데 실패했습니다.", error);
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (gameId) => {
    try {
      // 찜 취소 통신
      await axios.post('http://localhost:8080/api/bookmarks/toggle', {
        memberId: user.id,
        gameId: gameId
      });
      
      // 🌟 수정됨: 화면에서 지울 때도 에러 안 나게 안전하게 게임 ID 추출
      setBookmarks(prev => prev.filter(item => {
        const g = item.game ? item.game : item;
        return g.id !== gameId;
      }));
      alert("💔 찜 목록에서 삭제되었습니다.");
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  if (!user) return <div className="fallback">로그인이 필요합니다.</div>;
  if (loading) return <div className="fallback">목록을 불러오는 중... 🎮</div>;

  return (
    <div className="bookmark-page">
      <h1 className="page-title">내 찜 목록 ❤️</h1>
      
      {bookmarks.length === 0 ? (
        <div className="empty-state">아직 찜한 게임이 없습니다. 마음에 드는 게임에 하트를 눌러보세요!</div>
      ) : (
        <div className="bookmark-list">
          {bookmarks.map((item, index) => {
            // 🌟 수정됨: 백엔드에서 북마크 객체를 주든, 게임 객체를 통째로 주든 다 호환되도록 처리!
            const game = item.game ? item.game : item; 
            
            // 🌟 수정됨: 리액트 key 중복 에러를 막기 위한 안전한 고유 키 생성
            const uniqueKey = game.id ? `bookmark-${game.id}-${index}` : `bookmark-${index}`;

            return (
              <div key={uniqueKey} className="bookmark-list-item">
                {/* 1. 포스터 */}
                <img 
                  src={game.coverUrl ? game.coverUrl.replace('t_thumb', 't_cover_big') : 'https://via.placeholder.com/100x140'} 
                  alt={game.title || '제목 없음'} 
                  className="list-poster"
                />
                
                {/* 2. 게임 정보 (이름, 별점, 플랫폼) */}
                <div className="list-info">
                  <h2 className="list-title">{game.title || '알 수 없는 게임'}</h2>
                  <div className="list-meta">
                    <span className="list-rating">⭐ {game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
                    <span className="list-platform">{game.platform || '플랫폼 미상'}</span>
                  </div>
                </div>

                {/* 3. 기능하는 찜 아이콘 */}
                <button 
                  className="list-heart-btn" 
                  onClick={() => handleToggleFavorite(game.id)}
                  title="찜 취소하기"
                >
                  <Heart size={28} fill="#ef4444" color="#ef4444" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookmarkPage;
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';
import GameDetail from './GameDetail';
import './BookmarkPage.css';

function BookmarkPage({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (!selectedGameId) {
      const savedPos = sessionStorage.getItem('scroll_BookmarkPage');
      if (savedPos) {
        setTimeout(() => window.scrollTo(0, parseInt(savedPos, 10)), 10);
        sessionStorage.removeItem('scroll_BookmarkPage');
      }
    }
  }, [selectedGameId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (user && user.id) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
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
      await axios.post('http://localhost:8080/api/bookmarks/toggle', {
        memberId: user.id,
        gameId: gameId
      });
      
      setBookmarks(prev => prev.filter(item => {
        const g = item.game ? item.game : item;
        return g.id !== gameId;
      }));
      showToast("💔 찜 목록에서 삭제되었습니다.");
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  if (!user) return <div className="fallback">로그인이 필요합니다.</div>;
  if (loading) return <div className="fallback">목록을 불러오는 중... 🎮</div>;

  const filteredBookmarks = bookmarks.filter(item => {
    if (filter === 'ALL') return true;
    const game = item.game ? item.game : item;
    const platform = (game.platform || '').toLowerCase();
    
    if (filter === 'NINTENDO') return platform.includes('nintendo');
    if (filter === 'PLAYSTATION') return platform.includes('playstation') || platform.includes('ps');
    return true;
  });

  if (selectedGameId) {
    return <GameDetail gameId={selectedGameId} setSelectedGameId={setSelectedGameId} />;
  }

  return (
    <div className="bookmark-page">
      <h1 className="page-title">내 찜 목록</h1>
      
      <div className="bookmark-filters">
        <button 
          className={`filter-btn ${filter === 'ALL' ? 'active-all' : ''}`} 
          onClick={() => setFilter('ALL')}
        >
          전체
        </button>
        <button 
          className={`filter-btn ${filter === 'NINTENDO' ? 'active-nintendo' : ''}`} 
          onClick={() => setFilter('NINTENDO')}
        >
          닌텐도 스위치
        </button>
        <button 
          className={`filter-btn ${filter === 'PLAYSTATION' ? 'active-playstation' : ''}`} 
          onClick={() => setFilter('PLAYSTATION')}
        >
          플레이스테이션
        </button>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="empty-state">
          {bookmarks.length === 0 
            ? '아직 찜한 게임이 없습니다. 마음에 드는 게임에 하트를 눌러보세요!' 
            : '해당 플랫폼에 찜한 게임이 없습니다.'}
        </div>
      ) : (
        <div className="bookmark-list">
          {filteredBookmarks.map((item, index) => {
            const game = item.game ? item.game : item; 
            
            const uniqueKey = game.id ? `bookmark-${game.id}-${index}` : `bookmark-${index}`;

            const platformLower = (game.platform || '').toLowerCase();
            let platformName = game.platform || '플랫폼 미상';
            let platformClass = '';
            
            if (platformLower.includes('nintendo')) {
              platformName = '닌텐도 스위치';
              platformClass = 'badge-nintendo';
            } else if (platformLower.includes('playstation') || platformLower.includes('ps')) {
              platformName = '플레이스테이션';
              platformClass = 'badge-playstation';
            }

            return (
              <div 
                key={uniqueKey} 
                className="bookmark-list-item"
                onClick={() => {
                  sessionStorage.setItem('scroll_BookmarkPage', window.scrollY);
                  setSelectedGameId(game.id);
                }}
              >
                <img 
                  src={game.coverUrl ? game.coverUrl.replace('t_thumb', 't_cover_big') : 'https://via.placeholder.com/100x140'} 
                  alt={game.title || '제목 없음'} 
                  className="list-poster"
                />
                
                <div className="list-info">
                  <h2 className="list-title">{game.title || '알 수 없는 게임'}</h2>
                  <div className="list-meta">
                    <span className="list-rating">⭐ {game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
                    <span className={`list-platform ${platformClass}`}>{platformName}</span>
                  </div>
                </div>

                <button 
                  className="list-heart-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(game.id);
                  }}
                  title="찜 취소하기"
                >
                  <Heart size={28} fill="#ef4444" color="#ef4444" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {toastMessage && (
        <>
          <style>
            {`
              @keyframes toastSlideInOut {
                0% { opacity: 0; transform: translateY(20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(20px); }
              }
            `}
          </style>
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          color: '#f3f4f6',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          fontSize: '16px',
            fontWeight: '600',
            animation: 'toastSlideInOut 3s ease-in-out forwards'
        }}>
          {toastMessage}
        </div>
        </>
      )}
    </div>
  );
}

export default BookmarkPage;
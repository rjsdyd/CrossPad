import { useEffect, useState } from 'react';
import axios from 'axios';
import GameDetail from './GameDetail';
import './MainFeed.css';

function MainFeed({ activeTab }) {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedGameId) {
      const savedPos = sessionStorage.getItem('scroll_MainFeed');
      if (savedPos) {
        setTimeout(() => window.scrollTo(0, parseInt(savedPos, 10)), 10);
        sessionStorage.removeItem('scroll_MainFeed');
      }
    }
  }, [selectedGameId]);

  useEffect(() => {
    setSelectedGameId(null);
    setLoading(true);

    axios.get(`http://localhost:8080/api/games?platform=${activeTab}`)
      .then(response => {
        setGames(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("데이터 가져오기 실패:", error);
        setLoading(false);
      });
  }, [activeTab]);

  if (selectedGameId) {
    return <GameDetail gameId={selectedGameId} setSelectedGameId={setSelectedGameId} />;
  }

  return (
    <div className="feed-container">
      
      <h1 className="feed-title">
        {activeTab === 'NINTENDO' ? (
          <span className="text-nintendo">닌텐도 스위치</span>
        ) : (
          <span className="text-playstation">플레이스테이션</span>
        )}
      </h1>

      {loading ? (
        <div style={{ padding: '100px 0', textAlign: 'center', color: '#9ca3af', fontSize: '18px' }}>
          데이터를 불러오는 중입니다... 🎮
        </div>
      ) : (
        <div className="game-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card" onClick={() => {
              sessionStorage.setItem('scroll_MainFeed', window.scrollY);
              setSelectedGameId(game.id);
            }} style={{ cursor: 'pointer' }}>
              
              <div className="game-image-wrapper">
                <div className="game-image-overlay"></div>
                <img 
                  src={game.coverUrl ? game.coverUrl.replace('t_thumb', 't_cover_big') : 'https://via.placeholder.com/300x400?text=No+Image'}
                  alt={game.title} 
                  loading="lazy"
                />
              </div>
              
              <div className="game-info">
                <h2 className="game-title" title={game.title}>
                  {game.title}
                </h2>
                <div className="game-meta">
                  <span className={`platform-badge ${game.platform === 'NINTENDO' ? 'badge-nintendo' : 'badge-playstation'}`}>
                    {game.platform === 'NINTENDO' ? '닌텐도 스위치' : game.platform === 'PLAYSTATION' ? '플레이스테이션' : game.platform}
                  </span>
                  <p className="game-rating">
                    ⭐ {game.rating ? Math.round(game.rating) : 'N/A'}
                  </p>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

export default MainFeed;
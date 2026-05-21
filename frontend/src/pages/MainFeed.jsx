import { useEffect, useState } from 'react'
import axios from 'axios'
import GameDetail from './GameDetail'
import './MainFeed.css'

function MainFeed({ activeTab }) {
  const [games, setGames] = useState([])
  const [selectedGameId, setSelectedGameId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 탭(플랫폼)이 변경되면 선택된 게임 상태를 초기화하여 목록 화면으로 돌아옵니다.
    setSelectedGameId(null)
    setLoading(true) // 데이터 호출 시작 시 이전 카드를 비우고 로딩 상태 켜기

    axios.get(`http://localhost:8080/api/games?platform=${activeTab}`)
      .then(response => {
        setGames(response.data)
        setLoading(false) // 호출 완료 시 로딩 끄기
      })
      .catch(error => {
        console.error("데이터 가져오기 실패:", error)
        setLoading(false)
      })
  }, [activeTab])

  if (selectedGameId) {
    return <GameDetail gameId={selectedGameId} setSelectedGameId={setSelectedGameId} />
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
            <div key={game.id} className="game-card" onClick={() => setSelectedGameId(game.id)} style={{ cursor: 'pointer' }}>
              
              <div className="game-image-wrapper">
                <div className="game-image-overlay"></div>
                <img 
                  src={game.coverUrl ? game.coverUrl.replace('t_thumb', 't_cover_big') : 'https://via.placeholder.com/300x400?text=No+Image'} 
                  alt={game.title} 
                  loading="lazy" /* 💡 브라우저 과부하 방지: 화면에 보일 때만 이미지를 로딩합니다 */
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
  )
}

export default MainFeed
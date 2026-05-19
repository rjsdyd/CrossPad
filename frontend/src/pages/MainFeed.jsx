import { useEffect, useState } from 'react'
import axios from 'axios'
import './MainFeed.css'

function MainFeed({ activeTab }) {
  const [games, setGames] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:8080/api/games?platform=${activeTab}`)
      .then(response => setGames(response.data))
      .catch(error => console.error("데이터 가져오기 실패:", error))
  }, [activeTab])

  return (
    <div className="feed-container">
      
      <h1 className="feed-title">
        {activeTab === 'NINTENDO' ? (
          <><span className="text-nintendo">Nintendo</span> 명예의 전당</>
        ) : (
          <><span className="text-playstation">PlayStation</span> 명예의 전당</>
        )}
      </h1>

      <div className="game-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            
            <div className="game-image-wrapper">
              <div className="game-image-overlay"></div>
              <img 
                src={game.coverUrl ? game.coverUrl.replace('t_thumb', 't_cover_big') : 'https://via.placeholder.com/300x400?text=No+Image'} 
                alt={game.title} 
              />
            </div>
            
            <div className="game-info">
              <h2 className="game-title" title={game.title}>
                {game.title}
              </h2>
              <div className="game-meta">
                <span className={`platform-badge ${game.platform === 'NINTENDO' ? 'badge-nintendo' : 'badge-playstation'}`}>
                  {game.platform}
                </span>
                <p className="game-rating">
                  ⭐ {game.rating ? Math.round(game.rating) : 'N/A'}
                </p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default MainFeed
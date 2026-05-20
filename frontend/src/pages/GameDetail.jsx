import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, Star, X, ChevronLeft, ChevronRight } from 'lucide-react'
import './GameDetail.css'

function GameDetail({ gameId, setSelectedGameId }) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)

  useEffect(() => {
    // 백엔드로부터 특정 게임의 상세 정보 수신
    axios.get(`http://localhost:8080/api/games/${gameId}`)
      .then(response => {
        setGame(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("상세페이지 로딩 에러 원인:", error) // 💡 error 변수를 사용함!
        alert("게임 정보를 불러오는데 실패했습니다.")
        setSelectedGameId(null)
      })
  }, [gameId])

  if (loading) return <div style={{color: 'white', padding: '40px', textLight: 'center'}}>로딩 중...</div>

  return (
    <div className="detail-container">
      {/* 뒤로가기 버튼 누르면 ID를 null로 만들어 리스트로 돌아감 */}
      <button className="back-btn" onClick={() => setSelectedGameId(null)}>
        <ArrowLeft size={20} /> 목록으로 돌아가기
      </button>

      <div className="detail-content">
        <img 
          src={game.coverUrl ? game.coverUrl.replace('t_thumb', 't_1080p') : "https://via.placeholder.com/300x400"} 
          alt={game.title} 
          className="detail-cover"
        />
        
        <div className="detail-info">
          <h1 className="detail-title">{game.title}</h1>
          
          <div className="detail-meta">
            <span className={`badge-platform ${game.platform === 'NINTENDO' ? 'role-admin' : 'role-user'}`}>
              {game.platform}
            </span>
            <div className="rating-zone">
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              {game.rating ? Math.round(game.rating) : '평점 없음'} / 100
            </div>
          </div>

          <hr style={{border: '0', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0 0 20px 0'}} />

          <p className="detail-summary">
            {game.summary || "등록된 상세 줄거리 정보가 없습니다."}
          </p>
        </div>
      </div>

      {/* 💡 미디어 (트레일러 & 스크린샷) 영역 */}
      <hr style={{border: '0', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '40px 0 20px 0'}} />
      
      <div className="media-section">
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>미디어 (트레일러 및 스크린샷)</h2>
        
        {/* 1. 트레일러 영상이 있을 경우 렌더링 */}
        {game.videoId && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '20px' }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px' }}
              src={`https://www.youtube.com/embed/${game.videoId}`}
              title="Game Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* 2. 스크린샷 이미지들이 있을 경우 렌더링 */}
        {game.screenshots && game.screenshots.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {game.screenshots.map((url, index) => (
              <img 
                key={index} 
                src={url.replace('t_thumb', 't_1080p')} 
                alt={`screenshot ${index + 1}`} 
                style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', aspectRatio: '16/9', cursor: 'pointer' }} 
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        )}
        
        {/* 3. 트레일러도 없고 스크린샷도 없을 경우 표시할 기본 화면 */}
        {!game.videoId && (!game.screenshots || game.screenshots.length === 0) && (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <p style={{ color: '#9ca3af', margin: 0 }}>등록된 미디어 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 💡 스크린샷 확대 모달 (라이트박스) */}
      {selectedImageIndex !== null && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* 닫기 버튼 */}
          <button 
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '8px' }}
            onClick={() => setSelectedImageIndex(null)}
            title="닫기"
          >
            <X size={36} />
          </button>

          {/* 이전 버튼 */}
          <button
            style={{ position: 'absolute', left: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '16px', borderRadius: '50%' }}
            onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : game.screenshots.length - 1)); }}
          >
            <ChevronLeft size={36} />
          </button>

          <img 
            src={game.screenshots[selectedImageIndex].replace('t_thumb', 't_1080p')} 
            alt="확대된 스크린샷" 
            style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '8px', objectFit: 'contain', cursor: 'default' }} 
            onClick={(e) => e.stopPropagation()}
          />

          {/* 다음 버튼 */}
          <button
            style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '16px', borderRadius: '50%' }}
            onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev < game.screenshots.length - 1 ? prev + 1 : 0)); }}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  )
}

export default GameDetail
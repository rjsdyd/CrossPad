import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { ArrowLeft, Star, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import './GameDetail.css'
import ReviewSection from '../components/ReviewSection';

function ExpandableSummary({ text }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const textRef = useRef(null)

  useEffect(() => {
    if (textRef.current) {
      setShowButton(textRef.current.scrollHeight > textRef.current.clientHeight)
    }
  }, [text])

  if (!text) return <p className="detail-summary">등록된 상세 줄거리 정보가 없습니다.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <p 
        ref={textRef}
        className="detail-summary"
        style={{
          display: isExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : 8,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: showButton ? '8px' : '0'
        }}
      >
        {text}
      </p>
      {showButton && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: 0,
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          {isExpanded ? '접기' : '...더보기'}
        </button>
      )}
    </div>
  )
}

function GameDetail({ gameId, setSelectedGameId, user }) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const toastTimer = useRef(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    axios.get(`http://localhost:8080/api/games/${gameId}`)
      .then(response => {
        setGame(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("상세페이지 로딩 에러 원인:", error)
        alert("게임 정보를 불러오는데 실패했습니다.")
        setSelectedGameId(null)
      })

    if (user && user.id) {
      axios.get(`http://localhost:8080/api/bookmarks/check?memberId=${user.id}&gameId=${gameId}`)
        .then(response => {
          setIsBookmarked(response.data)
        })
        .catch(error => console.error("북마크 상태 확인 실패:", error))
    } else {
      setIsBookmarked(false)
    }
  }, [gameId])

  const handleToggleBookmark = async (e) => {
    e.stopPropagation();

    if (!user || !user.id) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/bookmarks/toggle', {
        memberId: user.id,
        gameId: gameId
      });
      const msg = !isBookmarked ? "❤️ 찜하기에 성공하였습니다." : "💔 찜 목록에서 삭제되었습니다.";
      showToast(msg);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(error.response.data);
      } else {
        alert("북마크 처리 중 오류가 발생했습니다.");
      }
    }
  }

  if (loading) return <div style={{color: 'white', padding: '40px', textLight: 'center'}}>로딩 중...</div>

  return (
    <div className="detail-container">
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
          
          <div className="detail-meta" style={{ alignItems: 'center' }}>
            <span className={`badge-platform ${game.platform === 'NINTENDO' ? 'role-admin' : 'role-user'}`}>
              {game.platform === 'NINTENDO' ? '닌텐도 스위치' : game.platform === 'PLAYSTATION' ? '플레이스테이션' : game.platform}
            </span>
            <div className="rating-zone">
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              {game.rating ? Math.round(game.rating) : '평점 없음'} / 100
            </div>

            <button 
              onClick={handleToggleBookmark}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <Heart size={20} fill={isBookmarked ? "#ef4444" : "none"} color={isBookmarked ? "#ef4444" : "#ffffff"} />
            </button>
          </div>

          <hr style={{border: '0', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0 0 20px 0'}} />

          <ExpandableSummary text={game.summary} />
        </div>
      </div>

      <hr style={{border: '0', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '40px 0 20px 0'}} />

      {game.genre ? (
        <div className="genre-section">
          {game.genre.split(',').map((g, index) => (
            <span key={index} className="genre-badge">
              #{g.trim()}
            </span>
          ))}
        </div>
      ) : null}

      <ReviewSection 
        gameId={game.id} 
      currentMember={user} 
      />
      
      <div className="media-section">
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>미디어 (트레일러 및 스크린샷)</h2>
        
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
        
        {!game.videoId && (!game.screenshots || game.screenshots.length === 0) && (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <p style={{ color: '#9ca3af', margin: 0 }}>등록된 미디어 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {selectedImageIndex !== null && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
          onClick={() => setSelectedImageIndex(null)}
        >
          <button 
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '8px' }}
            onClick={() => setSelectedImageIndex(null)}
            title="닫기"
          >
            <X size={36} />
          </button>

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

          <button
            style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '16px', borderRadius: '50%' }}
            onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev < game.screenshots.length - 1 ? prev + 1 : 0)); }}
          >
            <ChevronRight size={36} />
          </button>
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
  )
}

export default GameDetail
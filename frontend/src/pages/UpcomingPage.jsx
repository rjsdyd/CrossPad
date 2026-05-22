import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpcomingPage.css';
import GameDetail from './GameDetail';

const UpcomingPage = () => {
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [filter, setFilter] = useState('NINTENDO'); // 💡 기본값을 닌텐도 스위치로 변경

    useEffect(() => {
        // 백엔드 출시 예정작 API 호출
        axios.get('http://localhost:8080/api/games/upcoming')
            .then(response => {
                setUpcomingGames(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ 출시 예정작 수집 중 에러 발생:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="upcoming-loading">
                <div className="spinner"></div>
                <p>📅 글로벌 신작 라인업 수집 및 DeepL 번역 세탁 중...</p>
            </div>
        );
    }

    // 💡 게임을 클릭했을 때 상세 페이지로 화면을 전환합니다.
    if (selectedGameId) {
        return <GameDetail gameId={selectedGameId} setSelectedGameId={setSelectedGameId} />;
    }

    // 💡 선택된 플랫폼 필터에 따라 리스트를 필터링합니다.
    const filteredGames = upcomingGames.filter(game => {
        return game.platform === filter;
    });

    return (
        <div className="upcoming-container">
            <h1 className="upcoming-title">출시 예정 신작</h1>

            {/* 💡 플랫폼 필터링 버튼 구역 (명예의 전당 버튼 스타일 클래스 재사용) */}
            <div className="ranking-filters" style={{ marginBottom: '30px' }}>
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

            <div className="upcoming-grid">
                {filteredGames.map((game) => (
                    <div key={game.id} className="upcoming-card" onClick={() => setSelectedGameId(game.id)} style={{ cursor: 'pointer' }}>
                        <div className="upcoming-cover-wrapper">
                            <img 
                                /* 💡 t_thumb(저화질)를 t_cover_big(고화질)로 교체하여 선명한 포스터 제공 */
                                src={game.coverUrl ? game.coverUrl.replace('t_thumb', 't_cover_big') : 'https://via.placeholder.com/150x200?text=No+Cover'} 
                                alt={game.title} 
                                className="upcoming-cover" 
                                loading="lazy"
                            />
                        </div>
                        <div className="upcoming-info">
                            <h2 className="upcoming-game-title" title={game.title}>{game.title}</h2>
                            <div className="upcoming-meta">
                                <span className={`upcoming-platform-badge ${game.platform === 'NINTENDO' ? 'badge-nintendo' : 'badge-playstation'}`}>
                                    {game.platform === 'NINTENDO' ? '닌텐도 스위치' : game.platform === 'PLAYSTATION' ? '플레이스테이션' : game.platform}
                                </span>
                            </div>
                            {/* 💡 가로로 넓어진 리스트 형태에 맞춰 게임 설명을 다시 보여줍니다 */}
                            <p className="upcoming-summary">{game.summary}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingPage;
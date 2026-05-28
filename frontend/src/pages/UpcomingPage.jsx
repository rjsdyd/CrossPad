import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GameDetail from './GameDetail';
import './UpcomingPage.css';

const UpcomingPage = () => {
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [filter, setFilter] = useState('NINTENDO');

    useEffect(() => {
        if (!selectedGameId) {
            const savedPos = sessionStorage.getItem('scroll_UpcomingPage');
            if (savedPos) {
                setTimeout(() => window.scrollTo(0, parseInt(savedPos, 10)), 10);
                sessionStorage.removeItem('scroll_UpcomingPage');
            }
        }
    }, [selectedGameId]);

    useEffect(() => {
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

    if (selectedGameId) {
        return <GameDetail gameId={selectedGameId} setSelectedGameId={setSelectedGameId} />;
    }

    const filteredGames = upcomingGames.filter(game => {
        return game.platform === filter;
    });

    return (
        <div className="upcoming-container">
            <h1 className="upcoming-title">출시 예정 신작</h1>

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
                    <div key={game.id} className="upcoming-card" onClick={() => {
                        sessionStorage.setItem('scroll_UpcomingPage', window.scrollY);
                        setSelectedGameId(game.id);
                    }} style={{ cursor: 'pointer' }}>
                        <div className="upcoming-cover-wrapper">
                            <img 
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
                            <p className="upcoming-summary">{game.summary}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingPage;
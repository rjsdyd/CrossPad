import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RankingPage.css';
import GameDetail from './GameDetail';

const RankingPage = () => {
    const [rankingGames, setRankingGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        // 백엔드 평점 랭킹 API 호출
        axios.get('http://localhost:8080/api/games/ranking')
            .then(response => {
                setRankingGames(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ 랭킹 데이터를 가져오는 중 에러 발생:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="ranking-loading">🏆 명예의 전당 랭킹 로딩 중...</div>;
    }

    if (selectedGameId) {
        return <GameDetail gameId={selectedGameId} setSelectedGameId={setSelectedGameId} />;
    }

    // 💡 선택된 플랫폼 필터에 따라 랭킹 리스트를 필터링합니다.
    const filteredGames = rankingGames.filter(game => {
        if (filter === 'ALL') return true;
        return game.platform === filter;
    });

    return (
        <div className="ranking-container">
            <h1 className="ranking-title">명예의 전당</h1>

            {/* 💡 플랫폼 필터링 버튼 구역 */}
            <div className="ranking-filters">
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

            <div className="ranking-board">
                <table className="ranking-table">
                    <thead>
                        <tr>
                            <th className="th-rank">순위</th>
                            <th className="th-cover">커버</th>
                            <th className="th-title">게임 제목</th>
                            <th className="th-platform">기종</th>
                            <th className="th-rating">평점</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGames.map((game, index) => (
                            <tr 
                                key={game.id} 
                                className="ranking-row"
                                onClick={() => setSelectedGameId(game.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* 순위 국룰 디자인 포인트 (1, 2, 3등 강조) */}
                                <td className={`td-rank rank-${index + 1}`}>
                                    {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : index + 1}
                                </td>
                                <td className="td-cover">
                                    <img 
                                        src={game.coverUrl} 
                                        alt={game.title} 
                                        className="rank-game-cover" 
                                        loading="lazy" /* 💡 렌더링 성능 최적화 및 딜레이 방지 */
                                    />
                                </td>
                                <td className="td-title">
                                    <div className="rank-game-title">{game.title}</div>
                                </td>
                                <td className="td-platform">
                                    <span className={`platform-badge ${game.platform.toLowerCase()}`}>
                                        {/* 💡 기종 영문을 한글로 변환하여 렌더링합니다. */}
                                        {game.platform === 'NINTENDO' ? '닌텐도 스위치' : game.platform === 'PLAYSTATION' ? '플레이스테이션' : game.platform}
                                    </span>
                                </td>
                                <td className="td-rating">
                                    <span className="rating-score">⭐ {game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingPage;
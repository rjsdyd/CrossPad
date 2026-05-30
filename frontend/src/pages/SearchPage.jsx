import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Flame, Target } from 'lucide-react';
import GameDetail from './GameDetail';
import './SearchPage.css';
import SkeletonCard from '../components/SkeletonCard'; // 🌟 스켈레톤 컴포넌트 불러오기

const SearchPage = ({ user }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);

  useEffect(() => {
    if (!selectedGameId) {
      const savedPos = sessionStorage.getItem('scroll_SearchPage');
      if (savedPos) {
        setTimeout(() => window.scrollTo(0, parseInt(savedPos, 10)), 10);
        sessionStorage.removeItem('scroll_SearchPage');
      }
    }
  }, [selectedGameId]);

  const famousSeries = [
    { name: '마리오', query: 'Mario', bg: 'linear-gradient(to right, #FF1626, #cc111e)' },
    { name: '젤다의 전설', query: 'Zelda', bg: 'linear-gradient(to right, #FF1626, #cc111e)' },
    { name: '포켓몬', query: 'Pokemon', bg: 'linear-gradient(to right, #FF1626, #cc111e)' },
    { name: 'GTA', query: 'Grand Theft Auto', bg: 'linear-gradient(to right, #0072FF, #0056cc)' },
    { name: '엘든링', query: 'Elden Ring', bg: 'linear-gradient(to right, #0072FF, #0056cc)' },
    { name: '사이버펑크', query: 'Cyberpunk', bg: 'linear-gradient(to right, #0072FF, #0056cc)' }
  ];

  const fetchRecentSearches = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/search/history');
      setRecentSearches(res.data);
    } catch (err) {
      console.error('최근 검색어 로드 실패', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchRecentSearches();
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/search/games?keyword=${searchQuery}`);
      setSearchResults(res.data);
      setKeyword(searchQuery);
      fetchRecentSearches();
    } catch (err) {
      console.error('게임 검색 실패', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(keyword);
    }
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8080/api/search/history/${id}`);
      fetchRecentSearches();
    } catch (err) {
      console.error('검색 기록 삭제 실패', err);
    }
  };

  if (selectedGameId) {
    return <GameDetail gameId={selectedGameId} setSelectedGameId={setSelectedGameId} user={user} />;
  }

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="게임 타이틀은 영어 본문으로 검색해주세요. (ex. Mario, Zelda)"
          className="search-input"
        />
        <button onClick={() => handleSearch(keyword)} className="search-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Search size={22} />
        </button>
      </div>

      {recentSearches.length > 0 && (
        <div className="recent-search-wrapper">
          <span className="recent-title">최근 검색어:</span>
          {recentSearches.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => handleSearch(item.keyword)}
              className="recent-chip"
            >
              <span>{item.keyword}</span>
              <button
                onClick={(e) => handleDeleteHistory(item.id, e)}
                className="delete-chip-btn"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="famous-wrapper">
        <div className="famous-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={18} color="#E5E7EB" />
          <span>크로스패드 명작 추천 태그</span>
        </div>
        <div className="famous-btn-group">
          {famousSeries.map((series, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(series.query)}
              className="famous-btn"
              style={{ background: series.bg }}
            >
              {series.name}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 4. 검색 결과 그리드 (스켈레톤 로딩 장착 완료) */}
      <div style={{ minHeight: '500px' }}>
        <div className="result-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={24} color="#E5E7EB" />
            검색 결과 {(!loading && searchResults.length > 0) && `(${searchResults.length})`}
          </span>
        </div>

        {/* 🌟 조건 1. 로딩 중일 때: 스켈레톤 카드 6개를 렌더링 */}
        {loading ? (
          <div className="result-grid">
            {Array(6).fill(0).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          /* 🌟 조건 2. 로딩 완료 및 결과가 있을 때: 진짜 게임 데이터 렌더링 */
          <div className="result-grid">
            {searchResults.map((game) => (
              <div 
                key={game.id} 
                className="search-result-card" 
                onClick={() => {
                  sessionStorage.setItem('scroll_SearchPage', window.scrollY);
                  setSelectedGameId(game.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={game.coverUrl ? game.coverUrl.replace('t_thumb', 't_cover_big') : 'https://via.placeholder.com/90x120'}
                  alt={game.title}
                  className="search-result-cover"
                />
                <div className="search-result-info">
                  <h4 className="search-result-title">{game.title}</h4>
                  <div className="search-result-rating">⭐ 평점: {game.rating ? game.rating.toFixed(1) : '무'}</div>
                  <p className="search-result-summary">{game.summary}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 🌟 조건 3. 로딩 완료 및 결과가 없을 때 */
          keyword && <div className="status-msg">검색 조건에 매칭되는 명작 게임이 데이터베이스에 없습니다. 영문 타이틀을 다시 확인해 보세요!</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
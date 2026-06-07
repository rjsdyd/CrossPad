import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MainFeed from './pages/MainFeed';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import MyPage from './pages/MyPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SearchPage from './pages/SearchPage';
import RankingPage from './pages/RankingPage';
import UpcomingPage from './pages/UpcomingPage';
import BookmarkPage from './pages/BookmarkPage';
import ReportListPage from './pages/admin/ReportListPage';

import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('crosspad_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [activeTab, setActiveTab] = useState('NINTENDO');
  const navigate = useNavigate();
  const location = useLocation();

  // 💡 사용자가 사이드바/하단 탭을 눌러 탭을 바꿨을 때, URL이 관리자 페이지면 루트 경로로 복귀시킴
  useEffect(() => {
    if (activeTab !== 'ADMIN' && location.pathname.startsWith('/admin')) {
      navigate('/');
    }
  }, [activeTab, location.pathname, navigate]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('crosspad_user', JSON.stringify(userData));
    setActiveTab('NINTENDO');
    navigate('/'); // 로그인 시 혹시라도 이전 경로에 갇혀있지 않도록 이동
    alert(`${userData.nickname}님, 환영합니다!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('member'); 
    localStorage.removeItem('user');
    localStorage.removeItem('crosspad_user');

    setActiveTab('NINTENDO');
    navigate('/'); // 로그아웃 시 탭 이동과 함께 경로 초기화
    alert("로그아웃 되었습니다.");
  };

  const renderContent = () => {
    if (activeTab === 'SIGNUP') return <Signup setActiveTab={setActiveTab} />;
    if (activeTab === 'LOGIN') return <Login setActiveTab={setActiveTab} onLoginSuccess={handleLoginSuccess} />;
    if (activeTab === 'MYPAGE') return <MyPage user={user} handleLogout={handleLogout} setActiveTab={setActiveTab} />;
    if (activeTab === 'ADMIN') return <AdminDashboard user={user} />;
    if (activeTab === 'SEARCH') return <SearchPage user={user} />;
    if (activeTab === 'RANKING') return <RankingPage user={user} />;
    if (activeTab === 'UPCOMING') return <UpcomingPage user={user} />;
    if (activeTab === 'BOOKMARKS') return <BookmarkPage user={user} />;
    
    if (activeTab === 'TERMS') return <TermsOfService />;
    if (activeTab === 'PRIVACY') return <PrivacyPolicy />;
    
    return <MainFeed activeTab={activeTab} user={user} />;
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <main className="main-content">
        <Routes>
          {/* 관리자 대시보드 및 신고 목록 라우팅 */}
          <Route path="/admin" element={<AdminDashboard user={user} />} />
          <Route path="/admin/reports" element={<ReportListPage />} />
          {/* 기존 activeTab 기반 렌더링 유지 (기본값) */}
          <Route path="*" element={renderContent()} />
        </Routes>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
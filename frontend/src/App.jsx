import { useState } from 'react'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import MainFeed from './pages/MainFeed'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import MyPage from './pages/MyPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import SearchPage from './pages/SearchPage'
import RankingPage from './pages/RankingPage'
import UpcomingPage from './pages/UpcomingPage'
import BookmarkPage from './pages/BookmarkPage' // 🌟 찜목록 페이지 연결 완료!
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('crosspad_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  
  const [activeTab, setActiveTab] = useState('NINTENDO')

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    localStorage.setItem('crosspad_user', JSON.stringify(userData))
    setActiveTab('NINTENDO')
    alert(`${userData.nickname}님, 환영합니다!`)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('crosspad_user')
    setActiveTab('NINTENDO')
    alert("로그아웃 되었습니다.")
  }

  const renderContent = () => {
    if (activeTab === 'SIGNUP') return <Signup setActiveTab={setActiveTab} />
    if (activeTab === 'LOGIN') return <Login setActiveTab={setActiveTab} onLoginSuccess={handleLoginSuccess} />
    if (activeTab === 'MYPAGE') return <MyPage user={user} handleLogout={handleLogout} setActiveTab={setActiveTab} />
    if (activeTab === 'ADMIN') return <AdminDashboard user={user} />
    if (activeTab === 'SEARCH') return <SearchPage />
    if (activeTab === 'RANKING') return <RankingPage />
    if (activeTab === 'UPCOMING') return <UpcomingPage />
    
    // 🌟 마이페이지에서 날린 'BOOKMARKS' 신호를 여기서 캐치해서 화면을 띄워줍니다!
    if (activeTab === 'BOOKMARKS') return <BookmarkPage user={user} />
    
    return <MainFeed activeTab={activeTab} user={user} />
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <main className="main-content">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
    </div>
  )
}

export default App
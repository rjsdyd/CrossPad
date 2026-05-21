import { useState } from 'react'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import MainFeed from './pages/MainFeed'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import MyPage from './pages/auth/MyPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import SearchPage from './pages/SearchPage' // 💡 SearchPage 파일의 실제 경로에 맞게 매핑되어 있는지 확인해 주세요!
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
    
    // 🌟 탭 상태가 'SEARCH'일 때 분리형 CSS가 내장된 검색 페이지 컴포넌트를 띄워줍니다.
    if (activeTab === 'SEARCH') return <SearchPage />
    
    return <MainFeed activeTab={activeTab} />
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
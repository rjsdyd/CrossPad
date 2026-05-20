import { useState } from 'react'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import MainFeed from './pages/MainFeed'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import MyPage from './pages/auth/MyPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import './App.css'

function App() {
  // 💡 [수정] 앱이 켜질 때(새로고침 포함) 로컬 스토리지에 저장된 유저 정보가 있는지 먼저 확인합니다.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('crosspad_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  
  const [activeTab, setActiveTab] = useState('NINTENDO')

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    // 💡 [추가] 로그인 성공 시 브라우저 창고(localStorage)에 유저 정보를 문자열로 저장!
    localStorage.setItem('crosspad_user', JSON.stringify(userData))
    
    setActiveTab('NINTENDO')
    alert(`${userData.nickname}님, 환영합니다!`)
  }

  const handleLogout = () => {
    setUser(null)
    // 💡 [추가] 로그아웃 시 브라우저 창고도 깨끗하게 비워줍니다.
    localStorage.removeItem('crosspad_user')
    
    setActiveTab('NINTENDO')
    alert("로그아웃 되었습니다.")
  }

  const renderContent = () => {
    if (activeTab === 'SIGNUP') return <Signup setActiveTab={setActiveTab} />
    if (activeTab === 'LOGIN') return <Login setActiveTab={setActiveTab} onLoginSuccess={handleLoginSuccess} />
    if (activeTab === 'MYPAGE') return <MyPage user={user} handleLogout={handleLogout} setActiveTab={setActiveTab} />
    if (activeTab === 'ADMIN') return <AdminDashboard user={user} />
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
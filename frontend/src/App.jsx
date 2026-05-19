import { useState } from 'react'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import MainFeed from './pages/MainFeed'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import MyPage from './pages/auth/MyPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('NINTENDO')
  
  const [user, setUser] = useState(null)

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setActiveTab('MYPAGE')
  }

  const handleLogout = () => {
    setUser(null)
    setActiveTab('NINTENDO')
    alert("로그아웃 되었습니다.")
  }

  const renderContent = () => {
    if (activeTab === 'SIGNUP') {
      return <Signup setActiveTab={setActiveTab} />
    }
    if (activeTab === 'LOGIN') {
      return <Login setActiveTab={setActiveTab} onLoginSuccess={handleLoginSuccess} />
    }
    if (activeTab === 'MYPAGE') {
      return <MyPage user={user} handleLogout={handleLogout} />
    }
    return <MainFeed activeTab={activeTab} />
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <main className="main-content">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  )
}

export default App
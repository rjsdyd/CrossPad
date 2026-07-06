import './BottomNav.css'
import { Gamepad2, Monitor, Search, User } from 'lucide-react'

// 🌟 수정 1: user 정보를 Props로 받아옵니다.
function BottomNav({ activeTab, setActiveTab, user }) {
  return (
    <nav className="mobile-tab-bar">
      <button 
        onClick={() => setActiveTab('NINTENDO')} 
        className={`tab-btn ${activeTab === 'NINTENDO' ? 'active-nintendo' : ''}`}>
        <Gamepad2 size={24} />
        <span className="tab-text">닌텐도</span>
      </button>
      
      <button 
        onClick={() => setActiveTab('PLAYSTATION')} 
        className={`tab-btn ${activeTab === 'PLAYSTATION' ? 'active-ps' : ''}`}>
        <Monitor size={24} />
        <span className="tab-text">플스</span>
      </button>
      
      {/* 🌟 수정 2: 검색 버튼에 onClick 이벤트를 연결했습니다! */}
      <button 
        onClick={() => setActiveTab('SEARCH')}
        className={`tab-btn ${activeTab === 'SEARCH' ? 'active-search' : ''}`}>
        <Search size={24} />
        <span className="tab-text">검색</span>
      </button>
      
      {/* 🌟 수정 3: user가 있으면 MYPAGE로, 없으면 LOGIN으로 이동합니다! */}
      <button 
        onClick={() => setActiveTab(user ? 'MYPAGE' : 'LOGIN')}
        className={`tab-btn ${['LOGIN', 'SIGNUP', 'MYPAGE'].includes(activeTab) ? 'active-mypage' : ''}`}>
        <User size={24} />
        <span className="tab-text">마이페이지</span>
      </button>
    </nav>
  )
}

export default BottomNav
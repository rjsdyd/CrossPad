import './BottomNav.css'
import { Gamepad2, Monitor, Search, User } from 'lucide-react'

function BottomNav({ activeTab, setActiveTab }) {
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
      
      <button className="tab-btn">
        <Search size={24} />
        <span className="tab-text">검색</span>
      </button>
      
      <button 
        onClick={() => setActiveTab('LOGIN')}
        className={`tab-btn ${['LOGIN', 'SIGNUP'].includes(activeTab) ? 'active-mypage' : ''}`}>
        <User size={24} />
        <span className="tab-text">마이페이지</span>
      </button>
    </nav>
  )
}

export default BottomNav
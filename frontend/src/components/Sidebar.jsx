import { useState } from 'react'
import { Gamepad2, Monitor, Calendar, Search, Menu, User } from 'lucide-react'

function Sidebar({ activeTab, setActiveTab, user }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="menu-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={24} />
        </button>
        {isOpen && (
          <h1 className="sidebar-title" onClick={() => setActiveTab('NINTENDO')} style={{cursor:'pointer'}}>CrossPad</h1>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <button 
          onClick={() => setActiveTab('NINTENDO')} 
          className={`nav-btn ${activeTab === 'NINTENDO' ? 'nav-btn-nintendo' : 'nav-btn-inactive'}`}
          title="닌텐도 스위치">
          <Gamepad2 size={24} style={{ minWidth: '24px' }} /> {isOpen && <span>닌텐도 스위치</span>}
        </button>
        
        <button 
          onClick={() => setActiveTab('PLAYSTATION')} 
          className={`nav-btn ${activeTab === 'PLAYSTATION' ? 'nav-btn-playstation' : 'nav-btn-inactive'}`}
          title="플레이스테이션">
          <Monitor size={24} style={{ minWidth: '24px' }} /> {isOpen && <span>플레이스테이션</span>}
        </button>
        
        <button 
          onClick={() => setActiveTab('UPCOMING')}
          className={`nav-btn ${activeTab === 'UPCOMING' ? 'nav-btn-upcoming' : 'nav-btn-inactive'}`}
          title="출시 예정작">
          <Calendar size={24} style={{ minWidth: '24px' }} /> {isOpen && <span>출시 예정작</span>}
        </button>
        
        {/* 🌟 [게임 검색] 메뉴 버튼 깨끗한 문법으로 안착 완료! */}
        <button 
          onClick={() => setActiveTab('SEARCH')}
          className={`nav-btn ${activeTab === 'SEARCH' ? 'nav-btn-upcoming' : 'nav-btn-inactive'}`}
          title="게임 검색">
          <Search size={24} style={{ minWidth: '24px' }} /> {isOpen && <span>게임 검색</span>}
        </button>
        
        <button 
          onClick={() => setActiveTab(user ? 'MYPAGE' : 'LOGIN')}
          className={`nav-btn ${['LOGIN', 'SIGNUP', 'MYPAGE', 'ADMIN'].includes(activeTab) ? 'nav-btn-mypage' : 'nav-btn-inactive'}`}
          style={{ marginTop: 'auto' }}
          title="마이페이지"
        >
          <User size={24} style={{ minWidth: '24px' }} /> 
          {isOpen && <span>마이페이지</span>}
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
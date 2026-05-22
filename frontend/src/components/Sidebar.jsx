import { useState } from 'react'
// 🌟 lucide-react에서 랭킹판에 딱 어울리는 'Trophy(트로피)' 아이콘을 추가로 땡겨옵니다!
import { Gamepad2, Monitor, Calendar, Search, Menu, User, Trophy } from 'lucide-react'

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

        {/* 🏆 [명예의 전당 랭킹] 메뉴 버튼을 닌텐도/플스 바로 밑에 안착시켰습니다! */}
        <button 
          onClick={() => setActiveTab('RANKING')}
          className={`nav-btn ${activeTab === 'RANKING' ? 'nav-btn-mypage' : 'nav-btn-inactive'}`}
          title="명예의 전당">
          <Trophy size={24} style={{ minWidth: '24px' }} /> {isOpen && <span>명예의 전당</span>}
        </button>
        
        <button 
          onClick={() => setActiveTab('UPCOMING')}
          className={`nav-btn ${activeTab === 'UPCOMING' ? 'nav-btn-upcoming' : 'nav-btn-inactive'}`}
          title="출시 예정작">
          <Calendar size={24} style={{ minWidth: '24px' }} /> {isOpen && <span>출시 예정작</span>}
        </button>
        
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
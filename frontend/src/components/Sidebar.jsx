import { useState } from 'react'
import { Gamepad2, Monitor, Calendar, Menu, User } from 'lucide-react'

function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="menu-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={24} />
        </button>
        {isOpen && (
          <h1 className="sidebar-title">CrossPad</h1>
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
        
        <button 
          onClick={() => setActiveTab('LOGIN')}
          className={`nav-btn ${['LOGIN', 'SIGNUP'].includes(activeTab) ? 'nav-btn-mypage' : 'nav-btn-inactive'}`}
          title="마이페이지">
          <User size={24} style={{ minWidth: '24px' }} /> {isOpen && <span>마이페이지</span>}
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
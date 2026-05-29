import './Sidebar.css'
import { useState } from 'react';
import { Gamepad2, Monitor, Calendar, Search, Menu, User, Trophy } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, user }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="menu-toggle-btn" onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', flexShrink: 0 }}>
          <Menu size={24} style={{ minWidth: '24px' }} />
        </button>
        {isOpen && (
          <span className="sidebar-title" onClick={() => setActiveTab('NINTENDO')} style={{ cursor: 'pointer', fontSize: '22px', fontWeight: '900', margin: 0 }}>CrossPad</span>
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
          title="마이페이지"
        >
          <User size={24} style={{ minWidth: '24px' }} /> 
          {isOpen && <span>마이페이지</span>}
        </button>
      </nav>

      {isOpen && (
        <div 
          className="sidebar-footer" 
          style={{ 
            margin: 'auto auto 0', 
            paddingBottom: '24px',
            fontSize: '12px', 
            color: '#9ca3af', 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          <span 
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-color)'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            onClick={() => setActiveTab('TERMS')}
          >
            이용약관
          </span>
          <span>|</span>
          <span 
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-color)'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            onClick={() => setActiveTab('PRIVACY')}
          >
            개인정보처리방침
          </span>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
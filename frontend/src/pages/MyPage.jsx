import './MyPage.css'

function MyPage({ user, handleLogout, setActiveTab }) {
  return (
    <div className="mypage-container">
      <div className="mypage-card">
        <h2 className="mypage-title">마이페이지</h2>
        
        <div className="profile-zone">
          <div className="profile-avatar">
            {user?.nickname?.charAt(0)}
          </div>
          <h3 style={{margin: 0, fontSize: '20px'}}>{user?.nickname} 님, 환영합니다!</h3>
        </div>

        <div className="info-box">
          <div className="info-row">
            <span className="info-label">이메일 계정</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">닉네임</span>
            <span className="info-value">{user?.nickname}</span>
          </div>
          <div className="info-row">
            <span className="info-label">회원 등급</span>
            <span 
              className="info-value" 
              style={{ color: user?.role === 'ROLE_ADMIN' ? 'var(--nintendo-color)' : 'var(--ps-color)' }}
            >
              {/* 💡 대소문자나 공백 때문에 안 뜰 수 있으니 확실하게 바인딩 */}
              {user?.role === 'ROLE_ADMIN' ? '관리자' : '일반 유저'}
            </span>
          </div>
        </div>

        {/* 💡 [핵심 권한 분기] 로그인한 유저가 관리자일 때만 마이페이지 내부에 특수 버튼 노출 */}
        {user?.role === 'ROLE_ADMIN' && (
          <button 
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--ps-color)',
              backgroundColor: 'transparent',
              color: 'var(--ps-color)',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginBottom: '12px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ps-color)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--ps-color)'; }}
            onClick={() => setActiveTab('ADMIN')}
          >
            관리자 대시보드 진입
          </button>
        )}

        {/* 일반 유저일 경우 찜 목록 보러가기 버튼 노출 */}
        {user?.role !== 'ROLE_ADMIN' && (
          <button 
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--ps-color)',
              backgroundColor: 'transparent',
              color: 'var(--ps-color)',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginBottom: '12px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ps-color)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--ps-color)'; }}
            onClick={() => setActiveTab('BOOKMARKS')}
          >
            내 찜 목록 보러가기
          </button>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default MyPage
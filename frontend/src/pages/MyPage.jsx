import './MyPage.css'

function MyPage({ user, handleLogout, setActiveTab }) {
  return (
    <div className="mypage-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="user-info">
            <h2 className="nickname" style={{ textAlign: 'center' }}>{user?.nickname} 님, 환영합니다!</h2>
          </div>
        </div>

        <div className="profile-body">
          <div className="info-section">
            <h3 className="section-title">계정 정보</h3>
            <div className="info-item">
              <span className="label">이메일 계정</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">닉네임</span>
              <span className="value">{user?.nickname}</span>
            </div>
            <div className="info-item">
              <span className="label">회원 등급</span>
              <span 
                className="value" 
                style={{ color: user?.role === 'ROLE_ADMIN' ? 'var(--nintendo-color)' : 'var(--ps-color)' }}
              >
                {user?.role === 'ROLE_ADMIN' ? '관리자' : '일반 유저'}
              </span>
            </div>
          </div>

          {/* 💡 [핵심 권한 분기] 로그인한 유저가 관리자일 때만 마이페이지 내부에 특수 버튼 노출 */}
          {user?.role === 'ROLE_ADMIN' && (
            <button className="mypage-btn" onClick={() => setActiveTab('ADMIN')}>
              관리자 대시보드 진입
            </button>
          )}

          {/* 일반 유저일 경우 찜 목록 보러가기 버튼 노출 */}
          {user?.role !== 'ROLE_ADMIN' && (
            <button className="mypage-btn" onClick={() => setActiveTab('BOOKMARKS')}>
              내 찜 목록 보러가기
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyPage
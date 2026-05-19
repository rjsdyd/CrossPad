import './MyPage.css'

function MyPage({ user, handleLogout }) {
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
            <span className="info-value" style={{color: 'var(--ps-color)'}}>일반 회원</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default MyPage
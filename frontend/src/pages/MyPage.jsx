import React from 'react'
import { Shield, Heart } from 'lucide-react'
import './auth/MyPage.css' 

function MyPage({ user, handleLogout, setActiveTab }) {
  if (!user) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center', color: '#9ca3af', fontSize: '18px' }}>
        로그인이 필요한 서비스입니다. 🔒
      </div>
    );
  }

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
              {user?.role === 'ROLE_ADMIN' ? '관리자' : '일반 유저'}
            </span>
          </div>
        </div>

        {/* 👑 관리자 전용 대시보드 버튼 */}
        {user?.role === 'ROLE_ADMIN' && (
          <button 
            className="auth-btn" 
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px dashed var(--nintendo-color)', 
              color: 'var(--nintendo-color)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onClick={() => setActiveTab('ADMIN')}
          >
            <Shield size={18} color="#E5E7EB" /> 관리자 대시보드 진입
          </button>
        )}

        {/* 🌟 일반 유저 전용: 찜 목록 이동 버튼 (로그아웃 버튼 바로 위) */}
        {user?.role === 'ROLE_USER' && (
          <button 
            className="auth-btn" 
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid #ef4444', 
              color: '#ef4444',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onClick={() => setActiveTab('BOOKMARKS')}
          >
            <Heart size={18} fill="#ef4444" color="#ef4444" /> 내 찜 목록 보러가기
          </button>
        )}

        {/* 공통: 로그아웃 버튼 */}
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default MyPage
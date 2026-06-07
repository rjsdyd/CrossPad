import { useEffect, useState } from 'react'
import axios from 'axios'
import { Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

function AdminDashboard({ user }) {
  const [members, setMembers] = useState([])
  const navigate = useNavigate()

  // 1. 전체 가입 유저 목록 가져오기 (내 이메일을 파라미터로 동봉)
  const fetchMembers = () => {
    axios.get(`http://localhost:8080/api/admin/members?email=${user.email}`)
      .then(response => setMembers(response.data))
      .catch(error => alert(error.response?.data || "목록 로딩 실패"))
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // 2. 특정 유저 관리자로 승급 처리
  const handlePromote = (targetId, nickname) => {
    if (!window.confirm(`[${nickname}] 님을 관리자로 승급시키겠습니까?`)) return

    axios.post(`http://localhost:8080/api/admin/members/${targetId}/promote?email=${user.email}`)
      .then(response => {
        alert(response.data)
        fetchMembers() // 목록 새로고침
      })
      .catch(error => alert(error.response?.data))
  }

  // 3. 특정 유저 권한 강등 처리 (일반 유저로 변경)
  const handleDemote = (targetId, nickname) => {
    if (!window.confirm(`[${nickname}] 님의 관리자 권한을 해제하고 일반 유저로 강등시키겠습니까?`)) return

    axios.post(`http://localhost:8080/api/admin/members/${targetId}/demote?email=${user.email}`)
      .then(response => {
        alert(response.data)
        fetchMembers() // 목록 새로고침
      })
      .catch(error => {
        alert(error.response?.data || "권한 강등 처리에 실패했습니다.")
      })
  }

  // 4. 특정 유저 강제 탈퇴 (Ban) 처리
  const handleBan = (targetId, nickname) => {
    if (!window.confirm(`[${nickname}] 님을 정말 강제 탈퇴시키겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return

    axios.delete(`http://localhost:8080/api/admin/members/${targetId}?email=${user.email}`)
      .then(response => {
        alert(response.data)
        fetchMembers() // 목록 새로고침
      })
      .catch(error => alert(error.response?.data))
  }

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ textAlign: 'center' }}>
        <h1 className="admin-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Shield size={32} color="#E5E7EB" />
          관리자 제어 대시보드
        </h1>
        <p className="admin-subtitle">CrossPad 플랫폼의 전체 회원 권한 조정 및 탈퇴 관리를 총괄합니다.</p>
      </div>

      {/* 관리자 메뉴 탭 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '20px 0 30px' }}>
        <button 
          onClick={() => navigate('/admin')}
          style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          유저 관리
        </button>
        <button 
          onClick={() => navigate('/admin/reports')}
          style={{ padding: '10px 24px', backgroundColor: '#374151', color: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          신고 목록
        </button>
      </div>

      {/* 💡 모바일 환경에서 표가 찌그러지거나 잘리지 않도록 가로 스크롤 영역 추가 */}
      <div className="table-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="admin-table" style={{ minWidth: '768px' }}>
          <thead>
            <tr>
              <th>고유 ID</th>
              <th>이메일 계정</th>
              <th>닉네임</th>
              <th>보유 권한</th>
              <th>시스템 관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.email}</td>
                <td>{member.nickname}</td>
                <td>
                  <span className={`role-badge ${member.role === 'ROLE_ADMIN' ? 'role-admin' : 'role-user'}`}>
                    {member.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                  </span>
                </td>
                <td className="admin-actions">
                  {/* 대상이 일반 유저일 때만 승급 버튼 노출 */}
                  {member.role === 'ROLE_USER' && (
                    <button 
                      className="action-btn btn-promote"
                      style={{ width: '105px', textAlign: 'center', whiteSpace: 'nowrap' }}
                      onClick={() => handlePromote(member.id, member.nickname)}
                    >
                      관리자 승급
                    </button>
                  )}
                  {/* 대상이 관리자이고 본인이 아닐 때만 권한 강등 버튼 노출 */}
                  {member.role === 'ROLE_ADMIN' && member.email !== user.email && (
                    <button 
                      className="action-btn btn-demote"
                      style={{ width: '105px', textAlign: 'center', whiteSpace: 'nowrap', backgroundColor: '#f59e0b', color: 'white' }}
                      onClick={() => handleDemote(member.id, member.nickname)}
                    >
                      권한 강등
                    </button>
                  )}
                  {/* 본인 계정은 강제탈퇴 버튼 비활성화 (보호 조치) */}
                  {member.email !== user.email && (
                    <button 
                      className="action-btn btn-ban"
                      style={{ width: '105px', textAlign: 'center', whiteSpace: 'nowrap' }}
                      onClick={() => handleBan(member.id, member.nickname)}
                    >
                      강제 탈퇴
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
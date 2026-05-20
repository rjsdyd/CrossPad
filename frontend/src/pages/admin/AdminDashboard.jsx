import { useEffect, useState } from 'react'
import axios from 'axios'
import './AdminDashboard.css'

function AdminDashboard({ user }) {
  const [members, setMembers] = useState([])

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

  // 3. 특정 유저 강제 탈퇴 (Ban) 처리
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
      <div className="admin-header">
        <h1 className="admin-title">👑 관리자 제어 대시보드</h1>
        <p className="admin-subtitle">CrossPad 플랫폼의 전체 회원 권한 조정 및 탈퇴 관리를 총괄합니다.</p>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
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
                      onClick={() => handlePromote(member.id, member.nickname)}
                    >
                      관리자 승급
                    </button>
                  )}
                  {/* 본인 계정은 강제탈퇴 버튼 비활성화 (보호 조치) */}
                  {member.email !== user.email && (
                    <button 
                      className="action-btn btn-ban"
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
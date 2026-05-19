import { useState } from 'react'
import axios from 'axios'
import './Signup.css'

function Login({ setActiveTab, onLoginSuccess }) { // 💡 로그인 성공 핸들러 추가받음
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    
    // 💡 백엔드 로그인 API 호출
    axios.post('http://localhost:8080/api/members/login', {
      email,
      password
    })
    .then(response => {
      alert(`${response.data.nickname}님, 로그인 성공!`)
      onLoginSuccess(response.data) // 💡 상위 App 상태에 유저 정보 저장
    })
    .catch(error => {
      alert(error.response?.data || "로그인에 실패했습니다. 이메일이나 비밀번호를 확인해주세요.")
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">로그인</h2>
        <form onSubmit={handleLogin}>
          
          <div className="form-group">
            <label>이메일 주소</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-btn">
            로그인하기
          </button>
          
          <button 
            type="button" 
            className="auth-btn" 
            style={{ backgroundColor: 'transparent', color: '#9ca3af', fontSize: '14px', marginTop: '5px'}}
            onClick={() => setActiveTab('SIGNUP')}
          >
            아직 계정이 없으신가요? 회원가입
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
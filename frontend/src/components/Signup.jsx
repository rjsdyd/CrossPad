import { useState } from 'react'
import axios from 'axios'
import './Signup.css'

function Signup({ setActiveTab }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  
  const isPasswordValid = password.length >= 8

  const handleSignup = (e) => {
    e.preventDefault()
    
    axios.post('http://localhost:8080/api/members/signup', {
      email,
      password,
      nickname
    })
    .then(response => {
      alert(response.data)
      setActiveTab('LOGIN')
    })
    .catch(error => {
      alert(error.response?.data || "회원가입에 실패했습니다.")
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">회원가입</h2>
        <form onSubmit={handleSignup}>
          
          <div className="form-group">
            <label>이메일 주소</label>
            <input 
              type="email" 
              placeholder="example@crosspad.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input 
              type="password" 
              placeholder="8자 이상 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            {password && (
              <span className={`validation-msg ${isPasswordValid ? 'msg-valid' : 'msg-invalid'}`}>
                {isPasswordValid ? '✓ 사용 가능한 비밀번호입니다.' : '✗ 비밀번호는 최소 8자 이상이어야 합니다.'}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>닉네임</label>
            <input 
              type="text" 
              placeholder="크로스패드에서 쓸 이름"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={!isPasswordValid || !email || !nickname}
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup
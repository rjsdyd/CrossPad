import { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Login({ setActiveTab, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    axios.post('http://localhost:8080/api/members/login', {
      email,
      password
    })
    .then(response => {
      console.log("백엔드가 보내준 로그인 데이터:", response.data);
      
      alert(`${response.data.nickname}님, 로그인 성공!`);
      onLoginSuccess(response.data); 
    })
    .catch(error => {
      setErrorMessage('아이디 또는 비밀번호가 틀렸습니다.');
    });
  };

  return (
    <div className="auth-container">
      <style>
        {`
          .login-error-msg {
            color: #ef4444;
            font-size: 13px;
            margin: -5px 0 15px 0;
            text-align: center;
            font-weight: 500;
            animation: shake 0.3s ease-in-out;
          }
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            50% { transform: translateX(4px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
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

          {errorMessage && <p className="login-error-msg">{errorMessage}</p>}

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
  );
}

export default Login;
import React from 'react';

function PrivacyPolicy() {
  return (
    <div style={{ padding: '40px', color: '#e5e7eb', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #374151', paddingBottom: '16px', marginBottom: '30px' }}>개인정보처리방침</h1>
      
      <div style={{ lineHeight: '1.7', fontSize: '15px', color: '#d1d5db' }}>
        <p style={{ marginBottom: '30px', color: '#9ca3af' }}>
          크로스패드(CrossPad)는 이용자의 개인정보를 보호하고 이와 관련된 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
          <br /><strong style={{ color: '#a855f7' }}>본 웹사이트는 개발자의 포트폴리오 및 학습용으로 제작된 테스트 서버입니다. 실제 사용 중인 중요한 비밀번호나 민감한 개인정보의 입력을 절대 금합니다.</strong>
        </p>

        {/* 제 1 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 1 조 (개인정보의 처리 목적)</h3>
        <p style={{ marginBottom: '24px' }}>
          크로스패드는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않습니다.<br />
          1. <strong>회원 가입 및 관리</strong> : 포트폴리오 프로젝트의 로그인/로그아웃 기능 시연 및 회원 식별<br />
          2. <strong>서비스 기능 제공</strong> : 사용자의 게임 찜(북마크) 목록 저장, 최근 검색어 기록 저장 및 맞춤형 기능 시연
        </p>

        {/* 제 2 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 2 조 (처리하는 개인정보의 항목)</h3>
        <p style={{ marginBottom: '24px' }}>
          서비스 기능 시연을 위해 최소한의 정보만을 수집하고 있습니다.<br />
          1. <strong>필수 수집 항목</strong> : 이메일 주소(또는 아이디), 비밀번호, 닉네임<br />
          2. <strong>서비스 이용 과정에서 생성되는 항목</strong> : 게임 검색 기록, 명예의 전당 및 특정 게임의 찜(북마크) 내역, 접속 IP 정보 및 서비스 이용 기록
        </p>

        {/* 제 3 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 3 조 (개인정보의 처리 및 보유 기간)</h3>
        <p style={{ marginBottom: '24px' }}>
          1. 이용자의 개인정보는 원칙적으로 프로젝트 서버 운영 기간 동안에만 제한적으로 보관됩니다.<br />
          2. 본 서비스는 정식 서비스가 아닌 테스트용 환경이므로, 데이터베이스(DB) 최적화 및 유지보수를 위해 <strong>사전 안내 없이 주기적으로 모든 가입 정보와 이용 기록이 영구 삭제(초기화)</strong>될 수 있습니다.<br />
          3. 이용자가 직접 회원 탈퇴를 요청하거나, 본 프로젝트의 운영이 완전히 종료될 경우 해당 개인정보는 지체 없이 파기됩니다.
        </p>

        {/* 제 4 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 4 조 (개인정보의 제3자 제공)</h3>
        <p style={{ marginBottom: '24px' }}>
          크로스패드는 이용자의 개인정보를 상업적인 용도로 활용하거나 외부에 판매하지 않으며, 어떠한 경우에도 제3자에게 제공하지 않습니다. 단, 프로젝트 시연 목적의 코드 리뷰나 포트폴리오 심사 과정에서 익명화된 데이터 구조(DB Schema)가 일부 공개될 수 있습니다.
        </p>

        {/* 제 5 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 5 조 (안전성 확보 조치)</h3>
        <p style={{ marginBottom: '24px' }}>
          비밀번호는 암호화되어 저장 및 관리되고 있으나, 학습용 서버의 특성상 완벽한 보안을 보장하기 어렵습니다. 따라서 타 웹사이트와 동일한 비밀번호를 사용함으로 인해 발생하는 피해에 대해서는 개발자가 책임을 지지 않습니다.
        </p>

        {/* 제 6 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 6 조 (개인정보 보호책임자)</h3>
        <p style={{ marginBottom: '24px' }}>
          본 프로젝트와 관련된 개인정보 문의 및 삭제 요청은 아래의 연락처로 문의해 주시기 바랍니다.<br />
          - 담당자 : 크로스패드 프로젝트 관리자<br />
          - 깃허브 : https://github.com/rjsdyd
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
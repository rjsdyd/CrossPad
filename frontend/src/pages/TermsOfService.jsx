import React from 'react';

function TermsOfService() {
  return (
    <div style={{ padding: '40px', color: '#e5e7eb', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #374151', paddingBottom: '16px', marginBottom: '30px' }}>이용약관</h1>
      
      <div style={{ lineHeight: '1.7', fontSize: '15px', color: '#d1d5db' }}>
        
        {/* 제 1 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 1 조 (목적 및 서비스의 성격)</h3>
        <p style={{ marginBottom: '24px' }}>
          본 약관은 크로스패드(CrossPad, 이하 '서비스')의 이용 조건 및 절차, 이용자와 운영자의 권리, 의무, 책임 사항 등을 규정함을 목적으로 합니다.<br />
          <strong style={{ color: '#a855f7' }}>본 서비스는 개인의 프로그래밍 기술 향상 및 포트폴리오 제출을 위한 '학습용 프로젝트'로 제작되었으며, 어떠한 형태의 상업적, 영리적 목적도 추구하지 않습니다.</strong>
        </p>

        {/* 제 2 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 2 조 (외부 API 연동 및 서비스 제한)</h3>
        <p style={{ marginBottom: '24px' }}>
          본 서비스는 사용자에게 원활한 기능을 제공하기 위해 다음의 외부 API를 연동하여 사용하고 있습니다.<br />
          1. <strong>DeepL API</strong> : 게임 정보 및 검색어 등의 다국어 번역 처리<br />
          2. <strong>Twitch API (IGDB)</strong> : 게임 타이틀, 포스터 이미지, 평점 등 메타데이터 연동<br />
          외부 API의 무료 호출 한도(Quota) 초과, 해당 API 제공사의 정책 변경, 또는 서버 운영 상황에 따라 예고 없이 일부 기능(검색, 번역, 게임 정보 로드 등)이 지연되거나 서비스 전체가 일시 중단될 수 있습니다.
        </p>

        {/* 제 3 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 3 조 (이용자의 의무 및 악용 금지)</h3>
        <p style={{ marginBottom: '24px' }}>
          본 서비스가 취지에 맞게 운영될 수 있도록, 이용자는 다음의 행위를 해서는 안 됩니다.<br />
          1. 매크로, 봇(Bot) 등의 프로그램을 이용하여 외부 API(DeepL, Twitch) 호출 한도를 고의로 소진시키는 비정상적인 트래픽 유발 행위<br />
          2. 서비스 내의 데이터(게임 정보 등)를 무단으로 크롤링하거나 상업적 용도로 재가공 및 배포하는 행위<br />
          3. 기타 운영자의 학습용 서비스 취지에 위배되거나 시스템에 과부하를 주는 일체의 행위
        </p>

        {/* 제 4 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 4 조 (회원가입 및 계정 관리)</h3>
        <p style={{ marginBottom: '24px' }}>
          1. 본 서비스는 테스트 목적의 프로젝트이므로, 가입 시 타 사이트에서 사용하는 실제 비밀번호와 동일한 비밀번호의 사용을 엄격히 권장하지 않습니다.<br />
          2. 이용자의 부주의로 인한 계정 정보 유출 피해에 대해 운영자는 책임을 지지 않습니다.<br />
          3. 테스트 및 서버 최적화 목적에 따라, 등록된 회원 정보 및 찜 목록 등의 데이터(DB)는 사전 통보 없이 주기적으로 초기화될 수 있습니다.
        </p>

        {/* 제 5 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 5 조 (서비스의 변경 및 중지)</h3>
        <p style={{ marginBottom: '24px' }}>
          운영자는 포트폴리오 업데이트, 서버 유지보수, API 비용 한도 초과, 또는 기타 개인적인 사정에 의해 언제든지 서비스의 일부 또는 전부를 변경, 일시 정지, 혹은 영구 종료할 수 있으며, 이로 인해 발생하는 불이익에 대해 보상할 의무가 없습니다.
        </p>

        {/* 제 6 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 6 조 (면책 조항)</h3>
        <p style={{ marginBottom: '24px' }}>
          본 서비스는 테스트 및 학습 목적으로 운영되므로, 다음 사항에 대해 운영자는 법적 책임을 지지 않습니다.<br />
          1. 서버 유지보수, 트래픽 초과, 예상치 못한 버그 등으로 인한 서비스 중단 및 데이터 유실<br />
          2. DeepL 및 Twitch API를 통해 제공받은 번역 결과나 게임 데이터의 정확성 및 최신성<br />
          3. 이용자가 본 서비스를 이용하며 발생한 직·간접적인 불편이나 손해
        </p>

        {/* 제 7 조 */}
        <h3 style={{ color: '#f3f4f6', marginBottom: '12px', fontSize: '18px' }}>제 7 조 (저작권 및 지적재산권 안내)</h3>
        <p style={{ marginBottom: '24px' }}>
          1. 본 서비스 내에 노출되는 게임 포스터, 타이틀, 로고 등 게임과 관련된 모든 지적재산권은 해당 게임의 원저작자(개발사 및 퍼블리셔)에게 있습니다.<br />
          2. 본 서비스의 UI/UX 디자인 및 클라이언트/서버 소스 코드에 대한 저작권은 크로스패드 운영자에게 있습니다.
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;
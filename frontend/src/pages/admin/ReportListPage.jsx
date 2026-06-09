import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flag, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ReportListPage.css';

function ReportListPage() {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchReports = () => {
    axios.get('http://localhost:8080/api/reports')
      .then(response => {
        if (Array.isArray(response.data)) {
          // 최신순(내림차순)으로 정렬
          const sortedReports = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setReports(sortedReports);
        } else {
          setReports([]);
        }
      })
      .catch(error => console.error("신고 목록 로딩 실패:", error));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 페이징 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ textAlign: 'center' }}>
        <h1 className="admin-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Flag size={32} color="#ef4444" />
          신고 목록 대시보드
        </h1>
        <p className="admin-subtitle">CrossPad 플랫폼의 유저 신고 내역을 확인하고 처리합니다.</p>
      </div>

      {/* 관리자 메뉴 탭 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '20px 0 30px' }}>
        <button 
          onClick={() => navigate('/admin')}
          style={{ padding: '10px 24px', backgroundColor: '#374151', color: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          유저 관리
        </button>
        <button 
          onClick={() => navigate('/admin/reports')}
          style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          신고 목록
        </button>
      </div>

      <div className="report-container">
        {reports.length === 0 ? (
          <div className="empty-reports">
            <AlertCircle size={40} color="#9ca3af" />
            <p>현재 접수된 신고가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="report-grid">
              {currentReports.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <span className="report-reason">
                      {report.reason}
                    </span>
                    <span className="report-date">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="report-body">
                    <p><strong>신고자 닉네임:</strong> {report.reporterNickname || `유저 #${report.reporterId}`}</p>
                    <p><strong>신고당한 유저:</strong> {report.reviewerNickname || '확인 중...'}</p>
                    <p><strong>신고된 게임:</strong> {report.gameTitle || '확인 중...'}</p>
                    <p className="report-content">
                      "{report.content || '내용 없음'}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이징 버튼 */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)} 
                  className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportListPage;
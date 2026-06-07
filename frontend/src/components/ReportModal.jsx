import React, { useState } from 'react';
import axios from 'axios';
import './ReportModal.css';

const REPORT_REASONS = ['욕설', '스팸', '음란성 내용', '스포일러', '허위정보', '기타'];

function ReportModal({ isOpen, onClose, reviewId, reporterId }) {
    const [reason, setReason] = useState('');
    const [otherContent, setOtherContent] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!reason) {
            alert('신고 사유를 선택해주세요.');
            return;
        }
        if (reason === '기타' && !otherContent.trim()) {
            alert('기타 신고 사유를 200자 내외로 작성해주세요.');
            return;
        }

        try {
            // 백엔드 API 연동 (상황에 맞게 URL 수정 필요)
            await axios.post('http://localhost:8080/api/reports', {
                reviewId,
                reporterId,
                reason,
                content: reason === '기타' ? otherContent : ''
            });
            alert('신고가 정상적으로 접수되었습니다.');
            
            // 초기화 및 닫기
            setReason('');
            setOtherContent('');
            onClose();
        } catch (error) {
            console.error('신고 접수 실패:', error);
            alert('신고 접수 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="report-modal-overlay" onClick={onClose}>
            <div className="report-modal-content" onClick={e => e.stopPropagation()}>
                <h2>리뷰 신고하기</h2>
                <div className="report-reasons">
                    {REPORT_REASONS.map(r => (
                        <label key={r} className="report-radio-label">
                            <input 
                                type="radio" 
                                name="reportReason" 
                                value={r} 
                                checked={reason === r}
                                onChange={() => setReason(r)}
                            />
                            {r}
                        </label>
                    ))}
                </div>
                
                {reason === '기타' && (
                    <textarea 
                        className="report-textarea"
                        placeholder="신고 사유를 상세히 적어주세요 (최대 200자)"
                        maxLength={200}
                        value={otherContent}
                        onChange={e => setOtherContent(e.target.value)}
                    />
                )}

                <div className="report-modal-actions">
                    <button className="btn-cancel" onClick={onClose}>취소</button>
                    <button className="btn-submit" onClick={handleSubmit}>신고 접수</button>
                </div>
            </div>
        </div>
    );
}

export default ReportModal;
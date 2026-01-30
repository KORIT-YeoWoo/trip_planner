/** @jsxImportSource @emotion/react */
import { useNavigate } from 'react-router-dom';
import * as s from './styles';

function LockedStyleCard({ currentTripCount, requiredTripCount }) {
    const navigate = useNavigate();

    const current = currentTripCount || 0;
    const required = requiredTripCount || 3;
    const remaining = required - current;
    

    return (
        <div css={s.lockedContainer}>
            <div css={s.lockIcon}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            <h2 css={s.lockedTitle}>나의 여행 MBTI</h2>
            
            <p css={s.lockedDescription}>
                {remaining}번의 여행이 더 필요해요!
            </p>

            <div css={s.progressWrapper}>
                <div css={s.progressBar}>
                    <div 
                        css={s.progressFill} 
                        style={{ width: `${(currentTripCount / requiredTripCount) * 100}%` }}
                    />
                </div>
                <span css={s.progressText}>{currentTripCount}/{requiredTripCount}</span>
            </div>

            <button 
                css={s.ctaButton}
                onClick={() => navigate('/spots')}
            >
                여행 일정 짜러가기 ✈️
            </button>
        </div>
    );
}

export default LockedStyleCard;
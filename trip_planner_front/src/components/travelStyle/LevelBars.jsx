/** @jsxImportSource @emotion/react */
import * as s from './styles';

function LevelBars({ moveLevel, tourLevel, foodLevel }) {
    const getLevelWidth = (level) => {
        switch(level) {
            case 'HIGH': return '100%';
            case 'MEDIUM': return '60%';
            case 'LOW': return '30%';
            default: return '0%';
        }
    };

    const getLevelColor = (level) => {
        switch(level) {
            case 'HIGH': return '#FF6B35';
            case 'MEDIUM': return '#FFA726';
            case 'LOW': return '#FFD54F';
            default: return '#E0E0E0';
        }
    };

    const levels = [
        { label: '이동거리', level: moveLevel, icon: '🚗' },
        { label: '관광 선호도', level: tourLevel, icon: '📸' },
        { label: '평균 식사 비용', level: foodLevel, icon: '🍽️' }
    ];

    return (
        <div css={s.levelsContainer}>
            <h3 css={s.levelsTitle}>성향 그래프</h3>
            <div css={s.levelsList}>
                {levels.map((item, index) => (
                    <div key={index} css={s.levelItem}>
                        <div css={s.levelHeader}>
                            <span css={s.levelIcon}>{item.icon}</span>
                            <span css={s.levelLabel}>{item.label}</span>
                        </div>
                        <div css={s.levelBarWrapper}>
                            <div 
                                css={s.levelBar}
                                style={{ 
                                    width: getLevelWidth(item.level),
                                    backgroundColor: getLevelColor(item.level)
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LevelBars;
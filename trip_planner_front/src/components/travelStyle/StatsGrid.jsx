/** @jsxImportSource @emotion/react */
import * as s from './styles';

function StatsGrid({ stats }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num?.toFixed(0) || 0;
    };

    const statsData = [
        {
            label: '이동한 거리',
            value: `${stats?.totalDistance?.toFixed(1) || 0}km`,
        },
        {
            label: '총 여행 일수',
            value: `${stats?.totalDays || 0}일`
        },
        {
            label: '총 여행 예산',
            value: `${formatNumber(stats?.totalBudget)}원`
        },
        {
            label: '총 방문지 수',
            value: `${stats?.totalPlaces || 0}곳`
        }
    ];

    return (
        <div css={s.statsContainer}>
            <h3 css={s.statsTitle}>여행 통계</h3>
            <div css={s.statsGrid}>
                {statsData.map((stat, index) => (
                    <div key={index} css={s.statCard}>
                        <div css={s.statLabel}>{stat.label}</div>
                        <div css={s.statValue}>{stat.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatsGrid;
/** @jsxImportSource @emotion/react */
import { useQuery } from "@tanstack/react-query";
import MyPageCategory from "../../components/mypage/MyPageCategory";
import TravelStyleCard from "../../components/travelStyle/TravelStyleCard";
import LockedStyleCard from "../../components/travelStyle/LockedStyleCard";
import StatsGrid from "../../components/travelStyle/StatsGrid";
import LevelBars from "../../components/travelStyle/LevelBars";
import { getTravelStyle } from "../../apis/travelStyleApi";
import * as s from "./styles";
import * as ts from "../../components/travelStyle/styles";

function MyStylePage() {
    const { data: travelStyle, isLoading, error } = useQuery({
        queryKey: ['travelStyle'],
        queryFn: getTravelStyle,
        retry: 1,
        onError: (err) => {
            console.error('여행 스타일 조회 실패:', err);
        }
    });

    return (
        <div css={s.layout}> 
            <div css={s.bar}><MyPageCategory /></div>
            <div css={s.content} style={{ position: 'relative' }}>
                <div css={s.overlay}>
                    <div css={s.styleContent}>
                        {isLoading && (
                            <div css={ts.loading}>로딩 중...</div>
                        )}

                        {error && (
                            <div css={ts.error}>
                                여행 스타일을 불러오는데 실패했습니다.
                            </div>
                        )}

                        {travelStyle && !travelStyle.isAnalyzable && (
                            <LockedStyleCard 
                                currentTripCount={travelStyle.currentTripCount}
                                requiredTripCount={travelStyle.requiredTripCount}
                            />
                        )}

                        {travelStyle && travelStyle.isAnalyzable && (
                        <div css={ts.mainContainer}>
                            {/* 왼쪽: 캐릭터 카드 */}
                            <div css={ts.leftSection}>
                                <TravelStyleCard 
                                    type={travelStyle.type}
                                    typeName={travelStyle.typeName}
                                    description={travelStyle.typeDescription}
                                />
                            </div>

                            {/* 오른쪽: 상세 정보 */}
                            <div css={ts.rightSection}>
                                <div css={ts.header}>
                                    <h2 css={ts.mainTitle}>민석 님의 여행스타일</h2>
                                    <div css={ts.mainQuote}>
                                        "{travelStyle.typeDescription}"
                                    </div>
                                    <p css={ts.subDescription}>
                                        다음 여행에서도 당신만의 속도로, 당신만의 방식으로 세상을 탐험하세요.
                                        가장 아름다운 풍경은 언제나 예상치 못한 길 위에 있습니다. 안전운전하시고, 멋진 여정 되시길!
                                    </p>
                                </div>

                                <StatsGrid stats={travelStyle.stats} />
                                
                                {/* 뱃지 + 태그 (같은 라인) */}
                                <div css={ts.badgeTagContainer}>
                                    <div css={ts.badgeSection}>
                                        <h3 css={ts.sectionTitle}>획득 뱃지</h3>
                                        <div css={ts.badgeGrid}>
                                            <div css={ts.badgeRow}>
                                                <div css={ts.badgeItem}>
                                                    <span css={ts.badgeIcon}>🏖️</span>
                                                    <span css={ts.badgeText}>화려한 솔로</span>
                                                </div>
                                                <div css={ts.badgeCount}>15회</div>
                                            </div>
                                            <div css={ts.badgeRow}>
                                                <div css={ts.badgeItem}>
                                                    <span css={ts.badgeIcon}>👨‍👩‍👧</span>
                                                    <span css={ts.badgeText}>초보 여행가</span>
                                                </div>
                                                <div css={ts.badgeCount}>10회</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div css={ts.tagSection}>
                                        <h3 css={ts.sectionTitle}>선호 태그</h3>
                                        <div css={ts.tagList}>
                                            <div css={ts.tagRow}>
                                                <span css={ts.tag}>#바다유산</span>
                                                <span css={ts.tagCount}>15회</span>
                                            </div>
                                            <div css={ts.tagRow}>
                                                <span css={ts.tag}>#드라이빙</span>
                                                <span css={ts.tagCount}>11회</span>
                                            </div>
                                            <div css={ts.tagRow}>
                                                <span css={ts.tag}>#힐링</span>
                                                <span css={ts.tagCount}>8회</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <LevelBars 
                                    moveLevel={travelStyle.moveLevel}
                                    tourLevel={travelStyle.tourLevel}
                                    foodLevel={travelStyle.foodLevel}
                                />
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            <div css={s.bar} style={{ borderRight: 'none' }}></div>
        </div>
    );
}

export default MyStylePage;
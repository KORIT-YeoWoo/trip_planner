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
import { useAuth } from "../../contexts/AuthContext";

function MyStylePage() {
    const { data: travelStyle, isLoading, error } = useQuery({
        queryKey: ['travelStyle'],
        queryFn: getTravelStyle,
        retry: 1,
        onError: (err) => {
            console.error('여행 스타일 조회 실패:', err);
        }
    });

    const { user } = useAuth();

    const typeDescriptions = {
        INFLUENCER: "다음 여행에서도 당신만의 속도로, 당신만의 방식으로 세상을 탐험하세요. 가장 아름다운 풍경은 언제나 예상치 못한 길 위에 있습니다.",
        FOODIE: "당신에게 여행은 맛있는 발견의 연속입니다. 다음 여행에서도 특별한 미식 경험을 만들어가세요!",
        EXPLORER: "넓은 세상을 향한 당신의 호기심은 끝이 없습니다. 계속해서 새로운 곳을 탐험하며 추억을 쌓아가세요!",
        DRIVER: "여행의 진정한 재미는 멋진 풍경을 보며 달리는 것. 안전운전하시고, 멋진 여정 되시길!",
        FLEX: "한 곳에 머물며 깊이 있는 경험을 즐기는 당신. 다음 여행도 여유롭고 알차게 즐기세요!",
        VACATION: "휴식과 미식의 완벽한 조화. 당신만의 힐링 타임을 만끽하며 재충전하세요!",
        COST_EFFECTIVE: "효율적이면서도 알찬 여행! 당신의 똑똑한 여행 스타일이 빛을 발하네요.",
        HEALING: "완벽한 휴식과 힐링의 시간. 다음 여행에서도 편안한 쉼을 만끽하세요.",
        BALANCE: "모든 것이 균형잡힌 완벽한 여행! 당신의 여행 스타일이 이상적이네요."
    };

    const userName = user?.name || '여행자';

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
                                <div css={ts.leftSection}>
                                    <TravelStyleCard 
                                        type={travelStyle.type}
                                        typeName={travelStyle.typeName}
                                        description={travelStyle.typeDescription}
                                    />
                                </div>

                                <div css={ts.rightSection}>
                                    <div css={ts.header}>
                                        <h2 css={ts.mainTitle}>{userName} 님의 여행스타일</h2>
                                        <div css={ts.mainQuote}>
                                            "{travelStyle.typeDescription}"
                                        </div>
                                        <p css={ts.subDescription}>
                                            {typeDescriptions[travelStyle.type] || 
                                            "다음 여행에서도 당신만의 방식으로 세상을 탐험하세요!"}
                                        </p>
                                    </div>

                                    <StatsGrid stats={travelStyle.stats} />
                                    
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
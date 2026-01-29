/** @jsxImportSource @emotion/react */
import { useQuery } from "@tanstack/react-query";
import MyPageCategory from "../../components/mypage/MyPageCategory";
import TravelStyleCard from "../../components/travelStyle/TravelStyleCard";
import LockedStyleCard from "../../components/travelStyle/LockedStyleCard";
import StatsGrid from "../../components/travelStyle/StatsGrid";
import LevelBars from "../../components/travelStyle/LevelBars";
import { getTravelStyle } from "../../apis/travelStyleApi";
import * as s from "./styles";

function MyStylePage() {
    const { data: travelStyle, isLoading, error } = useQuery({
        queryKey: ['travelStyle'],
        queryFn: getTravelStyle,
        retry: 1,
        onSuccess: (data) => {
            console.log('여행 스타일 데이터:', data);
        },
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
                        <h1>나의 여행 스타일</h1>
                        
                        {isLoading && (
                            <div css={s.loading}>
                                <div className="spinner">로딩 중...</div>
                            </div>
                        )}

                        {error && (
                            <div css={s.error}>
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
                            <>
                                <TravelStyleCard 
                                    type={travelStyle.type}
                                    typeName={travelStyle.typeName}
                                    description={travelStyle.typeDescription}
                                />
                                
                                <StatsGrid stats={travelStyle.stats} />
                                
                                <LevelBars 
                                    moveLevel={travelStyle.moveLevel}
                                    tourLevel={travelStyle.tourLevel}
                                    foodLevel={travelStyle.foodLevel}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div css={s.bar} style={{ borderRight: 'none' }}></div>
        </div>
    );
}

export default MyStylePage;
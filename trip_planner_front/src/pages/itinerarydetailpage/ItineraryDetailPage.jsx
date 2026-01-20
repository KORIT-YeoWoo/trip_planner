/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useLocation } from "react-router-dom";
import ItineraryScheduleList from "../../components/itinerary/ItineraryScheduleList";
import * as s from "./styles";
import { useState, useEffect } from "react";

function ItineraryDetailPage(){
    const location = useLocation();
    const { itineraryData } = location.state || {};

    const [currentDay, setCurrentDay] = useState(0);
    const [scheduleData, setScheduleData] = useState(itineraryData?.days || []);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentItineraryId = itineraryData?.itineraryId;
    const currentBudget = itineraryData?.budget;

    const currentDayData = scheduleData[currentDay];

    // ✅ 컴포넌트 마운트 시 일정 데이터 불러오기
    useEffect(() => {
        if (!itineraryData && currentItineraryId) {
            fetchItinerary();
        }
    }, [currentItineraryId]);

    // ✅ 일정 데이터 가져오기
    const fetchItinerary = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8080/api/itinerary/${currentItineraryId}`
            );
            
            if (response.data && response.data.days) {
                setScheduleData(response.data.days);
            }
        } catch (error) {
            console.error('일정 조회 실패:', error);
            alert('일정을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // ✅ 삭제 핸들러
    const handleDelete = async (itemId) => {
        try {
            console.log('🗑️ 삭제 요청:', { 
                itineraryId: currentItineraryId, 
                day: currentDay + 1, 
                itemId 
            });
            
            await axios.delete(
                `http://localhost:8080/api/itinerary/${currentItineraryId}/days/${currentDay + 1}/items/${itemId}`
            );
            
            console.log('✅ 삭제 성공!');
            
            // 서버에서 최신 데이터 다시 불러오기
            const response = await axios.get(
                `http://localhost:8080/api/itinerary/${currentItineraryId}`
            );
            
            if (response.data && response.data.days) {
                setScheduleData(response.data.days);
            }
            
        } catch (error) {
            console.error('❌ 삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    // ✅ 순서 변경 핸들러
    const handleReorder = async (newItemIds) => {
        if (!currentDayData) {
            console.error('currentDayData가 없습니다.');
            return;
        }

        const currentDayNumber = currentDayData.day;
        
        try {
            const response = await fetch(
                `http://localhost:8080/api/itinerary/${currentItineraryId}/days/${currentDayNumber}/reorder`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemIds: newItemIds })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '순서 변경 실패');
            }

            const updatedDayData = await response.json();

            setScheduleData(prev => {
                const newData = [...prev];
                newData[currentDay] = updatedDayData;
                return newData;
            });

            console.log('순서 변경 성공:', updatedDayData);
        } catch (error) {
            console.error('API 호출 실패:', error);
            throw error;
        }
    };

    // ✅ 체류 시간 변경 핸들러
    const handleDurationChange = async (itemId, newDuration) => {
        try {
            console.log('⏱️ 체류 시간 변경 요청:', {
                itineraryId: currentItineraryId,
                day: currentDay + 1,
                itemId,
                newDuration
            });

            const response = await axios.put(
                `http://localhost:8080/api/itinerary/${currentItineraryId}/days/${currentDay + 1}/items/${itemId}/duration`,
                { duration: newDuration }
            );

            console.log('✅ 시간 변경 성공:', response.data);

            if (response.data && response.data.days) {
                setScheduleData(response.data.days);
            }

            alert(`체류 시간이 ${newDuration}분으로 변경되었습니다.`);

        } catch (error) {
            console.error('❌ 시간 변경 실패:', error);
            alert('시간 변경에 실패했습니다.');
        }
    };

    // ✅ 로딩 중이거나 데이터가 없을 때
    if (loading) {
        return <div css={s.layout}>
            <div css={s.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    로딩 중...
                </div>
            </div>
        </div>;
    }

    if (!scheduleData || scheduleData.length === 0) {
        return <div css={s.layout}>
            <div css={s.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    일정 데이터가 없습니다.
                </div>
            </div>
        </div>;
    }

    return <div css={s.layout}>
        <div css={s.container}>
            <div css={s.map}>
                <div css={s.mapInfo}>
                    <h3>GPS</h3>
                </div>
                <div css={s.kakaoMap}>
                    
                </div>
            </div>
            <div css={s.scheduleWrap}>
                <div css={s.dayTap}>
                    <ul css={s.daylist}>
                        {
                            scheduleData.map((day, index) => (
                                <li
                                    key={day.day}
                                    css={s.dayTab(currentDay === index)}
                                    onClick={() => setCurrentDay(index)}
                                >
                                    {day.day}일차
                                </li>
                            ))
                        }
                    </ul>
                    <div css={s.edit}>
                        <button css={s.editBtn}>수정</button>
                    </div>
                </div>
                <div css={s.schedule}>
                    <ItineraryScheduleList 
                        scheduleData={currentDayData?.items || []}
                        onReorder={handleReorder}
                        onDelete={handleDelete}
                        onDurationChange={handleDurationChange}
                        onDragStart={() => setIsDragging(true)} 
                        onDragEnd={() => setIsDragging(false)}
                        aiComment={currentDayData?.summary}
                        startTime={currentDayData?.startTime} 
                        endTime={currentDayData?.endTime}   
                    />
                </div>
                <div css={s.summary}>
                    <div css={s.summaryInfo}>
                        <div>
                            <p>이동거리</p>
                            <h3>{currentDayData?.totalDistance?.toFixed(1) || 0}km</h3>
                        </div>
                        <div>
                            <p>총예산</p>
                            <h3>{currentDayData?.totalCost?.toLocaleString() || 0}원
                                <span> / {currentBudget?.toLocaleString()}원</span>
                            </h3>
                        </div>
                        <div>
                            <p>소요시간</p>
                            <h3>{currentDayData?.totalDurationInHours?.toFixed(1) || 0}시간</h3>
                        </div>
                    </div>
                    <button css={s.createItinerary}>
                        일정 생성하기
                    </button>
                </div>
            </div>
       </div>
    </div>
}

export default ItineraryDetailPage;
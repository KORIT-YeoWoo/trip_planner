/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useLocation } from "react-router-dom";
import ItineraryScheduleList from "../../components/itinerary/ItineraryScheduleList";
import * as s from "./styles";
import { useState } from "react";

function ItineraryDetailPage(){
    const location = useLocation();
    const { itineraryData } = location.state || {};

    // ✅ 임시 데이터 추가
    const defaultItineraryData = {
        itinerariesId: 1,
        days: [
            {
                day: 1,
                date: "2026-01-19",
                startTime: "09:00",
                endTime: "18:15",
                summary: "Day 1: 3개 관광지, 54.6km (섬 포함)",
                totalDistance: 54.577,
                totalDuration: 555,
                totalCost: 12000,
                items: [
                    { 
                        order: 0,
                        type: "SPOT",
                        itemId: 2, 
                        name: "거문오름", 
                        category: "자연",
                        arrivalTime: "09:35",
                        departureTime: "10:35", 
                        duration: 60, 
                        cost: 2000,
                        island: false
                    },
                    { 
                        order: 1,
                        type: "SPOT",
                        itemId: 3, 
                        name: "우도", 
                        category: "자연",
                        arrivalTime: "11:08",
                        departureTime: "17:08", 
                        duration: 360, 
                        cost: 10000,
                        island: true
                    },
                    { 
                        order: 2,
                        type: "SPOT",
                        itemId: 4, 
                        name: "광치기해변", 
                        category: "자연",
                        arrivalTime: "17:15",
                        departureTime: "18:15", 
                        duration: 60, 
                        cost: 0,
                        island: false
                    }
                ]
            }
        ],
        budget: 100000
    };

    const [currentDay, setCurrentDay] = useState(0);
    const [scheduleData, setScheduleData] = useState(
        itineraryData?.days || defaultItineraryData.days
    );
    
    const [isDragging, setIsDragging] = useState(false);

    const currentItineraryId = itineraryData?.itinerariesId || defaultItineraryData.itinerariesId;
    const currentBudget = itineraryData?.budget || defaultItineraryData.budget;

    const currentDayData = scheduleData[currentDay];

    const handleDelete = async (itemId) => {
        try {
            console.log('🗑️ 삭제 요청:', { 
                itineraryId: currentItineraryId, 
                day: currentDay + 1, 
                itemId 
            });
            
            // 1. 삭제 API 호출
            await axios.delete(
                `http://localhost:8080/api/itinerary/${currentItineraryId}/days/${currentDay + 1}/items/${itemId}`
            );
            
            console.log('✅ 삭제 성공!');
            
            // 2. ✅ 서버에서 최신 일정 데이터 다시 불러오기
            const response = await axios.get(
                `http://localhost:8080/api/itinerary/${currentItineraryId}`
            );
            
            console.log('✅ 최신 데이터 받음:', response.data);
            
            // 3. ✅ 상태 업데이트
            if (response.data && response.data.days) {
                setScheduleData(response.data.days);
            }
            
        } catch (error) {
            console.error('❌ 삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        }
    };


    const handleReorder = async (newItemIds) => {
        // ✅ 안전하게 접근
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

            // scheduleData 업데이트
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

    // ✅ 디버깅 로그
    console.log('scheduleData:', scheduleData);
    console.log('currentDayData:', currentDayData);

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
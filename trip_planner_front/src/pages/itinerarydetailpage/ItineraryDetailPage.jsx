/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useLocation } from "react-router-dom";
import ItineraryScheduleList from "../../components/itinerary/ItineraryScheduleList";
import * as s from "./styles";
import { useState, useEffect, useRef } from "react";

function ItineraryDetailPage() {
    const location = useLocation();
    const { itineraryData } = location.state || {};

    const [currentDay, setCurrentDay] = useState(0);
    const [scheduleData, setScheduleData] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentItineraryId = itineraryData?.itineraryId;
    const currentBudget = itineraryData?.budget;

    const currentDayData = scheduleData[currentDay];
    const mapContainerRef = useRef(null);

    // 1. 카카오맵 SDK 동적 로드 (한 번만 로드)
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            console.log('카카오맵 SDK 이미 로드됨');
            return;
        }

        console.log('카카오맵 SDK 동적 로드 시작');

        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`;
        script.async = true;

        script.onload = () => {
            console.log('카카오맵 SDK 로드 완료!');
            window.kakao.maps.load(() => {
                console.log('kakao.maps.load 완료 → 맵 사용 가능');
            });
        };

        script.onerror = () => {
            console.error('카카오맵 SDK 로드 실패');
            alert('카카오맵을 불러오지 못했습니다. 앱키와 도메인 등록을 확인해주세요.');
        };

        document.head.appendChild(script);
    }, []); // 빈 배열 → 컴포넌트 마운트 시 한 번만

    // 2. 맵 초기화 & 업데이트 (currentDayData나 currentDay 바뀔 때마다)
    useEffect(() => {
        if (!window.kakao || !window.kakao.maps || !mapContainerRef.current || !currentDayData) {
            console.log('맵 초기화 스킵:', {
                kakaoLoaded: !!window.kakao?.maps,
                container: !!mapContainerRef.current,
                dayData: !!currentDayData
            });
            return;
        }

        console.log('맵 초기화 시작 - Day:', currentDayData.day);

        const container = mapContainerRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(33.5066, 126.4929), // 제주 중심
            level: 10,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 마커 이미지 (빨간 핀)
        const markerImage = new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
            new window.kakao.maps.Size(32, 35)
        );

        
        // 출발지 마커
        if (currentDayData.startLat && currentDayData.startLon) {
            new window.kakao.maps.Marker({
                map,
                position: new window.kakao.maps.LatLng(currentDayData.startLat, currentDayData.startLon),
                title: currentDayData.startName || '출발지',
                image: markerImage,
            });
            console.log('출발지 마커 추가:', currentDayData.startName);
        }

        // 경유지 마커 + 번호 오버레이
        const path = [];
        
        currentDayData.items?.forEach((item, index) => {
            if (item.lat && item.lon) {
                const position = new window.kakao.maps.LatLng(item.lat, item.lon);
                path.push(position);

                // 번호 커스텀 오버레이 (깔끔하게)
                const content = `<div style="
                    background: #FF6B35;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 28px;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                ">${index + 1}</div>`;

                new window.kakao.maps.CustomOverlay({
                    position,
                    content,
                    yAnchor: 1.3,
                }).setMap(map);
            }
        });

        // 도착지 마커
        if (currentDayData.endLat && currentDayData.endLon) {
            new window.kakao.maps.Marker({
                map,
                position: new window.kakao.maps.LatLng(currentDayData.endLat, currentDayData.endLon),
                title: currentDayData.endName || '도착지',
                image: markerImage,
            });
            path.push(new window.kakao.maps.LatLng(currentDayData.endLat, currentDayData.endLon));
            console.log('도착지 마커 추가:', currentDayData.endName);
        }

        // 경로선 (빨간색 실선)
        if (path.length > 1) {
            new window.kakao.maps.Polyline({
                map,
                path,
                strokeWeight: 5,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeStyle: 'solid',
            });
            console.log('경로선 그리기 완료 - 포인트 수:', path.length);
        }

        // 지도 범위 자동 조정
        if (path.length > 0) {
            const bounds = new window.kakao.maps.LatLngBounds();
            path.forEach(p => bounds.extend(p));
            map.setBounds(bounds);
            console.log('지도 범위 자동 조정 완료');
        }
    }, [currentDayData, currentDay]);

    // ✅ 컴포넌트 마운트 시 일정 데이터 불러오기
    useEffect(() => {
       if (currentItineraryId) {
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

    const handleDelete = async (spotId) => {
        try {
            console.log('🗑️ 삭제 요청:', { 
                itineraryId: currentItineraryId, 
                day: currentDay + 1, 
                spotId 
            });
            
            const response = await axios.delete(
                `http://localhost:8080/api/itinerary/${currentItineraryId}/days/${currentDay + 1}/items/${spotId}`
            );
            
            console.log('✅ 삭제 성공!');
            console.log('📦 응답 데이터:', response.data);
            console.log('📦 응답 items 개수:', response.data.items?.length);
            
            // ✅ 해당 Day만 업데이트
            setScheduleData(prev => {
                const newData = [...prev];
                newData[currentDay] = response.data;
                return newData;
            });
            
        } catch (error) {
            console.error('❌ 삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    // ✅ 순서 변경 핸들러
    const handleReorder = async (newspotIds) => {
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
                    body: JSON.stringify({ spotIds: newspotIds })
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

    // ✅ 시간 포맷팅
    const formatDuration = (minutes) => {
        if (!minutes || minutes === 0) return "0시간";
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours === 0) return `${mins}분`;
        if (mins === 0) return `${hours}시간`;
        return `${hours}시간 ${mins}분`;
    };

    // ✅ 체류 시간 변경 핸들러
    const handleDurationChange = async (spotId, newDuration) => {
        try {
            // 1. 요청 보내기
            const response = await axios.put(
                `http://localhost:8080/api/itinerary/${currentItineraryId}/days/${currentDay + 1}/items/${spotId}/duration`,
                { duration: newDuration }
            );

            console.log('✅ 시간 변경 성공:', response.data);

            // 2. 서버에서 받은 **변경된 Day 하나**만 현재 scheduleData에 반영
            if (response.data && response.data.day) {
                setScheduleData(prev => {
                    const newData = [...prev];
                    // day 번호가 1부터 시작하니, 배열 인덱스는 0부터
                    const targetIndex = newData.findIndex(d => d.day === response.data.day);
                    if (targetIndex !== -1) {
                        newData[targetIndex] = response.data;
                    }
                    return newData;
                });
            }

            alert(`체류 시간이 ${newDuration}분으로 변경되었습니다.`);

        } catch (error) {
            console.error('❌ 시간 변경 실패:', error);
            alert('시간 변경에 실패했습니다.');
            // 필요 시 원래 값 복구 로직 추가 가능
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
                <div ref={mapContainerRef} css={s.kakaoMap} style={{ width: '100%', height: '500px' }} />
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
                            <h3>{formatDuration(currentDayData?.totalDuration || 0)}</h3>
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
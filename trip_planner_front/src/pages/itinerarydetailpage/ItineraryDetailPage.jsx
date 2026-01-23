/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useLocation } from "react-router-dom";
import ItineraryScheduleList from "../../components/itinerary/ItineraryScheduleList";
import * as s from "./styles";
import { useState, useEffect, useRef } from "react";

const createMarkerStyle = (type) => {
    const colors = {
        start: '#FF6B35',
        end: '#FF6B35',
        spot: '#FF6B35'
    };
    
    return `
        background: ${colors[type]};
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        text-align: center;
        line-height: 28px;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
};

const createMarkerOverlay = (map, position, label, type) => {
    const content = `<div style="${createMarkerStyle(type)}">${label}</div>`;
    
    const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 1.3,
    });
    overlay.setMap(map);
    return overlay;
};

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
    const mapRef = useRef(null);
    const overlaysRef = useRef([]);
    const polylineRef = useRef(null);

    // SDK 로드
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            console.log('SDK 이미 준비됨');
            return;
        }

        console.log('카카오맵 SDK 로드 시작');

        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
        script.async = true;

        script.onload = () => {
            console.log('SDK 스크립트 로드 완료');
            window.kakao.maps.load(() => {
                console.log('kakao.maps.load 완료');
            });
        };

        script.onerror = () => {
            console.error('SDK 로드 실패');
            alert('카카오맵 로드 실패 - 앱키와 도메인 등록 확인');
        };

        document.head.appendChild(script);
    }, []);

    // 맵 초기화 & 경로 탐색
    useEffect(() => {
        if (!window.kakao?.maps || !mapContainerRef.current || !currentDayData) {
            console.log('초기화 스킵');
            return;
        }

        console.log('지도 초기화 시작 - Day:', currentDayData.day);

        // 이전 요소 제거
        overlaysRef.current.forEach(o => o.setMap(null));
        overlaysRef.current = [];

        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }

        const map = mapRef.current || new window.kakao.maps.Map(mapContainerRef.current, {
            center: new window.kakao.maps.LatLng(33.5066, 126.4929),
            level: 10,
        });
        mapRef.current = map;

        const bounds = new window.kakao.maps.LatLngBounds();

        // 출발지
        if (currentDayData.startLat && currentDayData.startLon) {
            const pos = new window.kakao.maps.LatLng(currentDayData.startLat, currentDayData.startLon);
            bounds.extend(pos);
            overlaysRef.current.push(createMarkerOverlay(map, pos, '출', 'start'));
        }

        // 경유지
        currentDayData.items?.forEach((item, idx) => {
            if (item.lat && item.lon) {
                const pos = new window.kakao.maps.LatLng(item.lat, item.lon);
                bounds.extend(pos);
                overlaysRef.current.push(createMarkerOverlay(map, pos, idx + 1, 'spot'));
            }
        });

        // 도착지
        if (currentDayData.endLat && currentDayData.endLon) {
            const pos = new window.kakao.maps.LatLng(currentDayData.endLat, currentDayData.endLon);
            bounds.extend(pos);
            overlaysRef.current.push(createMarkerOverlay(map, pos, '도', 'end'));
        }

        // 범위 조정
        if (!bounds.isEmpty()) map.setBounds(bounds);

        // ✅ REST API로 경로 탐색
        if (currentDayData.startLat && currentDayData.startLon && currentDayData.endLat && currentDayData.endLon) {
            fetchDirections(map, currentDayData);
        }
    }, [currentDayData, currentDay]);

    // ✅ Kakao Directions REST API 호출
    const fetchDirections = async (map, dayData) => {
        try {
            const waypoints = dayData.items
                ?.filter(item => item.lat && item.lon)
                .map(item => `${item.lon},${item.lat}`) // 경도,위도 순서
                .join('|');

            const params = new URLSearchParams({
                origin: `${dayData.startLon},${dayData.startLat}`,
                destination: `${dayData.endLon},${dayData.endLat}`,
                priority: 'RECOMMEND',
                car_type: '1',
                car_fuel: 'GASOLINE'
            });

            if (waypoints) {
                params.append('waypoints', waypoints);
            }

            const response = await fetch(
                `https://apis-navi.kakaomobility.com/v1/directions?${params}`,
                {
                    headers: {
                        'Authorization': `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`경로 탐색 실패: ${response.status}`);
            }

            const result = await response.json();
            console.log('경로 탐색 성공!', result);

            if (result.routes && result.routes.length > 0) {
                const route = result.routes[0];
                const roadPath = [];

                route.sections.forEach(section => {
                    section.roads.forEach(road => {
                        for (let i = 0; i < road.vertexes.length; i += 2) {
                            roadPath.push(new window.kakao.maps.LatLng(
                                road.vertexes[i + 1], // 위도
                                road.vertexes[i]      // 경도
                            ));
                        }
                    });
                });

                const polyline = new window.kakao.maps.Polyline({
                    map,
                    path: roadPath,
                    strokeWeight: 6,
                    strokeColor: '#FF6B35',
                    strokeOpacity: 0.9,
                    strokeStyle: 'solid'
                });

                polylineRef.current = polyline;
            }
        } catch (error) {
            console.error('경로 탐색 실패:', error);
            // 경로 탐색 실패 시 단순 직선으로 표시
            drawSimpleLine(map, dayData);
        }
    };

    // ✅ 경로 탐색 실패 시 대체: 단순 직선
    const drawSimpleLine = (map, dayData) => {
        const path = [];
        
        if (dayData.startLat && dayData.startLon) {
            path.push(new window.kakao.maps.LatLng(dayData.startLat, dayData.startLon));
        }
        
        dayData.items?.forEach(item => {
            if (item.lat && item.lon) {
                path.push(new window.kakao.maps.LatLng(item.lat, item.lon));
            }
        });
        
        if (dayData.endLat && dayData.endLon) {
            path.push(new window.kakao.maps.LatLng(dayData.endLat, dayData.endLon));
        }
        
        if (path.length > 1) {
            const polyline = new window.kakao.maps.Polyline({
                map,
                path,
                strokeWeight: 4,
                strokeColor: '#FF6B35',
                strokeOpacity: 0.7,
                strokeStyle: 'shortdash'
            });
            
            polylineRef.current = polyline;
        }
    };

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
            const response = await axios.put(
                `http://localhost:8080/api/itinerary/${currentItineraryId}/days/${currentDay + 1}/items/${spotId}/duration`,
                { duration: newDuration }
            );

            console.log('✅ 시간 변경 성공:', response.data);

            if (response.data && response.data.day) {
                setScheduleData(prev => {
                    const newData = [...prev];
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
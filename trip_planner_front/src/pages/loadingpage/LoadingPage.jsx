/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as s from "./styles";

import foxQuestion from "../../assets/물음표여우.PNG";
import foxTrouble from "../../assets/곤란여우.PNG";
import foxHappy from "../../assets/기쁜여우.PNG";

function LoadingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { travelData } = location.state || {};

    const [progress, setProgress] = useState(1);
    const [isApiComplete, setIsApiComplete] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const phase = useMemo(() => {
        if (progress <= 50) return 1;
        if (progress <= 80) return 2;
        return 3;
    }, [progress]);

    const phaseInfo = useMemo(() => {
        if (phase === 1) {
            return { image: foxQuestion, text: "일정을 생성하고 있어요...", max: 50 };
        }
        if (phase === 2) {
            return { image: foxTrouble, text: "최적 경로를 계산 중...", max: 80 };
        }
        return { image: foxHappy, text: "일정을 거의 완성했어요!", max: 99 };
    }, [phase]);

    const generateItinerary = async (travelData) => {
        // ✅ 1. 전체 데이터 확인
        console.log('🦊 전체 travelData:', travelData);
        console.log('🦊 selectedSpots:', travelData.selectedSpots);
        console.log('🦊 travelInfo:', travelData.travelInfo);
        
        // ✅ 2. dailyLocations 확인
        console.log('🦊 dailyLocations:', travelData.travelInfo?.dailyLocations);
        console.log('🦊 dailyLocations 개수:', travelData.travelInfo?.dailyLocations?.length);
        
        // ✅ 3. 각 일차별 확인
        travelData.travelInfo?.dailyLocations?.forEach((loc, index) => {
            console.log(`🦊 Day ${index + 1}:`, loc);
            console.log(`  - 출발지: ${loc.startName} (${loc.startLat}, ${loc.startLon})`);
            console.log(`  - 도착지: ${loc.endName} (${loc.endLat}, ${loc.endLon})`);
        });

        // ✅ 4. 백엔드로 전송할 데이터 확인
        const requestData = {
            spotIds: travelData.selectedSpots,
            startDate: travelData.travelInfo.dateRange[0],
            endDate: travelData.travelInfo.dateRange[1],
            budget: travelData.travelInfo.totalBudget,
            transport: travelData.travelInfo.transport,
            partyType: travelData.travelInfo.category,
            dailyLocations: travelData.travelInfo.dailyLocations
        };
        
        console.log('🦊 전송할 데이터:', requestData);
        console.log('🦊 dailyLocations 타입:', typeof requestData.dailyLocations);
        console.log('🦊 dailyLocations isArray:', Array.isArray(requestData.dailyLocations));

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/itinerary/generate`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('🦊✨ 백엔드 응답 성공:', response.data);
            console.log('🦊✨ dailyItineraries 개수:', response.data.days?.length); // 👈 추가
            console.log('🦊✨ dailyItineraries 전체:', response.data.days); // 👈 추가
            console.log('🦊✨ itineraryId:', response.data.itineraryId);
            return response;

        } catch (error) {
            console.error('🦊❌ API 호출 실패:', error);
            
            if (error.response) {
                console.error('📛 Response status:', error.response.status);
                console.error('📛 Response data:', error.response.data);
            }
            
            throw error;
        }
    };

    useEffect(() => {
        if (!travelData) {
            alert("여행 정보가 없습니다.");
            navigate("/spots");
            return;
        }

        const generatePlan = async () => {
            try {
                const response = await generateItinerary(travelData);

                setIsApiComplete(true);

                setTimeout(() => {
                    navigate(`/schedule`, {
                        state: { itineraryData: response.data }
                    });
                }, 800);
            } catch (error) {
                console.error("일정 생성 실패:", error);
                alert("일정 생성에 실패했습니다. 다시 시도해주세요.");
                navigate("/travelinfo");
            }
        };

        generatePlan();
    }, [travelData, navigate]);

    useEffect(() => {
        if (isApiComplete) {
            const timer = setInterval(() => {
                setProgress((p) => {
                    if (p >= 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    return p + 3;
                });
            }, 30);
            return () => clearInterval(timer);
        }

        const timer = setInterval(() => {
            setProgress((p) => {
                if (p >= phaseInfo.max) return phaseInfo.max;
                return p + 1;
            });
        }, phase === 1 ? 50 : phase === 2 ? 70 : 100);

        return () => clearInterval(timer);
    }, [phase, phaseInfo.max, isApiComplete]);

    return (
        <div css={s.overlay}>
            <div css={s.centerWrap}>
                <div css={s.foxBox}>
                    <img css={s.foxImage} src={phaseInfo.image} alt="fox" />
                </div>

                <div css={s.message}>{phaseInfo.text}</div>

                <div css={s.progressWrap}>
                    <div css={s.progressTrack}>
                        <div css={s.progressFill(progress)} />
                    </div>
                    <div css={s.percentText}>{progress}%</div>
                </div>
            </div>
        </div>
    );
}

export default LoadingPage;
/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as s from "./styles";

import foxQuestion from "../../assets/물음표여우.PNG";
import foxTrouble from "../../assets/곤란여우.PNG";
import foxHappy from "../../assets/기쁜여우.PNG";

function LoadingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { travelData } = location.state || {};

    const [progress, setProgress] = useState(1);
    const [isApiComplete, setIsApiComplete ] = useState(false);

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

                setTimeout(()=> {
                    navigate(`/schedule`, {
                        state: { itineraryData: response.data }
                    });
                }, 800);
            } catch (error) {
                console.error("일정 생성 실패:",error);
                alert("일정 생성에 실패했습니다. 다시 시도해주세요.");
                navigate("/travelinfo");
            }
        };

        generatePlan();
    }, [travelData, navigate]);

    useEffect(() =>{
        if(isApiComplete) {
            const timer = setInterval(() => {
                setProgress((p)=> {
                    if(p >= 100){
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
                {/* ✅ 고정 박스 */}
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
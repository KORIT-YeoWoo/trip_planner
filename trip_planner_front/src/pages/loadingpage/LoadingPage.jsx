/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useState } from "react";
import * as s from "./styles";

import foxQuestion from "../../assets/물음표여우.PNG";
import foxTrouble from "../../assets/곤란여우.PNG";
import foxHappy from "../../assets/기쁜여우.PNG";

function LoadingPage({ isComplete = false, onDone }) {
    const [progress, setProgress] = useState(1);

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
        if (isComplete) {
        const timer = setInterval(() => {
            setProgress((p) => (p >= 100 ? 100 : p + 2));
        }, 30);
        return () => clearInterval(timer);
        }

        const timer = setInterval(() => {
        setProgress((p) => {
            if (p >= 99) return 99;
            if (p < phaseInfo.max) return p + 1;
            return p + 1;
        });
        }, phase === 1 ? 45 : phase === 2 ? 60 : 80);

        return () => clearInterval(timer);
    }, [phase, phaseInfo.max, isComplete]);

    useEffect(() => {
        if (progress === 100 && onDone) onDone();
    }, [progress, onDone]);

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
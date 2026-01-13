/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useMemo, useState } from "react";
import foxImage from "../../assets/기본.PNG";

function MainPage() {
    const [isHover, setIsHover] = useState(false);

    const rotatingLines = useMemo(
        () => [
            ["가고 싶은 장소를", "자유롭게 선택하세요"],
            ["복잡한 일정 계산은", "여우에게 맡기세요"],
            ["당신에게 딱 맞는 여행을", "경험하세요"],
        ],
        []
    );

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % rotatingLines.length);
        }, 2600);

        return () => clearInterval(intervalId);
    }, [rotatingLines.length]);

    const [line1, line2] = rotatingLines[currentIndex];

    return (
        <div css={s.page}>
            <div css={s.badge}>영리한 여행 도우미</div>

            <main css={s.fox}>
                <h1 css={s.title}>
                    여행의 우선순위,
                    <span css={s.foxText}>여우</span>
                </h1>

                <div css={s.mascotWrap}>
                    <img src={foxImage} alt="fox" css={s.mascot} />
                </div>

                {/* ✅ 여우 아래 문구만 교체 + 전환 애니메이션 재실행 */}
                <p css={s.subtitle} key={currentIndex}>
                    {line1} <br />
                    {line2 === "여우에게 맡기세요" ? (
                        <>
                            <span css={s.foxAccent}>여우</span>에게 맡기세요
                        </>
                    ) : (
                        <span css={s.accentText}>{line2}</span>
                    )}
                </p>

                <button
                    css={[s.button, isHover && s.buttonHover]}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    시작하기
                </button>
            </main>
        </div>
    );
}

export default MainPage;
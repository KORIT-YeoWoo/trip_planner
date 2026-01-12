/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import foxImage from "../../assets/기본.PNG";

function MainPage() {
    const navigate = useNavigate();
    const [isHover, setIsHover] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

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

                    <p css={s.subtitle}>
                        누구나 쉽게 여행 코스를 만들 수 있도록, <br />
                        <span css={s.accentText}>AI가 일정과 동선을 추천</span>해드려요
                    </p>

                    <button
                        css={[s.button, isHover && s.buttonHover]}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        onClick={() => navigate("/spots")}
                        >
                        시작하기
                    </button>

                    <section css={s.cards}>
                        {[0, 1, 2].map((idx) => (
                            <div
                                key={idx}
                                css={[s.card, hoveredCard === idx && s.cardHover]}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                            <div css={s.cardText}>
                                {idx === 0 && (
                                <>
                                    가고 싶은 장소를 <br />
                                    자유롭게 선택하세요
                                </>
                                )}
                                {idx === 1 && (
                                <>
                                    복잡한 일정 계산은 <br />
                                    <span css={s.foxAccent}>여우</span>에게 맡기세요
                                </>
                                )}
                                {idx === 2 && (
                                <>
                                    당신에게 딱 맞는 <br />
                                    여행을 경험하세요
                                </>
                                )}
                            </div>
                            </div>
                        ))}
                </section>
            </main>
        </div>
    );
}
export default MainPage;
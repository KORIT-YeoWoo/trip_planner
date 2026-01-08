/** @jsxImportSource @emotion/react */
import * as styles from "./styles";
import { useState } from "react";
import foxImage from "../assets/기본.PNG";

export default function MainPage() {
    const [isHover, setIsHover] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <div css={styles.page}>
            <div css={styles.badge}>영리한 여행 도우미</div>

                <main css={styles.fox}>
                    <h1 css={styles.title}>
                        여행의 우선순위,
                        <span css={styles.foxText}>여우</span>
                    </h1>

                    <div css={styles.mascotWrap}>
                        <img src={foxImage} alt="fox" css={styles.mascot} />
                    </div>

                    <p css={styles.subtitle}>
                        누구나 쉽게 여행 코스를 만들 수 있도록, <br />
                        <span css={styles.accentText}>AI가 일정과 동선을 추천</span>해드려요
                    </p>

                    <button
                        css={[styles.button, isHover && styles.buttonHover]}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        >
                        시작하기
                    </button>

                    <section css={styles.cards}>
                        {[0, 1, 2].map((idx) => (
                            <div
                                key={idx}
                                css={[styles.card, hoveredCard === idx && styles.cardHover]}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                            <div css={styles.cardText}>
                                {idx === 0 && (
                                <>
                                    가고 싶은 장소를 <br />
                                    자유롭게 선택하세요
                                </>
                                )}
                                {idx === 1 && (
                                <>
                                    복잡한 일정 계산은 <br />
                                    <span css={styles.foxAccent}>여우</span>에게 맡기세요
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
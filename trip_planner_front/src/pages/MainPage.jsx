import styles from "./styles"
import { useState } from "react";
import foxImage from "../assets/기본.PNG";

export default function MainPage() {
    const [isHover, setIsHover] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    return (
        
        <div style={styles.page}>
            <div style={styles.badge}>영리한 여행 도우미</div>

            <main style={styles.fox}>
                <h1 style={styles.title}>
                    여행의 우선순위, <span style={styles.foxText}>여우</span>
                </h1>

                <div style={styles.mascotWrap}>
                    <img
                        src={foxImage}
                        style={styles.mascot}
                    />
                </div>

                <p style={styles.subtitle}>
                    가고 싶은 곳만 선택하면<br />
                    <span style={styles.accentText}>최적의 여행 일정</span>을 만들어드려요
                </p>

                <button
                    style={{
                        ...styles.button,
                        ...(isHover ? styles.buttonHover : {})
                    }}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    여행 계획 세우기
                </button>

                <section style={styles.cards}>
                    {[0, 1, 2].map((idx) => (
                        <div
                            key={idx}
                            style={{
                                ...styles.card,
                                ...(hoveredCard === idx ? styles.cardHover : {})
                            }}
                            onMouseEnter={() => setHoveredCard(idx)}
                            onMouseLeave={() => setHoveredCard(null)}
                            >
                            <div style={styles.cardText}>
                                {idx === 0 && (
                                <>
                                    가고 싶은 장소를 <br />
                                    자유롭게 선택하세요
                                </>
                                )}
                                {idx === 1 && (
                                <>
                                    복잡한 일정 계산은 <br />
                                    <span style={styles.foxAccent}>여우</span>에게 맡기세요
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
    )
}

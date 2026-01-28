/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // AuthContext 임포트
import foxImage from "../../assets/기본.PNG";

function MainPage() {
    const [isHover, setIsHover] = useState(false);
    const navigate = useNavigate();
    
    // AuthContext에서 로그인 상태와 모달 오픈 함수 가져오기
    const { isAuthenticated, openLoginModal } = useAuth();

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
        }, 4000);

        return () => clearInterval(intervalId);
    }, [rotatingLines.length]);

    const [line1, line2] = rotatingLines[currentIndex];

    // 시작하기 버튼 클릭 핸들러
    const handleStartClick = () => {
        if (isAuthenticated) {
            // 로그인 되어 있으면 바로 여행지 선택 페이지로
            navigate("/spots");
        } else {
            // 로그인 안 되어 있으면 로그인 팝업 띄우기
            openLoginModal();
        }
    };

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
                <div css={s.subtitleWrap}>
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
                </div>

                <button
                    css={[s.button, isHover && s.buttonHover]}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={handleStartClick} // 수정된 핸들러 연결
                >
                    시작하기
                </button>
            </main>
        </div>
    );
}

export default MainPage;
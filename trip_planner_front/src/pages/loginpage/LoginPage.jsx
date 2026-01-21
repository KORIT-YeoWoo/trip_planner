/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import * as s from "./styles";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
    // 내부 페이지 이동이 필요할 때를 대비해 유지 (예: 홈으로 가기)
    const navigate = useNavigate();

    const handleOAuth2LoginOnClick = (clientName) => {
        // OAuth2 인증 시작점 (Spring Security 기본 엔드포인트)
        window.location.href = `http://localhost:8080/oauth2/authorization/${clientName}`;
    };

    return (
        <div css={s.layout}>
            <div css={s.container}>
                {/* 왼쪽: 배경 이미지 영역 */}
                <div css={s.leftBackground}></div>

                {/* 오른쪽: 로그인 폼 영역 */}
                <div css={s.rightBackground}>
                    <h1>로그인</h1>
                    <p>여행 계획의 시작, 서비스에 로그인하세요.</p>
                    
                    <div>
                        {/* 네이버 버튼 */}
                        <button css={s.naver} onClick={() => handleOAuth2LoginOnClick("naver")}>
                            <SiNaver />
                            네이버로 시작하기
                        </button>

                        {/* 카카오 버튼 */}
                        <button css={s.kakao} onClick={() => handleOAuth2LoginOnClick("kakao")}>
                            <RiKakaoTalkFill />
                            카카오로 시작하기
                        </button>

                        {/* 구글 버튼 */}
                        <button css={s.google} onClick={() => handleOAuth2LoginOnClick("google")}>
                            <FcGoogle />
                            Google로 시작하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
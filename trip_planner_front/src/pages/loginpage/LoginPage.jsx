/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import * as s from "./styles";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleOAuth2LoginOnClick = (clientName) => {
        window.location.href = `${API_BASE}/oauth2/authorization/${clientName}`;
    };

    return (
        <div css={s.layout}>
            <div css={s.container}>
                <div css={s.leftBackground}></div>
                <div css={s.rightBackground}>
                    <h1>로그인</h1>
                    <p>여행 계획의 시작, 서비스에 로그인하세요.</p>
                    
                    <div>
                        <button css={s.naver} onClick={() => handleOAuth2LoginOnClick("naver")}>
                            <SiNaver />
                            네이버로 시작하기
                        </button>

                        <button css={s.kakao} onClick={() => handleOAuth2LoginOnClick("kakao")}>
                            <RiKakaoTalkFill />
                            카카오로 시작하기
                        </button>

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
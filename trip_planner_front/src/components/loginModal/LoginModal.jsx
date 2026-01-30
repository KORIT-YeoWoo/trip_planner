/** @jsxImportSource @emotion/react */
import * as s from "./styles"; 
import { useAuth } from "../../contexts/AuthContext";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

function LoginModal() {
    const { isLoginModalOpen, closeLoginModal } = useAuth();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    if (!isLoginModalOpen) return null;

    const handleOAuth2LoginOnClick = (clientName) => {
        window.location.href = `${API_BASE}/oauth2/authorization/${clientName}`;
    };

    return (
        <div css={s.overlay} onClick={closeLoginModal}>
            <div css={s.container} onClick={(e) => e.stopPropagation()}>
                {/* 닫기 버튼 */}
                <button css={s.closeBtn} onClick={closeLoginModal}>&times;</button>

                {/* 왼쪽 이미지 영역 */}
                <div css={s.leftBackground} />

                {/* 오른쪽 로그인 폼 영역 */}
                <div css={s.rightBackground}>
                    <h1>여행의 우선순위,여우</h1>
                    <p>여행코스 플랫폼<br/>여우에 로그인하세요.</p>
                    
                    <div>
                        <button css={s.naver} onClick={() => handleOAuth2LoginOnClick("naver")}>
                            <SiNaver /> 네이버로 시작하기
                        </button>

                        <button css={s.kakao} onClick={() => handleOAuth2LoginOnClick("kakao")}>
                            <RiKakaoTalkFill /> 카카오로 시작하기
                        </button>

                        <button css={s.google} onClick={() => handleOAuth2LoginOnClick("google")}>
                            <FcGoogle /> Google로 시작하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
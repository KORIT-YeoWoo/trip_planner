/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as s from "./styles";
import { useAuth } from "../../contexts/AuthContext";

function OAuth2CallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshUser } = useAuth(); // ✅ Context에서 refreshUser 가져오기

    useEffect(() => {
        const handleOAuth2Callback = async () => {
            const accessToken = searchParams.get('accessToken');
            const provider = searchParams.get('provider');

            console.log('OAuth2 콜백 수신:', { accessToken, provider });

            if (accessToken) {
                // ✅ 1. 토큰 저장
                localStorage.setItem('AccessToken', accessToken);
                console.log('✅ 토큰 저장 완료:', accessToken);

                // ✅ 2. 사용자 정보 즉시 갱신
                await refreshUser();

                // ✅ 3. 메인 페이지로 이동
                navigate('/', { replace: true });
            } else {
                console.error('❌ 토큰이 없습니다.');
                alert('로그인에 실패했습니다.');
                navigate('/login', { replace: true });
            }
        };

        handleOAuth2Callback();
    }, [searchParams, navigate, refreshUser]);

    return (
        <div css={s.loadingContainer}>
            <div css={s.spinner}></div>
            <p css={s.loadingText}>로그인 중...</p>
        </div>
    );
}

export default OAuth2CallbackPage;
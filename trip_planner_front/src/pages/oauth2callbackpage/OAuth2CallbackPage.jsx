/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as s from "./styles";

function OAuth2CallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // URL 파라미터에서 토큰 추출
        const accessToken = searchParams.get('accessToken');
        const provider = searchParams.get('provider');

        console.log('OAuth2 콜백 수신:', { accessToken, provider });

        if (accessToken) {
            // ✅ localStorage에 토큰 저장
            localStorage.setItem('AccessToken', accessToken);
            
            console.log('✅ 토큰 저장 완료:', accessToken);

            // ✅ 사용자 정보 확인 (선택사항)
            // fetchUserInfo(accessToken);

            // ✅ 메인 페이지로 리다이렉트
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 500);
        } else {
            console.error('❌ 토큰이 없습니다.');
            alert('로그인에 실패했습니다.');
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div css={s.loadingContainer}>
            <div css={s.spinner}></div>
            <p css={s.loadingText}>로그인 중...</p>
        </div>
    );
}

export default OAuth2CallbackPage;
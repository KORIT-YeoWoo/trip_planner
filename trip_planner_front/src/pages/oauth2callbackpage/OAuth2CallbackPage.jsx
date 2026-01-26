/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as s from "./styles";
import { useAuth } from "../../hooks/useAuth";

function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const hasProcessed = useRef(false); // ✅ 중복 실행 방지

  useEffect(() => {
    // ✅ 이미 처리했으면 리턴
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleOAuth2Callback = async () => {
      const accessToken = searchParams.get("accessToken");
      const provider = searchParams.get("provider");

      console.log("OAuth2 콜백 수신:", { accessToken, provider });

      if (accessToken) {
        try {
          // ✅ 1. 토큰 저장
          localStorage.setItem("AccessToken", accessToken);
          console.log("✅ 토큰 저장 완료:", accessToken);

          // ✅ 2. 사용자 정보 갱신
          await refreshUser();

          // ✅ 3. 메인 페이지로 이동
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 500);
        } catch (error) {
          console.error("❌ 로그인 처리 실패:", error);
          localStorage.removeItem("AccessToken");
          alert("로그인 처리 중 오류가 발생했습니다.");
          navigate("/login", { replace: true });
        }
      } else {
        console.error("❌ 토큰이 없습니다.");
        alert("로그인에 실패했습니다.");
        navigate("/login", { replace: true });
      }
    };

    handleOAuth2Callback();
  }, []); // ✅ searchParams, navigate, refreshUser 의존성 제거

  return (
    <div css={s.loadingContainer}>
      <div css={s.spinner}></div>
      <p css={s.loadingText}>로그인 중...</p>
    </div>
  );
}

export default OAuth2CallbackPage;

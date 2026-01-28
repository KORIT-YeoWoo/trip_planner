/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isButtonHover, setIsButtonHover] = useState(false);
  
  // useAuth에서 필요한 상태와 함수를 가져옵니다.
  const { user, isAuthenticated, logout, loading, openLoginModal } = useAuth();

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  // '여행 계획 세우기' 버튼 클릭 핸들러
  const handlePlanClick = () => {
    if (isAuthenticated) {
      navigate("/spots"); // 로그인 되어 있으면 이동
    } else {
      openLoginModal(); // 로그인 안 되어 있으면 팝업!
    }
  };

  return (
    <header css={s.header}>
      <div css={s.container}>
        <Link to="/" css={s.logo}>
          여우 <span css={{ fontSize: "0.9rem", color: "#6B7280" }}>YEOWOO</span>
        </Link>

        <nav css={s.nav}>
          {!loading && (
            <>
              {isAuthenticated ? (
                <>
                  <span css={s.userName}>
                    {user?.nickname || user?.name || '사용자'}님
                  </span>
                  <Link
                    to="/my"
                    css={{
                      ...s.navLink,
                      ...(hoveredLink === "my" ? s.navLinkHover : {}),
                    }}
                    onMouseEnter={() => setHoveredLink("my")}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    마이페이지
                  </Link>
                  <button
                    css={s.logoutButton}
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <div
                  css={{
                    ...s.navLink,
                    ...(hoveredLink === "login" ? s.navLinkHover : {}),
                    cursor: "pointer"
                  }}
                  onMouseEnter={() => setHoveredLink("login")}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={openLoginModal}
                >
                  로그인
                </div>
              )}
            </>
          )}

          <button
            css={{
              ...s.button,
              ...(isButtonHover ? s.buttonHover : {}),
            }}
            onMouseEnter={() => setIsButtonHover(true)}
            onMouseLeave={() => setIsButtonHover(false)}
            onClick={handlePlanClick} // [수정] 바로 navigate 하지 않고 핸들러 실행
          >
            여행 계획 세우기
          </button>
        </nav>
      </div>
    </header>
  );
}
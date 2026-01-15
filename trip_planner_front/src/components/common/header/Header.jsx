/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Header() {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isButtonHover, setIsButtonHover] = useState(false);

  return (
    <header css={s.header}>
      <div css={s.container}>
        <Link to="/" css={s.logo}>
          여우 <span css={{ fontSize: "0.9rem", color: "#6B7280" }}>YEOWOO</span>
        </Link>

        <nav css={s.nav}>
          <Link
            to="/spots"
            css={{
              ...s.navLink,
              ...(hoveredLink === "spots" ? s.navLinkHover : {}),
            }}
            onMouseEnter={() => setHoveredLink("spots")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            관광지 보기
          </Link>

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
            css={{
              ...s.button,
              ...(isButtonHover ? s.buttonHover : {}),
            }}
            onMouseEnter={() => setIsButtonHover(true)}
            onMouseLeave={() => setIsButtonHover(false)}
            onClick={() => navigate("/itinerary/create")}
          >
            여행 계획 세우기
          </button>
        </nav>
      </div>
    </header>
  );
}
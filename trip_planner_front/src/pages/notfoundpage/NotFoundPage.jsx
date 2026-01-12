/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import * as s from "./styles";
import { useState } from "react";
import notFoundImage from "../../assets/notfound.png"

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  return (
    <div css={s.container}>
      <div css={s.emoji}><img src={notFoundImage} alt="" /></div>
      <h1 css={s.title}>페이지를 찾을 수 없습니다</h1>
      <p css={s.message}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <button
        css={{
          ...s.button,
          ...(isHover ? s.buttonHover : {}),
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => navigate("/")}
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}

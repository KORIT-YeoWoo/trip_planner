/** @jsxImportSource @emotion/react */
import * as s from "./styles";

export default function Loading({ text = "로딩 중..." }) {
  return (
    <div css={s.container}>
      <div css={s.spinner}></div>
      <p css={s.text}>{text}</p>
    </div>
  );
}
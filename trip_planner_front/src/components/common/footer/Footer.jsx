/** @jsxImportSource @emotion/react */
import * as s from "./styles";

export default function Footer() {
  return (
    <footer css={s.footer}>
      <div css={s.container}>
        <div>
          <div css={s.logo}>여우 YEOWOO</div>
          <div css={s.copyright}>
            © 2026 YEOWOO. All rights reserved.
          </div>
        </div>

        <div css={s.links}>
          <a href="#" css={s.link}>
            이용약관
          </a>
          <a href="#" css={s.link}>
            개인정보처리방침
          </a>
          <a href="#" css={s.link}>
            고객센터
          </a>
        </div>
      </div>
    </footer>
  );
}

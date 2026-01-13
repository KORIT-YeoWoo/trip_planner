import { css, keyframes } from "@emotion/react";

export const overlay = css`
    position: fixed;
    inset: 0;
    background: #fbf7f2;
    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;

    /* 스크롤바 유무로 화면 흔들림 방지(브라우저가 지원하면 자동 보정) */
    scrollbar-gutter: stable;
`;

export const centerWrap = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const floatY = keyframes`
    0% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
    100% { transform: translateY(0); }
`;

/* ✅ 핵심: 이미지 “박스”를 고정 */
export const foxBox = css`
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;

    animation: ${floatY} 1.6s ease-in-out infinite;
`;

/* ✅ img는 박스 안에서만 contain */
export const foxImage = css`
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
`;

export const message = css`
    margin-top: 18px;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #111;
`;

export const progressWrap = css`
    margin-top: 26px;
    width: min(680px, 78vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

export const progressTrack = css`
    width: 100%;
    height: 10px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.08);
    overflow: hidden;
`;

export const progressFill = (progress) => css`
    height: 100%;
    width: ${progress}%;
    border-radius: 999px;
    background: #f47a20;
    transition: width 220ms ease;
`;

export const percentText = css`
    font-size: 16px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.45);
`;
import { css, keyframes } from "@emotion/react";

const subtitleRoll = keyframes`
    0% {
        opacity: 0;
        transform: translateY(18px) rotateX(70deg);
        filter: blur(1px);
    }
    60% {
        opacity: 1;
        transform: translateY(0) rotateX(0deg);
        filter: blur(0);
    }
    100% {
        opacity: 1;
        transform: translateY(0) rotateX(0deg);
        filter: blur(0);
    }
`;

export const page = css`
    flex: 1;
    width: 100%;
    background-color: #fbf7f2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 120px 20px 80px;
    margin: 0 auto;
`;

export const badge = css`
    padding: 8px 14px;
    border-radius: 999px;
    background-color: #ffffff;
    border: 1px solid #e9dfd6;
    font-size: 12px;
    color: #777;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
    cursor: default;
`;

export const fox = css`
    margin-top: 32px;
    max-width: 960px;
    width: 100%;
    text-align: center;
    cursor: default;
`;

export const title = css`
    font-size: 45px;
    font-weight: 900;
    letter-spacing: -0.03em;
    margin: 0;
    margin-bottom: 20px;
    color: #111;
    cursor: default;
`;

export const foxText = css`
    color: #ff8a00;
    font-size: 62px;
    margin-left: 10px;
`;

export const mascotWrap = css`
    margin: 20px auto;
`;

export const mascot = css`
    width: 120px;
    height: 120px;
    object-fit: contain;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.1));
`;

export const subtitleWrap = css`
    display: flex;
    justify-content: center;
    perspective: 900px;       /* 3D “뒤로 넘어감” 느낌 핵심 */
    margin-bottom: 20px;
`;

export const subtitle = css`
    font-size: 25px;
    line-height: 1.6;
    color: #333;
    margin: 0;

    transform-origin: 50% 100%;
    transform-style: preserve-3d;
    animation: ${subtitleRoll} 5200ms cubic-bezier(0.2, 0.8, 0.2, 1);
    will-change: transform, opacity, filter;
`;

export const accentText = css`
    color: #f47a20;
    font-weight: 800;
`;

export const foxAccent = css`
    color: #ff8a00;
    font-weight: 800;
`;

export const button = css`
    background-color: #f47a20;
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 22px rgba(244, 122, 32, 0.3);
    transition: all 0.2s ease;
`;

export const buttonHover = css`
    transform: translatey(-2px);
    background-color: #ff761bff;
`;





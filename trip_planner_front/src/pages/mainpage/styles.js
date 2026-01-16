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
    background-color: #fbf7f2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12vh 1.25rem 8vh;
    margin: 0 auto;
`;

export const badge = css`
    padding: 0.5rem 0.875rem;
    border-radius: 999px;
    background-color: #ffffff;
    border: 1px solid #e9dfd6;
    font-size: 0.75rem;  
    color: #777;
    box-shadow:  0 0.375rem 1.125rem rgba(0, 0, 0, 0.04);;
    cursor: default;
`;

export const fox = css`
    margin-top: 2rem;
    max-width: 60rem;
    width: 100%;
    text-align: center;
    cursor: default;
`;

export const title = css`
    font-size: 2.8125rem;   
    font-weight: 900;
    letter-spacing: -0.03em;
    margin: 0 0 1.25rem;
    color: #111;
    cursor: default;
`;

export const foxText = css`
    color: #ff8a00;
    font-size: 3.875rem;   
    margin-left: 0.625rem;
`;

export const mascotWrap = css`
    margin: 1.25rem auto;
`;

export const mascot = css`
    width: 7.5rem;
    height: 7.5rem;
    object-fit: contain;
    filter: drop-shadow(0 0.625rem 1rem rgba(0, 0, 0, 0.1));
`;

export const subtitleWrap = css`
    display: flex;
    justify-content: center;
    perspective: 56.25rem;       /* 3D “뒤로 넘어감” 느낌 핵심 */
    margin-bottom: 1.25rem;
`;

export const subtitle = css`
    font-size: 1.5rem;  
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
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;  
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 0.625rem 1.375rem rgba(244, 122, 32, 0.3);
    transition: all 0.2s ease;
`;

export const buttonHover = css`
    transform: translatey(-0.125rem);
    background-color: #ff761bff;
`;





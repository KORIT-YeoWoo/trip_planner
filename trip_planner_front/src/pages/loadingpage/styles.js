import { css, keyframes } from "@emotion/react";

export const overlay = css`
    position: fixed;
    inset: 0;
    background: #fbf7f2;
    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6vh 1rem;

    scrollbar-gutter: stable;
`;

export const centerWrap = css`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    max-width: 42.5rem;
`;

const floatY = keyframes`
    0% { transform: translateY(0); }
    50% { transform: translateY(-0.375rem); }
    100% { transform: translateY(0); }
`;

export const foxBox = css`
    width: 10rem;
    height: 10rem;
    display: flex;
    align-items: center;
    justify-content: center;

    animation: ${floatY} 1.6s ease-in-out infinite;
`;

export const foxImage = css`
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
`;

export const message = css`
    margin-top: 1.125rem;
    font-size: 1.375rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #111;
`;

export const progressWrap = css`
    margin-top: 1.625rem;
    width: 100%;
    max-width: 42.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
`;

export const progressTrack = css`
    width: 100%;
    height: 0.625rem;
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
    font-size: 1rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.45);
`;
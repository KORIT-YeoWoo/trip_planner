
import { css, keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popIn = keyframes`
  from { transform: translateY(10px) scale(0.985); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

export const overlay = css`
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.38);
    animation: ${fadeIn} 0.18s ease-out;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

export const modal = css`
    width: min(980px, 100%);
    height: min(520px, 92vh);

    border-radius: 26px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
    animation: ${popIn} 0.2s ease-out;

    display: grid;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 920px) {
        height: min(760px, 92vh);
        grid-template-columns: 1fr;
        grid-template-rows: 320px 1fr;
    }
`;

export const left = css`
    position: relative;
    background: #f3f3f3;
`;

export const image = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

export const imagePlaceholder = css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 14px;
`;

export const right = css`
    background: #fbf7f2;
    padding: 26px 26px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
`;

export const topRow = css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
`;

export const titleBlock = css`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const title = css`
    font-size: 26px;
    font-weight: 900;
    color: #222;
    line-height: 1.15;
`;

export const ratingRow = css`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #444;
`;

export const ratingText = css`
    font-size: 16px;
    font-weight: 800;
`;

export const closeBtn = css`
    border: none;
    background: #ffffff;
    border: 1px solid #eadfd6;
    color: #444;
    width: 36px;
    height: 36px;
    border-radius: 12px;
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
        filter: brightness(0.98);
    }
`;

export const tagRow = css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 2px;
`;

export const tag = css`
    font-size: 12px;
    font-weight: 800;
    color: #6b3f1f;
    background: #ffd8bd;
    border-radius: 999px;
    padding: 6px 10px;
`;

export const desc = css`
    margin-top: 4px;
    font-size: 14px;
    color: #333;
    line-height: 1.6;
    white-space: pre-wrap;
`;
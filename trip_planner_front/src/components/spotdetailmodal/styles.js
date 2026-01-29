
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
   min-height: 0; 
    overflow: hidden; 
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
    padding: 15px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid black;
    line-height: 1.6;
    white-space: pre-wrap;
`;

export const reviewSection = css`
  flex: 1;        /* ✅ right 안에서 남는 공간 전부 차지 */
  min-height: 0;

    padding-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
   
`;

export const starInputRow = css`
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const starBtn = (active) => css`
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    color: ${active ? "#f47a20" : "#cfcfcf"};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.12s ease, color 0.12s ease;

    &:hover {
        transform: translateY(-1px);
    }
`;

export const commentBar = css`
    display: flex;
    align-items: center;
    gap: 10px;

    background: #ffd8bd;
    border-radius: 999px;
    padding: 6px 10px 6px 14px;
`;

export const commentInput = css`
    flex: 1;
    border: none;
    outline: none;
    background: transparent;

    font-size: 14px;
    font-weight: 500;
    color: #5a3b22;

    resize: none;
    padding: 2px 0;
    line-height: 1.3;
    max-height: 84px;

    &::placeholder {
        color: rgba(90, 59, 34, 0.55);
        font-weight: 700;
    }
`;

export const sendBtn = (enabled) => css`
    width: 36px;
    height: 36px;
    border-radius: 999px;
    border: none;
    cursor: ${enabled ? "pointer" : "default"};

    background: ${enabled ? "#f47a20" : "rgba(244, 122, 32, 0.35)"};
    color: #fff;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
        filter: ${enabled ? "brightness(0.98)" : "none"};
    }
`;

export const comment = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
`;

export const commentItem = css`
  background: #fff;
  border: 1px solid #eadfd6;
  border-radius: 14px;
  padding: 12px 14px;
`;

export const commentTop = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

export const commentName = css`
  font-weight: 900;
  color: #222;
`;

export const commentStars = css`
  color: #f47a20;
  font-weight: 900;
`;

export const commentContent = css`
  color: #333;
  white-space: pre-wrap;
  line-height: 1.5;
`;

export const commentWrapper = css`
  flex: 1;
  min-height: 0;        /* ⭐ 이것도 중요 */
  overflow-y: auto;     /* ✅ 댓글만 스크롤 */
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.18);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;
import { css } from "@emotion/react";

const colors = {
  background: "oklch(0.99 0.005 85)",
  foreground: "oklch(0.25 0.02 60)",
  card: "oklch(1 0 0)",
  primary: "oklch(0.68 0.18 45)", // 브랜드 오렌지/코랄
  primaryForeground: "oklch(1 0 0)",
  muted: "oklch(0.96 0.01 85)",
  mutedForeground: "oklch(0.55 0.02 60)",
  border: "oklch(0.92 0.01 85)",
  accent: "oklch(0.9 0.08 45)", // 연한 오렌지
  radius: "1rem",
};

export const layout = css`

    display: grid;
    width: 100%;
    flex: 1;        /* 부모가 flex면 이 한 줄이 먹힘 */
    min-width: 0; 
    height: 100%;      /* 전체 높이 고정 */
    overflow: hidden;
    align-items: stretch;
    grid-template-columns: 320px 1fr 320px;
    background-color: ${colors.background};
`;
export const bar = css`
    
  
    height: 100vh;  
    background-color: ${colors.card};
    border-right: 1px solid ${colors.border};
    overflow-y: auto;
    background-color:  ${colors.background};
    
`;


export const content = css`//메인

    padding: 40px;
    overflow-y: auto;
    height: 100%;
    
    h1 {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 30px;
        color: ${colors.foreground};
    }
`;
export const grid = css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
`;


export const card = (select) => css`
    background-color: ${colors.card};
    border: 2px solid ${select ? colors.primary : "transparent"};
    border-radius: ${colors.radius};
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    height: 392px;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
    }
    
  
    &:active:not(:has(button:active)) { 
        transform: translateY(0px) scale(0.98);
    }
`;

export const imageWrapper= css`
  position: relative;
  width: 100%;
  
  height: 280px;        /* 카드 상단 이미지 높이 */
  overflow: hidden;
  background-color: gray;
  
`;
export const image = css`
  position: absolute;
  inset: 0;               /* top:0 left:0 right:0 bottom:0 */
  width: 100%;
  height: 100%;
  
  object-fit: cover;
  transition: transform 0.3s ease;

  
`;
export const emptyImage = css`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 64px;
  background-color: ${colors.muted};
  color: ${colors.mutedForeground};
  user-select: none;
`;
export const heartBtn = (isSelected) => css`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10; /* 이미지나 여우 아이콘보다 위에 위치 */

  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  
  /* 아이콘 색상 및 그림자 처리 */
  color: ${isSelected ? "#ff4d4d" : "white"}; 
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5));
  
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.9);
  }
`;
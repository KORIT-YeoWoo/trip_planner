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
    flex: 1;       
    min-width: 0; 
    
    overflow: hidden;
    align-items: stretch;
    grid-template-columns: 320px 1fr 320px;
    background-color: ${colors.background};
`;
export const bar = css`
    
    padding: 20px;
    height: 100%;  
    background-color: ${colors.card};
    border-right: 1px solid ${colors.background};
    overflow-y: auto;
    background-color:  ${colors.background};
    
`;


export const content = css`//메인
  
    padding: 40px;
    
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
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
`;


export const card = (select) => css`
  background-color: ${colors.card};
  border: 2px solid ${select ? colors.primary : "transparent"};
  border-radius: ${colors.radius};
  overflow: hidden;
  padding:0px;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
  }
`;
export const imageWrapper = css`
  position: relative;
  width: 100%;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  flex-shrink: 0;
  background-color: gray;

`;
export const image = css`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;


  object-fit: cover;

`;

export const emptyImage = css`
  position: absolute;
  inset: 0;
  
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 64px;
  background-color: ${colors.muted};

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
export const title = css`
  font-weight: 700;
  font-size: 13px;

  color: ${colors.foreground};

  text-align: center;
  margin: 0;
  padding: 10px 5px;
  text-align: center;
`;

export const overlay = css`
  position:absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent; 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  overflow: hidden;
`;
export const favoritContent = css`
  width: 90%;
  
  height: 80%;
  background-color: white;
  border-radius: ${colors.radius};
  transform: translateY(-5%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;


  h1 {
    font-size: 24px;
    font-weight: 800;
    color: ${colors.foreground};
    margin-bottom: 30px;
    text-align: left;
    margin:20px ;
  }
`;

export const gridScroll = css`
  flex: 1; 
  overflow-y: auto; 
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  


  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;



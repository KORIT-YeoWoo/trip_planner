import { css } from "@emotion/react";

// 1. CSS에서 정의된 변수들을 상수로 관리 (여우 브랜드 테마)
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
  flex: 1;
  display: grid;

  min-height: 100vh;
  align-items: stretch;
  grid-template-columns: 320px 1fr 320px;
  background-color: ${colors.background};
`;


export const selectedSection = css`
  
  padding: 20px;
  border-right: 1px solid ${colors.background};
  background-color: ${colors.card};
  min-width: 260px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-x: hidden;
  background-color: ${colors.background};

  h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    color: white;
  }
`;


export const spotSelectList = css`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${colors.card};
  flex: 1;
  overflow-y: auto;
`;

export const spotSelectItem = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid ${colors.border};
  border-radius: ${colors.radius};
  background: ${colors.background};
  transition: border-color 0.2s;
  overflow: hidden;
  &:hover {
    border-color: ${colors.primary};
  }
`;

export const spotSelectText = css`
  font-size: 14px;
  font-weight: 600;
  min-width: 0;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const selectedListWrapper = css`
  margin-top: 100px;
  border-radius: ${colors.radius};
  background-color: ${colors.card};
 
  max-height: calc(100vh - 80px); 
  overflow-y: auto;
  min-height: 400px;
  flex-direction: column;
  display: flex;

  box-shadow:  0 4px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid ${"transparent"};
  
`;


export const removeBtn = css`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: ${colors.mutedForeground};
  line-height: 1;
  padding: 4px 6px;
  border-radius: 6px;

  &:hover {
    background: ${colors.muted};
    color: ${colors.primary};
  }
`;

export const card = (select) => css`
  margin-bottom: 0; /* 그리드 갭이 있으므로 0으로 조정 */
  padding: 0;
  background-color: ${colors.card};
  border: 2px solid ${select ? colors.primary : "transparent"};
  border-radius: ${colors.radius};
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  
  
 
  height: 392px;
  gap:24px;

  &:hover {
    
    transform: translateY(-4px);
    border-color: ${select ? colors.primary : colors.accent};
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
  }
  &:active:not(:has(button:active)) { 
    /* 버튼이 active 상태가 아닐 때만 카드가 active 효과를 받음 */
    transform: translateY(0px) scale(0.98);
  }
`;



export const grid = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 40px;
`;

export const title = css`
  font-weight: bold;
  font-size: 17px;
  color: ${colors.foreground};
  margin-bottom: 6px;
`;

export const searchBar = css`
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 10px 0 16px;
  width: 96%;
`;

export const searchInput = css`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${colors.border};
  border-radius: ${colors.radius};
  background-color: ${colors.card};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${colors.primary};
  }
`;

export const categoryBar = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0 24px;
`;

export const categoryBtn = (active) => css`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid ${active ? colors.primary : colors.border};
  background: ${active ? colors.primary : colors.card};
  color: ${active ? colors.primaryForeground : colors.foreground};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  gap: 6px;
  
  &:hover {
    border-color: ${colors.primary};
    background: ${active ? colors.primary : colors.muted};
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

export const cardBody = css`
  position: relative;          
  padding: 12px 14px 18px;
  min-height: 80px;            
`;

export const detailBtn = css`
  position: absolute;
  right: 12px;
  bottom: 10px;

  height: 28px;
  padding: 0 12px;

  border: none;
  border-radius: 999px;

  background: rgba(244, 122, 32, 0.18);
  color: #f47a20;

  font-size: 12px;
  font-weight: 700;
  line-height: 28px;

  cursor: pointer;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);

  &:hover {
    background: rgba(244, 122, 32, 0.26);
  }

  &:active {
    transform: scale(0.97);
  }
`;
export const chatBtn = css`
  border: none;
  background-color: white;   
  cursor: pointer;

  position: fixed;
  bottom: 30px;     
  right: 30px;       
  z-index: 9999;

  width: 56px;
  height: 56px;
  border-radius: 50%;      

  display: flex;
  align-items: center;
  justify-content: center;


  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    background-color: ${colors.muted};  /* 살짝 회색 */
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;

 
    pointer-events: none;
  }
`;



export const info = css`
  display: flex;
  gap: 12px;
  margin-top: 6px;
  font-size: 13px;
  color: #666;

`;
export const sHeader = css`
    background-color: ${colors.primary};
    margin: 0;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
`;
export const sinfo = css`
    padding: 15px;
 
    
    text-align: center;
    
    p {
        margin: 4px 0;
        font-size: 14px;
        background-color: transparent;
        height: 50px;
        font-weight: 100;
        color: gray;
    }
`;
export const btnwrap = css`
    padding: 20px;
    
    border-top: 1px solid ${colors.border}; /* 선택 목록과 버튼 사이에 경계선 추가 */
    background-color: ${colors.card}; /* 배경색 통일 */
    position: sticky;
    bottom: 0;
`;
export const sclick = css`
    border: none;
    width: 100%; /* 부모(btnwrap)가 준 여백 안에서 100%를 차지합니다 */
    padding: 16px;
    border-radius: 12px;
    background-color: ${colors.primary};
    color: black;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s, filter 0.2s;
    

    /* 기존에 가로 스크롤을 유발하던 margin과 calc width는 삭제하세요! */

    &:hover { 
        filter: brightness(1.1); 
    }
    
    &:active { 
        transform: scale(0.98); 
    }
    
    &:disabled {
        background-color: #ccc;
        cursor: default;
    }
`;
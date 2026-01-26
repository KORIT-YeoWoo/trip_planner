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
export const styleContent = css`
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


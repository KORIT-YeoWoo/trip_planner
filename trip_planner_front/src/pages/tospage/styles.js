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
    height: calc(100vh - 73px - 76px);
    overflow: hidden;
    align-items: stretch;
    grid-template-columns: 320px 1fr 320px;
    background-color: ${colors.background};
`;
export const bar = css`
    
    padding: 20px;
    height: 100%;  
    background-color: ${colors.card};
    border-right: 1px solid ${colors.border};
    overflow: hidden;
    background-color:  ${colors.background};
    
`;


export const content = css`//메인
    overflow-y: auto;  
    overflow-x: hidden;


  &::-webkit-scrollbar {
    display: none;
  }

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
export const title = css`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 40px;
`;

export const section = css`
    margin-bottom: 32px;

    h2 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
    }

    p {
        font-size: 15px;
        margin-bottom: 10px;
    }

    ul {
        padding-left: 20px;
    }

    li {
        font-size: 15px;
        margin-bottom: 6px;
    }
`;
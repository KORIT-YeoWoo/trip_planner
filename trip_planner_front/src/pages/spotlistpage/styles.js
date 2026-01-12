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
  display: grid;
  gap: 0; /* 테두리 정렬을 위해 0으로 조정 */
  min-height: 100vh;
  align-items: stretch;
  grid-template-columns: 320px 1fr;
  background-color: ${colors.background};
`;

export const selectedSection = css`
  flex: 1;
  padding: 20px;
  border-right: 1px solid ${colors.border};
  background-color: ${colors.card};
  min-width: 260px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  background-color: ${colors.background};
`;

/* ✅ 왼쪽 리스트 */
export const spotSelectList = css`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${colors.background};
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

  &:hover {
    border-color: ${colors.primary};
  }
`;

export const spotSelectText = css`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const selectedListWrapper = css`
  margin-top: 12px;

  /* ✅ 제목(h2) 제외한 영역만 스크롤 */
  max-height: calc(100vh - 80px); 
  overflow-y: auto;
  border: 1px solid black;
  padding-right: 4px; /* 스크롤바 여백 */
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
  &:active {
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
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid ${active ? colors.primary : colors.border};
  background: ${active ? colors.primary : colors.card};
  color: ${active ? colors.primaryForeground : colors.foreground};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary};
    background: ${active ? colors.primary : colors.muted};
  }
`;
import { css } from "@emotion/react";

const colors = {
  background: "oklch(0.99 0.005 85)",
  foreground: "oklch(0.25 0.02 60)",
  card: "oklch(1 0 0)",
  primary: "oklch(0.68 0.18 45)",
  primaryForeground: "oklch(1 0 0)",
  muted: "oklch(0.96 0.01 85)",
  mutedForeground: "oklch(0.55 0.02 60)",
  border: "oklch(0.92 0.01 85)",
  accent: "oklch(0.9 0.08 45)",
  radius: "1rem",
  danger: "#ff4d4d", //  삭제 버튼 색상
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
    background-color: ${colors.background};
    border-right: 1px solid ${colors.border};
    overflow-y: auto;
`;

export const content = css`
    padding: 40px;
    height: 100%;
    position: relative;
`;

export const overlay = css`
    position: absolute;
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
    overflow: hidden;

    h1 {
        font-size: 24px;
        font-weight: 800;
        color: ${colors.foreground};
        margin: 20px;
        flex-shrink: 0;
    }
`;

export const listScroll = css`
    flex: 1;
    overflow-y: auto;
    padding: 0 20px 20px 20px;

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

export const listItem = css`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    margin-bottom: 12px;
    background-color: ${colors.card};
    border: 1px solid ${colors.border};
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${colors.muted};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
`;

export const thumbnail = css`
    width: 120px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    background-color: ${colors.muted};

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const emptyThumbnail = css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    background-color: ${colors.muted};
`;

export const info = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
`;

export const infoHeader = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    h3 {
        font-size: 18px;
        font-weight: 700;
        color: ${colors.foreground};
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const date = css`
    font-size: 14px;
    color: ${colors.mutedForeground};
    white-space: nowrap;
    flex-shrink: 0;
`;

export const details = css`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: ${colors.mutedForeground};
    flex-wrap: wrap;

    span {
        white-space: nowrap;
    }
`;

export const tag = css`
    padding: 4px 12px;
    background-color: ${colors.accent};
    color: ${colors.primary};
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
`;

//  삭제 버튼 (화살표 대체)
export const deleteBtn = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: ${colors.mutedForeground};
    border-radius: 8px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;

    &:hover {
        background-color: ${colors.danger};
        color: white;
    }

    &:active {
        transform: scale(0.95);
    }
`;

export const empty = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: ${colors.mutedForeground};

    div {
        font-size: 18px;
    }

    button {
        padding: 12px 24px;
        background: ${colors.primary};
        color: white;
        border: none;
        border-radius: ${colors.radius};
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    }
`;

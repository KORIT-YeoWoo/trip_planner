/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const colors = {
    primary: "#E66B23",
    text: "#333333",
    subText: "#666666",
    border: "#E0E0E0",
    white: "#FFFFFF",
};

export const container = css`
    width: 279px; /* 사이드바 너비에 맞춤 */
    background-color: ${colors.white};
    border-radius: 20px;
    border: 1px solid ${colors.border};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

export const hi = css`
    background-color: ${colors.primary};
    padding: 24px 20px;
    text-align: center;
    color: ${colors.white};
`;

export const profileWrapper = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

export const nicknameDisplay = css`
    display: flex;
    align-items: center;
    gap: 8px;
    h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
    }
`;

export const userEmail = css`
    margin: 0;
    font-size: 13px;
    opacity: 0.9;
`;

/* 닉네임 수정 폼 */
export const nicknameEdit = css`
    display: flex;
    gap: 5px;
    justify-content: center;
`;

export const nicknameInput = css`
    width: 120px;
    padding: 4px 8px;
    border-radius: 4px;
    border: none;
    font-size: 14px;
`;

export const saveButton = css`
    background: ${colors.white};
    color: ${colors.primary};
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
`;

export const cancelButton = css`
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
`;

export const editButton = css`
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid white;
    color: white;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    cursor: pointer;
    &:hover { background: white; color: ${colors.primary}; }
`;

const menuItem = css`
    display: flex;
    align-items: center;
    padding: 18px 24px;
    border-bottom: 1px solid ${colors.border};
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: ${colors.text};
    transition: background 0.2s;
    svg { font-size: 20px; margin-right: 12px; flex-shrink: 0; }
    &:hover { background-color: #F9F9F9; }
`;

export const booking = css`${menuItem};`;
export const favorite = css`${menuItem};`;
export const myTripStyle = css`${menuItem};`;
export const logout = css`
    ${menuItem};
    border-bottom: none;
    color: ${colors.subText};
    svg { color: ${colors.subText}; }
`;
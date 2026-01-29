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
    width: 279px; 
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

export const nameDisplay = css`
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
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const colors = {
    primary: "#E66B23", // 이미지의 오렌지색
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
    padding: 20px;
    text-align: center;
    
    h2 {
        margin: 0;
        color: ${colors.white};
        font-size: 20px;
        font-weight: 600;
        
        
    }
`;

// 공통 메뉴 스타일 (아이콘과 텍스트 정렬)
const menuItem = css`
    display: flex;
    align-items: center;
    padding: 18px 24px;
    border-bottom: 1px solid ${colors.border};
    cursor: pointer;
    font-size: 18px;
    font-weight: 500;
    color: ${colors.text};
    transition: background 0.2s;

    svg {
        font-size: 24px;
        margin-right: 15px;
        flex-shrink: 0;
    }

    &:hover {
        background-color: #F9F9F9;
    }
`;

export const booking = css`${menuItem};`;
export const favorite = css`${menuItem};`;
export const myTripStyle = css`${menuItem};`;

export const logout = css`
    ${menuItem};
    border-bottom: none; // 마지막 항목은 구분선 제거
    color: ${colors.subText};

    svg {
        color: ${colors.subText};
    }
`;
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import loginBg from "../../assets/기본.PNG";

// 모달 배경 (어두운 투명층)
export const overlay = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
`;

// 기존 container 스타일을 유지하되, 모달용으로 너비 조정
export const container = css`
    display: flex;
    border-radius: 15px;
    width: 800px; 
    height: 500px;
    background-color: #ffffff;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
`;

// 닫기 버튼 추가 (선택 사항)
export const closeBtn = css`
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
    z-index: 10;
    &:hover { color: #333; }
`;

export const leftBackground = css`
    flex: 1.2; 
    background-image: url(${loginBg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, rgba(0,0,0,0.2), transparent);
    }
`;

export const rightBackground = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 380px; 
    padding: 40px;

    & > h1 {
        margin: 0;
        font-size: 30px;
        color: #222222;
        font-weight: 700;
    }

    & > p {
        margin: 10px 0 35px 0;
        font-size: 20px;
        color: #666666;
        text-align: center;
    }

    & > div {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 12px;

        & > button {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            width: 100%;
            height: 48px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease-in-out;

            &:hover {
                filter: brightness(0.95);
                transform: translateY(-1px);
            }
        }
    }
`;

export const naver = css`
    background-color: #03c75a;
    color: #ffffff;
    border: none;
`;

export const kakao = css`
    background-color: #fee500;
    color: #181600;
    border: none;
`;

export const google = css`
    background-color: #ffffff;
    color: #3c4043;
    border: 1px solid #dadce0;
`;
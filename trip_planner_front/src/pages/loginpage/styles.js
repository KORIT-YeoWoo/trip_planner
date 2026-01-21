/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import loginBg from "../../assets/기본.PNG"; // 이미지 경로 확인 필수

export const layout = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh; /* 화면 전체 높이 사용 */
    background-color: #f5f5f5;
`;

export const container = css`
    display: flex;
    border-radius: 15px;
    width: 900px; /* 고정 너비로 안정감 부여 */
    height: 600px;
    background-color: #ffffff;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

export const leftBackground = css`
    flex: 1; /* 왼쪽 영역 유연하게 확장 */
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
    justify-content: center; /* 세로 중앙 정렬 */
    align-items: center;
    width: 450px; /* 로그인 폼 너비 고정 */
    padding: 60px;

    & > h1 {
        margin: 0;
        font-size: 28px;
        color: #222222;
        font-weight: 700;
    }

    & > p {
        margin: 10px 0 40px 0;
        font-size: 15px;
        color: #666666;
    }

    & > div {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 12px; /* 버튼 간격 */

        & > button {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            width: 100%;
            height: 48px; /* 버튼 높이 상향 */
            border: 1px solid #dbdbdb;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease-in-out;

            &:hover {
                filter: brightness(0.95);
                transform: translateY(-1px);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }
`;

export const naver = css`
    background-color: #03c75a;
    color: #ffffff;
    border: none !important;
    
    & > svg {
        font-size: 14px;
    }
`;

export const kakao = css`
    background-color: #fee500;
    color: #181600;
    border: none !important;

    & > svg {
        font-size: 18px;
    }
`;

export const google = css`
    background-color: #ffffff;
    color: #3c4043;
    border: 1px solid #dadce0 !important;

    & > svg {
        font-size: 18px;
    }
`;
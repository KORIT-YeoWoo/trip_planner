import { css } from "@emotion/react";

export const layout = css`
    flex: 1;
    display: flex;
    width: 100%;
    
`;

export const container = css`
    display: flex;
    width: 100%;
    
`;

export const map = css`
    flex: 0.4;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`;

export const mapInfo = css`
    height: 70px;
    background-color: #ff6b35;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    
    & > h3 {
        font-size: 1.5rem;
        padding-left: 30px;
        color: #ffffff;
    }
`;

export const locationInfo = css`
    display: flex;
    gap: 20px;
    font-size: 0.9rem;
    
    & > div {
        display: flex;
        align-items: center;
        gap: 8px;
        
        & > span:first-of-type {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 10px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.85rem;
        }
        
        & > span:last-of-type {
            font-weight: 500;
        }
    }
`;

export const kakaoMap = css`
    width: 100%;
    flex: 1;
    position: relative;
    min-height: 500px;
    background: #f0f0f0;

`;

export const scheduleWrap = css`
    flex: 0.6;
    display: flex;
    flex-direction: column;  
`;

export const dayTap = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 70px;
    width: 100%;
    font-size: 1rem;
    background-color: oklch(0.99 0.005 85);
`;

export const dayTab = (isActive) => css`
    padding: 12px 20px;
    cursor: pointer;
    border-bottom: 3px solid ${isActive ? '#FF6B35' : 'transparent'};
    background-color: ${isActive ? '#FFF5F2' : 'transparent'};
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #FFF5F2;
    }
`;

export const daylist = css`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    list-style: none;

    & > li{
        width: 250px;
        border: 1px solid #333;
        border-radius: 20px;
        box-sizing: border-box;
        padding: 10px;
        text-align: center;
    }
    
`;

export const edit = css`
    width: 10%;
    display: flex;
    justify-content: center;
`;

export const editBtn = css`
    width: 80px;
    border: 1px solid #333;
    border-radius: 20px;
    padding: 10px;
    background: none;
    font-family: 'SchoolSafetyNotification';
    font-size: 1rem;
`;

export const schedule = css`
    display: flex;
    flex-direction: column;  
    flex: 1;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    box-sizing: border-box;
    background-color: oklch(0.96 0.01 85);
    max-height: 690px;
`;

export const summary = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
    height: 70px;
    background-color: oklch(0.99 0.005 85);
`;

export const summaryInfo = css`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 600px;
    height: 70px;
    background-color: oklch(0.99 0.005 85);

    & > div{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 1rem;
        color: #999;

        & > p,h3{
            margin: 0;
        }

        & > h3{
            font-size: 1.5rem;
            color: #333;

            & > span {
                font-size: 1rem;
                color: #999;
            }
        }
    }
`;

export const createItinerary = css`
    border: none;
    background-color: #ff6b35;
    width: 200px;
    border-radius: 50px;
    padding: 0;
    font-family: 'SchoolSafetyNotification';
    font-size: 1.2rem;
    color: #ffffff;
`;
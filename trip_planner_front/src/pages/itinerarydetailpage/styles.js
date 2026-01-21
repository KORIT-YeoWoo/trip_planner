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
    flex: 0.4;                // 비율 유지
    display: flex;
    flex-direction: column;
    height: 100vh;            // 전체 화면 높이로 강제 (또는 calc(100vh - 헤더높이))
    overflow: hidden;
`;

export const mapInfo = css`
    height: 70px;
    background-color: #ff6b35;
    display: flex;
    align-items: center;
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

export const kakaoMap = css`
    width: 100%;
    height: 100%;             // 부모 높이를 100% 채움 (필수!)
    position: relative;       // 오버레이/마커 위치 제어용
    min-height: 500px;        // 최소 높이 보장 (여백 방지)
    background: #f0f0f0;      // 로딩 중 빈 공간 방지용 회색

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
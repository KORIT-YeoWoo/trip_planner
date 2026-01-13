import { css } from "@emotion/react";

export const page = css`
  display: flex; flex-direction: column; min-height: 100vh;
  background-color: #fbf9f7; font-family: 'Pretendard', sans-serif;
  padding-bottom: 100px; box-sizing: border-box;
`;

export const header = css`
  padding: 15px 20px; background: white; display: flex; justify-content: center; border-bottom: 1px solid #f0e6de;
`;

export const logoText = css` font-size: 20px; font-weight: 900; color: #333; `;
export const yeowooText = css` font-size: 14px; font-weight: 700; color: #ef6c22; margin-left: 4px; `;

export const stepContainer = css` display: flex; justify-content: center; align-items: center; padding: 15px; gap: 8px; `;
export const stepItem = (isActive) => css`
  padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;
  background: ${isActive ? "#ef6c22" : "#eee"}; color: ${isActive ? "white" : "#999"};
`;

export const mainCard = css`
  flex: 1; background: white; margin: 0 16px 20px; border-radius: 24px; padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03); 
  display: flex; flex-direction: column; justify-content: center; align-items: center; 
`;

export const sectionTitle = css` font-size: 18px; font-weight: 800; margin-bottom: 20px; color: #333; `;

/* 📅 달력 & 오늘 표시 (노란색) */
export const dateBox = css`
  width: 100%; max-width: 320px;
  .react-calendar { width: 100%; border: none; font-size: 13px; }
  .react-calendar__tile--now {
    background: none !important;
    abbr { background: #ffd700 !important; color: #333 !important; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto; }
  }
  .react-calendar__tile--active abbr {
    background: #ef6c22 !important; color: white !important; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto;
  }
`;

export const configBtn = css`
  width: 100%; max-width: 320px; margin-top: 15px; padding: 14px; border-radius: 12px;
  background: #fdf0e9; color: #ef6c22; border: 1px dashed #ef6c22; font-weight: 700; font-size: 14px; cursor: pointer;
`;

/* 👛 예산 (요청하신 퍼센트 반영) */
export const budgetWrapper = css`
  width: 100%; max-width: 300px; display: flex; flex-direction: column; align-items: center;
  .price { font-size: 32px; font-weight: 900; color: #ef6c22; margin-bottom: 10px; }
  input { width: 100%; margin: 20px 0; accent-color: #ef6c22; }
`;
export const budgetRow = css` width: 100%; display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f9f9f9; font-size: 14px; color: #666; `;

/* 👥 인원 설정 (중앙 배치) */
export const counterWrap = css`
  display: flex; align-items: center; justify-content: center; gap: 30px; margin: 10px 0 30px;
  .num { font-size: 40px; font-weight: 900; color: #333; min-width: 80px; text-align: center; }
  button { width: 50px; height: 50px; border-radius: 50%; border: 2px solid #ef6c22; background: white; color: #ef6c22; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
`;

export const grid2 = css` display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 300px; `;
export const gridBtn = (isSelected) => css`
  padding: 16px; border-radius: 16px; border: 2px solid ${isSelected ? "#ef6c22" : "#f0f0f0"};
  background: ${isSelected ? "#fdece6" : "white"}; cursor: pointer; text-align: center;
  .icon { font-size: 22px; display: block; margin-bottom: 4px; } .label { font-size: 14px; font-weight: 700; color: ${isSelected ? "#ef6c22" : "#666"}; }
`;

/* ⏰ 팝업 모달 스타일 */
export const modalOverlay = css` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; `;
export const modalContent = css` background: white; width: 85%; max-width: 340px; border-radius: 20px; padding: 25px; max-height: 70vh; overflow-y: auto; `;

export const bottomBar = css` position: fixed; bottom: 0; width: 100%; max-width: 600px; left: 50%; transform: translateX(-50%); background: white; padding: 12px 20px; display: flex; gap: 10px; border-top: 1px solid #eee; `;
export const nextBtn = (disabled) => css` flex: 1; padding: 16px; border-radius: 14px; border: none; background: ${disabled ? "#eee" : "#ef6c22"}; color: ${disabled ? "#aaa" : "white"}; font-weight: 800; cursor: pointer; `;
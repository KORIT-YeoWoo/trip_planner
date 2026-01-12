import { css } from "@emotion/react";

export const page = css`
  min-height: 100vh;
  background-color: #fbf9f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 85px;
  padding-bottom: 100px;
  box-sizing: border-box;
`;

export const header = css`
  position: fixed; top: 0; left: 0; width: 100%; height: 85px;
  background-color: #ffffff; border-bottom: 1px solid #f0e6de; z-index: 1000;
  display: flex; align-items: center;
`;

export const logo = css`
  position: absolute; left: 131px; display: flex; align-items: baseline;
  font-family: 'Hakgyoansim Allimjang', sans-serif;
`;

export const logoText = css` font-size: 32px; font-weight: 900; color: #000; `;
export const yeowooText = css` font-size: 22px; font-weight: 700; color: #ef6c22; margin-left: 6px; `;

/* 이미지 기반 스텝바 디자인 */
export const stepContainer = css`
  display: flex; align-items: center; gap: 10px; margin: 40px 0;
`;

export const stepCircle = (isActive) => css`
  width: 44px; height: 44px; border-radius: 50%;
  border: 2px solid ${isActive ? '#ef6c22' : '#eee'};
  background: ${isActive ? '#ef6c22' : '#fff'};
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s;
  img, svg { width: 22px; height: 22px; filter: ${isActive ? 'brightness(0) invert(1)' : 'none'}; }
`;

export const stepLongCapsule = css`
  background: #ef6c22; color: #fff; padding: 10px 20px;
  border-radius: 30px; display: flex; align-items: center; gap: 8px;
  font-weight: 800; font-size: 16px;
`;

export const stepLine = css`
  width: 50px; height: 1.5px; background: #eee;
`;

/* 메인 컨텐츠 영역 */
export const mainCard = css`
  width: 90%; max-width: 500px; background: #fff; border-radius: 24px;
  padding: 40px 30px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex; flex-direction: column; align-items: center;
`;

/* 하단 버튼 바 */
export const bottomBar = css`
  position: fixed; bottom: 0; left: 0; width: 100%; height: 85px;
  background: #fff; border-top: 1px solid #eee; display: flex;
  justify-content: center; align-items: center; gap: 15px; z-index: 1000;
`;

export const prevBtn = css`
  width: 120px; height: 55px; background: #f5f5f5; color: #999;
  border: none; border-radius: 14px; font-weight: 700; cursor: pointer;
`;

export const nextBtn = (disabled) => css`
  width: 280px; height: 55px; 
  background: ${disabled ? '#ccc' : '#ef6c22'}; 
  color: #fff; border: none; border-radius: 14px; 
  font-weight: 700; cursor: pointer;
`;

/* 기존 모달 & 달력 스타일 동일 유지 (중략) */
export const dateSelectionBox = css`
  width: 100%; margin-bottom: 25px;
  .react-calendar { width: 100%; border: none; }
  .react-calendar__tile--now abbr { background: #fdece6; border-radius: 50%; color: #ef6c22; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
  .react-calendar__tile--active abbr { background: #ef6c22 !important; color: #fff !important; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
`;
export const resultBar = css` width: 100%; padding: 15px; background: #fdece6; border-radius: 10px; color: #ef6c22; font-weight: 700; text-align: center; cursor: pointer; `;
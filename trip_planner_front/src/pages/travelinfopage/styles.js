import { css } from "@emotion/react";

export const 전체페이지 = css`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100vh; background-color: #f8f9fa; padding: 10px; overflow: hidden;
`;

export const 단계진행바 = css` display: flex; gap: 10px; margin-bottom: 15px; `;

export const 단계아이템 = (활성) => css`
  display: flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 50px;
  background: ${활성 ? "#FF6B00" : "white"}; color: ${활성 ? "white" : "#adb5bd"};
  font-weight: 700; font-size: 13px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

export const 메인카드 = css`
  background: white; border-radius: 25px; width: 95%; max-width: 920px;
  padding: 25px 35px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
`;

export const 헤더안내 = css` margin-bottom: 20px; h2 { font-size: 20px; font-weight: 800; margin: 0; color: #333; } `;

export const 콘텐츠가로배치 = css` display: flex; gap: 35px; align-items: flex-start; `;

export const 달력영역 = css`
  flex: 1.3; min-width: 380px;
  .react-calendar { width: 100%; border: none; font-size: 14px; }
  .react-calendar__month-view__weekdays {
    padding-bottom: 10px;
    abbr { text-decoration: none; font-size: 14px; font-weight: 800; color: #bbb; }
  }
  .react-calendar__month-view__weekdays__weekday:nth-of-type(1) abbr { color: #e54d42; } /* 일요일 헤더 */
  .react-calendar__month-view__weekdays__weekday:nth-of-type(7) abbr { color: #3973ac; } /* 토요일 헤더 */

  .react-calendar__month-view__days__day:nth-of-type(7n+1) { color: #e54d42 !important; } /* 일요일 날짜 */
  .react-calendar__month-view__days__day:nth-of-type(7n) { color: #3973ac !important; } /* 토요일 날짜 */

  .react-calendar__tile { padding: 16px 0 !important; font-size: 15px; font-weight: 600; }

  /* 오늘 날짜 (평상시 노란 동그라미) */
  .react-calendar__tile--now {
    background: transparent !important;
    abbr {
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; background: #FFD400; border-radius: 50%;
      color: black !important; margin: 0 auto;
    }
  }

  /* 선택된 날짜 (주황색 칸이 노랑을 덮음) */
  .react-calendar__tile--active {
    background: #FF6B00 !important; border-radius: 10px; color: white !important;
    abbr { background: transparent !important; color: white !important; }
  }

  .react-calendar__month-view__days__day--neighboringMonth { color: #eee !important; }
`;

export const 상세일정박스 = css`
  flex: 1; background: #fafafa; border: 1px solid #f0f0f0; border-radius: 18px;
  padding: 20px; height: 410px; display: flex; flex-direction: column;
`;

export const 기간요약헤더 = css`
  font-size: 16px; font-weight: 800; color: #FF6B00; padding-bottom: 12px;
  border-bottom: 2px solid #FFF0E6; margin-bottom: 15px;
`;

export const 일차리스트컨테이너 = css`
  display: flex; flex-direction: column; gap: 8px; overflow-y: auto;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
`;

export const 일차항목박스 = css`
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px; background: white; border: 1px solid #f0f0f0; border-radius: 12px;
  .일차텍스트 { font-weight: 700; font-size: 14px; }
  .시간설정영역 { display: flex; align-items: center; gap: 6px; }
`;

export const 시간셀렉트 = css`
  padding: 4px 2px; border: 1px solid #FF6B00; border-radius: 6px;
  color: #FF6B00; font-weight: 600; font-size: 12px; background: white; outline: none;
`;

export const 오늘날짜표시 = css` text-align: center; color: #FF6B00; font-weight: 600; font-size: 14px; margin-bottom: 12px; `;
export const 오늘버튼영역 = css` display: flex; justify-content: center; margin-top: 20px; `;
export const 오늘버튼 = css` background: #f8f9fa; border: 1px solid #eee; padding: 8px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; `;
export const 비어있는상태 = css` flex: 1; display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 14px; text-align: center; `;
export const 네비버튼영역 = css`
  display: flex; width: 95%; max-width: 920px; gap: 12px; margin-top: 15px;
  button { flex: 1; padding: 14px; border-radius: 14px; border: none; font-weight: 700; font-size: 15px; cursor: pointer; }
  button:first-of-type { background: white; color: #adb5bd; border: 1px solid #eee; }
  button:last-of-type { background: #FF6B00; color: white; }
`;
import { css } from "@emotion/react";

export const 전체페이지 = css`
  flex: 1;
  font-family: "Pretendard", -apple-system, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
  padding: 20px;
`;

export const 단계진행바 = css`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;
export const 단계아이템 = (활성) => css`
  padding: 8px 18px;
  border-radius: 50px;
  background: ${활성 ? "#FF6B00" : "white"};
  color: ${활성 ? "white" : "#adb5bd"};
  font-weight: 700;
  font-size: 13px;
`;

export const 메인카드 = css`
  background: white;
  border-radius: 25px;
  width: 100%;
  max-width: 900px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  min-height: 500px;
`;

export const 카테고리버튼 = (활성) => css`
  flex: 1;
  padding: 15px 0;
  border-radius: 15px;
  border: 2px solid ${활성 ? "#FF6B00" : "#eee"};
  background: ${활성 ? "#FFF0E6" : "white"};
  color: ${활성 ? "#FF6B00" : "#888"};
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
`;

export const 달력영역 = css`
  flex: 1.2;
  min-width: 340px;

  .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
  }

  /* 요일 레이아웃 및 폰트 */
  .react-calendar__month-view__weekdays {
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    padding-bottom: 10px;

    abbr {
      text-decoration: none;
    }
  }

  .react-calendar__month-view__weekdays__weekday:nth-of-type(1) {
    color: #ff4d4d;
  }

  .react-calendar__month-view__weekdays__weekday:nth-of-type(7) {
    color: #4d79ff;
  }

  .react-calendar__tile {
    font-weight: 600;
    padding: 12px 0;
  }

  .react-calendar__month-view__days__day--neighboringMonth:nth-of-type(7n),
  .react-calendar__month-view__days__day:nth-of-type(7n) {
    color: #4d79ff;
  }

  .react-calendar__month-view__days__day--neighboringMonth:nth-of-type(7n + 1),
  .react-calendar__month-view__days__day:nth-of-type(7n + 1) {
    color: #ff4d4d;
  }

  .react-calendar__tile--active {
    background: #ff6b00 !important;
    border-radius: 10px;
    color: white !important;
  }
`;
export const 인원설정컨테이너 = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 30px;
`;
export const 카테고리영역 = css`
  width: 100%;
  max-width: 500px;
  label {
    display: block;
    text-align: center;
    font-weight: 800;
    margin-bottom: 20px;
    font-size: 18px;
  }
`;
export const 카테고리그룹 = css`
  display: flex;
  gap: 10px;
  width: 100%;
`;
export const 인원조절영역애니메이션 = css`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const 안내문구 = css`
  font-weight: 700;
  color: #ff6b00;
  margin-bottom: 20px;
`;
export const 인원조절그룹 = css`
  display: flex;
  gap: 20px;
  width: 100%;
`;
export const 인원항목 = css`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 25px;
  background: #fafafa;
  border-radius: 20px;
  border: 1px solid #f0f0f0;
  span {
    font-weight: 700;
  }
`;
export const 카운터 = css`
  display: flex;
  align-items: center;
  gap: 15px;
  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: white;
    color: #ff6b00;
    cursor: pointer;
  }
  span {
    font-weight: 700;
    min-width: 25px;
    text-align: center;
    font-size: 18px;
  }
`;
export const 콘텐츠가로배치 = css`
  display: flex;
  gap: 30px;
`;
export const 상세일정박스 = css`
  flex: 1;
  background: #fafafa;
  border-radius: 18px;
  padding: 20px;
  height: 400px;
  display: flex;
  flex-direction: column;
`;
export const 일차리스트컨테이너 = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;
export const 일차항목박스 = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  .일차텍스트 {
    font-weight: 700;
  }
`;
export const 시간설정영역 = css`
  display: flex;
  gap: 5px;
  align-items: center;
`;
export const 시간셀렉트 = css`
  border: 1px solid #ff6b00;
  border-radius: 5px;
  color: #ff6b00;
  font-weight: 600;
  padding: 2px 4px;
`;
export const 통합페이지컨테이너 = css`
  display: flex;
  gap: 30px;
`;
export const 왼쪽섹션 = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;
export const 오른쪽섹션 = css`
  flex: 1;
`;
export const 그룹 = css`
  label {
    display: block;
    font-weight: 700;
    margin-bottom: 10px;
    color: #555;
  }
`;
export const 버튼그룹 = css`
  display: flex;
  gap: 10px;
`;
export const 이동버튼 = (활성) =>
  css`
    flex: 1;
    padding: 15px;
    border-radius: 12px;
    border: 2px solid ${활성 ? "#FF6B00" : "#eee"};
    background: ${활성 ? "#FFF0E6" : "white"};
    color: ${활성 ? "#FF6B00" : "#888"};
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
  `;
export const 슬라이더영역 = css`
  input {
    width: 100%;
    accent-color: #ff6b00;
  }
`;
export const 금액표시 = css`
  font-size: 28px;
  font-weight: 800;
  color: #ff6b00;
  text-align: center;
  margin: 15px 0 5px;
`;
export const 범위안내 = css`
  font-size: 12px;
  color: #bbb;
  text-align: center;
`;
export const 추천결과카드 = css`
  background: #fafafa;
  padding: 25px;
  border-radius: 20px;
  h4 {
    margin-top: 0;
  }
`;
export const 결과줄 = css`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  span {
    color: #666;
    font-size: 14px;
  }
  strong {
    font-size: 15px;
  }
`;
export const 총액바 = css`
  margin-top: 20px;
  padding-top: 15px;
  text-align: right;
  font-weight: 800;
  color: #ff6b00;
  border-top: 2px dashed #ddd;
  font-size: 18px;
`;
export const 네비버튼영역 = css`
  display: flex;
  width: 100%;
  max-width: 900px;
  gap: 15px;
  margin-top: 25px;
  button {
    flex: 1;
    padding: 18px;
    border-radius: 15px;
    border: none;
    font-weight: 800;
    font-size: 16px;
    cursor: pointer;
    font-family: inherit;
  }
`;
export const 기간요약헤더 = css`
  font-weight: 800;
  color: #ff6b00;
  margin-bottom: 10px;
`;
export const 비어있는상태 = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
`;

export const 위치설정컨테이너 = css`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

export const 위치설정제목 = css`
  margin: 0 0 12px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`;

export const 위치설정안내 = css`
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
  text-align: center;
  font-size: 15px;
`;

// Day별 위치 목록
export const 일차위치목록 = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Day별 카드
export const 일차위치카드 = css`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const 일차제목 = css`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;
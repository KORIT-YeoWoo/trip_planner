import { css } from "@emotion/react";

export const pageContainer = css`
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

export const stepProgressBar = css`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const stepItem = (isActive) => css`
  padding: 8px 18px;
  border-radius: 50px;
  background: ${isActive ? "#FF6B00" : "white"};
  color: ${isActive ? "white" : "#adb5bd"};
  font-weight: 700;
  font-size: 13px;
`;

export const mainCard = css`
  background: white;
  border-radius: 25px;
  width: 100%;
  max-width: 900px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  min-height: 500px;
`;

export const categoryButton = (isActive) => css`
  flex: 1;
  padding: 15px 0;
  border-radius: 15px;
  border: 2px solid ${isActive ? "#FF6B00" : "#eee"};
  background: ${isActive ? "#FFF0E6" : "white"};
  color: ${isActive ? "#FF6B00" : "#888"};
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
`;

export const calendarArea = css`
  flex: 1.2;
  min-width: 340px;

  .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
  }

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

export const peopleSettingContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 30px;
`;

export const categoryArea = css`
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

export const categoryGroup = css`
  display: flex;
  gap: 10px;
  width: 100%;
`;

export const peopleControlAreaAnimation = css`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const guideText = css`
  font-weight: 700;
  color: #ff6b00;
  margin-bottom: 20px;
`;

export const peopleControlGroup = css`
  display: flex;
  gap: 20px;
  width: 100%;
`;

export const peopleItem = css`
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

export const counter = css`
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

export const contentHorizontalLayout = css`
  display: flex;
  gap: 30px;
`;

export const detailScheduleBox = css`
  flex: 1;
  background: #fafafa;
  border-radius: 18px;
  padding: 20px;
  height: 400px;
  display: flex;
  flex-direction: column;
`;

export const dayListContainer = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;

export const dayItemBox = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  .dayText {
    font-weight: 700;
  }
`;

export const timeSettingArea = css`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const timeSelect = css`
  border: 1px solid #ff6b00;
  border-radius: 5px;
  color: #ff6b00;
  font-weight: 600;
  padding: 2px 4px;
`;

export const integratedPageContainer = css`
  display: flex;
  gap: 30px;
`;

export const leftSection = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const rightSection = css`
  flex: 1;
`;

export const group = css`
  label {
    display: block;
    font-weight: 700;
    margin-bottom: 10px;
    color: #555;
  }
`;

export const buttonGroup = css`
  display: flex;
  gap: 10px;
`;

export const transportButton = (isActive) =>
  css`
    flex: 1;
    padding: 15px;
    border-radius: 12px;
    border: 2px solid ${isActive ? "#FF6B00" : "#eee"};
    background: ${isActive ? "#FFF0E6" : "white"};
    color: ${isActive ? "#FF6B00" : "#888"};
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
  `;

export const sliderArea = css`
  input {
    width: 100%;
    accent-color: #ff6b00;
  }
`;

export const amountDisplay = css`
  font-size: 28px;
  font-weight: 800;
  color: #ff6b00;
  text-align: center;
  margin: 15px 0 5px;
`;

export const rangeGuide = css`
  font-size: 12px;
  color: #bbb;
  text-align: center;
`;

export const recommendResultCard = css`
  background: #fafafa;
  padding: 25px;
  border-radius: 20px;
  h4 {
    margin-top: 0;
  }
`;

export const resultRow = css`
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

export const totalBar = css`
  margin-top: 20px;
  padding-top: 15px;
  text-align: right;
  font-weight: 800;
  color: #ff6b00;
  border-top: 2px dashed #ddd;
  font-size: 18px;
`;

export const navButtonArea = css`
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

export const durationSummaryHeader = css`
  font-weight: 800;
  color: #ff6b00;
  margin-bottom: 10px;
`;

export const emptyState = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
`;

export const locationSettingContainer = css`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

export const locationSettingTitle = css`
  margin: 0 0 12px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`;

export const locationSettingGuide = css`
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
  text-align: center;
  font-size: 15px;
`;

export const dayLocationList = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const dayLocationCard = css`
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

export const dayTitle = css`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;
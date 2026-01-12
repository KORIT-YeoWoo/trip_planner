"use client";

/** @jsxImportSource @emotion/react */
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as s from "./styles";

export default function TravelInfoPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0:기간, 1:예산, 2:이동수단, 3:인원
  const [dateRange, setDateRange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itineraryDays, setItineraryDays] = useState([]);

  const steps = [
    { label: "여행 기간", icon: "📅" },
    { label: "예산", icon: "👛" },
    { label: "이동 수단", icon: "🚗" },
    { label: "인원", icon: "👥" }
  ];

  // 30분 단위 시간 옵션
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = (i % 2) * 30;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });

  const handleDateChange = (value) => {
    setDateRange(value);
    if (value?.[0] && value?.[1]) {
      const diffDays = Math.ceil((value[1] - value[0]) / (1000 * 60 * 60 * 24)) + 1;
      const newDays = Array.from({ length: diffDays }, (_, i) => {
        const d = new Date(value[0]);
        d.setDate(value[0].getDate() + i);
        return {
          day: i + 1,
          date: `${d.getMonth() + 1}/${d.getDate()}`,
          start_time: "09:00",
          end_time: "21:00",
        };
      });
      setItineraryDays(newDays);
    }
  };

  return (
    <div css={s.page}>
      <header css={s.header}>
        <div css={s.logo}>
          <span css={s.logoText}>여우</span><span css={s.yeowooText}>YEOWOO</span>
        </div>
      </header>

      {/* [비주얼 스텝바] 이미지 스타일 반영 */}
      <nav css={s.stepContainer}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            {currentStep === idx ? (
              <div css={s.stepLongCapsule}>
                <span>{step.label}</span> <span>{step.icon}</span>
              </div>
            ) : (
              <div css={s.stepCircle(false)}><span>{step.icon}</span></div>
            )}
            {idx < steps.length - 1 && <div css={s.stepLine} />}
          </div>
        ))}
      </nav>

      <main css={s.mainCard}>
        {/* Step 0: 여행 기간 (기존 내용) */}
        {currentStep === 0 && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{steps[0].label}</h2>
            <p style={{ fontSize: '13px', color: '#999', margin: '10px 0 30px' }}>일정을 짤 기간을 선택해주세요</p>
            <div css={s.dateSelectionBox}>
              <Calendar 
                onChange={handleDateChange} value={dateRange} selectRange={true} 
                calendarType="gregory" prev2Label={null} next2Label={null}
                formatShortWeekday={(l, d) => ['일','월','화','수','목','금','토'][d.getDay()]}
                formatDay={(l, d) => d.getDate()}
              />
            </div>
            <div css={s.resultBar} onClick={() => itineraryDays.length > 0 && setIsModalOpen(true)}>
              {itineraryDays.length > 0 ? `${itineraryDays.length - 1}박 ${itineraryDays.length}일 상세설정 ⚙️` : "날짜를 선택해 주세요"}
            </div>
          </>
        )}

        {/* Step 1~3: 예산, 이동수단, 인원 (예시 화면) */}
        {currentStep > 0 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{steps[currentStep].label} 설정</h2>
            <p style={{ marginTop: '20px' }}>{steps[currentStep].label}을(를) 입력하는 페이지입니다.</p>
          </div>
        )}
      </main>

      {/* 시간 상세 설정 모달 (Step 0 전용) */}
      {isModalOpen && (
        <div css={s.modalOverlay}>
          <div css={s.modalContent}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>일차별 시간 설정 (30분 단위)</h3>
            {itineraryDays.map((item, idx) => (
              <div key={item.day} css={s.dayCard}>
                <div css={s.dayHeader}><span>{item.day}일차</span><span>{item.date}</span></div>
                <div css={s.timePickerWrapper}>
                  <select value={item.start_time} onChange={(e) => { const up = [...itineraryDays]; up[idx].start_time = e.target.value; setItineraryDays(up); }}>
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span>~</span>
                  <select value={item.end_time} onChange={(e) => { const up = [...itineraryDays]; up[idx].end_time = e.target.value; setItineraryDays(up); }}>
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            ))}
            <button css={s.completeBtn} onClick={() => setIsModalOpen(false)}>설정 완료</button>
          </div>
        </div>
      )}

      {/* 하단 버튼 바: 실제로 동작하는 단계 이동 */}
      <footer css={s.bottomBar}>
        <button css={s.prevBtn} onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}>이전</button>
        <button 
          css={s.nextBtn(currentStep === 0 && itineraryDays.length === 0)} 
          onClick={() => {
            if (currentStep === 0 && itineraryDays.length === 0) return alert("날짜를 선택해주세요!");
            if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
          }}
        >
          {currentStep === steps.length - 1 ? "완료" : "다음 단계로"}
        </button>
      </footer>
    </div>
  );
}
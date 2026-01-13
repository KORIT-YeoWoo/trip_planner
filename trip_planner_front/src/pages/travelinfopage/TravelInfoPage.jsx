"use client";

/** @jsxImportSource @emotion/react */
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as s from "./styles";

export default function TravelInfoPage() {
  const [step, setStep] = useState(0);
  const [dateRange, setDateRange] = useState(null);
  const [days, setDays] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [budget, setBudget] = useState(500000);
  const [transport, setTransport] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [companion, setCompanion] = useState("");

  const steps = ["기간", "예산", "이동", "인원"];
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

  // 예산 계산 로직 (40%, 30%, 15%, 15%)
  const stayCost = Math.floor(budget * 0.4);
  const foodCost = Math.floor(budget * 0.3);
  const transCost = Math.floor(budget * 0.15);
  const tourCost = Math.floor(budget * 0.15);

  const handleDate = (v) => {
    setDateRange(v);
    if (v?.[0] && v?.[1]) {
      const diff = Math.ceil((v[1] - v[0]) / (1000 * 60 * 60 * 24)) + 1;
      setDays(Array.from({ length: diff }, (_, i) => ({ id: i + 1, start: "09:00", end: "21:00" })));
    }
  };

  const updateTime = (id, field, val) => {
    setDays(days.map(d => d.id === id ? { ...d, [field]: val } : d));
  };

  return (
    <div css={s.page}>
      <header css={s.header}><span css={s.logoText}>여우</span><span css={s.yeowooText}>YEOWOO</span></header>

      <nav css={s.stepContainer}>
        {steps.map((name, i) => (
          <div key={i} css={s.stepItem(step === i)}>{name}</div>
        ))}
      </nav>

      <main css={s.mainCard}>
        {step === 0 && (
          <>
            <h3 css={s.sectionTitle}>언제 떠나시나요?</h3>
            <div css={s.dateBox}><Calendar onChange={handleDate} value={dateRange} selectRange={true} calendarType="gregory" /></div>
            {days.length > 0 && <button css={s.configBtn} onClick={() => setIsModal(true)}>{days.length}일간의 시간 설정하기 ⚙️</button>}
          </>
        )}

        {step === 1 && (
          <div css={s.budgetWrapper}>
            <h3 css={s.sectionTitle}>총 예산 설정</h3>
            <div className="price">{budget.toLocaleString()}원</div>
            <input type="range" min="100000" max="2000000" step="50000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
            <div css={s.budgetRow}><span>🏨 숙박비 (40%)</span><b>{stayCost.toLocaleString()}원</b></div>
            <div css={s.budgetRow}><span>🍱 식비 (30%)</span><b>{foodCost.toLocaleString()}원</b></div>
            <div css={s.budgetRow}><span>🚌 교통비 (15%)</span><b>{transCost.toLocaleString()}원</b></div>
            <div css={s.budgetRow}><span>🎟️ 관광/체험 (15%)</span><b>{tourCost.toLocaleString()}원</b></div>
          </div>
        )}

        {step === 2 && (
          <div css={s.transportWrapper}>
            <h3 css={s.sectionTitle} style={{textAlign:'center'}}>이동 수단</h3>
            {[{id:'car', l:'렌트카/자차', i:'🚗'}, {id:'bus', l:'대중교통', i:'🚌'}, {id:'walk', l:'도보 여행', i:'👟'}].map(t => (
              <div key={t.id} css={s.gridBtn(transport === t.id)} onClick={() => setTransport(t.id)}>
                <span className="icon">{t.i}</span><span className="label">{t.l}</span>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div style={{ width: '100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <h3 css={s.sectionTitle}>인원 및 동행</h3>
            <div css={s.counterWrap}>
              <button onClick={() => numPeople > 1 && setNumPeople(numPeople - 1)}>-</button>
              <span className="num">{numPeople}명</span>
              <button onClick={() => numPeople < 20 && setNumPeople(numPeople + 1)}>+</button>
            </div>
            <div css={s.grid2}>
              {[{id:'s', l:'혼자', i:'👤'}, {id:'f', l:'친구', i:'🙌'}, {id:'c', l:'커플', i:'👩‍❤️‍👨'}, {id:'fa', l:'가족', i:'👨‍👩‍👧‍👦'}].map(c => (
                <div key={c.id} css={s.gridBtn(companion === c.id)} onClick={() => setCompanion(c.id)}>
                  <span className="icon">{c.i}</span><span className="label">{c.l}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ⏰ 일차별 시간 설정 팝업 복구 */}
      {isModal && (
        <div css={s.modalOverlay}>
          <div css={s.modalContent}>
            <h4 style={{ margin: '0 0 20px', textAlign: 'center', fontWeight: 800 }}>일차별 시간 설정</h4>
            {days.map(d => (
              <div key={d.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #eee'}}>
                <span style={{ fontWeight: 700, color:'#ef6c22' }}>{d.id}일차</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select style={{padding:'5px', borderRadius:'5px', border:'1px solid #ddd'}} value={d.start} onChange={(e) => updateTime(d.id, 'start', e.target.value)}>
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span style={{fontSize:'12px', color:'#999'}}>~</span>
                  <select style={{padding:'5px', borderRadius:'5px', border:'1px solid #ddd'}} value={d.end} onChange={(e) => updateTime(d.id, 'end', e.target.value)}>
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            ))}
            <button style={{ width: '100%', marginTop: '25px', padding: '15px', background: '#ef6c22', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setIsModal(false)}>설정 완료</button>
          </div>
        </div>
      )}

      <div css={s.bottomBar}>
        {step > 0 && <button onClick={() => setStep(step-1)} style={{ flex: 0.3, border: 'none', background: '#f0f0f0', borderRadius: '14px', color: '#888', cursor: 'pointer' }}>이전</button>}
        <button css={s.nextBtn(step === 0 ? !dateRange : step === 3 ? !companion : false)} onClick={() => step < 3 ? setStep(step+1) : alert("일정 생성!")}>
          {step === 3 ? "일정 생성하기" : "다음으로"}
        </button>
      </div>
    </div>
  );
}
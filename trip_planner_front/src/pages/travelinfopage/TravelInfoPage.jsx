/** @jsxImportSource @emotion/react */
import { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as s from "./styles";

// ⭐ 이미지 경로에 맞춘 LoadingPage 임포트
import LoadingPage from "../loadingpage/LoadingPage";

import { IoPeopleSharp } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineWallet } from "react-icons/md";

function TravelInfoPage() {
  const [단계, set단계] = useState(1);
  const [로딩중, set로딩중] = useState(false);

  // 데이터 상태
  const [카테고리, set카테고리] = useState(null);
  const [인원, set인원] = useState({ 성인: 0, 아동: 0 });
  const [선택된날짜범위, set선택된날짜범위] = useState(null);
  const [일정시간목록, set일정시간목록] = useState([]);
  const [이동수단, set이동수단] = useState("렌터카");
  const [총예산, set총예산] = useState(1000000);
  const [세부예산, set세부예산] = useState({});

  const 총인원수 = 인원.성인 + 인원.아동;

  // 1. 카테고리 선택 (커플 눌러도 다른 카테고리 자유 이동)
  const 카테고리선택 = (cat) => {
    set카테고리(cat);
    if (cat === "혼자") set인원({ 성인: 1, 아동: 0 });
    else if (cat === "커플") set인원({ 성인: 2, 아동: 0 });
    else if (cat === "친구") set인원({ 성인: 2, 아동: 0 });
    else if (cat === "가족") set인원({ 성인: 2, 아동: 1 });
  };

  const 인원변경 = (type, delta) => {
    if (카테고리 === "혼자") return;
    set인원((prev) => ({
      ...prev,
      [type]:
        type === "성인"
          ? Math.max(1, prev[type] + delta)
          : Math.max(0, prev[type] + delta),
    }));
  };

  // 2. 기간 계산
  const 기간 = useMemo(() => {
    if (!선택된날짜범위 || !선택된날짜범위[0] || !선택된날짜범위[1])
      return { 박: 0, 일: 1 };
    const 차이 = Math.floor(
      (선택된날짜범위[1] - 선택된날짜범위[0]) / (1000 * 60 * 60 * 24)
    );
    return { 박: 차이, 일: 차이 + 1 };
  }, [선택된날짜범위]);

  useEffect(() => {
    if (기간.일 > 0)
      set일정시간목록(
        Array.from({ length: 기간.일 }, () => ({ 시작: 9, 종료: 22 }))
      );
  }, [기간.일]);

  // 3. 예산 계산 (인원 * 일수 연동)
  const 최소예산 = 총인원수 * 기간.일 * 100000;
  const 최대예산 = 총인원수 * 기간.일 * 500000;

  useEffect(() => {
    const 적정최소 = 최소예산 || 100000;
    const 적정최대 = 최대예산 || 500000;
    if (총예산 < 적정최소) set총예산(적정최소);
    if (총예산 > 적정최대) set총예산(적정최대);
  }, [총인원수, 기간.일]);

  useEffect(() => {
    const 비율 =
      이동수단 === "렌터카"
        ? { 숙박: 0.35, 식비: 0.25, 교통: 0.15, 항공: 0.15, 체험: 0.1 }
        : { 숙박: 0.4, 식비: 0.3, 교통: 0.05, 항공: 0.15, 체험: 0.1 };
    const 결과 = {};
    Object.keys(비율).forEach((k) => (결과[k] = Math.floor(총예산 * 비율[k])));
    set세부예산(결과);
  }, [총예산, 이동수단]);

  // 4. 계획 완료 핸들러
  const 계획완료핸들러 = () => {
    set로딩중(true);
    setTimeout(() => {
      set로딩중(false);
      alert("여행 계획이 완성되었습니다!");
    }, 3000);
  };

  const 시간옵션들 = Array.from({ length: 24 }, (_, i) => (
    <option key={i} value={i}>
      {String(i).padStart(2, "0")}:00
    </option>
  ));

  if (로딩중) return <LoadingPage />;

  return (
    <div css={s.전체페이지}>
      <div css={s.단계진행바}>
        <div css={s.단계아이템(단계 === 1)}>
          인원 <IoPeopleSharp />
        </div>
        <div css={s.단계아이템(단계 === 2)}>
          기간 <LuCalendarDays />
        </div>
        <div css={s.단계아이템(단계 === 3)}>
          예산 <MdOutlineWallet />
        </div>
      </div>

      <div css={s.메인카드}>
        {단계 === 1 && (
          <div css={s.인원설정컨테이너}>
            <div css={s.카테고리영역}>
              <label>누구와 함께하시나요?</label>
              <div css={s.카테고리그룹}>
                {["혼자", "커플", "친구", "가족"].map((cat) => (
                  <button
                    key={cat}
                    css={s.카테고리버튼(카테고리 === cat)}
                    onClick={() => 카테고리선택(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {카테고리 && (
              <div css={s.인원조절영역애니메이션}>
                <p css={s.안내문구}>
                  {카테고리 === "혼자" ? "나홀로 여행" : "인원을 설정해주세요"}
                </p>
                <div css={s.인원조절그룹}>
                  <div css={s.인원항목}>
                    <span>성인</span>
                    <div css={s.카운터}>
                      <button
                        onClick={() => 인원변경("성인", -1)}
                        disabled={카테고리 === "혼자"}
                      >
                        -
                      </button>
                      <span>{인원.성인}</span>
                      <button
                        onClick={() => 인원변경("성인", 1)}
                        disabled={카테고리 === "혼자"}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div css={s.인원항목}>
                    <span>아동</span>
                    <div css={s.카운터}>
                      <button
                        onClick={() => 인원변경("아동", -1)}
                        disabled={카테고리 === "혼자"}
                      >
                        -
                      </button>
                      <span>{인원.아동}</span>
                      <button
                        onClick={() => 인원변경("아동", 1)}
                        disabled={카테고리 === "혼자"}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {단계 === 2 && (
          <div css={s.콘텐츠가로배치}>
            <div css={s.달력영역}>
              <Calendar
                onChange={set선택된날짜범위}
                value={선택된날짜범위}
                selectRange
                locale="ko-KR"
                // ⭐ 요일을 '일월화수목금토' 한 글자로 고정
                formatShortWeekday={(locale, date) =>
                  ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
                }
                formatDay={(locale, date) => date.getDate()}
                calendarType="gregory" // 일요일부터 시작하는 달력 타입
              />
            </div>
            <div css={s.상세일정박스}>
              {선택된날짜범위 ? (
                <>
                  <div css={s.기간요약헤더}>
                    {기간.박}박 {기간.일}일 일정
                  </div>
                  <div css={s.일차리스트컨테이너}>
                    {일정시간목록.map((시간, i) => (
                      <div key={i} css={s.일차항목박스}>
                        <span className="일차텍스트">{i + 1}일차</span>
                        <div className="시간설정영역">
                          <select
                            css={s.시간셀렉트}
                            value={시간.시작}
                            onChange={(e) => {
                              const n = [...일정시간목록];
                              n[i].시작 = Number(e.target.value);
                              set일정시간목록(n);
                            }}
                          >
                            {시간옵션들}
                          </select>
                          <span>~</span>
                          <select
                            css={s.시간셀렉트}
                            value={시간.종료}
                            onChange={(e) => {
                              const n = [...일정시간목록];
                              n[i].종료 = Number(e.target.value);
                              set일정시간목록(n);
                            }}
                          >
                            {시간옵션들}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div css={s.비어있는상태}>날짜를 선택해주세요</div>
              )}
            </div>
          </div>
        )}

        {단계 === 3 && (
          <div css={s.통합페이지컨테이너}>
            <div css={s.왼쪽섹션}>
              <div css={s.그룹}>
                <label>이동수단</label>
                <div css={s.버튼그룹}>
                  <button
                    css={s.이동버튼(이동수단 === "렌터카")}
                    onClick={() => set이동수단("렌터카")}
                  >
                    렌터카
                  </button>
                  <button
                    css={s.이동버튼(이동수단 === "대중교통")}
                    onClick={() => set이동수단("대중교통")}
                  >
                    대중교통
                  </button>
                </div>
              </div>
              <div css={s.그룹}>
                <label>
                  총 예산 ({총인원수}인/{기간.일}일)
                </label>
                <div css={s.슬라이더영역}>
                  <input
                    type="range"
                    min={최소예산}
                    max={최대예산}
                    step="10000"
                    value={총예산}
                    onChange={(e) => set총예산(Number(e.target.value))}
                  />
                  <div css={s.금액표시}>{총예산.toLocaleString()}원</div>
                  <div css={s.범위안내}>
                    최소 {최소예산 / 10000}만 ~ 최대 {최대예산 / 10000}만
                  </div>
                </div>
              </div>
            </div>
            <div css={s.오른쪽섹션}>
              <div css={s.추천결과카드}>
                <h4>1인당 지출 가이드</h4>
                {Object.entries(세부예산).map(([항목, 금액]) => (
                  <div key={항목} css={s.결과줄}>
                    <span>{항목}</span>
                    <strong>
                      {Math.floor(금액 / (총인원수 || 1)).toLocaleString()}원
                    </strong>
                  </div>
                ))}
                <div css={s.총액바}>
                  합계: {Math.floor(총예산 / (총인원수 || 1)).toLocaleString()}
                  원
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div css={s.네비버튼영역}>
        <button onClick={() => set단계((p) => Math.max(p - 1, 1))}>이전</button>
        <button
          onClick={단계 === 3 ? 계획완료핸들러 : () => set단계((p) => p + 1)}
          disabled={단계 === 1 && !카테고리}
        >
          {단계 === 3 ? "계획 완료" : "다음"}
        </button>
      </div>
    </div>
  );
}

export default TravelInfoPage;

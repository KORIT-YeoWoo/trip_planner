/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as s from "./styles";

// 아이콘 임포트
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineWallet } from "react-icons/md";
import { FaCar } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";

function TravelInfoPage() {
  const [단계, set단계] = useState(1);
  const [선택된날짜범위, set선택된날짜범위] = useState(null);
  const [현재보여지는달, set현재보여지는달] = useState(new Date());
  const [일정시간목록, set일정시간목록] = useState([]);

  // 1. 여행 기간 정밀 계산
  const 여행기간계산함수 = () => {
    if (!선택된날짜범위 || !선택된날짜범위[0] || !선택된날짜범위[1])
      return null;
    const 시작일 = new Date(
      선택된날짜범위[0].getFullYear(),
      선택된날짜범위[0].getMonth(),
      선택된날짜범위[0].getDate()
    );
    const 종료일 = new Date(
      선택된날짜범위[1].getFullYear(),
      선택된날짜범위[1].getMonth(),
      선택된날짜범위[1].getDate()
    );
    const 차이일수 = Math.floor((종료일 - 시작일) / (1000 * 60 * 60 * 24));
    return { 박: 차이일수, 일: 차이일수 + 1 };
  };

  const 여행기간 = 여행기간계산함수();

  // 2. 날짜 선택 시 시간 리스트 초기화
  useEffect(() => {
    if (여행기간) {
      const 초기시간 = Array.from({ length: 여행기간.일 }, () => ({
        시작: 9,
        종료: 22,
      }));
      set일정시간목록(초기시간);
    }
  }, [여행기간?.일]);

  // 3. 드롭다운 시간 변경 핸들러
  const 시간변경핸들러 = (인덱스, 종류, 값) => {
    const 새시간목록 = [...일정시간목록];
    새시간목록[인덱스][종류] = Number(값);
    set일정시간목록(새시간목록);
  };

  // 00:00 ~ 23:00 옵션 생성
  const 시간옵션들 = Array.from({ length: 24 }, (_, i) => (
    <option key={i} value={i}>
      {String(i).padStart(2, "0")}:00
    </option>
  ));

  const 오늘요일글자 = new Date().toLocaleDateString("ko-KR", {
    weekday: "long",
  });

  return (
    <div css={s.전체페이지}>
      {/* 상단 단계 바: 높이를 줄이기 위해 패딩 축소 */}
      <div css={s.단계진행바}>
        <div css={s.단계아이템(단계 === 1)}>
          여행 기간 <LuCalendarDays />
        </div>
        <div css={s.단계아이템(단계 === 2)}>
          예산 <MdOutlineWallet />
        </div>
        <div css={s.단계아이템(단계 === 3)}>
          이동수단 <FaCar />
        </div>
        <div css={s.단계아이템(단계 === 4)}>
          인원 <IoPeopleSharp />
        </div>
      </div>

      <div css={s.메인카드}>
        <div css={s.헤더안내}>
          <h2>{단계 === 1 ? "여행 일정을 설정해주세요" : "준비 중"}</h2>
        </div>

        {단계 === 1 && (
          <div css={s.콘텐츠가로배치}>
            <div css={s.달력영역}>
    <div css={s.오늘날짜표시}>오늘은 {오늘요일글자} 입니다 📅</div>
    <Calendar
      onChange={set선택된날짜범위}
      value={선택된날짜범위}
      selectRange={true}
      locale="ko-KR"
      calendarType="gregory"
      activeStartDate={현재보여지는달}
      onActiveStartDateChange={({ activeStartDate }) => set현재보여지는달(activeStartDate)}
      formatDay={(locale, date) => date.getDate()}
      formatShortWeekday={(locale, date) => 
        ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
      }
    />
    <div css={s.오늘버튼영역}>
      <button onClick={() => set현재보여지는달(new Date())} css={s.오늘버튼}>오늘로 돌아가기</button>
    </div>
  </div>

            <div css={s.상세일정박스}>
              {여행기간 ? (
                <>
                  <div css={s.기간요약헤더}>
                    {여행기간.박}박 {여행기간.일}일 일정
                  </div>
                  <div css={s.일차리스트컨테이너}>
                    {일정시간목록.map((시간, 인덱스) => (
                      <div key={인덱스} css={s.일차항목박스}>
                        <span className="일차텍스트">{인덱스 + 1}일차</span>
                        <div className="시간설정영역">
                          <select
                            css={s.시간셀렉트}
                            value={시간.시작}
                            onChange={(e) =>
                              시간변경핸들러(인덱스, "시작", e.target.value)
                            }
                          >
                            {시간옵션들}
                          </select>
                          <span>~</span>
                          <select
                            css={s.시간셀렉트}
                            value={시간.종료}
                            onChange={(e) =>
                              시간변경핸들러(인덱스, "종료", e.target.value)
                            }
                          >
                            {시간옵션들}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div css={s.비어있는상태}>
                  달력에서 여행 날짜를
                  <br />
                  선택해주세요!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div css={s.네비버튼영역}>
        <button onClick={() => set단계((이전) => Math.max(이전 - 1, 1))}>
          이전
        </button>
        <button onClick={() => set단계((이전) => Math.min(이전 + 1, 4))}>
          다음
        </button>
      </div>
    </div>
  );
}

export default TravelInfoPage;

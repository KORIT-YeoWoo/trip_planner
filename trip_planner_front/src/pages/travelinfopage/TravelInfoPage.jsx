/** @jsxImportSource @emotion/react */
import { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as s from "./styles";
import LocationSearchInput from "../../components/locationsearchinput/LocationSearchInput";

import LoadingPage from "../loadingpage/LoadingPage";

import { IoPeopleSharp } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineWallet } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa"; 
import { useLocation, useNavigate } from "react-router-dom";

function TravelInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSpotIds = location.state?.selectedSpotIds ?? 
    JSON.parse(sessionStorage.getItem('selectedSpotIds') || '[]');

  const [단계, set단계] = useState(1);
  const [로딩중, set로딩중] = useState(false);

  // 데이터 상태
  const [카테고리, set카테고리] = useState(null);
  const [인원, set인원] = useState({ 성인: 0, 아동: 0 });
  const [선택된날짜범위, set선택된날짜범위] = useState(null);
  const [일정시간목록, set일정시간목록] = useState([]);
  const [위치정보, set위치정보] = useState([]);
  
  const [이동수단, set이동수단] = useState("렌터카");
  const [총예산, set총예산] = useState(1000000);
  const [세부예산, set세부예산] = useState({});

  const 총인원수 = 인원.성인 + 인원.아동;

  //  날짜를 YYYY-MM-DD 형식으로 변환하는 헬퍼 함수 (시간대 문제 해결)
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 1. 카테고리 선택
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

  // 3. 기간 선택 시 위치정보 초기화
  useEffect(() => {
    if (기간.일 > 0) {
      console.log('🗓️ 날짜 계산:', { 박: 기간.박, 일: 기간.일 });
      
      const locations = Array.from({ length: 기간.일 }, (_, index) => ({
        day: index + 1,
        startLocation: index === 0 
          ? { 
              name: '제주국제공항', 
              address: '제주특별자치도 제주시 공항로 2',
              lat: 33.5066, 
              lon: 126.4929 
            }
          : null,
        endLocation: index === 기간.일 - 1
          ? { 
              name: '제주국제공항', 
              address: '제주특별자치도 제주시 공항로 2',
              lat: 33.5066, 
              lon: 126.4929 
            }
          : null
      }));
      
      console.log(` ${기간.박}박${기간.일}일 → 위치정보 ${locations.length}개 생성`);
      set위치정보(locations);
    }
  }, [기간.일, 기간.박]);

  // 4. 예산 계산
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

  // 5. 계획 완료 핸들러
  const 계획완료핸들러 = () => {
    // 유효성 검사
    if (!선택된날짜범위 || !선택된날짜범위[0] || !선택된날짜범위[1]) {
      alert("날짜를 선택해주세요.");
      return;
    }

    if (!selectedSpotIds || selectedSpotIds.length === 0) {
      alert("관광지를 먼저 선택해주세요.");
      navigate('/spots');
      return;
    }

    // 위치 정보 유효성 검사
    const 위치정보완료 = 위치정보.every(dayLoc => 
      dayLoc.startLocation && dayLoc.endLocation
    );
    
    if (!위치정보완료) {
      alert('모든 출발지와 도착지/숙소를 입력해주세요!');
      return;
    }

    //  시간대 문제 해결한 날짜 변환
    const startDateStr = formatDateToYYYYMMDD(선택된날짜범위[0]);
    const endDateStr = formatDateToYYYYMMDD(선택된날짜범위[1]);
    
    console.log('🗓️ 변환된 날짜:');
    console.log('  - startDate:', startDateStr);
    console.log('  - endDate:', endDateStr);

    // 전달할 데이터 구성
    const travelData = {
      selectedSpots: selectedSpotIds,
      travelInfo: {
        category: 카테고리,
        people: 인원,
        dateRange: [startDateStr, endDateStr],
        dailySchedules: 일정시간목록.map((시간, index) => {
          const 날짜 = new Date(선택된날짜범위[0]);
          날짜.setDate(날짜.getDate() + index);
          
          return {
            day: index + 1,
            date: formatDateToYYYYMMDD(날짜),  //  여기도 수정
            startTime: `${String(시간.시작).padStart(2, '0')}:00`,
            endTime: `${String(시간.종료).padStart(2, '0')}:00`
          };
        }),
        dailyLocations: 위치정보.map(dayLoc => ({
          day: dayLoc.day,
          startName: dayLoc.startLocation.name,
          startAddress: dayLoc.startLocation.address,
          startLat: dayLoc.startLocation.lat,
          startLon: dayLoc.startLocation.lon,
          endName: dayLoc.endLocation.name,
          endAddress: dayLoc.endLocation.address,
          endLat: dayLoc.endLocation.lat,
          endLon: dayLoc.endLocation.lon
        })),
        transport: 이동수단,
        totalBudget: 총예산,
        budgetBreakdown: 세부예산
      }
    };

    console.log('🧪 전달할 데이터:', travelData);
    console.log('🧪 위치정보 개수:', travelData.travelInfo.dailyLocations.length);
    console.log('🧪 dateRange:', travelData.travelInfo.dateRange);

    // LoadingPage로 이동하면서 데이터 전달
    navigate('/loading', { state: { travelData } });
  };
  
  
  const 시간옵션들 = Array.from({ length: 24 }, (_, i) => (
    <option key={i} value={i}>
      {String(i).padStart(2, "0")}:00
    </option>
  ));

  if (로딩중) return <LoadingPage />;

  return (
    <div css={s.전체페이지}>
      {/* 단계 진행바 */}
      <div css={s.단계진행바}>
        <div css={s.단계아이템(단계 === 1)}>
          인원 <IoPeopleSharp />
        </div>
        <div css={s.단계아이템(단계 === 2)}>
          기간 <LuCalendarDays />
        </div>
        <div css={s.단계아이템(단계 === 3)}>
          출발지/숙소 <FaMapMarkerAlt />
        </div>
        <div css={s.단계아이템(단계 === 4)}>
          예산 <MdOutlineWallet />
        </div>
      </div>

      <div css={s.메인카드}>
        {/* Step 1: 인원 */}
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

        {/* Step 2: 기간 */}
        {단계 === 2 && (
          <div css={s.콘텐츠가로배치}>
            <div css={s.달력영역}>
              <Calendar
                onChange={set선택된날짜범위}
                value={선택된날짜범위}
                selectRange
                locale="ko-KR"
                formatShortWeekday={(locale, date) =>
                  ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
                }
                formatDay={(locale, date) => date.getDate()}
                calendarType="gregory"
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

        {/* Step 3: 출발지/숙소 */}
        {단계 === 3 && (
          <div css={s.위치설정컨테이너}>
            <h2 css={s.위치설정제목}>📍 출발지 및 숙소 설정</h2>
            <p css={s.위치설정안내}>
              각 날짜의 출발지와 숙소를 입력해주세요. 
              기본값이 설정되어 있으며 자유롭게 변경 가능합니다.
            </p>

            {위치정보.length === 0 ? (
              <div css={s.비어있는상태}>먼저 여행 기간을 선택해주세요.</div>
            ) : (
              <div css={s.일차위치목록}>
                {위치정보.map((dayLoc, index) => (
                  <div key={index} css={s.일차위치카드}>
                    <h3 css={s.일차제목}>Day {dayLoc.day}</h3>
                    
                    {/* 출발지 */}
                    <LocationSearchInput
                      label={
                        dayLoc.day === 1 
                          ? '🛫 여행 시작 위치' 
                          : `🏨 Day ${dayLoc.day} 출발지`
                      }
                      placeholder="장소를 검색하세요"
                      defaultValue={dayLoc.startLocation}
                      onSelect={(place) => {
                        const updated = [...위치정보];
                        updated[index].startLocation = place;
                        set위치정보(updated);
                      }}
                    />

                    {/* 도착지 */}
                    <LocationSearchInput
                      label={
                        index === 위치정보.length - 1
                          ? '🛬 여행 종료 위치'
                          : `🏨 Day ${dayLoc.day} 숙소`
                      }
                      placeholder={
                        index === 위치정보.length - 1
                          ? '공항, 항구, 호텔 등'
                          : '숙소를 검색하세요'
                      }
                      defaultValue={dayLoc.endLocation}
                      onSelect={(place) => {
                        const updated = [...위치정보];
                        updated[index].endLocation = place;
                        
                        // 다음 날 출발지 자동 설정
                        if (index < 위치정보.length - 1) {
                          updated[index + 1].startLocation = place;
                        }
                        
                        set위치정보(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: 예산 */}
        {단계 === 4 && (
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

      {/* 네비게이션 버튼 */}
      <div css={s.네비버튼영역}>
        <button onClick={() => set단계((p) => Math.max(p - 1, 1))}>이전</button>
        <button
          onClick={단계 === 4 ? 계획완료핸들러 : () => set단계((p) => p + 1)}
          disabled={단계 === 1 && !카테고리}
        >
          {단계 === 4 ? "계획 완료" : "다음"}
        </button>
      </div>
    </div>
  );
}

export default TravelInfoPage;
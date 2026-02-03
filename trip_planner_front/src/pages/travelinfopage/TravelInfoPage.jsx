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
  const selectedSpotIds =
    location.state?.selectedSpotIds ??
    JSON.parse(sessionStorage.getItem("selectedSpotIds") || "[]");

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState(null);
  const [people, setPeople] = useState({ adult: 0, child: 0 });
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [scheduleTimeList, setScheduleTimeList] = useState([]);
  const [locationInfo, setLocationInfo] = useState([]);

  const [transport, setTransport] = useState("렌터카");
  const [totalBudget, setTotalBudget] = useState(1000000);
  const [budgetBreakdown, setBudgetBreakdown] = useState({});

  const totalPeople = people.adult + people.child;

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectCategory = (cat) => {
    setCategory(cat);
    if (cat === "혼자") setPeople({ adult: 1, child: 0 });
    else if (cat === "커플") setPeople({ adult: 2, child: 0 });
    else if (cat === "친구") setPeople({ adult: 2, child: 0 });
    else if (cat === "가족") setPeople({ adult: 2, child: 1 });
  };

  const changePeople = (type, delta) => {
    if (category === "혼자") return;
    setPeople((prev) => ({
      ...prev,
      [type]:
        type === "adult"
          ? Math.max(1, prev[type] + delta)
          : Math.max(0, prev[type] + delta),
    }));
  };

  const duration = useMemo(() => {
    if (!selectedDateRange || !selectedDateRange[0] || !selectedDateRange[1])
      return { nights: 0, days: 1 };
    const diff = Math.floor(
      (selectedDateRange[1] - selectedDateRange[0]) / (1000 * 60 * 60 * 24),
    );
    return { nights: diff, days: diff + 1 };
  }, [selectedDateRange]);

  useEffect(() => {
    if (duration.days > 0)
      setScheduleTimeList(
        Array.from({ length: duration.days }, () => ({ start: 9, end: 22 })),
      );
  }, [duration.days]);

  useEffect(() => {
    if (duration.days > 0) {
      console.log("🗓️ 날짜 계산:", {
        nights: duration.nights,
        days: duration.days,
      });

      const locations = Array.from({ length: duration.days }, (_, index) => ({
        day: index + 1,
        startLocation:
          index === 0
            ? {
                name: "제주국제공항",
                address: "제주특별자치도 제주시 공항로 2",
                lat: 33.5066,
                lon: 126.4929,
              }
            : null,
        endLocation:
          index === duration.days - 1
            ? {
                name: "제주국제공항",
                address: "제주특별자치도 제주시 공항로 2",
                lat: 33.5066,
                lon: 126.4929,
              }
            : null,
      }));

      console.log(
        `✅ ${duration.nights}박${duration.days}일 → 위치정보 ${locations.length}개 생성`,
      );
      setLocationInfo(locations);
    }
  }, [duration.days, duration.nights]);

  const minBudget = totalPeople * duration.days * 100000;
  const maxBudget = totalPeople * duration.days * 500000;

  useEffect(() => {
    const appropriateMin = minBudget || 100000;
    const appropriateMax = maxBudget || 500000;
    if (totalBudget < appropriateMin) setTotalBudget(appropriateMin);
    if (totalBudget > appropriateMax) setTotalBudget(appropriateMax);
  }, [totalPeople, duration.days]);

  useEffect(() => {
    const ratio =
      transport === "렌터카"
        ? { 숙박: 0.35, 식비: 0.25, 교통: 0.15, 항공: 0.15, 체험: 0.1 }
        : { 숙박: 0.4, 식비: 0.3, 교통: 0.05, 항공: 0.15, 체험: 0.1 };
    const result = {};
    Object.keys(ratio).forEach(
      (k) => (result[k] = Math.floor(totalBudget * ratio[k])),
    );
    setBudgetBreakdown(result);
  }, [totalBudget, transport]);

  const handlePlanComplete = () => {
    if (!selectedDateRange || !selectedDateRange[0] || !selectedDateRange[1]) {
      alert("날짜를 선택해주세요.");
      return;
    }

    if (!selectedSpotIds || selectedSpotIds.length === 0) {
      alert("관광지를 먼저 선택해주세요.");
      navigate("/spots");
      return;
    }

    const isLocationComplete = locationInfo.every(
      (dayLoc) => dayLoc.startLocation && dayLoc.endLocation,
    );

    if (!isLocationComplete) {
      alert("모든 출발지와 도착지/숙소를 입력해주세요!");
      return;
    }

    const startDateStr = formatDateToYYYYMMDD(selectedDateRange[0]);
    const endDateStr = formatDateToYYYYMMDD(selectedDateRange[1]);

    console.log("🗓️ 변환된 날짜:");
    console.log("  - startDate:", startDateStr);
    console.log("  - endDate:", endDateStr);

    const travelData = {
      selectedSpots: selectedSpotIds,
      travelInfo: {
        category: category,
        people: people,
        dateRange: [startDateStr, endDateStr],
        dailySchedules: scheduleTimeList.map((time, index) => {
          const date = new Date(selectedDateRange[0]);
          date.setDate(date.getDate() + index);

          return {
            day: index + 1,
            date: formatDateToYYYYMMDD(date),
            startTime: `${String(time.start).padStart(2, "0")}:00`,
            endTime: `${String(time.end).padStart(2, "0")}:00`,
          };
        }),
        dailyLocations: locationInfo.map((dayLoc) => ({
          day: dayLoc.day,
          startName: dayLoc.startLocation.name,
          startAddress: dayLoc.startLocation.address,
          startLat: dayLoc.startLocation.lat,
          startLon: dayLoc.startLocation.lon,
          endName: dayLoc.endLocation.name,
          endAddress: dayLoc.endLocation.address,
          endLat: dayLoc.endLocation.lat,
          endLon: dayLoc.endLocation.lon,
        })),
        transport: transport,
        totalBudget: totalBudget,
        budgetBreakdown: budgetBreakdown,
      },
    };

    console.log("🧪 전달할 데이터:", travelData);
    console.log(
      "🧪 위치정보 개수:",
      travelData.travelInfo.dailyLocations.length,
    );
    console.log("🧪 dateRange:", travelData.travelInfo.dateRange);

    navigate("/loading", { state: { travelData } });
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => (
    <option key={i} value={i}>
      {String(i).padStart(2, "0")}:00
    </option>
  ));

  if (isLoading) return <LoadingPage />;

  return (
    <div css={s.pageContainer}>
      <div css={s.stepProgressBar}>
        <div css={s.stepItem(step === 1)}>
          인원 <IoPeopleSharp />
        </div>
        <div css={s.stepItem(step === 2)}>
          기간 <LuCalendarDays />
        </div>
        <div css={s.stepItem(step === 3)}>
          출발지/숙소 <FaMapMarkerAlt />
        </div>
        <div css={s.stepItem(step === 4)}>
          예산 <MdOutlineWallet />
        </div>
      </div>

      <div css={s.mainCard}>
        {step === 1 && (
          <div css={s.peopleSettingContainer}>
            <div css={s.categoryArea}>
              <label>누구와 함께하시나요?</label>
              <div css={s.categoryGroup}>
                {["혼자", "커플", "친구", "가족"].map((cat) => (
                  <button
                    key={cat}
                    css={s.categoryButton(category === cat)}
                    onClick={() => selectCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {category && (
              <div css={s.peopleControlAreaAnimation}>
                <p css={s.guideText}>
                  {category === "혼자" ? "나홀로 여행" : "인원을 설정해주세요"}
                </p>
                <div css={s.peopleControlGroup}>
                  <div css={s.peopleItem}>
                    <span>성인</span>
                    <div css={s.counter}>
                      <button
                        onClick={() => changePeople("adult", -1)}
                        disabled={category === "혼자"}
                      >
                        -
                      </button>
                      <span>{people.adult}</span>
                      <button
                        onClick={() => changePeople("adult", 1)}
                        disabled={category === "혼자"}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div css={s.peopleItem}>
                    <span>아동</span>
                    <div css={s.counter}>
                      <button
                        onClick={() => changePeople("child", -1)}
                        disabled={category === "혼자"}
                      >
                        -
                      </button>
                      <span>{people.child}</span>
                      <button
                        onClick={() => changePeople("child", 1)}
                        disabled={category === "혼자"}
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

        {step === 2 && (
          <div css={s.contentHorizontalLayout}>
            <div css={s.calendarArea}>
              <Calendar
                onChange={setSelectedDateRange}
                value={selectedDateRange}
                selectRange
                locale="ko-KR"
                formatShortWeekday={(locale, date) =>
                  ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
                }
                formatDay={(locale, date) => date.getDate()}
                calendarType="gregory"
              />
            </div>
            <div css={s.detailScheduleBox}>
              {selectedDateRange ? (
                <>
                  <div css={s.durationSummaryHeader}>
                    {duration.nights}박 {duration.days}일 일정
                  </div>
                  <div css={s.dayListContainer}>
                    {scheduleTimeList.map((time, i) => (
                      <div key={i} css={s.dayItemBox}>
                        <span className="dayText">{i + 1}일차</span>
                        <div className="timeSettingArea">
                          <select
                            css={s.timeSelect}
                            value={time.start}
                            onChange={(e) => {
                              const n = [...scheduleTimeList];
                              n[i].start = Number(e.target.value);
                              setScheduleTimeList(n);
                            }}
                          >
                            {timeOptions}
                          </select>
                          <span>~</span>
                          <select
                            css={s.timeSelect}
                            value={time.end}
                            onChange={(e) => {
                              const n = [...scheduleTimeList];
                              n[i].end = Number(e.target.value);
                              setScheduleTimeList(n);
                            }}
                          >
                            {timeOptions}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div css={s.emptyState}>날짜를 선택해주세요</div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div css={s.locationSettingContainer}>
            <h2 css={s.locationSettingTitle}>📍 출발지 및 숙소 설정</h2>
            <p css={s.locationSettingGuide}>
              각 날짜의 출발지와 숙소를 입력해주세요. 기본값이 설정되어 있으며
              자유롭게 변경 가능합니다.
            </p>

            {locationInfo.length === 0 ? (
              <div css={s.emptyState}>먼저 여행 기간을 선택해주세요.</div>
            ) : (
              <div css={s.dayLocationList}>
                {locationInfo.map((dayLoc, index) => (
                  <div key={index} css={s.dayLocationCard}>
                    <h3 css={s.dayTitle}>Day {dayLoc.day}</h3>

                    <LocationSearchInput
                      label={
                        dayLoc.day === 1
                          ? "🛫 여행 시작 위치"
                          : `🏨 Day ${dayLoc.day} 출발지`
                      }
                      placeholder="장소를 검색하세요"
                      defaultValue={dayLoc.startLocation}
                      onSelect={(place) => {
                        const updated = [...locationInfo];
                        updated[index].startLocation = place;
                        setLocationInfo(updated);
                      }}
                    />

                    <LocationSearchInput
                      label={
                        index === locationInfo.length - 1
                          ? "🛬 여행 종료 위치"
                          : `🏨 Day ${dayLoc.day} 숙소`
                      }
                      placeholder={
                        index === locationInfo.length - 1
                          ? "공항, 항구, 호텔 등"
                          : "숙소를 검색하세요"
                      }
                      defaultValue={dayLoc.endLocation}
                      onSelect={(place) => {
                        const updated = [...locationInfo];
                        updated[index].endLocation = place;

                        if (index < locationInfo.length - 1) {
                          updated[index + 1].startLocation = place;
                        }

                        setLocationInfo(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div css={s.integratedPageContainer}>
            <div css={s.leftSection}>
              <div css={s.group}>
                <label>이동수단</label>
                <div css={s.buttonGroup}>
                  <button
                    css={s.transportButton(transport === "렌터카")}
                    onClick={() => setTransport("렌터카")}
                  >
                    렌터카
                  </button>
                  <button
                    css={s.transportButton(transport === "대중교통")}
                    onClick={() => setTransport("대중교통")}
                  >
                    대중교통
                  </button>
                </div>
              </div>
              <div css={s.group}>
                <label>
                  총 예산 ({totalPeople}인/{duration.days}일)
                </label>
                <div css={s.sliderArea}>
                  <input
                    type="range"
                    min={minBudget}
                    max={maxBudget}
                    step="10000"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                  />
                  <div css={s.amountDisplay}>
                    {totalBudget.toLocaleString()}원
                  </div>
                  <div css={s.rangeGuide}>
                    최소 {minBudget / 10000}만 ~ 최대 {maxBudget / 10000}만
                  </div>
                </div>
              </div>
            </div>
            <div css={s.rightSection}>
              <div css={s.recommendResultCard}>
                <h4>1인당 지출 가이드</h4>
                {Object.entries(budgetBreakdown).map(([item, amount]) => (
                  <div key={item} css={s.resultRow}>
                    <span>{item}</span>
                    <strong>
                      {Math.floor(amount / (totalPeople || 1)).toLocaleString()}
                      원
                    </strong>
                  </div>
                ))}
                <div css={s.totalBar}>
                  합계:{" "}
                  {Math.floor(
                    totalBudget / (totalPeople || 1),
                  ).toLocaleString()}
                  원
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div css={s.navButtonArea}>
        <button onClick={() => setStep((p) => Math.max(p - 1, 1))}>이전</button>
        <button
          onClick={
            step === 4 ? handlePlanComplete : () => setStep((p) => p + 1)
          }
          disabled={step === 1 && !category}
        >
          {step === 4 ? "계획 완료" : "다음"}
        </button>
      </div>
    </div>
  );
}

export default TravelInfoPage;

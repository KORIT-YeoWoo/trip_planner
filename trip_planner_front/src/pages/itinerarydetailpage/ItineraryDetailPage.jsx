/** @jsxImportSource @emotion/react */
import ItineraryScheduleList from "../../components/itinerary/ItineraryScheduleList";
import * as s from "./styles";

function ItineraryDetailPage(){
    return <div css={s.layout}>
        <div css={s.container}>
            <div css={s.map}>
                <div css={s.mapInfo}>
                    <h3>GPS</h3>
                </div>
                <div css={s.kakaoMap}>
                    
                </div>
            </div>
            <div css={s.scheduleWrap}>
                <div css={s.dayTap}>
                    <ul css={s.daylist}>
                        <li>1일차</li>
                        <li>2일차</li>
                        <li>3일차</li>
                    </ul>
                    <div css={s.edit}>
                        <button css={s.editBtn}>수정</button>
                    </div>
                </div>
                <div css={s.schedule}>
                    <ItineraryScheduleList />
                </div>
                <div css={s.summary}>
                    <div css={s.summaryInfo}>
                        <div>
                            <p>이동거리</p>
                            <h3>25km</h3>
                        </div>
                        <div>
                            <p>총예산</p>
                            <h3>500,000원<span> / 2,000,000원</span></h3>
                        </div>
                        <div>
                            <p>소요시간</p>
                            <h3>8시간</h3>
                        </div>
                    </div>
                    <button css={s.createItinerary}>
                        일정 생성하기
                    </button>
                </div>
            </div>
       </div>
    </div>
}

export default ItineraryDetailPage;
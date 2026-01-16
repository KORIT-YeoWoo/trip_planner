/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import foxFace from "../../assets/smile.png"

function ItineraryScheduleList(){
    return <div css={s.container}>
        <div css={s.aiComment}>
            <img src={foxFace} alt="여우"/>
            <p>오늘은 성산, 우도를 방문하는 동쪽으로 일정을 구성했어요!</p>
        </div>
        <ul css={s.scheduleItems}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
}


export default ItineraryScheduleList;
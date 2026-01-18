/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { MdDragIndicator } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS as dndCSS } from "@dnd-kit/utilities";

function ScheduleItem({ data, order }) {
    // ✅ 데이터 안전하게 추출
    const time = data?.arrivalTime || "00:00";
    const title = data?.name || "관광지";
    const duration = data?.duration || 60;
    const price = data?.cost || 0;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: data?.itemId || 0 });

    const style = {
        transform: dndCSS.Transform.toString(transform),
        transition,
    };

    // ✅ 디버깅용 로그
    console.log('ScheduleItem data:', data);

    return (
        <li ref={setNodeRef} style={style}>
            <div css={s.scheduleItem(isDragging)}>
                <div css={s.orderBadge}>{order}</div>
                <div css={s.itemContent}>
                    <div css={s.timeText}>{time}</div>
                    <div css={s.placeInfo}>
                        <div css={s.placeIcon}>
                            <PiMapPinAreaFill />
                        </div>
                        <div css={s.place}>{title}</div>
                    </div>
                    <div css={s.detailInfo}>
                        <span>{duration}분 소요</span>
                        <span>•</span>
                        <span>₩ {price?.toLocaleString()}원</span>
                    </div>
                </div>
                <div css={s.dragHandle} {...attributes} {...listeners}>
                    <MdDragIndicator size={24} />
                </div>
            </div>
        </li>
    );
}

export default ScheduleItem;
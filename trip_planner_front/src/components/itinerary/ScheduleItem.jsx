/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { MdDragIndicator } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS as dndCSS } from "@dnd-kit/utilities";

function ScheduleItem({ data, order, isFixed = false }) {
    const time = data?.arrivalTime || "00:00";
    const title = data?.name || "관광지";
    const duration = data?.duration ?? 0;  // ✅ || 대신 ?? 사용
    const price = data?.cost ?? 0;         // ✅ || 대신 ?? 사용

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: data?.itemId || 0,
        disabled: isFixed
    });

    const style = {
        transform: dndCSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={!isFixed ? setNodeRef : undefined} style={!isFixed ? style : undefined}>
            <div css={s.scheduleItem(isDragging)}>
                <div css={s.orderBadge}>{order}</div>
                <div css={s.itemContent}>
                    <div css={s.timeText}>{time}</div>
                    <div css={s.placeInfo}>
                        <div css={s.placeIcon}>
                            <PiMapPinAreaFill />
                        </div>
                        <div css={s.placeTitle}>{title}</div>
                    </div>
                    {/* ✅ duration과 price가 모두 0이면 안 보이게 */}
                    {(duration > 0 || price > 0) && (
                        <div css={s.detailInfo}>
                            <span>{duration}분 소요</span>
                            <span>•</span>
                            <span>₩ {price?.toLocaleString()}원</span>
                        </div>
                    )}
                </div>
                {!isFixed && (
                    <div css={s.dragHandle} {...attributes} {...listeners}>
                        <MdDragIndicator size={24} />
                    </div>
                )}
            </div>
        </li>
    );
}

export default ScheduleItem;
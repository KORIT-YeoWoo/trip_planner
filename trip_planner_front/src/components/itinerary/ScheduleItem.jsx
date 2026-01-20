/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { MdDragIndicator } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS as dndCSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

function ScheduleItem({ data, order, isFixed = false, onDurationChange }) {
    const time = data?.arrivalTime || "00:00";
    const title = data?.name || "관광지";
    const duration = data?.duration ?? 0;
    const price = data?.cost ?? 0;

    // ✅ 체류 시간 조정 상태
    const [isEditingDuration, setIsEditingDuration] = useState(false);
    const [newDuration, setNewDuration] = useState(duration);

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

    // ✅ 저장 핸들러 (자동 저장)
    const handleSave = () => {
        if (newDuration !== duration && onDurationChange) {
            onDurationChange(data.itemId, newDuration);
        }
        setIsEditingDuration(false);
    };

    // ✅ 취소 핸들러 (백드롭 클릭 시 자동 저장)
    const handleCancel = () => {
        if (newDuration !== duration && onDurationChange) {
            onDurationChange(data.itemId, newDuration);
        }
        setIsEditingDuration(false);
    };

    // ✅ 시간 포맷팅
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}시간 ${mins}분`;
        if (hours > 0) return `${hours}시간`;
        return `${mins}분`;
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

                    {!isFixed && data?.type === 'SPOT' && (
                        <div css={s.durationSection}>
                            <span css={s.durationText}>
                                {formatDuration(duration)} 소요
                            </span>
                            <button
                                css={s.editDurationBtn}
                                onClick={() => setIsEditingDuration(true)}
                            >
                                <FaEdit />
                            </button>
                            {price > 0 && (
                                <div css={s.detailInfo}>
                                    <span>₩ {price?.toLocaleString()}원</span>
                                </div>
                            )}
                            
                            {isEditingDuration && (
                                <>
                                    <div css={s.durationPopupBackdrop} onClick={handleCancel} />
                                    <div css={s.durationPopup}>
                                        <input
                                            type="range"
                                            min="10"
                                            max="240"
                                            step="10"
                                            value={newDuration}
                                            onChange={(e) => setNewDuration(Number(e.target.value))}
                                            css={s.durationSlider}
                                        />
                                        <span css={s.popupDurationDisplay}>
                                            {formatDuration(newDuration)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ✅ 기존 가격 표시 (duration과 price가 모두 0이면 안 보이게) */}
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
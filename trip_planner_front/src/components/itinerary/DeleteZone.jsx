/** @jsxImportSource @emotion/react */
import { IoTrashOutline } from "react-icons/io5";
import * as s from "./styles";
import { useDroppable } from '@dnd-kit/core';

function DeleteZone({ isActive }) {
    const {isOver, setNodeRef } = useDroppable({
        id: 'delete-zone',
    })

    return (
        <div 
            ref={setNodeRef}
            css={s.deleteZone(isActive, isOver)}
        >
            <IoTrashOutline size={32} />
            <p css={s.deleteText}>
                삭제
            </p>
        </div>
    );
}

export default DeleteZone;
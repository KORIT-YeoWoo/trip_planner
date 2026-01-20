/** @jsxImportSource @emotion/react */ 
import * as s from "./styles"; 
import foxFace from "../../assets/smile.png" 
import ScheduleItem from "./ScheduleItem"; 
import { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import DeleteZone from "./DeleteZone";
import { last } from "lodash";

function ItineraryScheduleList({ 
    scheduleData, 
    onReorder, 
    onDelete,
    onDurationChange, 
    aiComment, 
    startTime, 
    endTime
}){ 
    console.log('실제 데이터 사용:', scheduleData);
    
    const [items, setItems] = useState(scheduleData || []);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        setItems(scheduleData || []);
    }, [scheduleData]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        if (over.id === 'delete-zone') {
            console.log('🗑️ 항목을 삭제 영역에 드롭:', active.id);
            
            if (onDelete) {
                try {
                    await onDelete(active.id);
                } catch (error) {
                    console.error('삭제 실패:', error);
                    alert(error.message || '삭제에 실패했습니다.');
                }
            }
            return;
        }

        if (active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.itemId === active.id);
            const newIndex = items.findIndex(item => item.itemId === over.id);

            if (oldIndex === -1 || newIndex === -1) {
                console.error('Invalid drag indices');
                return;
            }
            
            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);

            if (onReorder) {
                try {
                    const newItemIds = newItems.map(item => item.itemId);
                    await onReorder(newItemIds);
                } catch (error) {
                    console.error('순서 변경 실패:', error);
                    alert(error.message || '순서 변경에 실패했습니다.');
                    setItems(items);
                }
            }
        }
    };

    const startPoint = {
        itemId: 'start-point',
        type: 'START',
        name: '출발',
        arrivalTime: startTime || '09:00',
        duration: 0,
        cost: 0,
        isFixed: true
    };

    const endPoint = {
        itemId: 'end-point',
        type: 'END',
        name: '도착',
        arrivalTime: endTime || '18:15',
        duration: 0,
        cost: 0,
        isFixed: true
    };

    return <div css={s.container}> 
        <div css={s.aiComment}> 
            <img src={foxFace} alt="여우"/> 
            <p>{aiComment || '오늘은 성산, 우도를 방문하는 동쪽으로 일정을 구성했어요!'}</p> 
        </div> 

        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}  
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]} 
        >
            <SortableContext
                items={items.map(item => item.itemId)}
                strategy={verticalListSortingStrategy}
            >
                <ul css={s.scheduleItems}> 
                    <ScheduleItem 
                        data={startPoint}
                        order="출"
                        isFixed={true}
                    />

                    {items.map((item, index) => ( 
                        <ScheduleItem
                            key={item.itemId}
                            data={item}
                            order={index + 1}
                            onDurationChange={onDurationChange} 
                        /> 
                    ))} 
                    
                    <ScheduleItem 
                        data={endPoint}
                        order="도"
                        isFixed={true}
                    />
                </ul>
            </SortableContext>
            <DeleteZone isActive={activeId !== null} />
        </DndContext>
    </div> 
} 

export default ItineraryScheduleList;
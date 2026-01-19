/** @jsxImportSource @emotion/react */ 
import * as s from "./styles"; 
import foxFace from "../../assets/smile.png" 
import ScheduleItem from "./ScheduleItem"; 
import { act, useEffect, useState } from "react";
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

function ItineraryScheduleList({ scheduleData, onReorder, onDelete, aiComment, startTime, endTime}){ 
    const defaultScheduleData = [
        { 
            order: 0,
            type: "SPOT",
            itemId: 2, 
            name: "거문오름", 
            category: "자연",
            arrivalTime: "09:35",
            departureTime: "10:35", 
            duration: 60, 
            cost: 2000,
            island: false,
            travelFromPrevious: {
                distance: 24.737,
                duration: 35,
                transportType: "CAR"
            }
        },
        { 
            order: 1,
            type: "SPOT",
            itemId: 3, 
            name: "우도", 
            category: "자연",
            arrivalTime: "11:08",
            departureTime: "17:08", 
            duration: 360, 
            cost: 10000,
            island: true,
            travelFromPrevious: {
                distance: 25.758,
                duration: 33,
                transportType: "CAR"
            }
        },
        { 
            order: 2,
            type: "SPOT",
            itemId: 4, 
            name: "광치기해변", 
            category: "자연",
            arrivalTime: "17:15",
            departureTime: "18:15", 
            duration: 60, 
            cost: 0,
            island: false,
            travelFromPrevious: {
                distance: 4.082,
                duration: 7,
                transportType: "CAR"
            }
        },
    ];


    const [items, setItems] = useState(defaultScheduleData);
    const [activeId, setActiveId] = useState(null); 

    // scheduleData가 있으면 사용, 없으면 임시 데이터
    useEffect(() => {
        if (scheduleData && scheduleData.length > 0) {
            console.log('실제 데이터 사용:', scheduleData);
            setItems(scheduleData);
        } else {
            console.log('임시 데이터 사용');
            setItems(defaultScheduleData);
        }
    }, [scheduleData]);

    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };


    const handleDragEnd = async (event) => {
        const { active, over } = event;

        setActiveId(null); // 드래그 종료

        // 삭제 영역에 드롭한 경우
        if (over && over.id === 'delete-zone'){
            const itemToDelete = items.find(item => item.itemId === active.id);

            if (items.length <= 1){
                alert('최소 1개 이상의 관광지가 필요합니다.');
                return;
            }

            if (window.confirm(`"${itemToDelete?.name}"을(를) 삭제하시겠습니까?`)){
                const newItems = items.filter(item => item.itemId !== active.id);
                setItems(newItems);

                if(onDelete){
                    try {
                        await onDelete(active.id);
                    } catch (error) {
                        console.error('삭제 실패:',error);
                        alert(error.message || '삭제에 실패했습니다.');
                        setItems(items);
                    }
                }
            }
            return;
        }

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.itemId === active.id);
            const newIndex = items.findIndex(item => item.itemId === over.id);
            
            const newItems = arrayMove(items, oldIndex, newIndex);
            
            // 섬 개수 체크
            const islandCount = newItems.filter(item => item.island).length;
            if (islandCount > 1) {
                alert('⚠️ 하루에 섬은 1개만 방문 가능합니다.');
                return;
            }
            
            // 섬 있을 때 개수 체크
            if (islandCount === 1 && newItems.length > 3) {
                alert('⚠️ 섬이 있는 날은 최대 3개 관광지만 가능합니다.');
                return;
            }
            
            setItems(newItems);  // UI 즉시 업데이트

            // 백엔드 API 호출
            if (onReorder) {
                try {
                    const newItemIds = newItems.map(item => item.itemId);
                    await onReorder(newItemIds);
                } catch (error) {
                    console.error('순서 변경 실패:', error);
                    alert(error.message || '순서 변경에 실패했습니다.');
                    setItems(items);  // 실패 시 원상복구
                }
            }
        }
    };

    // ✅ 출발지/도착지 데이터 생성
    const startPoint = {
        itemId: 'start-point',
        type: 'START',
        name: '출발',
        arrivalTime: startTime || '09:00',
        duration: 0,
        cost: 0,
        isFixed: true  // 고정 아이템 표시
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
                        order="🏠"
                        isFixed={true}
                    />

                    {items.map((item, index) => ( 
                        <ScheduleItem
                            key={item.itemId}
                            data={item}
                            order={index + 1}
                        /> 
                    ))} 
                    <ScheduleItem 
                        data={endPoint}
                        order="🏠"
                        isFixed={true}
                    />
                </ul>
            </SortableContext>
            <DeleteZone isActive={activeId !== null} />
        </DndContext>
    </div> 
} 

export default ItineraryScheduleList;
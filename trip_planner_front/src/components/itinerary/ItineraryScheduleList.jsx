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

function ItineraryScheduleList({ scheduleData, onReorder, aiComment }){ 
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

    const handleDragEnd = async (event) => {
        const { active, over } = event;

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

    return <div css={s.container}> 
        <div css={s.aiComment}> 
            <img src={foxFace} alt="여우"/> 
            <p>{aiComment || '오늘은 성산, 우도를 방문하는 동쪽으로 일정을 구성했어요!'}</p> 
        </div> 

        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => item.itemId)}
                strategy={verticalListSortingStrategy}
            >
                <ul css={s.scheduleItems}> 
                    {items.map((item, index) => ( 
                        <ScheduleItem
                            key={item.itemId}
                            data={item}
                            order={index + 1}
                        /> 
                    ))} 
                </ul>
            </SortableContext>
        </DndContext>
    </div> 
} 

export default ItineraryScheduleList;
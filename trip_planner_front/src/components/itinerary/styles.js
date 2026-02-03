import { css } from "@emotion/react";

export const container = css`
    display: flex;
    flex-direction: column;
    min-height: 100%; 
`;

export const aiComment = css`
    flex-shrink: 0;
    position: sticky;
    top: 10px;
    display: flex;
    flex-direction: row;
    padding: 15px;
    margin: 10px 20px;
    box-sizing: border-box;
    border-radius: 20px;
    background-color: #FDEBE0;
    justify-content: space-between;
    align-items: center;
    z-index: 100;

    & > img {
        width: 60px;
        height: 60px;
    }

    & > p {
        width: 90%;
        font-size: 1.2rem;
    }
`;

export const scheduleItems = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: scroll;
    padding: 0 20px 20px 20px;

    &::-webkit-scrollbar{
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }

    & > li {
        flex-shrink: 0;
        list-style: none;
    }
`;

// =====================

export const scheduleItem = (isDragging) => css`
    position: relative;
    display: flex;
    align-items: center;
    gap: 15px;
    background-color: #fff;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    cursor: default;
    transition: all 0.2s ease;
    opacity: ${isDragging ? 0.5 : 1};
    transform: ${isDragging ? 'scale(1.02)' : 'scale(1)'};
    
    ${isDragging && `
        opacity: 0.5;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        z-index: 999;
    `}

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
`;

export const orderBadge = css`
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ff6b35;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 700;
`;

export const itemContent = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const timeText = css`
    font-size: 0.9rem;
    color: #999;
    font-weight: 600;
`;

export const placeInfo = css`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const placeIcon = css`
    font-size: 1.2rem;
`;

export const placeTitle = css`
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
`;

export const detailInfo = css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #666;

    & > span:nth-of-type(2) {
        color: #ddd;
    }
`;

export const dragHandle = css`
    flex-shrink: 0;
    cursor: grab;
    color: #ccc;
    transition: color 0.2s ease;

    &:hover {
        color: #ff6b35;
    }

    &:active {
        cursor: grabbing;
    }
`;

export const deleteZone = (isActive, isOver) => css`
    position: sticky;
    bottom: 20px;
    width: calc(100%-40px);  //  좌우 20px씩 여백
    height: ${isActive ? '40px' : '0'};
    padding: ${isActive ? '20px' : '0'};
    margin: ${isActive ? '10px' : '0'};
    background-color: ${isOver ? '#f44336' : '#ffebee'};
    border: 2px dashed ${isOver ? '#d32f2f' : '#ef5350'};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: ${isOver ? 'white' : '#d32f2f'};
    transition: all 0.3s ease;
    overflow: hidden;
    opacity: ${isActive ? 1 : 0};
    
    svg {
        transition: transform 0.2s ease;
        transform: ${isOver ? 'scale(1.2)' : 'scale(1)'};
    }
`;

//==============

export const durationSection = css`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const durationText = css`
    font-size: 13px;
    color: #666;
`;

export const editDurationBtn = css`
    font-size: 12px;
    border:none;
    cursor: pointer;
    background: none;
    color: #ff6b35;
`;

//  팝업 백드롭 (투명한 배경)
export const durationPopupBackdrop = css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    animation: fadeIn 0.15s ease;

`;

// 심플한 슬라이더 팝업
export const durationPopup = css`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    padding: 20px 20px 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: popupSlideIn 0.2s ease;

    @keyframes popupSlideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -45%) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;

export const popupDurationDisplay = css`
    font-size: 14px;
    font-weight: 600;
    color: #ff6b35;
`;

export const durationSlider = css`
    width: 200px;
    height: 5px;
    border-radius: 4px;
    background: linear-gradient(to right, #ffebe0 0%, #ff6b35 100%);
    outline: none;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        border: 3px solid #ff6b35;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.15s ease;

        &:hover {
            transform: scale(1.15);
            box-shadow: 0 3px 12px rgba(255, 107, 53, 0.3);
        }

        &:active {
            transform: scale(1.05);
        }
    }

    &::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: white;
        border: 3px solid #ff6b35;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
`;

export const popupButtons = css`
    display: none;
`;

export const saveBtn = css`
    display: none;
`;

export const cancelBtn = css`
    display: none;
`;
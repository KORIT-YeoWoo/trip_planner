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
import { css } from '@emotion/react';

// ==================== LockedStyleCard ====================
export const lockedContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 40px;
    background: linear-gradient(135deg, #FFF5F0 0%, #FFE8DD 100%);
    border-radius: 20px;
    margin-top: 40px;
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.1);
`;

export const lockIcon = css`
    margin-bottom: 30px;
    animation: bounce 2s infinite;

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;

export const lockedTitle = css`
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
`;

export const lockedDescription = css`
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
`;

export const progressWrapper = css`
    width: 100%;
    max-width: 400px;
    margin-bottom: 40px;
`;

export const progressBar = css`
    width: 100%;
    height: 12px;
    background-color: #FFE8DD;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
`;

export const progressFill = css`
    height: 100%;
    background: linear-gradient(90deg, #FF6B35 0%, #FF8C61 100%);
    border-radius: 10px;
    transition: width 0.3s ease;
`;

export const progressText = css`
    display: block;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #FF6B35;
`;

export const ctaButton = css`
    padding: 16px 40px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;

// ==================== TravelStyleCard ====================
export const styleCard = css`
    display: flex;
    gap: 40px;
    padding: 40px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-top: 30px;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
    }
`;

export const characterSection = css`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    background: linear-gradient(135deg, #FFF5F0 0%, #FFE8DD 100%);
    border-radius: 50%;
    
    @media (max-width: 768px) {
        width: 200px;
        height: 200px;
        margin: 0 auto;
    }
`;

export const characterImage = css`
    width: 200px;
    height: 200px;
    object-fit: contain;
    
    @media (max-width: 768px) {
        width: 160px;
        height: 160px;
    }
`;

export const infoSection = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const typeName = css`
    font-size: 32px;
    font-weight: bold;
    color: #FF6B35;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
        font-size: 24px;
        text-align: center;
    }
`;

export const typeDescription = css`
    font-size: 18px;
    line-height: 1.6;
    color: #555;
    
    @media (max-width: 768px) {
        font-size: 16px;
        text-align: center;
    }
`;

// ==================== StatsGrid ====================
export const statsContainer = css`
    margin-top: 40px;
`;

export const statsTitle = css`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
`;

export const statsGrid = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
`;

export const statCard = css`
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
`;

export const statIcon = css`
    font-size: 36px;
    margin-bottom: 12px;
`;

export const statLabel = css`
    display: block;
    font-size: 14px;
    color: #888;
    margin-bottom: 8px;
`;

export const statValue = css`
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #333;
`;

// ==================== LevelBars ====================
export const levelsContainer = css`
    margin-top: 40px;
    padding: 30px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

export const levelsTitle = css`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
`;

export const levelsList = css`
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

export const levelItem = css`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const levelHeader = css`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const levelIcon = css`
    font-size: 24px;
`;

export const levelLabel = css`
    font-size: 16px;
    font-weight: 600;
    color: #333;
`;

export const levelBarWrapper = css`
    width: 100%;
    height: 30px;
    background-color: #F5F5F5;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
`;

export const levelBar = css`
    height: 100%;
    border-radius: 15px;
    transition: width 0.5s ease;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;
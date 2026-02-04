import { css } from '@emotion/react';

// ==================== 공통 ====================
export const loading = css`
    text-align: center;
    padding: 60px;
    font-size: 16px;
    color: #666;
`;

export const error = css`
    text-align: center;
    padding: 30px;
    color: #e74c3c;
    background-color: #ffe8e8;
    border-radius: 8px;
`;

// ==================== 메인 레이아웃 (2열) ====================
export const mainContainer = css`
    display: flex;
    gap: 25px;
    padding: 15px;
    height: 100%;
    overflow: hidden;
    
    @media (max-width: 1200px) {
        flex-direction: column;
    }
`;

export const leftSection = css`
    flex-shrink: 0;
    width: 45%;
    
    @media (max-width: 1200px) {
        width: 100%;
    }
`;

export const rightSection = css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
`;

// ==================== 왼쪽 카드 ====================
export const leftCard = css`
    border-radius: 20px;
    padding: 30px 20px;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const characterCircle = css`
    width: 220px;
    height: 220px;
    margin: 0 auto 20px;
    background: linear-gradient(180deg, #FFF5F0 0%, #FFE8DD 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const characterImg = css`
    width: 300px;
    height: 300px;
    object-fit: contain;
`;

export const cardTypeName = css`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
`;

export const cardDescription = css`
    font-size: 18px;
    line-height: 1.5;
    color: #555;
    padding: 0 10px;
`;

// ==================== 오른쪽 헤더 ====================
export const header = css`
    background: linear-gradient(135deg, #FFF9F5 0%, #FFF5F0 100%);
    border-radius: 15px;
    padding: 10px 20px;
    flex-shrink: 0;
`;

export const mainTitle = css`
    font-size: 20px;
    font-weight: bold;
    color: #333;
`;

export const mainQuote = css`
    font-size: 16px;
    font-weight: 600;
    color: #FF6B35;
    line-height: 1.5;
    margin-bottom: 10px;
    padding: 12px;
    background: white;
    border-radius: 8px;
    border-left: 3px solid #FF6B35;
`;

export const subDescription = css`
    font-size: 12px;
    line-height: 1.6;
    color: #666;
`;

// ==================== StatsGrid ====================
export const statsContainer = css`
    flex-shrink: 0;
`;

export const statsTitle = css`
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
`;

export const statsGrid = css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

export const statCard = css`
    text-align: center;
    padding: 12px 6px;
`;

export const statLabel = css`
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
`;

export const statValue = css`
    display: block;
    font-size: 16px;
    font-weight: bold;
    color: #333;
`;

export const badgeTagContainer = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    flex-shrink: 0;
`;


export const sectionTitle = css`
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
`;

export const badgeGrid = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const badgeRow = css`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
`;

export const badgeItem = css`
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const badgeIcon = css`
    font-size: 18px;
`;

export const badgeText = css`
    font-size: 12px;
    color: #555;
`;

export const badgeCount = css`
    font-size: 12px;
    color: #999;
`;

export const tagList = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const tagRow = css`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
`;

export const tag = css`
    background: #FF6B35;
    color: white;
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
    width: fit-content;
`;

export const tagCount = css`
    font-size: 12px;
    color: #999;
`;

// ==================== LevelBars ====================
export const levelsContainer = css`
    flex-shrink: 0;
`;

export const levelsTitle = css`
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
`;

export const levelsList = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const levelItem = css`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const levelHeader = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const levelLabel = css`
    font-size: 12px;
    font-weight: 600;
    color: #333;
`;

export const levelBarWrapper = css`
    width: 100%;
    height: 18px;
    background-color: #F5F5F5;
    border-radius: 9px;
    overflow: hidden;
`;

export const levelBar = css`
    height: 100%;
    border-radius: 9px;
    transition: width 0.8s ease;
    background: linear-gradient(90deg, #FF6B35 0%, #FF8C61 100%);
`;

// ==================== LockedStyleCard ====================
export const lockedContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 30px;
    background: linear-gradient(135deg, #FFF5F0 0%, #FFE8DD 100%);
    border-radius: 20px;
    box-shadow: 0 2px 12px rgba(255, 107, 53, 0.08);
    margin: 15px;
`;

export const lockIcon = css`
    margin-bottom: 20px;
    animation: bounce 2s infinite;

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;

export const lockedTitle = css`
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
`;

export const lockedDescription = css`
    font-size: 15px;
    color: #666;
    margin-bottom: 20px;
`;

export const progressWrapper = css`
    width: 100%;
    max-width: 300px;
    margin-bottom: 30px;
`;

export const progressBar = css`
    width: 100%;
    height: 10px;
    background-color: #FFE8DD;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 8px;
`;

export const progressFill = css`
    height: 100%;
    background: linear-gradient(90deg, #FF6B35 0%, #FF8C61 100%);
    border-radius: 8px;
    transition: width 0.3s ease;
`;

export const progressText = css`
    display: block;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #FF6B35;
`;

export const ctaButton = css`
    padding: 12px 30px;
    font-size: 15px;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(255, 107, 53, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
    }
`;
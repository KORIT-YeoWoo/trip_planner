import { css } from "@emotion/react";

export const container = css`
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
`;

export const profileSection = css`
    display: flex;
    gap: 24px;
    padding: 32px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
`;

export const profileImage = css`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const defaultAvatar = css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ff6b35, #f47a20);
    color: white;
    font-size: 32px;
    font-weight: 700;
`;

export const profileInfo = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const nicknameDisplay = css`
    display: flex;
    align-items: center;
    gap: 12px;

    h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: #333;
    }
`;

export const nicknameEdit = css`
    display: flex;
    gap: 8px;
    align-items: center;
`;

export const nicknameInput = css`
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    flex: 1;
    max-width: 300px;

    &:focus {
        outline: none;
        border-color: #ff6b35;
    }
`;

export const editButton = css`
    padding: 6px 12px;
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #6b7280;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
    }
`;

export const saveButton = css`
    padding: 8px 16px;
    background: #ff6b35;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #e55a2b;
    }
`;

export const cancelButton = css`
    padding: 8px 16px;
    background: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #f5f5f5;
    }
`;

export const email = css`
    margin: 0;
    color: #6b7280;
    font-size: 14px;
`;

export const provider = css`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
`;

export const menuSection = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const menuItem = css`
    padding: 16px 24px;
    background: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    color: #333;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.2s;

    &:hover {
        background: #f9fafb;
        transform: translateX(4px);
    }
`;

export const logoutMenuItem = css`
    color: #ef4444;
    margin-top: 24px;

    &:hover {
        background: #fef2f2;
    }
`;
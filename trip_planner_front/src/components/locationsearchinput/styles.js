/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const locationSearchInput = css`
  margin-bottom: 20px;
  position: relative;
`;

export const locationLabel = css`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 15px;
`;

// 검색 입력창 래퍼
export const searchInputWrapper = css`
  position: relative;
  z-index: 1;
`;

export const searchInput = css`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }

  &::placeholder {
    color: #999;
  }
`;

export const searchingIcon = css`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: translateY(-50%) rotate(0deg);
    }
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
`;

// 선택된 장소 표시
export const selectedPlace = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f0f7ff;
  border: 1px solid #4caf50;
  border-radius: 8px;
`;

export const placeInfo = css`
  flex: 1;
`;

export const placeName = css`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  font-size: 15px;
`;

export const placeAddress = css`
  font-size: 14px;
  color: #666;
`;

export const clearButton = css`
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }
`;

// ✅ 검색 결과 (중요 수정!)
export const searchResults = css`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;  /* ✅ 높은 z-index */
  margin-top: -1px;
  
  /* ✅ 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0 0 8px 0;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const resultItem = css`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;  /* ✅ 배경 명시 */

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

export const resultName = css`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  font-size: 15px;
`;

export const resultAddress = css`
  font-size: 14px;
  color: #666;
`;
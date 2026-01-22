import { css } from "@emotion/react";

export const header = css`
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const container = css`
  max-width: 1700px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const logo = css`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6b35;
  text-decoration: none;
  cursor: pointer;
`;

export const nav = css`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

export const navLink = css`
  color: #374151;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #ff6b35;
  }
`;

export const userName = css`
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
`;

export const logoutButton = css`
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }
`;

export const button = css`
  background-color: #ff6b35;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e55a2b;
  }
`;
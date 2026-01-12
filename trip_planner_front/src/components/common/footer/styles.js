import { css } from "@emotion/react";

export const footer = css`
  background-color: #1f2937;
  color: #d1d5db;
  padding: 2rem;
  margin-top: auto;
`;

export const container = css`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const logo = css`
  font-size: 1.25rem;
  font-weight: bold;
  color: #ff6b35;
`;

export const copyright = css`
  font-size: 0.875rem;
  color: #9ca3af;
`;

export const links = css`
  display: flex;
  gap: 1.5rem;
`;

export const link = css`
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;

  &:hover {
    color: #ff6b35;
  }
`;

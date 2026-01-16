import { css } from "@emotion/react";

export const container = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`;

export const emoji = css`
    display: flex;
    flex-direction: column;
    width: 15vh;
`;

export const title = css`
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

export const message = css`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

export const button = css`
  background-color: #ff6b35;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e55a2b;
  }
`;

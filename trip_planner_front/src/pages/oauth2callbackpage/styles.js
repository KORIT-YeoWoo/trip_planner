import { css, keyframes } from "@emotion/react";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const loadingContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f8f9fa;
  z-index: 9999;
`;

export const spinner = css`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #ff6b35;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const loadingText = css`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #374151;
  font-weight: 500;
  text-align: center;
`;
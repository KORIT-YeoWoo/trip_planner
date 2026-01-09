import { css } from "@emotion/react";

export const card = (select)=>css`

  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid ${select ? "orange":"black"};
  border-radius: 6px;
  cursor: pointer;
   transition: transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease;

  &:hover{
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  }
  &:active{
    transform: translateY(0px) scale(0.99);
  }

`;
export const grid = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* ✅ 한 줄에 3개 */
  gap: 16px;


`;
export const title = css`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
`;
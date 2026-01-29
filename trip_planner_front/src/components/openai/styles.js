import { css } from "@emotion/react";


export const aiChatLayout = (open) => css`
    display: ${open ? "flex" : "none"};
    position: fixed;
    top: 0;
    right: 0;

    height: 100vh;
    
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;


export const aiChatContainer = css`
    border: 1px solid oklch(0.92 0.01 85);
    width: 350px;
    height: 700px;
    background-color: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column; 
    overflow: hidden;      
    position: relative;

`;


export const layout = css`
    display: flex;
    flex-direction: column;
    height: 100%;          
    overflow: hidden;      
`;


export const chatContainer = css`
    flex: 1;                
    overflow-y: auto;       
    padding: 20px 20px 20px; //상단 닫기 버튼 자리를 위해 top 패딩을 줌 
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #f9f9f9;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 10px;
    }
`;

// 5. 유저 말풍선
export const question = css`
    align-self: flex-end;   // 오른쪽 정렬 
    background-color: #ff4d4d;
    color: white;
    padding: 10px 15px;
    border-radius: 15px 15px 0 15px;
    max-width: 80%;
    font-size: 14px;
    line-height: 1.5;
`;

//ai 말풍선
export const answer = css`
    align-self: flex-start; /* 왼쪽 정렬 */
    background-color: white;
    color: #333;
    padding: 12px 16px;
    border-radius: 15px 15px 15px 0;
    max-width: 85%;
    font-size: 14px;
    line-height: 1.6;
    border: 1px solid #eee;

    
    p { margin: 0; }
    ul, ol { padding-left: 20px; margin: 5px 0; }
`;

export const inputContainer = css`
    display: flex;
    padding: 15px;
    background-color: white;
    border-top: 1px solid #eee;
    gap: 10px;
    align-items: center;

    textarea {
        flex: 1;
        height: 40px;
        max-height: 100px;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 10px;
        resize: none;
        outline: none;
        font-family: inherit;
        &:focus { border-color: #ff4d4d; }
    }

    button {
        background: #ff4d4d;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding-left: 3px;
        padding-top: 2px;
        &:disabled { background: #ccc; }
        svg { font-size: 20px; }
    }
`;
export const chatTopbar= css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: white; 
    border-bottom: 1px solid #eee;
    height: 60px;
    box-sizing: border-box;

`;
export const chatTitle = css`
 
    font-size: 16px;
    font-weight: 800;
    color: #333;

    
`;
export const closeBtn = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 8px;
    background-color: #f2f2f2;
    color: #888;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;

    &:hover {
        background-color: #ff4d4d;
        color: white;
        
    }
`;
export const topelement = css`
    display: flex;
    align-items: center;
    gap: 8px;


`;
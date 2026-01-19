import { css } from "@emotion/react";

// 1. 모달 전체 배경 (Overlay)
export const aiChatLayout = (open) => css`
    display: ${open ? "flex" : "none"};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

// 2. 흰색 모달 박스 본체
export const aiChatContainer = css`
    width: 450px;
    height: 700px;
    background-color: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column; /* 세로 배치 */
    overflow: hidden;       /* 내부 요소가 둥근 테두리를 벗어나지 않게 함 */
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

// 3. OpenaiApiModal의 가장 바깥쪽 div (스크롤 영역 제어)
export const layout = css`
    display: flex;
    flex-direction: column;
    height: 100%;           /* 부모 높이를 가득 채움 */
    overflow: hidden;       /* 레이아웃 자체는 고정 */
`;

// 4. 메시지들이 쌓이는 실제 스크롤 영역
export const chatContainer = css`
    flex: 1;                /* 입력창을 제외한 나머지 공간을 다 차지함 */
    overflow-y: auto;       /* ✅ 대화가 길어지면 여기에 스크롤 발생 */
    padding: 60px 20px 20px; /* 상단 닫기 버튼 자리를 위해 top 패딩을 줌 */
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #f9f9f9;

    /* 스크롤바 커스텀 */
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 10px;
    }
`;

// 5. 질문(사용자) 말풍선
export const question = css`
    align-self: flex-end;   /* 오른쪽 정렬 */
    background-color: #ff4d4d;
    color: white;
    padding: 10px 15px;
    border-radius: 15px 15px 0 15px;
    max-width: 80%;
    font-size: 14px;
    line-height: 1.5;
`;

// 6. 답변(AI) 말풍선
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

    /* 마크다운 스타일 정돈 */
    p { margin: 0; }
    ul, ol { padding-left: 20px; margin: 5px 0; }
`;

// 7. 하단 입력 영역
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
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:disabled { background: #ccc; }
        svg { font-size: 20px; }
    }
`;
import { css } from "@emotion/react";

export const container = css`
    display: flex;
    flex-direction: column;
    min-height: 100%; 
`;

export const aiComment = css`
    flex-shrink: 0;
    position: sticky;
    top: 10px;
    display: flex;
    flex-direction: row;
    padding: 15px;
    margin: 10px 20px;
    box-sizing: border-box;
    border-radius: 20px;
    background-color: #FDEBE0;
    justify-content: space-between;
    align-items: center;
    z-index: 100;

    & > img {
        width: 60px;
        height: 60px;
    }

    & > p {
        width: 90%;
        font-size: 1.2rem;
    }
`;

export const scheduleItems = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
    overflow-y: scroll;

    &::-webkit-scrollbar{
        display: none;
    }
    & > li {
        flex-shrink: 0;
        list-style: none;
        background-color: #fff;
        width: 90%;
        height: 100px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;
/** @jsxImportSource @emotion/react */

import * as s from "./styles";
import MyPageCategory from "../../components/mypage/MyPageCategory";

function MyPage() {
    return (
        <div css={s.layout}> 
            <div css={s.bar}><MyPageCategory /></div>
            <div css={s.content}></div>

            <div css={s.bar}style={{ borderRight: 'none' }}></div>
            
        </div>
        

    );
}

export default MyPage;
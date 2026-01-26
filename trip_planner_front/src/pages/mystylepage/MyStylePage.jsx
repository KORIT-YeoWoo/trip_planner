/** @jsxImportSource @emotion/react */
import MyPageCategory from "../../components/mypage/MyPageCategory";
import * as s from "./styles";
function MyStylePage() {
    return (
        <div css={s.layout}> 
            <div css={s.bar}><MyPageCategory /></div>
            <div css={s.content} style={{ position: 'relative' }}>
                <div css={s.overlay}>
                    <div css={s.styleContent}><h1>나의 여행 스타일</h1></div>
                </div>
            </div>
                


            <div css={s.bar}style={{ borderRight: 'none' }}></div>
            
        </div>
        

    );
}

export default MyStylePage;
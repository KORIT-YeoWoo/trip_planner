/** @jsxImportSource @emotion/react */

import * as s from "./styles";

function TosPage() {
   
    return (
        <div css={s.layout}> 
            <div css={s.bar}></div>

            {/* 약관 본문 영역 */}
            <div css={s.content}>
                <h1 css={s.title}>이용약관</h1>

                <section css={s.section}>
                    <h2>제1조 (목적)</h2>
                    <p>
                        본 약관은 YEOWOO(이하 “회사”)가 제공하는 AI 여행 일정 자동 최적화 서비스(이하 “서비스”)의
                        이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                    </p>
                </section>

                <section css={s.section}>
                    <h2>제2조 (정의)</h2>
                    <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                    <ul>
                        <li>“서비스”란 회사가 제공하는 여행 일정 추천, 관광지 정보 제공, 일정 자동 생성 서비스를 말합니다.</li>
                        <li>“이용자”란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                        <li>“회원”이란 회사에 개인정보를 제공하여 회원등록을 한 자를 말합니다.</li>
                    </ul>
                </section>

                <section css={s.section}>
                    <h2>제3조 (약관의 효력 및 변경)</h2>
                    <p>
                        본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.
                        회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있습니다.
                    </p>
                </section>

                <section css={s.section}>
                    <h2>제4조 (서비스의 제공)</h2>
                    <ul>
                        <li>관광지 정보 제공</li>
                        <li>사용자 맞춤 여행 일정 자동 생성</li>
                        <li>지도 기반 이동 경로 제공</li>
                        <li>기타 회사가 제공하는 부가 서비스</li>
                    </ul>
                </section>

                <section css={s.section}>
                    <h2>제5조 (책임의 제한)</h2>
                    <p>
                        회사는 서비스 이용 결과의 정확성, 완전성을 보장하지 않으며,
                        일정 추천 및 이동 시간, 비용 정보는 참고용입니다.
                    </p>
                </section>

                <section css={s.section}>
                    <h2>부칙</h2>
                    <p>본 약관은 2026년 1월 1일부터 시행합니다.</p>
                </section>
            </div>

            <div 
                css={s.bar}
                style={{ borderRight: 'none' }}
            ></div>
        </div>
    );
}

export default TosPage;

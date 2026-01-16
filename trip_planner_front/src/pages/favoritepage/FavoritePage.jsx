/** @jsxImportSource @emotion/react */

import { useEffect, useState } from "react";
import { getMyFavorites, getSpots, removeFavorites } from "../../apis/spotApi"; 
import { IoMdHeart } from "react-icons/io";
import * as s from "./styles";
function FavoritePage() {
    const [favoriteSpots, setFavoriteSpots]=useState([]);
    const[loading,setLoading] = useState(false);

    useEffect(() => {
    const fetchFavoriteSpots = async () => {
      try {
        setLoading(true);
        // 1. API 호출 (참고하신 형식과 동일)
        const response = await getMyFavorites();
        
        // 2. 응답 구조에 따라 데이터 추출 (가장 중요한 부분!)
        // 인터셉터가 response.data를 주면 response를 쓰고, 
        // 아니면 일반적인 response.data를 시도합니다.
        const favoriteData = response.data || response;
        
        setFavoriteSpots(Array.isArray(favoriteData) ? favoriteData : []);
      } catch (err) {
        console.error('관광지 목록 조회 실패:', err);
        // 에러 상태가 있다면 여기서 처리 (setError 등)
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteSpots();
  }, []);


    const handleRemoveWish = async (id) => {
        try {
            await removeFavorites(id); // 서버에서 삭제
            setFavoriteSpots((prev) => prev.filter(spot => spot.spotId !== id)); // 화면에서 즉시 제거
        } catch (e) {
            console.error("삭제 실패", e);
        }
    };


    return (
        <div css={s.layout}> 
            <div css={s.bar}></div>
            <div css={s.content}>
                <h1>♡ 관심 여행지 ♡</h1>
                {loading ? <p>로딩 중...</p> : (
                <div css={s.grid}>
                    {favoriteSpots.map((r) => (
                        <div key={r.spotId} css={s.card(false)}> 
                            <div css={s.imageWrapper}>
                                {r.spotImg ? (
                                    <img css={s.image} src={r.spotImg} alt={r.title} />
                                ) : (
                                    <div css={s.emptyImage}>🦊</div>
                                )}
                                {/* 여기서 하트는 항상 빨간색이어야 함 */}
                                <button
                                    type="button"
                                    css={s.heartBtn(true)} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveWish(r.spotId); // 클릭 시 삭제 함수 실행
                                    }}
                                >
                                    <IoMdHeart size={34} />
                                </button>
                            </div>
                            <div css={s.title}>{r.title}</div>
                        </div>
                    ))}
                </div>
            )}
            </div>
            <div css={s.bar}style={{ borderLeft: '1px solid #e00000', borderRight: 'none' }}></div>
        </div>
    );
}

export default FavoritePage;
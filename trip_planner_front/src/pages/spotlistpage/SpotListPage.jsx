/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useState } from "react";

import { 
  getSpots, 
  addBookmark,    
  removeBookmark, 
  getMyBookmarks,  
  removeFavorites,
  addFavorites
} from "../../apis/spotApi";// 민석님의 API 함수

import { PiMountains } from "react-icons/pi";
import { MdOutlineSurfing } from "react-icons/md";
import { IoRestaurantOutline, IoCafeOutline } from "react-icons/io5"; 
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
function SpotListPage() {
  const [spots, setSpots] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [wishListId, setWishListId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const CATEGORY_OPTIONS=["전체","문화•체험","카페","식당"];
  const CATEGORY_ICONS = {
    "전체":null,
    "문화•체험":<MdOutlineSurfing />  ,
    "자연":<PiMountains />, 
    "카페":<IoCafeOutline />, 
    "식당":<IoRestaurantOutline />};
  const [selectedCategory, setSelectedCategory] = useState("전체");
 
  useEffect(()=>{
    console.log("현재 찜 목록(wishList)",wishListId)
  },[wishListId]);
  
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getSpots({ page: 1, size: 100 });
        
        // 응답 구조에 따라 데이터 추출
        // ApiResponse 형식이면: response.data
        // 일반 형식이면: response
        const spotData = response.data || response;
        
        setSpots(spotData);
      } catch (err) {
        console.error('관광지 목록 조회 실패:', err);
        setError('관광지 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  const filteredSpots = spots
  .filter((s) => {
    if(selectedCategory === "전체") return true;
    return s.category === selectedCategory;
  })
  
  .filter((spot) =>
    (spot.title ?? "").toLowerCase().includes(searchTitle.trim().toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedId((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };


  const toggleWish = async(id)=>{
    const isWished = wishListId.includes(id);
    
    try{
      if(isWished){
        await removeFavorites(id);
        setWishListId((prev)=> prev.filter((v)=> v !== id));
        console.log(`${id}번 찜 삭제 완료`);
      }else{
        await addFavorites(id);
        setWishListId((prev)=> [...prev,id]);
        console.log(`${id}번 찜 등록 완료`);
      }
    }catch(error){
      console.log("찜 에러");
          
    }
  };

  
 


  if (loading) {
    return <div style={{ padding: 20 }}>로딩 중...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  }

  return (
  <div css={s.layout}>
    {/* 왼쪽: 선택된 여행지 */}
    <div css={s.selectedSection}>
      

      <div css={s.selectedListWrapper}>
        <h2>선택한 여행지</h2>
        <ul css={s.spotSelectList}>
          {selectedId.map((id, index) => {
            const spot = spots.find((s) => s.spotId === id);
            if (!spot) return null;

            return (
              <li key={spot.spotId} css={s.spotSelectItem}>
                <span css={s.spotSelectText}>
                  {index + 1}. {spot.title}
                </span>

                <button
                  type="button"
                  css={s.removeBtn}
                  onClick={() => toggleSelect(spot.spotId)}
                  aria-label="선택 해제"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>

    {/* 오른쪽: 전체 관광지 목록 (여기서 선택) */}
    <div style={{ padding: 20, flex: 3 }}>
      <h1>관광지 목록</h1>

      <div css={s.searchBar}>
        <input
          css={s.searchInput}
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="제목으로 검색"
        />
      </div>

      {/* 카테고리 */}
      <div css={s.categoryBar}>
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat}
            type="button"
            css={s.categoryBtn(cat === selectedCategory)}
            onClick={() => setSelectedCategory(cat)}
          >
            {CATEGORY_ICONS[cat] && <span style={{ marginRight: '6px', display: 'inline-flex' }}>{CATEGORY_ICONS[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      <div css={s.grid}>
        {filteredSpots.map((r) => {
          const isSelected = selectedId.includes(r.spotId);
          const isWished = wishListId.includes(r.spotId);

          return (
            <div
              key={r.spotId}
              css={s.card(isSelected)}
              onClick={() => toggleSelect(r.spotId)}
            > 
              <div css={s.imageWrapper}>
                {r.spotImg ? (
                  <img
                    css={s.image}
                    src={r.spotImg}
                    alt={r.title}
                    loading="lazy"
                  />
                ) : (
                  <div css={s.emptyImage}>🦊</div>
                )}
                <button
                  type="button"
                  css={s.heartBtn(isWished)}
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 이벤트가 중복 발생하지 않도록 차단
                    toggleWish(r.spotId);
                  }}
                >
                  {isWished ? <IoMdHeart size={34} /> : <IoIosHeartEmpty size={34} />}
                </button>
              </div>

              <div css={s.title}>{r.title}</div>
            </div>
          );
        })}
      </div>
      
    </div>
    <div css={s.selectedSection} style={{ borderLeft: '1px solid #e00000', borderRight: 'none' }}></div>
  </div>
);

}

export default SpotListPage;
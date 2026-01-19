/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useState } from "react";

import { 
  getSpots, 
  addBookmark,    
  removeBookmark, 
  getMyFavorites,
  removeFavorites,
  addFavorites
} from "../../apis/spotApi";// 민석님의 API 함수

import { PiMountains } from "react-icons/pi";
import { MdOutlineSurfing } from "react-icons/md";
import { IoRestaurantOutline, IoCafeOutline, IoLogoWechat } from "react-icons/io5"; 
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import OpenaiModal from "../../components/openai/OpenaiModal";

function SpotListPage() {
  const [spots, setSpots] = useState([]); //여행지 상태관리
  const [selectedId, setSelectedId] = useState([]); //여행지 선택 관리
  const [wishListId, setWishListId] = useState([]); //찜 선택관리
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState(""); //검색관리
  const CATEGORY_OPTIONS=["전체","문화•체험","카페","식당"]; //카테고리 옵션
  const CATEGORY_ICONS = {
    //카테고리 아이콘
    "전체":null,
    "문화•체험":<MdOutlineSurfing />  ,
    "자연":<PiMountains />, 
    "카페":<IoCafeOutline />, 
    "식당":<IoRestaurantOutline />};
  const [selectedCategory, setSelectedCategory] = useState("전체"); //카테고리 초기값 전체로 두기 (카테고리 선택 관리)
  //chatbot 싱태관리
  const [aiOpen, setAiOpen] = useState(false);




  // navigate 추가 (민석)
  const navigate = useNavigate();

  const handleCreateItinerary = () => {
    console.log("=== SpotListPage 디버깅 ===");
    console.log("선택된 ID:", selectedId);
    console.log("선택된 개수:", selectedId.length);

    if (selectedId.length === 0) {
      alert("관광지를 먼저 선택해주세요.");
      return;
    }


    console.log("TravelInfoPage로 이동 시작");
    console.log("전달할 데이터:", { selectedSpotIds: selectedId });
    
    sessionStorage.setItem('selectedSpotIds', JSON.stringify(selectedId));

    navigate('/travelinfo',{
      state: { selectedSpotIds: selectedId }
    });
  };

  //
  useEffect(() => {
  console.log("모달 열림 상태(aiOpen):", aiOpen);
}, [aiOpen]);

  useEffect(()=>{
    console.log("현재 찜 목록(wishList)",wishListId)
  },[wishListId]); //현재 찜 어떤거 선택되엇는지 콘솔 출력
  
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


        const fResponse = await getMyFavorites();
        const fData = fResponse.data || fResponse;
        
        if(Array.isArray(fData)){
          const ids = fData.map(item => item.spotId);// 찜 목록의 모든 데이터 중에서 장소id만 뽑아서 새 list만들기
          setWishListId(ids)//그 리스트를 찜목록에 저장
          // 새로고침하면 wishList는 초기화 되어서 db와 별개. 그래서 화면 초기 부를때 세팅해줘야함
        }

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
  }) //여행지의 카테고리가 전체면 모든 여행지 리턴 ,아니면 여행지의 카테고리와 맞는 걸 리턴
  
  .filter((spot) =>
    (spot.title ?? "")//제목이 빈 문자열이면 null로 취급
  .toLowerCase().includes(searchTitle.trim().toLowerCase())
  );// 제목 검색

  const toggleSelect = (id) => {
    setSelectedId((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };// 여행지 id를 받아서 선택된 id 에 넣는데 이전에 있던 아이디이면 제외하고 배열 만들기
  //  없으면 기존 prev 에 추가


  const toggleWish = async(id)=>{
    const isWished = wishListId.includes(id);// 클릭한 관광지가 찜 목록에 있는지 확인
    
    try{
      if(isWished){//있다면
        await removeFavorites(id);
        // removeFavorites는 api통신함수. 해당 id의 관광지를 찜 목록에서 삭제 -> db에서도 삭제
        setWishListId((prev)=> prev.filter((v)=> v !== id)); //찜 목록에서 이전에 선택 되었던 id는 제외하고 배열 만들기
        console.log(`${id}번 찜 삭제 완료`);
      }else{
        await addFavorites(id); //addFavorites은 api 통신함수. 해당 id의 관광지 찜 목록에 추가 (db에도 추가)
        setWishListId((prev)=> [...prev,id]);//기존꺼에 선택된 여행지 추가
        console.log(`${id}번 찜 등록 완료`);
      }
    }catch(error){
      console.log("찜 에러");
          
    }
  };
  
  const totalPay = selectedId.reduce((plus,id)=>{//누적값, 선택된 여행지 id
    const place = spots.find((s)=> s.spotId === id);//spot 객체에서 id랑 같은거를 찾음
    const price = place?.price ?? 0;//price 없으면 0
    return plus + price;// 누적
  },0);//초기값 0

  
 


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
        <div>
          <p>선택된 관광지 수: {selectedId.length}</p>
          <p>예상 예산:{totalPay}원</p>
        </div>
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
        <button
            type="button"
            disabled={selectedId.length === 0}
            // 온클릭 이벤트 이렇게 추가하면 될 것 같아
            onClick={handleCreateItinerary}
          >
            {selectedId.length === 0 ? "여행지를 선택하세요" : "일정 만들기"}
        </button>
      </div>
    </div>

    {/* 오른쪽: 전체 관광지 목록 (여기서 선택) */}
    <div style={{ padding:20, flex:3 }}>
      <h1>관광지 목록</h1>

      <div css={s.searchBar}>
        <input
          css={s.searchInput}
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}  // 이벤트 일어나자마자 실행
          placeholder="제목으로 검색"
        />
      </div>

      {/* 카테고리 */}
      <div css={s.categoryBar}>
        {CATEGORY_OPTIONS.map((cat) => ( //옵션갑을 키로 사용해서 아이콘즈에서 매칭되는 아이콘 가져옴
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
    <div css={s.selectedSection} style={{ borderLeft: '1px solid #e00000', borderRight: 'none' }}>
      <button type="button" onClick={() =>{console.log("버튼 클릭됨!");setAiOpen(true)}}>
        <IoLogoWechat size={28} />
      </button>
    </div>
    <OpenaiModal 
      open={aiOpen}
      onClose={() => setAiOpen(false)}
    />
 
  </div>
);

}

export default SpotListPage;
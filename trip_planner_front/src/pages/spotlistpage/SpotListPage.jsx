/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useState } from "react";
import { getSpots } from "../../apis/spotApi"; // 민석님의 API 함수 import

function SpotListPage() {
  const [spots, setSpots] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const CATEGORY_OPTIONS = ["전체", "문화/시설·체험", "음식", "레포츠"];
  const [selectedCategory, setSelectedCategory] = useState("전체");

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

  if (loading) {
    return <div style={{ padding: 20 }}>로딩 중...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  }

  return (
  <div css={s.layout}>
    {/* ✅ 왼쪽: 선택된 여행지 */}
    <div css={s.selectedSection}>
      <h2>선택한 여행지</h2>

      <div css={s.selectedListWrapper}>
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
            {cat}
          </button>
        ))}
      </div>

      <div css={s.grid}>
        {filteredSpots.map((r) => {
          const isSelected = selectedId.includes(r.spotId);

          return (
            <div
              key={r.spotId}
              css={s.card(isSelected)}
              onClick={() => toggleSelect(r.spotId)}
            >
              <div css={s.title}>{r.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

}

export default SpotListPage;
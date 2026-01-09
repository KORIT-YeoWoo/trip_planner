/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useState } from "react";
import { getSpots } from "../../apis/spotApi"; // 민석님의 API 함수 import

function SpotListPage() {
  const [spots, setSpots] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div style={{ padding: 20 }}>
      <h1>관광지 목록</h1>

      <div css={s.grid}>
        {spots.map((r) => {
          const isSelected = selectedId.includes(r.spotId);

          return (
            <div
              key={r.spotId}
              css={s.card(isSelected)}
              onClick={() => toggleSelect(r.spotId)}
            >
              <div css={s.title}>
                {r.title}
              </div>
              <div>주소: {r.address}</div>
              <div>
                경도: {r.longitude} / 위도: {r.latitude}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SpotListPage;
/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useState } from "react";
import axios from "axios";

function SpotListPage() {
  const [spots, setSpots] = useState([]);
  const [selectedId, setSelectedId] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/json")
      .then((res) => setSpots(res.data))
      .catch(console.error);
  }, []);

  const toggleSelect = (id) => {
    setSelectedId((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>관광지 목록</h1>

      <div css={s.grid}>
        {spots.map((r, index) => {
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

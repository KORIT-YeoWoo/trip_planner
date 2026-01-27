import instance from "../configs/axios";

export const createComment = async (data) => {
  try {
    const resp = await instance.post("/api/comments", data);
    return resp; // 공용 인터셉터가 ApiResponseDto 그대로 리턴하는 구조
  } catch (err) {
    // ✅ 공용 axios가 못 까주는 에러를 여기서만 까줌
    const status = err?.response?.status;
    const serverData = err?.response?.data;

    console.error("createComment error status:", status);
    console.error("createComment error response:", serverData);

    // 백엔드 ApiResponseDto: { success, message, data }
    const message =
      serverData?.message ||
      "리뷰 등록 중 서버 오류가 발생했어요. (500)";

    alert(message);
    throw err;
  }
};

export const getCommentsBySpotId = (spotId) =>
  instance.get(`/api/comments/spots/${spotId}`);

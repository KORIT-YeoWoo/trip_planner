import axios from "axios"

// 일정 생성 API
export const generateItinerary = async (travelData) => {
    const response = await axios.post('/api/itineraries/generate', travelData);
    return response;
};

// 일정 경로 재계산 API
export const recalculateRoute = async (data) => {
    const response = await axios.post('/api/itineraries/recalculate',data);
    return response;
}

// 일정 저장 API
export const saveItinerary = async (itineraryId, data) => {
    const response = await axios.put(`/api/itineraries/${itineraryId}`, data);
    return response;
}

// 일정 조회 API
export const getItinerary = async (itineraryId) => {
    const response = await axios.get(`/api/itineraries/${itineraryId}`);
    return response;
};

// 일정 삭제 API
export const deleteItinerary = async (itineraryId) => {
    const response = await axios.delete(`/api/itineraries/${itineraryId}`);
    return response;
}

// 내 일정 목록 조회 API
export const getMyItineraries = async () => {
    const response = await axios.get('/api/itineraries/my');
    return response;
}
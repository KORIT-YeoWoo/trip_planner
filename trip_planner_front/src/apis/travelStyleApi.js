import instance from "../configs/axios";

export const getTravelStyle = async () => {
    try {
        const response = await instance.get('/api/travel-style/my');
        return response.data || response;
    } catch (error) {
        console.error('getTravelStyle 에러:', error);
        throw error;
    }
};
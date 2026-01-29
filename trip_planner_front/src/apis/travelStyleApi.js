import axios from "axios";

export const getTravelStyle = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('/api/travel-style/my', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    console.log('API 응답:', response.data);
    return response.data;
};
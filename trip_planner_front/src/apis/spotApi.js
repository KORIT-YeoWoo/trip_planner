import axios from '../configs/axios';

export const getSpots = async (params = {}) => {
    const { page = 1, size = 12, category, search } = params;

    const queryParams = {
        page,
        size,
    };

    if (category) {
        queryParams.category = category;
    }

    if (search) {
        queryParams.search = search;
    }

    const response = await axios.get('/api/spots', {
        params: queryParams,
    });

    return response;
};

export const getSpotById = async (spotId) => {
    const response = await axios.get(`/api/spots/${spotId}`);
    return response;
};

export const getCategories = async () => {
    const response = await axios.get('/api/spots/categories');
    return response;
};
    
export const getPopularSpots = async (limit = 6) => {
    const response = await axios.get('/api/spots/popular', {
        params: { limit },
    });
    return response;
};

export const addBookmark = async (spotId) => {
    const response = await axios.post(`/api/bookmarks/${spotId}`);
    return response;
};

export const removeBookmark = async (spotId) => {
    const response = await axios.delete(`/api/bookmarks/${spotId}`);
    return response;
};

export const getMyBookmarks = async () => {
    const response = await axios.get('/api/bookmarks');
    return response;
};
export const addFavorites = async(spotId) =>{
    const response = await axios.post(`/api/favorites/${spotId}`);
    return response;
};

export const removeFavorites = async(spotId)=>{
    const response = await axios.delete(`/api/favorites/${spotId}`);
    return response;
};

export const getMyFavorites = async() =>{
    const response = await axios.delete(`/api/favorites`);
    return response;
};

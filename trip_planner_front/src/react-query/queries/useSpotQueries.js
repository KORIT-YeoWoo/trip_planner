import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateQueries, queryClient, queryKeys } from "../../configs/queryClient"
import { addBookmark, getCategories, getMyBookmarks, getPopularSpots, removeBookmark } from "../../apis/spotApi";

// 관광지 목록 조회 훅
export const useSpots = (params = {}) => {
    return useQuery({
        queryKey: queryKeys.spots.list(params),
        queryFn: () => getSpots(params),
        enabled: true,
        select: (response) => {
            return response.data;
        },
    });
};

// 관광지 상세 조회 훅
export const useSpot = (spotId, options = {}) => {
    return useQuery({
        queryKey: queryKeys.spots.detail(spotId),
        queryFn: () => getSpotById(spotId),
        enabled: !!spotId,
        select: (response) => response.data,
        ...options,
    });
};

// 인기 관광지 조회 훅
export const useCategories = () => {
    return useQuery({
        queryKey: queryKeys.spots.categories(),
        queryFn: getCategories,
        staleTime: 1000 * 60 * 60,
        select: (response) => response.data,
    });
};

// 북마크 추가 Mutation
export const usePopularSpots = (limit = 6) => {
    return useQuery({
        queryKey: queryKeys.spots.popular(limit),
        queryFn: () => getPopularSpots(limit),
        staleTime: 1000 * 6 * 10,
        select: (response) => response.data,
    });
};

// 내 북마크 목록 조회 훅
export const useAddBookmark = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: addBookmark,
        onSuccess: (data, spotId) => {
            invalidateQueries.bookmarks();

            invalidateQueries.spot(spotId);

            console.log('북마크 추가 성공');
        },
        onError: (error) => {
            console.error('북마크 추가 실패:', error.message);
        },
    });
};

export const useRemoveBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeBookmark,
        onSuccess: (data, spotId) => {
            invalidateQueries.bookmarks();
            invalidateQueries.spot(spotId);
            
            console.log('북마크 삭제 성공');
        },
        onError: (error) => {
            console.error('북마크 삭제 실패: ', error.message);
        },
    });
};

export const useMyBookmarks = () => {
    return useQuery({
        queryKey: queryKeys.bookmarks.my(),
        queryFn: getMyBookmarks,
        enabled: false,
        select: (response) => response.data,
    })
}
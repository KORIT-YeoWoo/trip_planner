import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 30,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
        
        useErrorBoundary: false,
        
        onError: (error) => {
            console.error('[React Query Error]', error);
        },
    },
    
    mutations: {
      retry: 0,
      
      onError: (error) => {
        console.error('[Mutation Error]', error);
      },
      
      onSuccess: (data) => {
        console.log('[Mutation Success]', data);
      },
    },
  },
});

export const queryKeys = {
  spots: {
    all: ['spots'],
    lists: () => [...queryKeys.spots.all, 'list'],
    list: (params) => [...queryKeys.spots.lists(), params],
    details: () => [...queryKeys.spots.all, 'detail'],
    detail: (id) => [...queryKeys.spots.details(), id],
    categories: () => [...queryKeys.spots.all, 'categories'],
    popular: (limit) => [...queryKeys.spots.all, 'popular', limit],
  },
};


export const invalidateQueries = {
  spots: () => queryClient.invalidateQueries(queryKeys.spots.all),
  spot: (id) => queryClient.invalidateQueries(queryKeys.spots.detail(id)),
  bookmarks: () => queryClient.invalidateQueries(queryKeys.bookmarks.all),
  itineraries: () => queryClient.invalidateQueries(queryKeys.itineraries.all),
};
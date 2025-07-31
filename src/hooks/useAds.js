import { useInfiniteQuery } from '@tanstack/react-query';
import { adsAPI } from '../services/api';

export const useAds = () => {
  // Get all ads with pagination
  const useAdsQuery = (filters = {}) => {
    return useInfiniteQuery({
      queryKey: ['ads', filters],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await adsAPI.getAds({
          page: pageParam,
          limit: filters.limit || 10,
          ...filters
        });
        
        return {
          data: response.data || [],
          total: response.total || 0,
          currentPage: response.currentPage || pageParam,
          totalPages: response.totalPages || 1
        };
      },
      getNextPageParam: (lastPage) => {
        return lastPage.currentPage < lastPage.totalPages 
          ? lastPage.currentPage + 1 
          : undefined;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return {
    useAdsQuery
  };
};
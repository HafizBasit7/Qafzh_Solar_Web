import { useInfiniteQuery } from '@tanstack/react-query';
import { adsAPI } from '../services/api';

const useAds = () => {
  // Get all ads with pagination
  const useAdsQuery = (filters = {}, options = {}) => {
    return useInfiniteQuery({
      queryKey: ['ads', 'list', filters],
      queryFn: ({ pageParam = 1 }) => {
        return adsAPI.getAds({
          ...filters,
          page: pageParam,
          limit: filters.limit || 10,
        });
      },
      getNextPageParam: (lastPage) => {
        // Check if there are more pages
        if (!lastPage?.data || lastPage.data.length < (filters.limit || 10)) {
          return undefined; // No more pages
        }
        // Get current page from the last request
        const currentPage = lastPage.currentPage || 1;
        return currentPage + 1;
      },
      ...options,
    });
  };

  // Search ads
  const useSearchAdsQuery = (searchParams = {}, options = {}) => {
    return useInfiniteQuery({
      queryKey: ['ads', 'search', searchParams],
      queryFn: ({ pageParam = 1 }) => {
        return adsAPI.searchAds({
          ...searchParams,
          page: pageParam,
          limit: searchParams.limit || 10,
        });
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage?.data || lastPage.data.length < (searchParams.limit || 10)) {
          return undefined;
        }
        const currentPage = lastPage.currentPage || 1;
        return currentPage + 1;
      },
      ...options,
    });
  };

  return {
    useAdsQuery,
    useSearchAdsQuery,
  };
};

export default useAds;
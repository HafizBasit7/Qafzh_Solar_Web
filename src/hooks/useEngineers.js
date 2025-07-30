import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { engineersAPI } from '../services/api';

const useEngineers = () => {
  // Get all engineers with pagination
  const useEngineersQuery = (filters = {}, options = {}) => {
    return useInfiniteQuery({
      queryKey: ['engineers', 'list', filters],
      queryFn: ({ pageParam = 1 }) => {
        return engineersAPI.getEngineers({
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

  // Get engineer by ID
  const useEngineerQuery = (id, options = {}) => {
    return useQuery({
      queryKey: ['engineers', 'detail', id],
      queryFn: () => engineersAPI.getEngineerById(id),
      enabled: !!id,
      ...options,
    });
  };

  // Search engineers
  const useSearchEngineersQuery = (searchParams = {}, options = {}) => {
    return useInfiniteQuery({
      queryKey: ['engineers', 'search', searchParams],
      queryFn: ({ pageParam = 1 }) => {
        return engineersAPI.searchEngineers({
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
    useEngineersQuery,
    useEngineerQuery,
    useSearchEngineersQuery,
  };
};

export default useEngineers;
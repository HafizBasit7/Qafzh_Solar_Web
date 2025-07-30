import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { shopsAPI } from '../services/api';

// Get all shops with pagination
export const useShopsQuery = (filters = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: ['shops', 'list', filters],
    queryFn: ({ pageParam = 1 }) => {
      return shopsAPI.getShops({
        ...filters,
        page: pageParam,
        limit: filters.limit || 10,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data || lastPage.data.length < (filters.limit || 10)) {
        return undefined;
      }
      const currentPage = lastPage.currentPage || 1;
      return currentPage + 1;
    },
    ...options,
  });
};

// Get shop by ID
export const useShopQuery = (id, options = {}) => {
  return useQuery({
    queryKey: ['shops', 'detail', id],
    queryFn: () => shopsAPI.getShopById(id),
    enabled: !!id,
    ...options,
  });
};

// Search shops
export const useSearchShopsQuery = (searchParams = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: ['shops', 'search', searchParams],
    queryFn: ({ pageParam = 1 }) => {
      return shopsAPI.searchShops({
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

// Default export for backward compatibility
const useShops = () => {
  return {
    useShopsQuery,
    useShopQuery,
    useSearchShopsQuery,
  };
};

export default useShops;